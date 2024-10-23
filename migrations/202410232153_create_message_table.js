module.exports = {
	up: async ({ context: { queryInterface, Sequelize } }) => {
		await queryInterface.createTable(
			'message',
			{
				id: {
					type: Sequelize.BIGINT,
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
				},
				user_id: {
					type: Sequelize.BIGINT,
					allowNull: false,
					reference: {
						model: 'user',
						key: 'id',
					},
					onDelete: 'CASCADE',
					comment: 'Ссылка на автора',
				},
				text: {
					type: Sequelize.TEXT,
					allowNull: false,
					comment: 'Текст сообщения',
				},
				date: {
					type: Sequelize.DATE,
					allowNull: false,
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
				comment: 'Сообщения',
			},
		);
	},
	down: ({ context: { queryInterface } }) => queryInterface.dropTable('message'),
};
