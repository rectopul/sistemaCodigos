'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([queryInterface.addColumn('partners', 'position', { type: Sequelize.DataTypes.INTEGER })])
    },

    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn('partners', 'position')])
    },
}
