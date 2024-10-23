import { ProfileDto } from '../../domain/dto/profile.dto';
import { LogFactory } from '../../factories/log.factory';
import { GoogleRepository } from '../../domain/repositories/google.repository';
import { ApiSource } from '../../domain/datasources/api.source';

export class GoogleRepositoryImpl extends GoogleRepository {
	private readonly _log = LogFactory.getInstance().createLogger('GoogleRepositoryImpl');
	private readonly _api: ApiSource;

	constructor(api: ApiSource) {
		super();
		this._api = api;
	}

	public override async getProfile(access_token: string): Promise<ProfileDto | null> {
		try {
			return await this._api.get<ProfileDto>(
				`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
			);
		} catch (exception) {
			this._log.error({ method: 'update', exception, stack: exception.stack });
		}

		return null;
	}
}
