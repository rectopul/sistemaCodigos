const { DataTypes, Model } = require('sequelize')

class Product extends Model {
    static init(sequelize) {
        super.init(
            {
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The name field cannot be empty`,
                        },
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
                weight: {
                    type: DataTypes.DECIMAL,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The weight field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The weight cannot be empty`,
                        },
                        isDecimal: {
                            msg: `The weight field must be in decimal format`,
                        },
                    },
                },
                brand: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The brand field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The brand cannot be empty`,
                        },
                    },
                },
                lot: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The lot field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The lot cannot be empty`,
                        },
                    },
                },
                type: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The type field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `This field cannot be empty`,
                        },
                    },
                },
                availability: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The availability field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `This availability cannot be empty`,
                        },
                    },
                },
            },
            {
                sequelize,
            }
        )
    }

    static associate(models) {}
}

module.exports = Product