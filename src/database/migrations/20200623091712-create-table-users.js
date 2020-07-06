'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            phone: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            cell: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            address: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            city: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            about: {
                type: Sequelize.STRING,
            },
            password_hash: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            password_reset_token: {
                type: Sequelize.STRING,
            },
            password_reset_expires: {
                type: Sequelize.DATE,
            },
            type: {
                type: Sequelize.STRING,
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
        return queryInterface.dropTable('users')
    },
}
