import { Sequelize } from 'sequelize-typescript';

export abstract class SequelizeSource {
	public abstract get sequelize(): Sequelize;
}
