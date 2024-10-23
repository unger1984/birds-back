import { LogFactory } from '../../factories/log.factory';
import { MessageEntity } from '../../domain/entities/message.entity';
import MessageModel from '../models/message.model';
import { MessageRepository } from '../../domain/repositories/message.repository';
import UserModel from '../models/user.model';

export class MessageRepositoryImpl extends MessageRepository {
	private readonly _log = LogFactory.getInstance().createLogger('MessageRepositoryImpl');

	public override async create(entity: MessageEntity): Promise<MessageEntity> {
		try {
			const model = await MessageModel.create(entity);
			await model.save();
			return await this.getById(model.id);
		} catch (exception) {
			this._log.error({ method: 'createOrUpdate', exception, stack: exception.stack });
			throw exception;
		}
	}

	public override async getById(id: number): Promise<MessageEntity> {
		try {
			return (await MessageModel.findOne({ where: { id }, include: [{ model: UserModel, as: 'user' }] })).get({
				plain: true,
			});
		} catch (exception) {
			this._log.error({ method: 'createOrUpdate', exception, stack: exception.stack });
			throw exception;
		}
	}

	public override async getLast(): Promise<MessageEntity[]> {
		try {
			return (
				await MessageModel.findAll({
					include: [{ model: UserModel, as: 'user' }],
					order: [['created_at', 'desc']],
					limit: 20,
				})
			)
				.map(itm => itm.get({ plain: true }))
				.reverse();
		} catch (exception) {
			this._log.error({ method: 'createOrUpdate', exception, stack: exception.stack });
		}
		return [];
	}
}
