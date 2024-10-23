import { UserEntity } from './user.entity';

export class MessageEntity {
	id?: number;
	user_id: number;
	user?: UserEntity;
	date: Date;
	text: string;
}
