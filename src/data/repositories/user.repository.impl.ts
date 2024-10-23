import { UserRepository } from '../../domain/repositories/user.repository';
import { LogFactory } from '../../factories/log.factory';
import { UserEntity } from '../../domain/entities/user.entity';
import UserModel from '../models/user.model';
import { Op } from 'sequelize';

export class UserRepositoryImpl extends UserRepository {
	private readonly _log = LogFactory.getInstance().createLogger('UserRepositoryImpl');

	public override async createOrUpdate(entity: UserEntity): Promise<UserEntity> {
		try {
			const found = await this.getByEmail(entity.email);
			if (!found) {
				const model = await UserModel.create(entity);
				await model.save();
				return model.get({ plain: true });
			}
			await UserModel.update(entity, { where: { id: found.id } });
			return this.getByEmail(found.email);
		} catch (exception) {
			this._log.error({ method: 'createOrUpdate', exception, stack: exception.stack });
			throw exception;
		}
	}

	public override async getByEmail(email: string): Promise<UserEntity | null> {
		try {
			return (await UserModel.findOne({ where: { email: { [Op.iLike]: email } } }))?.get({ plain: true }) ?? null;
		} catch (exception) {
			this._log.error({ method: 'getByEmail', exception, stack: exception.stack });
		}
		return null;
	}
}
