import { v4 as uuid } from 'uuid';
import { connection as WSConnection, server as WebSocketServer } from 'websocket';
import https from 'https';
import http from 'http';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { WsService } from '../../domain/services/ws.service';
import { LogFactory } from '../../factories/log.factory';
import { ConfigEntity } from '../../domain/entities/config.entity';
import { UserEntity } from '../../domain/entities/user.entity';
import { WsMessage } from '../../domain/entities/ws.message';
import { WsDto } from '../../domain/dto/ws.dto';

interface ConnectionsPoolType {
	[key: string]: { connection: WSConnection; user?: UserEntity | null };
}

export class WsServiceWebsocket implements WsService {
	private readonly _log = LogFactory.getInstance().createLogger('WsServiceWebsocket');
	private readonly _config: ConfigEntity;
	private _connectionsPool: ConnectionsPoolType = {};
	// private _lastMessages: MessageEntity[] = [new MessageEntity('Приветствую на онлайн трансляции!')];

	constructor(config: ConfigEntity) {
		this._config = config;
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

		// setInterval(() => this.sendToAll(new WsMessage('count', Object.keys(this._connectionsPool).length)), 5000);

		wsserver.on('request', async request => {
			try {
				const index = uuid();
				const connection = request.accept(this._config.ECHO_PROTOCOL, request.origin);
				this._connectionsPool[index] = { connection };

				this._log.debug(`connect ${Object.keys(this._connectionsPool).length}`);

				// this.send(connection, new WsMessage('count', Object.keys(this._connectionsPool).length));
				// for (const message of this._lastMessages) {
				// 	this.send(connection, new WsMessage('message', message));
				// }

				// Обработаем закрытие соединения
				connection.on('close', () => {
					if (this._connectionsPool[index]) delete this._connectionsPool[index];
					// connection.sendUTF(JSON.stringify(new WsMessage('count', Object.keys(this._connectionsPool).length)));
				});

				// Обработаем входящие данные
				connection.on('message', message => {
					if (message.type === 'utf8') {
						const msg: WsDto = JSON.parse(message.utf8Data || '{}');

						this._log.debug(msg);

						// switch (msg.cmd) {
						// 	case 'message':
						// 		if (this._connectionsPool[index].user) {
						// 			const chatMsg = msg.data as MessageEntity;
						// 			chatMsg.user = this._connectionsPool[index].user;
						// 			this._lastMessages.push(chatMsg);
						// 			this.sendToAll(new WsMessage('message', chatMsg));
						// 		} else {
						// 			this._log.error('user not signing');
						// 		}
						// 		break;
						// 	case 'sign':
						// 		this._connectionsPool[index].user = msg.data;
						// 		break;
						// }
						// client.publish(
						//     'websockets',
						//     JSON.stringify(new WsRedisMessage('fromUser', new WsMessageFromUser(index, msg))),
						// );
					}
				});
			} catch (error) {
				this._log.error(error);
			}
		});

		// this._microserviceMessangerService.subscribe('logwebsocket', msg => this._localListener(msg));
	}

	public send(connection: WSConnection, message: WsMessage): void {
		try {
			connection.sendUTF(JSON.stringify(message));
		} catch (exception) {
			this._log.error({ method: 'send', exception, stack: exception.stack });
		}
	}

	public sendToAll(message: WsMessage) {
		try {
			Object.keys(this._connectionsPool).forEach(key => {
				this.send(this._connectionsPool[key].connection, message);
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
