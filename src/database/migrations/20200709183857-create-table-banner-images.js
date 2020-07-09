'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('banner_images', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            banner_id: {
                type: Sequelize.INTEGER,
                references: { model: 'banners', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            size: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            key: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            url: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            default: {
                type: Sequelize.BOOLEAN,
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
        return queryInterface.dropTable('banner_images')
    },
}
