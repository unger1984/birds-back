/* eslint-disable no-unused-vars */
export interface LogServiceMessage {
	method?: string;
	exception?: any;
	code?: number;
	message?: string;
	type?: string;
	stack?: any;
	[key: string]: any;
}

// eslint-disable-next-line no-shadow
export enum LogLevel {
	debug = 10,
	info = 20,
	warn = 30,
	error = 40,
}

export abstract class LogService {
	protected readonly name: string;
	public level: LogLevel = LogLevel.debug;

	protected constructor(name: string) {
		this.name = name;
	}

	public abstract log(level: LogLevel, message: LogServiceMessage);

	public debug(message: LogServiceMessage | string) {
		if (this.level <= LogLevel.debug) {
			if (typeof message === 'string') {
				this.log(LogLevel.debug, { name: this.name, message });
			} else {
				const msg: any = { name: this.name, ...message };
				if (message.exception && message.exception.stack && !message.stack) msg.stack = message.exception.stack;
				this.log(LogLevel.debug, msg);
			}
		}
	}

	public info(message: LogServiceMessage | string) {
		if (this.level <= LogLevel.info) {
			if (typeof message === 'string') {
				this.log(LogLevel.info, { name: this.name, message });
			} else {
				const msg: any = { name: this.name, ...message };
				if (message.exception && message.exception.stack && !message.stack) msg.stack = message.exception.stack;
				this.log(LogLevel.info, msg);
			}
		}
	}

	public warn(message: LogServiceMessage | string) {
		if (this.level <= LogLevel.warn) {
			if (typeof message === 'string') {
				this.log(LogLevel.warn, { name: this.name, message });
			} else {
				const msg: any = { name: this.name, ...message };
				if (message.exception && message.exception.stack && !message.stack) msg.stack = message.exception.stack;
				this.log(LogLevel.warn, msg);
			}
		}
	}

	public error(message: LogServiceMessage | string) {
		if (this.level <= LogLevel.error) {
			if (typeof message === 'string') {
				this.log(LogLevel.error, { name: this.name, message });
			} else {
				const msg: any = { name: this.name, ...message };
				if (message.exception && message.exception.stack && !message.stack) msg.stack = message.exception.stack;
				this.log(LogLevel.error, msg);
			}
		}
	}
}
