'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([queryInterface.addColumn('carousels', 'url', { type: Sequelize.DataTypes.TEXT })])
    },

    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn('carousels', 'url')])
    },
}
