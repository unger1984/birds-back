import { LogFactory } from './factories/log.factory';
import { WsService } from './domain/services/ws.service';
import { ServiceLocator } from './factories/service.locator';
import { ConfigEntity } from './domain/entities/config.entity';
import { MigrateService } from './domain/services/migrate.service';

class Server {
	private readonly _log = LogFactory.getInstance().createLogger('Server');
	private readonly _ws: WsService;
	private readonly _config: ConfigEntity;
	private readonly _migrateService: MigrateService;

	constructor() {
		process.on('uncaughtException', exception => {
			this._log.error({ method: 'Unknown', exception, stack: exception.stack });
		});

		this._config = ServiceLocator.getInstance().configSource.config;
		this._ws = ServiceLocator.getInstance().wsService;
		this._migrateService = ServiceLocator.getInstance().migrateService;

		this._run();
	}

	private _run(): void {
		this._migrateService
			.migrate()
			.then(() => {
				this._log.info('Миграции завершены');
				this._ws.listen().then(() => {
					this._log.info(
						`WS Server started succes wss://${this._config.HTTP_SERVER_HOST}:${this._config.HTTP_SERVER_WS}`,
					);
				});
			})
			.catch(exception => {
				this._log.error({ method: 'run', exception, stack: exception.stack });
			});
	}
}

new Server();
