'use strict'
const { DataTypes, Model } = require('sequelize')

class Translation extends Model {
    static init(sequelize) {
        super.init(
            {
                text: DataTypes.TEXT,
                language: DataTypes.STRING,
            },
            {
                sequelize,
            }
        )
    }

    static associate(models) {
        this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' })
        this.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' })
        this.belongsTo(models.Page, { foreignKey: 'page_id', as: 'page' })
    }
}

module.exports = Translation
