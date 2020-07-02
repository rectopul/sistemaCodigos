const { DataTypes, Model } = require('sequelize')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class ProductCategory extends Model {
    static init(sequelize) {
        super.init(
            {},
            {
                sequelize,
            }
        )
    }

    static associate(models) {
        this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' })
        this.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' })
    }
}

module.exports = ProductCategory
