import { connection as WSConnection } from 'websocket';
import { UserEntity } from './user.entity';
import { WsUseCases } from '../usecases/ws.use.cases';
import { WsDto } from '../dto/ws.dto';
import { LogFactory } from '../../factories/log.factory';

export class WsClient {
	private readonly _log = LogFactory.getInstance().createLogger('WsClient');
	private readonly _uuid: string;
	private readonly _ip?: string;
	private readonly _connection: WSConnection;
	private readonly _wsUsecases: WsUseCases;
	private _user?: UserEntity | null;

	constructor(uuid: string, connection: WSConnection, wsUseCases: WsUseCases, ip?: string) {
		this._uuid = uuid;
		this._connection = connection;
		this._wsUsecases = wsUseCases;
		this._ip = ip;

		this._connection.on('close', () => {
			this._destroy();
		});

		this._connection.on('message', async message => {
			if (message.type === 'utf8') {
				const dto = JSON.parse(message.utf8Data || '{}') as WsDto;
				this._wsUsecases.handleMessage(dto, this);
			}
		});
	}

	private _destroy() {
		this._wsUsecases.removeClient(this._uuid);
	}

	public get user(): UserEntity | null | undefined {
		return this._user;
	}

	public set user(usr: UserEntity | null | undefined) {
		this._user = usr;
	}

	public get uuid(): string {
		return this._uuid;
	}

	public get ip(): string {
		return this._ip;
	}

	public send(message: WsDto): void {
		try {
			this._connection.sendUTF(JSON.stringify(message));
		} catch (exception) {
			// this._log.error({ method: 'send', exception, stack: exception.stack });
		}
	}
}
