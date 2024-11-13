import { ProfileDto, YandexProfileDto } from '../../domain/dto/profile.dto';
import { LogFactory } from '../../factories/log.factory';
import { ApiSource } from '../../domain/datasources/api.source';
import { YandexRepository } from '../../domain/repositories/yandex.repository';
import { ConfigEntity } from '../../domain/entities/config.entity';

export class YandexRepositoryImpl extends YandexRepository {
	private readonly _log = LogFactory.getInstance().createLogger('YandexRepositoryImpl');
	private readonly _api: ApiSource;
	private readonly _config: ConfigEntity;

	constructor(api: ApiSource, config: ConfigEntity) {
		super();
		this._api = api;
		this._config = config;
	}

	public override async getProfile(access_token: string): Promise<ProfileDto | null> {
		try {
			const res = await this._api.get<YandexProfileDto>(
				`https://login.yandex.ru/info?format=json&jwt_secret=${this._config.YANDEX_CLIENT_SECRET}`,
				{ headers: { Authorization: `Bearer ${access_token}` } },
			);
			return new ProfileDto(res);
		} catch (exception) {
			this._log.error({ method: 'update', exception, stack: exception.stack });
		}

		return null;
	}
}
