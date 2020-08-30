'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('users', [
            {
                name: 'User Teste',
                email: 'example@example.com',
                password_hash: bcrypt.hashSync('123mudar', 8),
                phone: '99 9999-9999',
                cell: '99 9999-9999',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ])
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('users', null, {})
    },
}
