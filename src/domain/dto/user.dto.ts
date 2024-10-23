import { UserEntity } from '../entities/user.entity';

export class UserDto {
	name: string;
	avatar?: string | null;

	constructor(user: UserEntity) {
		this.name = user.name ?? user.given_name;
		this.avatar = user.picture;
	}
}
