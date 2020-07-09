const { DataTypes, Model } = require('sequelize')

class Page extends Model {
    static init(sequelize) {
        super.init(
            {
                title: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                    validate: {
                        notNull: {
                            msg: `The title field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The title field cannot be empty`,
                        },
                    },
                },
                content: {
                    type: DataTypes.TEXT,
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
                        msg: `This slug name already sxist`,
                    },
                    validate: {
                        notNull: {
                            msg: `The slug field cannot be empty`,
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
        this.hasOne(models.Banner, { foreignKey: 'page_id', as: 'banner' })
    }
}

module.exports = Page
