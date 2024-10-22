import { v4 as uuid } from 'uuid';
import { connection as WSConnection, server as WebSocketServer } from 'websocket';
import https from 'https';
import http from 'http';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { WsService } from '../../domain/services/ws.service';
import { LogFactory } from '../../factories/log.factory';
import { ConfigEntity } from '../../domain/entities/config.entity';
import { ChatMessageEntity } from '../../domain/entities/chat.message.entity';

export class WsMessage {
	command: string;
	data: any;

	constructor(cmd: string, data: any) {
		this.command = cmd;
		this.data = data;
	}
}

interface ConnectionsPoolType {
	[key: string]: { connection: WSConnection };
}

export class WsServiceWebsocket implements WsService {
	private readonly _log = LogFactory.getInstance().createLogger('WsServiceWebsocket');
	private readonly _config: ConfigEntity;
	private _connectionsPool: ConnectionsPoolType = {};
	private _lastMessages: ChatMessageEntity[] = [new ChatMessageEntity('Приветствую на онлайн трансляции!')];

	constructor(config: ConfigEntity) {
		this._config = config;
	}

	public async listen(): Promise<void> {
		const ssl = {
			key: readFileSync(resolve(__dirname, '../', '../', '../', this._config.SSL_SERVER_KEY)),
			cert: readFileSync(resolve(__dirname, '../', '../', '../', this._config.SSL_SERVER_CRT)),
		};

		const server =
			this._config.ENV === 'local' ? https.createServer(ssl, () => null) : http.createServer(() => null);

		server.listen(this._config.HTTP_SERVER_WS, this._config.HTTP_SERVER_HOST);

		const wsserver = new WebSocketServer({
			httpServer: server,
			autoAcceptConnections: false,
		});

		setInterval(() => this.sendToAll(new WsMessage('count', Object.keys(this._connectionsPool).length)), 5000);

		wsserver.on('request', async request => {
			const index = uuid();
			const connection = request.accept(this._config.ECHO_PROTOCOL, request.origin);
			this._connectionsPool[index] = { connection };

			for (const message of this._lastMessages) {
				connection.sendUTF(JSON.stringify(new WsMessage('message', message)));
				// connection.sendUTF(JSON.stringify(new WsMessage('count', Object.keys(this._connectionsPool).length)));
			}

			// Обработаем закрытие соединения
			connection.on('close', () => {
				if (this._connectionsPool[index]) delete this._connectionsPool[index];
				// connection.sendUTF(JSON.stringify(new WsMessage('count', Object.keys(this._connectionsPool).length)));
			});

			// Обработаем входящие данные
			connection.on('message', message => {
				if (message.type === 'utf8') {
					const msg: WsMessage = JSON.parse(message.utf8Data || '{}');
					switch (msg.command) {
						case 'message':
							this._lastMessages.push(msg.data as ChatMessageEntity);
							this.sendToAll(new WsMessage('message', msg.data as ChatMessageEntity));
							break;
					}
					// client.publish(
					//     'websockets',
					//     JSON.stringify(new WsRedisMessage('fromUser', new WsMessageFromUser(index, msg))),
					// );
				}
			});
		});

		// this._microserviceMessangerService.subscribe('logwebsocket', msg => this._localListener(msg));
	}

	public sendToAll(message: any) {
		try {
			Object.keys(this._connectionsPool).forEach(key => {
				this._connectionsPool[key].connection.sendUTF(JSON.stringify(message));
			});
		} catch (exception) {
			this._log.error({ method: 'sendToAll', exception, stack: exception.stack });
		}
	}
	//
	// private async _localListener(message: string) {
	// 	const log = JSON.parse(message) as LogEntity;
	// 	this.sendToAll(log);
	// }
}
