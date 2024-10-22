// import { LogServiceWinston } from './data/services/log.service.winston';
import { LogLevel, LogService } from '../domain/services/log.service';
import { LogServiceConsole, LogServiceConsoleFormatter } from '../data/services/log.service.console';

export class LogFactory {
	private static _instance: LogFactory;
	private _level: LogLevel = LogLevel.debug;

	public static getInstance(): LogFactory {
		if (!LogFactory._instance) {
			LogFactory._instance = new LogFactory();
		}
		return LogFactory._instance;
	}

	public createLogger(name: string): LogService {
		// const service = new LogServiceWinston(name);
		const service = new LogServiceConsole(name, LogServiceConsoleFormatter.color);
		service.level = this._level;
		return service;
	}

	public set level(value: LogLevel) {
		this._level = value;
	}

	public get level() {
		return this._level;
	}
}
