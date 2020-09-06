const { DataTypes, Model } = require('sequelize')

class Carousel extends Model {
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
                url: {
                    type: DataTypes.TEXT,
                    validate: {
                        notEmpty: {
                            msg: `The url field cannot be empty`,
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
        this.hasMany(models.TranslateCarousel, { foreignKey: 'carousel_id', as: 'translations' })
    }
}

module.exports = Carousel
