const { DataTypes, Model } = require('sequelize')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class Search extends Model {
    static init(sequelize) {
        super.init(
            {
                name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The name field cannot be empty`,
                        },
                    },
                },
                surname: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `The surname field cannot be empty`,
                        },
                    },
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The email field cannot be null`,
                        },
                        notEmpty: {
                            msg: `The email field cannot be empty`,
                        },
                        isEmail: {
                            msg: `The email field must be an email`,
                        },
                    },
                },
                address: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The address field cannot be null`,
                        },
                        notEmpty: {
                            msg: `The address field cannot be empty`,
                        },
                    },
                },
                city: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The city field cannot be null`,
                        },
                        notEmpty: {
                            msg: `The city field cannot be empty`,
                        },
                    },
                },
                device: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The device field cannot be null`,
                        },
                        notEmpty: {
                            msg: `The device field cannot be empty`,
                        },
                    },
                },
                ip: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The ip field cannot be null`,
                        },
                        notEmpty: {
                            msg: `The ip field cannot be empty`,
                        },
                    },
                },
                status: {
                    type: DataTypes.STRING
                },
                inserted_code: {
                    type: DataTypes.STRING
                }
            },
            {
                sequelize,
            }
        )
    }

    static associate(models) {
        this.belongsTo(models.Code, { foreignKey: 'code_id', as: 'code' })
    }
}

module.exports = Search
