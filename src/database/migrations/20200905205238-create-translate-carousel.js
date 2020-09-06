'use strict'
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('translate_carousels', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            carousel_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'carousels', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            image_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'images', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
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
        return queryInterface.dropTable('translate_carousels')
    },
}
