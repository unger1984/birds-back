import { resolve } from 'node:path';
import { Sequelize } from 'sequelize-typescript';

import { SequelizeSource } from '../../domain/datasources/sequelize.source';
import { ConfigEntity } from '../../domain/entities/config.entity';
import { LogFactory } from '../../factories/log.factory';

export class SequelizeSourceImpl implements SequelizeSource {
	private readonly _sequelize: Sequelize;

	constructor(config: ConfigEntity) {
		this._sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
			...config.db,
			logging: sql => LogFactory.getInstance().createLogger('SEQUELIZE').debug(sql),
			models: [resolve(__dirname, '../', 'models')],
			pool: {
				min: 0,
				max: 20,
				idle: 10000,
			},
		});

		// bigint
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		require('pg').types.setTypeParser(20, (value: string) => {
			return parseInt(value);
		});

		// numeric
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		require('pg').types.setTypeParser(1700, (value: string) => {
			return parseFloat(value);
		});
	}

	public get sequelize(): Sequelize {
		return this._sequelize;
	}
}
