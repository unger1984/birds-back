import { ProfileDto } from '../dto/profile.dto';

export class UserEntity {
	id: number;
	email: string;
	given_name?: string | null;
	name?: string | null;
	picture?: string | null;

	constructor(profile: ProfileDto) {
		this.email = profile.email;
		this.name = profile.name;
		this.given_name = profile.given_name;
		this.picture = profile.picture;
	}
}
