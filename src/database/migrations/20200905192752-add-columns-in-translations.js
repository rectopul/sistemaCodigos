'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([queryInterface.addColumn('translations', 'title', { type: Sequelize.DataTypes.TEXT })])
    },

    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn('translations', 'title')])
    },
}
