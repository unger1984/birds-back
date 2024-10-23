import { Sequelize } from 'sequelize-typescript';
import { Umzug, SequelizeStorage } from 'umzug';

import { MigrateService } from '../../domain/services/migrate.service';
import { LogFactory } from '../../factories/log.factory';

export class MigrateServiceUmzug extends MigrateService {
	private readonly _log = LogFactory.getInstance().createLogger('MigrateServiceUmzug');
	private readonly _umzug: Umzug;

	constructor(sequelize: Sequelize) {
		super();
		this._umzug = new Umzug({
			storage: new SequelizeStorage({ sequelize, tableName: 'sequelize_migrations' }),
			migrations: {
				glob: 'migrations/*.js',
			},
			context: () => ({ queryInterface: sequelize.getQueryInterface(), Sequelize: sequelize.constructor }),
			logger: undefined,
		});
	}

	public override async migrate(): Promise<void> {
		return new Promise((response, reject) => {
			this._umzug
				.up()
				.then(migrations => {
					migrations.map(mig => {
						this._log.info(`Migrate ${mig.name}`);
					});
				})
				.then(() => response())
				.catch(exc => reject(exc));
		});
	}
}
