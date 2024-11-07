import { WsClient } from '../entities/ws.client';
import { connection as WSConnection } from 'websocket';
import { v4 as uuid } from 'uuid';
import { WsCmd, WsDataAuth, WsDataCount, WsDataMessage, WsDataSignIn, WsDto } from '../dto/ws.dto';
import { UserUseCases } from './user.use.cases';
import { LogFactory } from '../../factories/log.factory';
import { MessageUseCases } from './message.use.cases';
import { UserDto } from '../dto/user.dto';
import moment from 'moment';

export class WsUseCases {
	private readonly _log = LogFactory.getInstance().createLogger('WsUseCases');
	private _clients: { [key: string]: WsClient } = {};
	private readonly _userUseCases: UserUseCases;
	private readonly _messageUseCases: MessageUseCases;

	constructor(options: { userUseCases: UserUseCases; messageUseCases: MessageUseCases }) {
		this._userUseCases = options.userUseCases;
		this._messageUseCases = options.messageUseCases;

		setInterval(
			() => this.sendToAll(new WsDto(WsCmd.count, new WsDataCount(Object.keys(this._clients).length))),
			5000,
		);
	}

	private _sendLastMessage(client: WsClient) {
		this._messageUseCases.last.then(list => {
			for (const message of list) {
				client.send(
					new WsDto(WsCmd.message, new WsDataMessage(message.text, message.date, new UserDto(message.user))),
				);
			}
		});
	}

	public addClient(connection: WSConnection, ip?: string) {
		const index = uuid();
		this._clients[index] = new WsClient(index, connection, this, ip);
		this._log.debug(`connections: ${Object.keys(this._clients).length}`);
		this._log.info(`Connected from ${ip}`);
		this._sendLastMessage(this._clients[index]);
	}

	public removeClient(index: string) {
		const client = this._clients[index];
		const duration = moment.duration(moment().diff(moment(client.createdAt)));
		const hours = duration.asHours();
		const minutes = duration.asMinutes() % 60;
		const seconds = duration.asSeconds() % 60;
		if (client.user) {
			this._log.info(`Disconnected ${client.user.email} from ${client.ip} ${hours}:${minutes}:${seconds}`);
		} else {
			this._log.info(`Disconnected from ${client.ip} ${hours}:${minutes}:${seconds}`);
		}
		delete this._clients[index];
	}

	public async handleMessage(dto: WsDto, client: WsClient) {
		switch (dto.cmd) {
			case WsCmd.auth:
				{
					const data = dto.data as WsDataAuth;
					const payload = await this._userUseCases.auth(data.token);
					if (payload) {
						const { user, token } = payload;
						this._clients[client.uuid].user = user;
						this._clients[client.uuid].send(
							new WsDto(WsCmd.auth, new WsDataAuth(token, new UserDto(user))),
						);
						this._log.info(`User ${user.email} auth from ${client.ip}`);
					} else {
						this._clients[client.uuid].user = null;
						this._clients[client.uuid].send(new WsDto(WsCmd.auth, new WsDataAuth('not found', null)));
					}
				}
				break;
			case WsCmd.sign_in:
				{
					const data = dto.data as WsDataSignIn;
					const payload = await this._userUseCases.singnIn(data.access_token);
					if (payload) {
						const { user, token } = payload;
						this._clients[client.uuid].user = user;
						this._clients[client.uuid].send(
							new WsDto(WsCmd.auth, new WsDataAuth(token, new UserDto(user))),
						);
						this._log.info(`User ${user.email} auth from ${client.ip}`);
					} else {
						this._clients[client.uuid].user = null;
						this._clients[client.uuid].send(new WsDto(WsCmd.auth, new WsDataAuth('not found', null)));
					}
				}
				break;
			case WsCmd.message:
				{
					if (client.user) {
						// только авторизованнй может отправлять сообщения
						const data = dto.data as WsDataMessage;
						const message = await this._messageUseCases.addMessage(data, client.user);
						this.sendToAll(new WsDto(WsCmd.message, message));
					}
				}
				break;
			case WsCmd.reload_chat:
				this._sendLastMessage(client);
				break;
		}
	}

	public sendToAll(message: WsDto) {
		try {
			Object.keys(this._clients).forEach(key => {
				this._clients[key].send(message);
			});
		} catch (exception) {
			this._log.error({ method: 'sendToAll', exception, stack: exception.stack });
		}
	}
}
