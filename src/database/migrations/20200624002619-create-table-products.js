'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('products', {
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
            description: {
                type: Sequelize.TEXT,
            },
            weight: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            brand: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            lot: {
                type: Sequelize.STRING,
                unique: true,
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            availability: {
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
        return queryInterface.dropTable('products')
    },
}
