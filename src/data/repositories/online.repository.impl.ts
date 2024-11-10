import { OnlineRepository } from '../../domain/repositories/online.repository';
import { LogFactory } from '../../factories/log.factory';
import { OnlineLogEntity } from '../../domain/entities/online.log.entity';
import OnlineLogModel from '../models/online.log.model';
import UserModel from '../models/user.model';

export class OnlineRepositoryImpl extends OnlineRepository {
	private readonly _log = LogFactory.getInstance().createLogger('OnlineRepositoryImpl');

	public override async log(entity: OnlineLogEntity): Promise<OnlineLogEntity> {
		try {
			const model = await OnlineLogModel.create(entity);
			await model.save();
			return (
				await OnlineLogModel.findOne({ where: { id: model.id }, include: [{ model: UserModel, as: 'user' }] })
			)?.get({ plain: true });
		} catch (exception) {
			this._log.error({ method: 'log', exception, stack: exception.stack });
			throw exception;
		}
	}
}
