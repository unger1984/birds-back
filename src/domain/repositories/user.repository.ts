import { UserEntity } from '../entities/user.entity';

export abstract class UserRepository {
	public abstract createOrUpdate(entity: UserEntity): Promise<UserEntity>;
	public abstract getByEmail(email: string): Promise<UserEntity | null>;
}
