'use strict'
const { DataTypes, Model } = require('sequelize')

class Translation extends Model {
    static init(sequelize) {
        super.init(
            {
                text: {
                    type: DataTypes.TEXT,
                    validate: {
                        notEmpty: {
                            msg: `A tradução não pode estar vazía`,
                        },
                    },
                },
                language: {
                    type: DataTypes.STRING,
                    notEmpty: {
                        msg: `A linguagem não pode estar vazía`,
                    },
                },
                title: {
                    type: DataTypes.TEXT,
                    validate: {
                        notEmpty: {
                            msg: `O titulo da tradução não pode estar vazio`,
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
        this.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' })
        this.belongsTo(models.Page, { foreignKey: 'page_id', as: 'page' })
    }
}

module.exports = Translation
