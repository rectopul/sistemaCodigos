const { DataTypes, Model } = require('sequelize')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class Category extends Model {
    static init(sequelize) {
        super.init(
            {
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: `The name field cannot be empty`,
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
                slug: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: {
                        msg: `This category slug already exist`,
                    },
                    validate: {
                        notNull: {
                            msg: `The slug field cannot be null`,
                        },
                        notEmpty: {
                            msg: `The slug field cannot be empty`,
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
        //this.hasOne(models.Category, { foreignKey: 'parent', as: 'parent' })
        this.hasMany(models.Category, { foreignKey: 'parent', as: 'child' })
        this.hasMany(models.ProductCategory, { foreignKey: 'category_id', as: 'products' })
    }
}

module.exports = Category
