/* eslint-disable no-console, no-unused-vars */
import { LogLevel, LogService, LogServiceMessage } from '../../domain/services/log.service';
import * as console from 'node:console';
import moment from 'moment';

const colors = {
	INFO: '\x1b[32m',
	DEBUG: '\x1b[34m',
	ERROR: '\x1b[31m',
	WARN: '\x1b[33m',
	VERB: '\x1b[43m',
};

// eslint-disable-next-line no-shadow
export enum LogServiceConsoleFormatter {
	json,
	color,
}

export class LogServiceConsole extends LogService {
	private readonly _formatter: LogServiceConsoleFormatter;

	constructor(name: string, formatter?: LogServiceConsoleFormatter) {
		super(name);
		this._formatter = formatter ?? LogServiceConsoleFormatter.json;
	}

	private _colorFormatter(data: LogServiceMessage): any {
		const { timestamp, level, name, stack, message, requestId, ...others } = data;
		if (message)
			return `${moment(timestamp).format('YYYYMMDD HH:mm:ss.SSS Z')} ${colors[level]}${level.toUpperCase()} [${name}]: ${requestId ? `{${requestId}} ` : ''}${message}\x1b[0m${stack ? `\n${colors[level]}${stack}\x1b[0m` : ''}`;
		return `${moment(timestamp).format('YYYYMMDD HH:mm:ss.SSS Z')} ${colors[level]}${level.toUpperCase()} [${name}]: ${requestId ? `{${requestId}} ` : ''}${JSON.stringify(others, null, 2)}\x1b[0m${stack ? `\n${colors[level]}${stack}\x1b[0m` : ''}`;
	}

	private _jsonFormatter(message: LogServiceMessage): any {
		return message;
	}

	private _format(message: LogServiceMessage) {
		switch (this._formatter) {
			case LogServiceConsoleFormatter.color:
				return this._colorFormatter(message);
			case LogServiceConsoleFormatter.json:
				return this._jsonFormatter(message);
		}
	}

	public log(level: LogLevel, message: LogServiceMessage) {
		const msg = { timestamp: new Date(), ...message };
		try {
			switch (level) {
				case LogLevel.debug:
					console.debug(this._format({ level: 'DEBUG', ...msg }));
					break;
				case LogLevel.info:
					console.info(this._format({ level: 'INFO', ...msg }));
					break;
				case LogLevel.warn:
					console.warn(this._format({ level: 'WARN', ...msg }));
					break;
				case LogLevel.error:
					console.error(this._format({ level: 'ERROR', ...msg }));
					break;
			}
		} catch (__) {
			console.error(message);
		}
	}
}
