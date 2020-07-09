const page = (() => {
    //private var/functions
    //slugkeydown
    const changeSlug = (form) => {
        const title = form.querySelector('.pageTitle')

        const slug = form.querySelector('.pageSlug')

        let automatic = true

        if (automatic) {
            title.addEventListener('keyup', (e) => {
                slug.value = validateSlug(title.value)
            })
        }

        slug.addEventListener('keyup', (e) => {
            slug.value = validateSlug(slug.value)
            automatic = false
        })
    }

    const isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) return false
        }
        return true
    }

    //validate slug
    const validateSlug = (slug) => {
        slug = slug
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/ /g, '_')

        return slug
    }

    const actionButton = (button) => {
        const form = button.closest('form')
        changeSlug(form)
        button.addEventListener('click', (e) => {
            e.preventDefault()
            //function
            return create(form)
        })
    }

    const insertMenu = (object) => {
        const { title, slug } = object

        const pai = document.querySelector('#collapsePages > div')
        const filho = document.querySelector('#collapsePages > div .collapse-divider')

        const newPage = document.createElement('a')

        newPage.classList.add('collapse-item')

        newPage.setAttribute('href', `/page/${slug}`)

        newPage.innerHTML = title

        pai.insertBefore(newPage, filho)
    }

    const request = (object) => {
        return new Promise((resolve, reject) => {
            const { title, slug, content } = object

            const token = `Bearer ${document.body.dataset.token}`

            fetch(`/api/page`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    authorization: token,
                },
                body: JSON.stringify({ title, slug, content }),
            })
                .then((r) => r.json())
                .then((res) => {
                    if (res.error) return reject(res.error)

                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    const requestUpdate = (object) => {
        return new Promise((resolve, reject) => {
            const { slug, content, banner } = object

            const token = `Bearer ${document.body.dataset.token}`

            fetch(`/api/page/${object.id}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    authorization: token,
                },
                body: JSON.stringify({ slug, content, banner }),
            })
                .then((r) => r.json())
                .then((res) => {
                    if (res.error) return reject(res.error)

                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    const validate = (list) => {
        const object = {}
        const banner = {}
        const msg = `Preencha este campo`
        return new Promise((resolve, reject) => {
            list.map((item) => {
                const input = item

                if (!input.classList.contains('pageSlug')) {
                    if (input.tagName != 'BUTTON') {
                        if (!input.value || input.value == `Selecione...`) {
                            input.setCustomValidity(msg)

                            input.reportValidity()

                            return reject(msg)
                        }
                    }
                }

                if (input.classList.contains('pageTitle')) object.title = input.value
                if (input.classList.contains('pageContent')) object.content = input.value
                if (input.classList.contains('pageSlug')) object.slug = input.value
                if (input.classList.contains('bannerTitle')) banner.title = input.value
                if (input.classList.contains('bannerPosition')) banner.position = input.value
                if (input.classList.contains('bannerDescription')) banner.description = input.value
            })

            if (!isEmpty(banner)) object.banner = banner

            return resolve(object)
        })
    }

    const create = (form, banners) => {
        const elements = []

        console.log(banners)

        Array.from(form.elements).map((input) => {
            if (input.tagName != 'BUTTON')
                return elements.push({
                    input: input,
                    msg: `Preencha este campo`,
                })
        })

        return validate(elements)
            .then((r) => {
                return request(r)
                    .then((res) => {
                        insertMenu(res)
                        return Swal.fire({
                            title: `Página criada`,
                            text: `A página ${res.title} foi criada com sucesso!`,
                            icon: 'success',
                            confirmButtonText: 'Ok',
                        })
                    })
                    .catch((err) => {
                        return Swal.fire({
                            title: `Erro ao criar página`,
                            text: err,
                            icon: 'error',
                            confirmButtonText: 'Ok',
                        })
                    })
            })
            .catch((err) => console.log(err))
    }

    const update = (form, banners, formBanner) => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault()

            console.log(`Banners`, banners)

            const object = [...form.elements]

            const data = {}

            const imageForm = new FormData()
            imageForm.append('file', banners[0])

            if (banners) {
                if (!formBanner) return console.log(`Nenhum formulário de banner inserido`)

                const bannerInputs = [...formBanner.elements]

                if (formBanner.classList.contains('changed')) {
                    const banner = await validate(bannerInputs)
                    const bannerImage = await util.request('banner-image', 'POST', true, imageForm)

                    if (!banner) return console.log(`Erro na validação do banner`)

                    data.banner = {
                        image_id: bannerImage.id,
                        title: banner.banner.title,
                        position: banner.banner.position,
                        description: banner.banner.description,
                    }
                }
            }

            const id = form.querySelector('button').dataset.id

            return validate(object)
                .then((r) => {
                    const { slug, content } = r
                    data.id = id
                    data.slug = slug
                    data.content = content
                    return requestUpdate(data)
                        .then((res) => {
                            if (formBanner) formBanner.classList.remove('changed')
                            return Swal.fire({
                                title: `Página Atualizada`,
                                text: `A página ${res.title} foi atualizada com sucesso!`,
                                icon: 'success',
                                confirmButtonText: 'Ok',
                            })
                        })
                        .catch((err) => {
                            return Swal.fire({
                                title: `Erro ao atualizar página página`,
                                text: err,
                                icon: 'error',
                                confirmButtonText: 'Ok',
                            })
                        })
                })
                .catch((err) => console.log(err))
        })
    }

    return {
        //public var/functions
        create: actionButton,
        update,
    }
})()

const banner = (() => {
    //private var/functions
    const validate = (list) => {
        const object = {}
        return new Promise((resolve, reject) => {
            list.map((item) => {
                const { input, msg } = item

                if (!input.classList.contains('pageSlug')) {
                    if (!input.value || input.value == `Selecione...`) {
                        input.setCustomValidity(msg)

                        input.reportValidity()

                        return reject(msg)
                    }
                }

                if (input.classList.contains('pageTitle')) object.title = input.value
                if (input.classList.contains('pageContent')) object.content = input.value
                if (input.classList.contains('pageSlug')) object.slug = input.value
            })
            console.log(object)

            return resolve(object)
        })
    }

    const request = (object) => {
        return new Promise((resolve, reject) => {
            const { title, position, description, page_id } = object

            const token = `Bearer ${document.body.dataset.token}`

            fetch(`/api/banner/${page_id}`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    authorization: token,
                },
                body: JSON.stringify({ title, position, description }),
            })
                .then((r) => r.json())
                .then((res) => {
                    if (res.error) return reject(res.error)

                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    const create = (form) => {
        form.addEventListener('submit', function (e) {
            e.preventDefault()

            const page_id = form.querySelector('button').dataset.id

            const elements = Array.from(form.elements).map((input) => {
                if (input.tagName != `BUTTON`) {
                    return {
                        input,
                        msg: `Preencha este campo`,
                    }
                }
            })

            return validate(elements).then((r) => {
                const data = { page_id, title: r.title, position: r.position, description: r.description }
                return request(data)
                    .then((res) => {
                        return Swal.fire({
                            title: `Banner criado`,
                            text: `O banner ${res.title} foi criado com sucesso!`,
                            icon: 'success',
                            confirmButtonText: 'Ok',
                        })
                    })
                    .catch((err) => {
                        return Swal.fire({
                            title: `Erro ao criar Banner`,
                            text: err,
                            icon: 'error',
                            confirmButtonText: 'Ok',
                        })
                    })
            })
        })
    }

    return {
        //public var/functions
        create,
    }
})()

//btnAddPage
const btnAddPage = document.querySelector('.btnCreateNewPage')

if (btnAddPage) page.create(btnAddPage)

const updatePageForm = document.querySelector('.updatePageForm')

const formBanner = document.querySelector('.formBanner')

if (updatePageForm && formBanner) page.update(updatePageForm, util.images, formBanner)

const bannerImage = document.querySelector('.bannerImage')

const bannersContainer = document.querySelector('.bannersContainer')

if (bannerImage && bannersContainer) util.image(bannerImage, bannersContainer, 'single', 'large')
