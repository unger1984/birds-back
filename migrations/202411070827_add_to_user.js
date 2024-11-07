module.exports = {
	up: async ({ context: { queryInterface, Sequelize } }) => {
		await queryInterface.addColumn('user', 'last_seen', {
			type: Sequelize.DATE,
			allowNull: true,
			defaultValue: null,
			comment: 'последний визит',
		});
	},
	down: async ({ context: { queryInterface } }) => {
		await queryInterface.removeColumn('user', 'last_seen');
	},
};
