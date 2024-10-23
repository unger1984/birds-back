module.exports = {
	up: async ({ context: { queryInterface, Sequelize } }) => {
		await queryInterface.createTable(
			'user',
			{
				id: {
					type: Sequelize.BIGINT,
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
				},
				email: {
					type: Sequelize.STRING,
					unique: true,
					allowNull: false,
					comment: 'Email пользователя',
				},
				given_name: {
					type: Sequelize.STRING,
					allowNull: true,
					defaultValue: null,
					comment: 'Имя пользователя',
				},
				name: {
					type: Sequelize.STRING,
					allowNull: true,
					defaultValue: null,
					comment: 'Имя пользователя',
				},
				picture: {
					type: Sequelize.STRING,
					allowNull: true,
					defaultValue: null,
					comment: 'Ссылка на аватар',
				},
				created_at: {
					allowNull: false,
					type: Sequelize.DATE,
				},
				updated_at: {
					allowNull: false,
					type: Sequelize.DATE,
				},
			},
			{
				comment: 'Пользователи',
			},
		);
	},
	down: ({ context: { queryInterface } }) => queryInterface.dropTable('user'),
};
