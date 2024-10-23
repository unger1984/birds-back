import { ProfileDto } from '../dto/profile.dto';

export abstract class GoogleRepository {
	public abstract getProfile(access_token: string): Promise<ProfileDto | null>;
}
