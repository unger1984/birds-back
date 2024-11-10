module.exports = {
	up: async ({ context: { queryInterface, Sequelize } }) => {
		await queryInterface.createTable(
			'online_log',
			{
				id: {
					type: Sequelize.BIGINT,
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
				},
				user_id: {
					type: Sequelize.BIGINT,
					allowNull: true,
					defaultValue: null,
					reference: {
						model: 'user',
						key: 'id',
					},
					onDelete: 'SET NULL',
					comment: 'Ссылка на пользователя',
				},
				ip: {
					type: Sequelize.STRING,
					allowNull: false,
					comment: 'Адрес',
				},
				connected: {
					type: Sequelize.DATE,
					allowNull: false,
					comment: 'Дата подключения',
				},
				time: {
					type: Sequelize.INTEGER,
					allowNull: false,
					comment: 'время онлайн в секундах',
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
				comment: 'Лог онлайна',
			},
		);
	},
	down: ({ context: { queryInterface } }) => queryInterface.dropTable('online_log'),
};
