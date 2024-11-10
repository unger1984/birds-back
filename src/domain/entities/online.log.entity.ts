import { WsClient } from './ws.client';
import moment from 'moment/moment';

export class OnlineLogEntity {
	id?: number;
	user_id?: number | null;
	ip?: string;
	connected: Date;
	time?: number;
	created_at?: Date;

	constructor(client: WsClient) {
		const duration = moment.duration(moment().diff(moment(client.createdAt)));

		this.user_id = client.user?.id ?? null;
		this.ip = client.ip;
		this.connected = client.createdAt;
		this.time = Math.floor(duration.asSeconds());
	}
}
