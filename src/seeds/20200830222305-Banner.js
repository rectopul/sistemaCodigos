'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('banners', [
            {
                page_id: 1,
                title: 'Test',
                position: 'top',
                description: `Imagem phones`,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                page_id: 2,
                title: 'Test',
                position: 'top',
                description: `Esta é ima imagem que ilustra fones`,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ])
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('banners', null, {})
    },
}
