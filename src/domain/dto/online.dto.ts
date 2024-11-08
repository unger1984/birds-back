import { UserDto } from './user.dto';
import { WsClient } from '../entities/ws.client';

export class OnlineDto {
	uuid?: string;
	ip?: string;
	user?: UserDto | null;
	createdAt?: Date;

	constructor(ws: WsClient) {
		this.uuid = ws.uuid;
		this.ip = ws.ip;
		this.user = ws.user ? new UserDto(ws.user) : null;
		this.createdAt = ws.createdAt;
	}
}
