//
const { DataTypes, Model } = require('sequelize')

class Subscriber extends Model {
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
                surname: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The surname field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The surname field cannot be empty`,
                        },
                    },
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: {
                        msg: `This email already sxist`,
                    },
                    validate: {
                        notNull: {
                            msg: `The email field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The email field cannot be empty`,
                        },
                    },
                },
                status: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The status field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The status field cannot be empty`,
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

module.exports = Subscriber
