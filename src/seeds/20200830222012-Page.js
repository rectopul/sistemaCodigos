'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('pages', [
            {
                title: 'Home',
                slug: 'home',
                content: `<h1 class="my-5">BratvaLabs®</h1>
                <p>
                            Estamos entre os laboratórios farmacêuticos mais renomados da Europa.
                            Desenvolvemos a mais segura tecnologia de fármacos para atletas de alta performance,
                            e realizamos negócios há mais de 25 anos, exportando para 30 países
                            ao redor de 4 continentes pelo mundo. Esse é nosso know-how global.
                            E agora <i>“the growth science to powerul results”</i> chega ao Paraguay.
                </p>
                <h4 class="my-5"><a href="/products">Conheça nossos produtos &gt;</a></h4>`,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                title: 'Produtos',
                slug: 'produtos',
                content: `<h1>BratvaLabs®<br>
                Produtos para sua alta performance.</h1>`,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ])
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('pages', null, {})
    },
}
