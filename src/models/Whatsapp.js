'use strict'
const { DataTypes, Model } = require('sequelize')

class Whatsapp extends Model {
    static init(sequelize) {
        super.init(
            {
                number: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                    validate: {
                        notEmpty: {
                            msg: `O informe o número de telefone`,
                        },
                        notNull: {
                            msg: `O informe o número de telefone`,
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

module.exports = Whatsapp
