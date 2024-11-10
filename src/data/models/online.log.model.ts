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
	Default,
} from 'sequelize-typescript';

import { UserEntity } from '../../domain/entities/user.entity';
import UserModel from './user.model';
import { OnlineLogEntity } from '../../domain/entities/online.log.entity';

@Table({ modelName: 'OnlineLog', tableName: 'online_log' })
export default class OnlineLogModel extends Model<OnlineLogEntity> {
	@ForeignKey(() => UserModel)
	@AllowNull(true)
	@Default(null)
	@Column({ type: DataType.BIGINT })
	user_id: number | null;

	@BelongsTo(() => UserModel, 'user_id')
	user: UserEntity;

	@AllowNull(false)
	@Column({ type: DataType.STRING })
	ip: string;

	@AllowNull(false)
	@Column({ type: DataType.DATE })
	connected: Date;

	@AllowNull(false)
	@Column({ type: DataType.INTEGER })
	time: number;

	@CreatedAt
	created_at: Date;

	@UpdatedAt
	updated_at: Date;
}
