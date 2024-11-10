import { WsClient } from '../entities/ws.client';
import { connection as WSConnection } from 'websocket';
import { v4 as uuid } from 'uuid';
import { WsCmd, WsDataAuth, WsDataCount, WsDataMessage, WsDataOnline, WsDataSignIn, WsDto } from '../dto/ws.dto';
import { UserUseCases } from './user.use.cases';
import { LogFactory } from '../../factories/log.factory';
import { MessageUseCases } from './message.use.cases';
import { UserDto } from '../dto/user.dto';
import moment from 'moment';
import { OnlineRepository } from '../repositories/online.repository';
import { OnlineLogEntity } from '../entities/online.log.entity';

export class WsUseCases {
	private readonly _log = LogFactory.getInstance().createLogger('WsUseCases');
	private _clients: { [key: string]: WsClient } = {};
	private readonly _userUseCases: UserUseCases;
	private readonly _messageUseCases: MessageUseCases;
	private readonly _onlineRepository: OnlineRepository;

	constructor(options: {
		userUseCases: UserUseCases;
		messageUseCases: MessageUseCases;
		onlineRepository: OnlineRepository;
	}) {
		this._userUseCases = options.userUseCases;
		this._messageUseCases = options.messageUseCases;
		this._onlineRepository = options.onlineRepository;

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
		const hours = Math.floor(duration.asHours());
		const minutes = Math.floor(duration.asMinutes() % 60);
		const seconds = Math.floor(duration.asSeconds() % 60);
		if (client.user) {
			this._log.info(`Disconnected ${client.user.email} from ${client.ip} ${hours}:${minutes}:${seconds}`);
		} else {
			this._log.info(`Disconnected from ${client.ip} ${hours}:${minutes}:${seconds}`);
		}
		this._onlineRepository.log(new OnlineLogEntity(client));
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
			case WsCmd.online:
				if (client.user?.email.toLowerCase() === 'unger1984@gmail.com') {
					this._clients[client.uuid].send(
						new WsDto(WsCmd.online, new WsDataOnline(Object.values(this._clients))),
					);
				} else {
					this._clients[client.uuid].send(new WsDto(WsCmd.auth, new WsDataAuth('not found', null)));
				}
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
