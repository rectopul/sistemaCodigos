'use strict'

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('banner_images', [
            {
                banner_id: 1,
                name: 'banner-strong.png',
                size: '1422196',
                key: `c7e39f276237cc53e3a7d9576034aba8-banner-strong.png`,
                url: `https://uploadwecheckout.s3.amazonaws.com/c7e39f276237cc53e3a7d9576034aba8-banner-strong.png`,
                default: false,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                banner_id: 2,
                name: 'banner-top.jpg',
                size: '161610',
                key: `adb9e1b88448e5bcd7fc3de5b5f2776e-banner-top.jpg`,
                url: `https://uploadwecheckout.s3.amazonaws.com/adb9e1b88448e5bcd7fc3de5b5f2776e-banner-top.jpg`,
                default: false,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ])
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('banner_images', null, {})
    },
}
