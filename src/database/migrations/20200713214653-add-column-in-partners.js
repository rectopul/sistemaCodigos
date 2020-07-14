'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('partners', 'content', { type: Sequelize.DataTypes.TEXT }),
            queryInterface.addColumn('partners', 'company', { type: Sequelize.DataTypes.TEXT }),
        ])
    },

    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn('partners', 'content'),
            queryInterface.removeColumn('partners', 'company'),
        ])
    },
}
