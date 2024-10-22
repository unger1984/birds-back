import { ConfigSource } from '../domain/datasources/config.source';
import { ConfigSourceDotenv } from '../data/datasources/config.source.dotenv';
import { WsService } from '../domain/services/ws.service';
import { WsServiceWebsocket } from '../data/services/ws.service.websocket';

export class ServiceLocator {
	private static instance: ServiceLocator;
	private readonly _configSource: ConfigSource;
	private readonly _wsService: WsService;

	private constructor() {
		this._configSource = new ConfigSourceDotenv();
		this._wsService = new WsServiceWebsocket(this.configSource.config);
	}

	static getInstance() {
		if (!ServiceLocator.instance) {
			ServiceLocator.instance = new ServiceLocator();
		}
		return ServiceLocator.instance;
	}

	public get configSource(): ConfigSource {
		return this._configSource;
	}

	public get wsService(): WsService {
		return this._wsService;
	}
}
