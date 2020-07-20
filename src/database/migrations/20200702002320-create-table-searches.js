'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('searches', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            code_id: {
                type: Sequelize.INTEGER,
                references: { model: 'codes', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            name: {
                type: Sequelize.STRING,
            },
            surname: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            address: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            city: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            device: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            ip: {
                type: Sequelize.TEXT,
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
        return queryInterface.dropTable('searches')
    },
}
