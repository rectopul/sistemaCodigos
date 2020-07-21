'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([queryInterface.addColumn('categories', 'position', { type: Sequelize.DataTypes.INTEGER })])
    },

    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn('categories', 'position')])
    },
}
