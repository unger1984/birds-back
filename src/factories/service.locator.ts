import { ConfigSource } from '../domain/datasources/config.source';
import { ConfigSourceDotenv } from '../data/datasources/config.source.dotenv';
import { WsService } from '../domain/services/ws.service';
import { WsServiceWebsocket } from '../data/services/ws.service.websocket';
import { ApiSource } from '../domain/datasources/api.source';
import { ApiSourceAxios } from '../data/datasources/api.source.axios';
import { GoogleRepository } from '../domain/repositories/google.repository';
import { GoogleRepositoryImpl } from '../data/repositories/google.repository.impl';
import { MigrateService } from '../domain/services/migrate.service';
import { MigrateServiceUmzug } from '../data/services/migrate.service.umzug';
import { SequelizeSource } from '../domain/datasources/sequelize.source';
import { SequelizeSourceImpl } from '../data/datasources/sequelize.source.impl';
import { UserRepository } from '../domain/repositories/user.repository';
import { UserRepositoryImpl } from '../data/repositories/user.repository.impl';
import { MessageRepository } from '../domain/repositories/message.repository';
import { MessageRepositoryImpl } from '../data/repositories/message.repository.impl';

export class ServiceLocator {
	private static instance: ServiceLocator;
	private readonly _configSource: ConfigSource = new ConfigSourceDotenv();
	private readonly _apiSource: ApiSource = new ApiSourceAxios();
	private readonly _sequelizeSource: SequelizeSource;

	private readonly _googleRepository: GoogleRepository;
	private readonly _userRepository: UserRepository;
	private readonly _messageRepository: MessageRepository;

	private readonly _migrateService: MigrateService;
	private readonly _wsService: WsService;

	private constructor() {
		// this._configSource = new ConfigSourceDotenv();
		// this._apiSource = new ApiSourceAxios();
		this._sequelizeSource = new SequelizeSourceImpl(this.configSource.config);

		this._googleRepository = new GoogleRepositoryImpl(this.apiSource);
		this._userRepository = new UserRepositoryImpl();
		this._messageRepository = new MessageRepositoryImpl();

		this._migrateService = new MigrateServiceUmzug(this.sequelizeSource.sequelize);
		this._wsService = new WsServiceWebsocket({
			config: this.configSource.config,
			userRepository: this.userRepository,
			googleRepository: this.googleRepository,
			messageRepository: this.messageRepository,
		});
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

	public get apiSource(): ApiSource {
		return this._apiSource;
	}

	public get sequelizeSource(): SequelizeSource {
		return this._sequelizeSource;
	}

	public get googleRepository(): GoogleRepository {
		return this._googleRepository;
	}

	public get userRepository(): UserRepository {
		return this._userRepository;
	}

	public get messageRepository(): MessageRepository {
		return this._messageRepository;
	}

	public get migrateService(): MigrateService {
		return this._migrateService;
	}

	public get wsService(): WsService {
		return this._wsService;
	}
}
