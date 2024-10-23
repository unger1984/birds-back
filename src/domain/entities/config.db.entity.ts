export class ConfigDbEntity {
	dialect: 'postgres' | 'mysql' | 'sqlite' | 'mariadb' | 'mssql' | undefined;
	host: string;
	port: number;
	logging: boolean | ((sql: string) => void);
	username: string;
	password: string;
	database: string;
	dialectOptions: any;
	define: any;
	timezone?: string;
}
