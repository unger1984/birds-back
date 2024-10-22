import { UserEntity } from './user.entity';

export class ChatMessageEntity {
	date: Date;
	text: string;
	user?: UserEntity;

	constructor(text: string, user?: UserEntity) {
		this.date = new Date();
		this.text = text;
		this.user = user;
	}
}
