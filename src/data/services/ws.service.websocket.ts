import { server as WebSocketServer } from 'websocket';
import https from 'https';
import http from 'http';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { WsService } from '../../domain/services/ws.service';
import { LogFactory } from '../../factories/log.factory';
import { ConfigEntity } from '../../domain/entities/config.entity';
import { WsUseCases } from '../../domain/usecases/ws.use.cases';
import { UserUseCases } from '../../domain/usecases/user.use.cases';
import { UserRepository } from '../../domain/repositories/user.repository';
import { GoogleRepository } from '../../domain/repositories/google.repository';
import { MessageUseCases } from '../../domain/usecases/message.use.cases';
import { MessageRepository } from '../../domain/repositories/message.repository';

export class WsServiceWebsocket implements WsService {
	private readonly _log = LogFactory.getInstance().createLogger('WsServiceWebsocket');
	private readonly _config: ConfigEntity;
	private readonly _wsUseCases: WsUseCases;

	constructor(option: {
		config: ConfigEntity;
		userRepository: UserRepository;
		googleRepository: GoogleRepository;
		messageRepository: MessageRepository;
	}) {
		this._config = option.config;
		this._wsUseCases = new WsUseCases({
			userUseCases: new UserUseCases({
				config: option.config,
				userRepository: option.userRepository,
				googleRepository: option.googleRepository,
			}),
			messageUseCases: new MessageUseCases({ messageRepository: option.messageRepository }),
		});
	}

	public async listen(): Promise<void> {
		const ssl = {
			key: readFileSync(resolve(__dirname, '../', '../', '../', this._config.SSL_SERVER_KEY)),
			cert: readFileSync(resolve(__dirname, '../', '../', '../', this._config.SSL_SERVER_CRT)),
		};

		const server =
			this._config.ENV === 'development' ? https.createServer(ssl, () => null) : http.createServer(() => null);

		server.listen(this._config.HTTP_SERVER_WS, this._config.HTTP_SERVER_HOST);

		const wsserver = new WebSocketServer({
			httpServer: server,
			autoAcceptConnections: false,
		});

		wsserver.on('request', async request => {
			try {
				const xforward = request.httpRequest.headers['x-forwarded-for'];
				let ip;
				if (xforward && Array.isArray(xforward)) {
					ip = xforward[0];
				} else if (xforward) {
					ip = xforward;
				} else {
					ip = request.socket.remoteAddress;
				}
				this._wsUseCases.addClient(request.accept(this._config.ECHO_PROTOCOL, request.origin), ip);
			} catch (error) {
				this._log.error(error);
			}
		});
	}
}
