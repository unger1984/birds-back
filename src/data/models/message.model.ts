import {
	Column,
	Model,
	Table,
	DataType,
	AllowNull,
	CreatedAt,
	UpdatedAt,
	ForeignKey,
	BelongsTo,
} from 'sequelize-typescript';

import { UserEntity } from '../../domain/entities/user.entity';
import { MessageEntity } from '../../domain/entities/message.entity';
import UserModel from './user.model';

@Table({ modelName: 'Message', tableName: 'message' })
export default class MessageModel extends Model<MessageEntity> {
	@ForeignKey(() => UserModel)
	@Column({ type: DataType.BIGINT })
	user_id: number;

	@BelongsTo(() => UserModel, 'user_id')
	user: UserEntity;

	@AllowNull(false)
	@Column({ type: DataType.TEXT })
	text: string;

	@AllowNull(false)
	@Column({ type: DataType.DATE })
	date: string;

	@CreatedAt
	created_at: Date;

	@UpdatedAt
	updated_at: Date;
}
