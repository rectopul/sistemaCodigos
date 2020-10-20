'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([queryInterface.addColumn('searches', 'inserted_code', { type: Sequelize.DataTypes.STRING })])
    },

    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn('searches', 'inserted_code')])
    },
}
