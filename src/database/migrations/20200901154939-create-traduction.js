'use strict'
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('translations', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            product_id: {
                type: Sequelize.INTEGER,
                unique: true,
                references: { model: 'products', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            category_id: {
                type: Sequelize.INTEGER,
                unique: true,
                references: { model: 'categories', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            page_id: {
                type: Sequelize.INTEGER,
                unique: true,
                references: { model: 'pages', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            text: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            language: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('translations')
    },
}
