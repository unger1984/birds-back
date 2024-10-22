export class WsMessage {
	command: string;
	data: any;

	constructor(cmd: string, data: any) {
		this.command = cmd;
		this.data = data;
	}
}
