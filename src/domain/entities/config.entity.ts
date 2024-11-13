/* eslint-disable no-unused-vars */

import { ConfigDbEntity } from './config.db.entity';

// eslint-disable-next-line no-shadow
export enum EnvTypes {
	development = 'development',
	production = 'production',
}

export class ConfigEntity {
	ENV: EnvTypes;
	SSL_SERVER_KEY: string;
	SSL_SERVER_CRT: string;
	HTTP_SERVER_HOST: string;
	HTTP_SERVER_PORT: number;
	HTTP_SERVER_WS: number;
	ECHO_PROTOCOL: string;
	TOKEN: string;
	YANDEX_CLIENT_SECRET: string;
	db: ConfigDbEntity;

	constructor() {
		this.SSL_SERVER_KEY = '';
		this.SSL_SERVER_CRT = '';
		this.HTTP_SERVER_HOST = 'localhost';
		this.HTTP_SERVER_PORT = 443;
		this.HTTP_SERVER_WS = 444;
		this.ECHO_PROTOCOL = 'birds';
		this.ENV = EnvTypes.development;
		this.TOKEN = '';
		this.YANDEX_CLIENT_SECRET = '';
		this.db = new ConfigDbEntity();
	}
}
