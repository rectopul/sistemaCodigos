'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([queryInterface.addColumn('products', 'slug', { type: Sequelize.DataTypes.TEXT })])
    },

    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn('products', 'slug')])
    },
}
