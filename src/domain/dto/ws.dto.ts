/* eslint-disable no-unused-vars */
import { UserDto } from './user.dto';

// eslint-disable-next-line no-shadow
export enum WsCmd {
	message = 'message',
	sign_in = 'sign_in',
	auth = 'auth',
	count = 'count',
}

export class WsData {}

export class WsDataMessage extends WsData {
	text: string;
	date: Date;
	user?: UserDto | null;

	constructor(text: string, date: Date, user?: UserDto | null) {
		super();
		this.text = text;
		this.date = date;
		this.user = user;
	}
}

export class WsDataSignIn extends WsData {
	access_token: string;

	constructor(access_token: string) {
		super();
		this.access_token = access_token;
	}
}

export class WsDataAuth extends WsData {
	token: string;
	user?: UserDto | null;

	constructor(token: string, user?: UserDto | null) {
		super();
		this.token = token;
		this.user = user;
	}
}

export class WsDataCount extends WsData {
	total: number;

	constructor(total: number) {
		super();
		this.total = total;
	}
}

export class WsDto {
	cmd: WsCmd;
	data: WsData;

	constructor(cmd: WsCmd, data: WsData) {
		this.cmd = cmd;
		this.data = data;
	}
}
