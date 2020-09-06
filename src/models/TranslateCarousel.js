const { DataTypes, Model } = require('sequelize')

class TranslateCarousel extends Model {
    static init(sequelize) {
        super.init(
            {
                language: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: `Informe a linguagem do banner`,
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
        this.belongsTo(models.Carousel, { foreignKey: 'carousel_id', as: 'carousel' })
    }
}

module.exports = TranslateCarousel
