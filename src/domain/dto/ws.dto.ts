/* eslint-disable no-unused-vars */
import { UserDto } from './user.dto';
import { OnlineDto } from './online.dto';
import { WsClient } from '../entities/ws.client';

// eslint-disable-next-line no-shadow
export enum WsCmd {
	message = 'message',
	sign_in = 'sign_in',
	auth = 'auth',
	count = 'count',
	reload_chat = 'reload_chat',
	online = 'online',
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

export class WsDataReloadChat extends WsData {}

export class WsDataOnline extends WsData {
	list?: OnlineDto[];

	constructor(list?: WsClient[]) {
		super();
		this.list = list?.map(item => new OnlineDto(item));
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
