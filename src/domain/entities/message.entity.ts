import { UserEntity } from './user.entity';
import { WsDataMessage } from '../dto/ws.dto';

export class MessageEntity {
	id?: number;
	user_id: number;
	user?: UserEntity;
	date: Date;
	text: string;

	constructor(dto: WsDataMessage, user_id: number) {
		this.user_id = user_id;
		this.date = dto.date;
		this.text = dto.text;
	}
}
