'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('pages', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            slug: {
                type: Sequelize.TEXT,
                unique: true,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        })
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('pages')
    },
}
