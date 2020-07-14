const { DataTypes, Model } = require('sequelize')

class Contact extends Model {
    static init(sequelize) {
        super.init(
            {
                fullname: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The fullname field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The fullname field cannot be empty`,
                        },
                    },
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The email field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The email field cannot be empty`,
                        },
                        isEmail: {
                            msg: `This field is a e-mail`,
                        },
                    },
                },
                subject: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The subject field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The subject field cannot be empty`,
                        },
                    },
                },
                message: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The message field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The message field cannot be empty`,
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

module.exports = Contact
