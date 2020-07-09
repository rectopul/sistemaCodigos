const { DataTypes, Model } = require('sequelize')

class Banner extends Model {
    static init(sequelize) {
        super.init(
            {
                title: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The title field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The title field cannot be empty`,
                        },
                    },
                },
                position: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `The position field cannot be empty`,
                        },
                        notEmpty: {
                            msg: `The position field cannot be empty`,
                        },
                    },
                },
                description: {
                    type: DataTypes.TEXT,
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
        this.belongsTo(models.Page, { foreignKey: 'page_id', as: 'page' })
        this.hasOne(models.BannerImage, { foreignKey: 'banner_id', as: 'image' })
    }
}

module.exports = Banner
