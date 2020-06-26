const { DataTypes, Model } = require('sequelize')

class Code extends Model {
    static init(sequelize) {
        super.init(
            {
                code: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                    validate: {
                        notNull: {
                            msg: `The code field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The code field cannot be empty`,
                        },
                    },
                },
                description: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The description field cannot be empty`,
                        },
                    },
                },
            },
            {
                sequelize,
            }
        )
    }

    static associate(models) {
        this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' })
        this.belongsTo(models.ProductIten, { foreignKey: 'item_id', as: 'item' })
    }
}

module.exports = Code
