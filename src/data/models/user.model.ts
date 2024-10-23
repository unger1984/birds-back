import { Column, Model, Table, DataType, AllowNull, Default, CreatedAt, UpdatedAt, Unique } from 'sequelize-typescript';

import { UserEntity } from '../../domain/entities/user.entity';

@Table({ modelName: 'User', tableName: 'user' })
export default class UserModel extends Model<UserEntity> {
	@Unique
	@AllowNull(false)
	@Column({ type: DataType.STRING })
	email: string;

	@AllowNull(true)
	@Default(null)
	@Column({ type: DataType.STRING })
	given_name: string;

	@AllowNull(true)
	@Default(null)
	@Column({ type: DataType.STRING })
	name: string;

	@AllowNull(true)
	@Default(null)
	@Column({ type: DataType.STRING })
	picture: string;

	@CreatedAt
	created_at: Date;

	@UpdatedAt
	updated_at: Date;
}
