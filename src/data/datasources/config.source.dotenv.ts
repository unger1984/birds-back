import { readFileSync } from 'fs';
import process from 'process';
import { ConfigSource } from '../../domain/datasources/config.source';
import { ConfigEntity } from '../../domain/entities/config.entity';
import { LogFactory } from '../../factories/log.factory';
import { LogLevel } from '../../domain/services/log.service';

export class ConfigSourceDotenv implements ConfigSource {
	private readonly _log = LogFactory.getInstance().createLogger('ConfigSourceDotenv');
	private _config: ConfigEntity;

	constructor() {
		this._log.info('Читаем конфиг');
		this._config = new ConfigEntity();
		// Парсим файл env
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const dotenv = require('dotenv').parse(readFileSync(`.env`));
		// Приводим к массиву
		const array = [];
		for (const key in dotenv) {
			array.push(key);
		}
		let error = false;
		for (const key of [...Object.keys(new ConfigEntity())]) {
			const exist = array.includes(key);
			// Проверяем что
			if (!exist) {
				this._log.warn(`Не определен ${key} в .env`);
				error = true;
			} else {
				this._config[key] = typeof this._config[key] === 'number' ? parseInt(dotenv[key]) : dotenv[key];
				process.env[key] = typeof this._config[key] === 'number' ? parseInt(dotenv[key]) : dotenv[key];
				this._log.info(`Значение для ${key} установлено: ${dotenv[key]}`);
			}
		}

		if (error) {
			this._log.error('При проверке env обнаружены ошибки');
			this._log.info(`Обратитесь к .env.sample для получения примерных значений`);
			process.kill(process.pid, 'SIGINT');
		}

		if (this._config.ENV === 'production') {
			LogFactory.getInstance().level = LogLevel.info;
		}
		this._log.info(`Конфиг загружен`);
	}

	public get config(): ConfigEntity {
		return this._config;
	}
}
