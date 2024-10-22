import { LogFactory } from './factories/log.factory';
import { WsService } from './domain/services/ws.service';
import { ServiceLocator } from './factories/service.locator';
import { ConfigEntity } from './domain/entities/config.entity';

class Server {
	private readonly _log = LogFactory.getInstance().createLogger('Server');
	private readonly _ws: WsService;
	private readonly _config: ConfigEntity;

	constructor() {
		this._ws = ServiceLocator.getInstance().wsService;
		this._config = ServiceLocator.getInstance().configSource.config;

		this._run();
	}

	private _run(): void {
		this._ws.listen().then(() => {
			this._log.info(
				`WS Server started succes wss://${this._config.HTTP_SERVER_HOST}:${this._config.HTTP_SERVER_WS}`,
			);
		});
	}
}

new Server();
