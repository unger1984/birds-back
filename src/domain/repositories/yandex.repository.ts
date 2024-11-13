import { ProfileDto } from '../dto/profile.dto';

export abstract class YandexRepository {
	public abstract getProfile(access_token: string): Promise<ProfileDto | null>;
}
