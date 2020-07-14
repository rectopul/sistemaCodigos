const { DataTypes, Model } = require('sequelize')

class Partner extends Model {
    static init(sequelize) {
        super.init(
            {
                title: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: {
                        msg: `This title already exist`,
                    },
                    validate: {
                        notNull: {
                            msg: `The title field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The title field cannot be empty`,
                        },
                    },
                },
                company: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The company field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The company field cannot be empty`,
                        },
                    },
                },
                content: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The content field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The content field cannot be empty`,
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
        this.belongsTo(models.Image, { foreignKey: 'image_id', as: 'image' })
    }
}

module.exports = Partner
