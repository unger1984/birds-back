/* eslint-disable no-unused-vars */

// eslint-disable-next-line no-shadow
export enum EnvTypes {
	development = 'development',
	production = 'production',
	local = 'local',
}

export class ConfigEntity {
	ENV: EnvTypes;
	SSL_SERVER_KEY: string;
	SSL_SERVER_CRT: string;
	HTTP_SERVER_HOST: string;
	HTTP_SERVER_PORT: number;
	HTTP_SERVER_WS: number;
	ECHO_PROTOCOL: string;

	constructor() {
		this.SSL_SERVER_KEY = '';
		this.SSL_SERVER_CRT = '';
		this.HTTP_SERVER_HOST = '';
		this.HTTP_SERVER_PORT = 443;
		this.HTTP_SERVER_WS = 444;
		this.ECHO_PROTOCOL = '';
		this.ENV = EnvTypes.development;
	}
}
