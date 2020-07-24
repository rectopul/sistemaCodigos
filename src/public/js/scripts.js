const URL = `http://192.168.0.10:3333/api`

const util = (() => {
    const images = []
    let imageDefault = 0
    //private var/functions
    const setImageDefault = (image, container) => {
        image.addEventListener('click', (e) => {
            const index = image.dataset.index

            allImages = container.querySelectorAll('img')

            Array.from(allImages).forEach((img) => {
                img.classList.remove('active')
            })

            image.classList.add('active')

            imageDefault = parseInt(index)

            return console.log(imageDefault)
        })
    }

    image = (input, output, mode, size) => {
        input.addEventListener('change', (e) => {
            e.preventDefault()

            input.closest('form').classList.add('changed')

            const sizes = {
                large: [`my-2`, `col-12`],
                medium: [`my-2`, `col-6`],
                small: [`my-2`, `col-3`],
            }

            if (!size && !sizes[size]) return console.log(`Informe o tamanho entre (large, medium e small)`)

            const containerImages = output

            const inputFiles = [...input.files]

            const file = input.files[0]

            input.closest('.custom-file').querySelector('label').innerHTML = inputFiles.length + ` imagens`

            if (mode === `mult`) {
                inputFiles.map((file) => {
                    const imageContainer = document.createElement('div')

                    imageContainer.classList.add(`mb-2`, `col-sm-3`)

                    imageContainer.innerHTML = `
                    <img class="img-thumbnail" src="">
                    `

                    const image = imageContainer.querySelector('img')

                    // FileReader support
                    if (FileReader && file) {
                        var fr = new FileReader()
                        fr.onload = function () {
                            image.src = fr.result
                        }
                        fr.readAsDataURL(file)

                        images.push(file)

                        image.dataset.index = images.indexOf(file)

                        if (images.length === 1) image.classList.add('active')

                        setImageDefault(image, output)

                        return containerImages.append(imageContainer)
                    }

                    // Not supported
                    else {
                        // fallback -- perhaps submit the input to an iframe and temporarily store
                        // them on the server until the user's session ends.
                    }
                })
            } else {
                const imageContainer = document.createElement('div')

                imageContainer.classList.add(...sizes[size])

                imageContainer.innerHTML = `
                <img class="img-thumbnail" src="">
                `
                const image = imageContainer.querySelector('img')

                // FileReader support
                if (FileReader && file) {
                    var fr = new FileReader()
                    fr.onload = function () {
                        image.src = fr.result
                    }
                    fr.readAsDataURL(file)

                    images[0] = file

                    containerImages.innerHTML = ``

                    return containerImages.append(imageContainer)
                }

                // Not supported
                else {
                    // fallback -- perhaps submit the input to an iframe and temporarily store
                    // them on the server until the user's session ends.
                }
            }
        })
    }

    const request = (url, method, useToken, object, contentType) => {
        return new Promise((resolve, reject) => {
            /* const { headers, method, url } = object

            var myHeaders = new Headers()

            if (headers['Content-Type']) myHeaders.append('Content-Type', headers['Content-Type'])
            if (headers['authorization']) myHeaders.append('authorization', headers.authorization)

            var myInit = { method, headers: myHeaders }

            var myRequest = new Request(url, myInit)

            fetch(myRequest)
                .then((r) => r.json())
                .then((res) => {
                    if (res.error) return reject(res.error)

                    return resolve(res)
                })
                .catch((error) => reject(error)) */
            const token = `Bearer ${document.body.dataset.token}`

            const headers = {}

            if (contentType) headers['content-type'] = contentType

            const body = object || null

            if (useToken) headers.authorization = token

            fetch(`/api/${url}`, { method, headers, body })
                .then((r) => r.json())
                .then((res) => {
                    if (res.error) return reject(res.error)

                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    const scroll = (link) => {
        link.addEventListener('click', function (e) {
            e.preventDefault()

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth',
                block: `start`,
            })
        })
    }

    const validateSlug = (slug) => {
        slug = slug
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/ /g, '_')

        return slug
    }

    return {
        //public var/functions
        image,
        images,
        request,
        scroll,
        validateSlug,
    }
})()

const allprods = document.querySelector('.nav-link.dropdown-toggle')
const hoverMenu = document.querySelector('.nav-item.dropdown')

if (hoverMenu) {
    hoverMenu.onmouseover = () => {
        document.querySelector('.nav-item.dropdown > ul').classList.add('show')
    }
    hoverMenu.onmouseout = () => {
        document.querySelector('.nav-item.dropdown > ul').classList.remove('show')
    }
}

if (allprods) {
    allprods.addEventListener('click', function (e) {
        e.preventDefault()

        url = allprods.getAttribute('href')

        if (window.matchMedia('(min-width:800px)').matches) {
            window.location.href = url
        }
    })
}

const btnValidat = document.querySelector('.btnAnchor')

if (btnValidat) util.scroll(btnValidat)
;(function () {
    'use strict'
    window.addEventListener(
        'load',
        function () {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('needs-validation')
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function (form) {
                form.addEventListener(
                    'submit',
                    (event) => {
                        if (form.checkValidity() === false) {
                            event.preventDefault()
                            event.stopPropagation()
                        }
                        form.classList.add('was-validated')
                    },
                    false
                )
            })
        },
        false
    )
})()

const carousel = (() => {
    //private var/functions
    const table = $('#dataTable').DataTable()

    const change = (input) => {
        const container = document.querySelector('.carouselImageContainer')
        util.image(input, container, 'single', 'large')
    }

    const destroy = (button) => {
        button.addEventListener('click', async (e) => {
            e.preventDefault()

            try {
                const id = button.dataset.id

                const deleted = await request({
                    url: `/api/carousel/${id}`,
                    method: `DELETE`,
                })

                console.log(deleted)

                table
                    .row($(button.closest('tr')))
                    .remove()
                    .draw()
            } catch (error) {
                console.log(error)
            }
        })
    }

    const request = (object) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token

            const { url, method, body, headers } = object

            const options = {
                method: method || `GET`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }

            if (headers) {
                options.headers['content-type'] = headers['content-type']
            }

            if (body) options.body = body

            console.log(`Options request: `, options)

            fetch(url, options)
                .then((r) => r.json())
                .then((res) => {
                    if (res.error) return reject(res.error)

                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    const create = (form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault()

            const image = form.querySelector('.carouselImage').files[0]

            //return console.log(image)

            if (form.checkValidity()) {
                const formSend = new FormData()
                formSend.append('file', image)

                return request({
                    url: `/api/carousel/image`,
                    method: `POST`,
                    body: formSend,
                })
                    .then((rImage) => {
                        console.log(rImage)
                        return request({
                            url: `/api/carousel`,
                            method: `POST`,
                            headers: {
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                name: form.querySelector('.carouselName').value,
                                image_id: rImage.id,
                            }),
                        })
                            .then((res) => {
                                console.log(res)

                                listInput = [...form.elements]

                                listInput.map((input) => (input.value = ``))

                                const newRow = table.row
                                    .add([
                                        res.id,
                                        res.name,
                                        `<img src="${res.image.url}" alt="..." class="img-thumbnail" style="max-width: 120px;">`,
                                        res.createdAt,
                                        `<button type="button"
                                            class="btn btn-datatable btn-icon btn-transparent-dark carouselDestroy py-0"
                                            data-id="${res.id}">

                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round" class="feather feather-trash-2">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path
                                                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                                </path>
                                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                                <line x1="14" y1="11" x2="14" y2="17"></line>
                                            </svg>
                                        </button>
                                        `,
                                    ])
                                    .draw()
                                    .node()

                                $('#modalCarousel').modal('hide')
                                const buttonDestroy = newRow.querySelector('.carouselDestroy')

                                if (buttonDestroy) destroy(buttonDestroy)

                                return Swal.fire({
                                    title: `Sucesso!`,
                                    text: `Imagem criada com sucesso!`,
                                    icon: 'success',
                                    confirmButtonText: 'Ok',
                                })
                            })
                            .catch((err) => console.log(err))
                    })
                    .catch((err) => {
                        return Swal.fire({
                            title: `Erro`,
                            text: err,
                            icon: 'error',
                            confirmButtonText: 'Ok',
                        })
                    })
            }
        })
    }

    return {
        //public var/functions
        change,
        create,
        destroy,
    }
})()

const carouselDestroy = document.querySelectorAll('.carouselDestroy')

if (carouselDestroy) {
    Array.from(carouselDestroy).forEach((button) => {
        carousel.destroy(button)
    })
}

const carouselImage = document.querySelector('.carouselImage')

const carouselForm = document.querySelector('.carouselForm')

if (carouselForm) carousel.create(carouselForm)
if (carouselImage) carousel.change(carouselImage)

const category = (() => {
    const table = $('#dataTable').DataTable()

    //Private vars/functions
    const btnClick = (btn) => {
        const id = btn.dataset.id

        btn.addEventListener('click', (e) => {
            e.preventDefault()
            return removeCategory(btn, id)
        })
    }

    const removeCategory = (element, id) => {
        requestDestroy(id)
            .then((res) => {
                table
                    .row($(element.closest('tr')))
                    .remove()
                    .draw()
                /* if (element.closest('tr')) {
                    element.closest('tr').remove()
                } */

                return Swal.fire({
                    title: `Categoria ${res.name} removida com sucesso!`,
                    icon: 'success',
                    confirmButtonText: 'Ok',
                })
            })
            .catch((err) => {
                return Swal.fire({
                    title: err,
                    text: `Ocorreu um erro ao remover a categoria`,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                })
            })
    }

    const requestDestroy = (id) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token

            fetch(`/api/category/${id}`, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    if (!res.ok) return reject(`Erro ao deletar categoria`)
                    return res.json()
                })
                .then((res) => resolve(res))
                .catch((error) => reject(error))
        })
    }

    const destroy = (btn) => {
        return btnClick(btn)
    }

    //Validate form
    const validateForm = (list) => {
        return new Promise((resolve, reject) => {
            list.map((item) => {
                const { input, msg } = item

                console.log()

                if (!input.value || input.value == `Selecione...`) {
                    input.setCustomValidity(msg)

                    input.reportValidity()

                    return reject(msg)
                }

                return resolve()
            })
        })
    }

    //Create new category
    const requestCreate = (object) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token

            const { name, description, slug, parent, position } = object

            fetch(`/api/category`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description, slug, parent, position }),
            })
                .then((r) => r.json())
                .then((res) => {
                    if (res.error) return reject(res.error)
                    resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    //Create category in front
    const createFront = (object) => {
        const { id, name, description, createdAt, position } = object

        let data = new Date(createdAt)

        data = new Intl.DateTimeFormat('pt-BR').format(data)

        const newRow = table.row
            .add([
                id,
                name,
                description,
                position,
                0,
                `<!-- Botão de ação Editar // -->
            <button type="button" class="btn btn-datatable btn-icon btn-transparent-dark editCategory py-0" data-toggle="modal" data-target="#modalEditCategory" data-id="${id}">
                <i class="fas fa-edit"></i>
            </button>
            <!-- Botão de ação Editar // -->
            <button type="button" class="btn btn-datatable btn-icon btn-transparent-dark categoryDestroy py-0" data-id="${id}">
                <i class="far fa-trash-alt"></i>
            </button>`,
            ])
            .draw()
            .node()

        newRow.classList.add(`category-${id}`)

        const btnEdit = newRow.querySelector('.editCategory')

        openModal(btnEdit)

        const btnDestroy = newRow.querySelector('.categoryDestroy')

        destroy(btnDestroy)

        //document.querySelector('.listCaregories').append(tr)
    }

    const create = (btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault()

            const inputName = document.querySelector('.categoryName')
            const inputDescription = document.querySelector('.categoryDescription')
            const inputSlug = document.querySelector('.categorySlug')
            const inputParent = document.querySelector('.categoryParent')
            const inputPosition = document.querySelector('.categoryPosition')

            const inputsValidate = [{ input: inputName, msg: `Informe um nome para a categoria` }]

            return validateForm(inputsValidate)
                .then(() => {
                    return requestCreate({
                        name: inputName.value,
                        description: inputDescription.value,
                        slug: inputSlug.value,
                        parent: inputParent.value || null,
                        position: inputPosition.value,
                    })
                        .then((res) => {
                            createFront(res)
                            return Swal.fire({
                                title: `Categoria ${res.name} criada com sucesso!`,
                                icon: 'success',
                                confirmButtonText: 'Ok',
                            })
                        })
                        .catch((err) => {
                            return Swal.fire({
                                title: err,
                                icon: 'error',
                                confirmButtonText: 'Ok',
                            })
                        })
                })
                .catch((err) => console.log(err))
        })
    }

    //Find category
    const find = (id) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token
            fetch(`/api/category/${id}`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((res) => resolve(res))
                .catch((error) => reject(error))
        })
    }

    //edit
    const edit = (object) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token

            const { id, name, description, slug, parent, position } = object

            fetch(`/api/category/${id}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description, slug, parent, position }),
            })
                .then((res) => {
                    if (!res.ok) return reject(`Erro ao criar categoria`)
                    return res.json()
                })
                .then((res) => resolve(res))
                .catch((error) => reject(error))
        })
    }

    //Update category in front
    const updateFront = (object) => {
        const { id, name, description, slug, parent, createdAt } = object

        const category = document.querySelector(`.category-${id}`)

        if (category) {
            table.row($(category)).remove().draw()

            createFront(object)

            return Swal.fire({
                title: `Categoria ${name} editada com sucesso!`,
                icon: 'success',
                confirmButtonText: 'Ok',
            })
        }
    }

    const formSubmitEdit = (form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault()
            const id = form.dataset.id

            const name = form.querySelector('.editCategoryName').value
            const description = form.querySelector('.editCategoryDescription').value
            const slug = form.querySelector('.editCategorySlug').value
            const parent = form.querySelector('.editCategoryParent').value || null
            const position = form.querySelector('.editCategoryPosition').value

            return edit({
                id,
                name,
                description,
                slug,
                parent,
                position,
            }).then((res) => {
                console.log(res)
                $('#modalEditCategory').modal('hide')

                return updateFront(res)
            })
        })
    }

    //Functions from edit categories
    const openModal = (btn) => {
        btn.addEventListener('click', (e) => {
            const id = btn.dataset.id
            const action = `editCategory`

            //const btnModal = document.querySelector('.btnEditCategory')

            return find(id)
                .then((res) => {
                    const inputName = document.querySelector('.editCategoryName')
                    const inputDescription = document.querySelector('.editCategoryDescription')
                    const inputSlug = document.querySelector('.editCategorySlug')
                    const inputParent = document.querySelector('.editCategoryParent')
                    const inputPosition = document.querySelector('.editCategoryPosition')

                    const { id, name, description, slug, parent, position } = res

                    if (inputParent.querySelector(`option[value="${parent}"]`)) {
                        inputParent.querySelector(`option[value="${parent}"]`).selected = true
                    }

                    inputName.value = name
                    inputDescription.value = description
                    inputSlug.value = slug
                    inputPosition.value = position

                    return (document.querySelector('.modalEditCategory form').dataset.id = id)
                })
                .catch((err) => {
                    console.log(err)
                    return Swal.fire({
                        title: `Erro ao editar categoria`,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                    })
                })
        })
    }

    return {
        destroy,
        create,
        edit: openModal,
        formSubmitEdit,
    }
})()

const formEditCategory = document.querySelector('.modalEditCategory form')

if (formEditCategory) category.formSubmitEdit(document.querySelector('.modalEditCategory form'))

if (document.querySelector('.editCategorySlug')) {
    document.querySelector('.editCategorySlug').addEventListener('keyup', function (e) {
        e.preventDefault()

        const thisValue = document.querySelector('.editCategorySlug').value

        document.querySelector('.editCategorySlug').value = util.validateSlug(thisValue)
    })
}

const btnCategoryDestroy = document.querySelectorAll('.categoryDestroy')

if (btnCategoryDestroy) {
    Array.from(btnCategoryDestroy).forEach((btn) => {
        return category.destroy(btn)
    })
}

const btnModalEditCategory = document.querySelectorAll('.editCategory')

if (btnModalEditCategory) {
    Array.from(btnModalEditCategory).forEach((btn) => {
        return category.edit(btn)
    })
}

const btnCreateCategory = document.querySelector('.btnCreateCategory')

if (btnCreateCategory) category.create(btnCreateCategory)

const loginResource = `login`

const requestLogin = (object) => {
    return new Promise((resolve, reject) => {
        const { email, password, gToken } = object

        const reqUrl = `/api/${loginResource}`
        fetch(reqUrl, {
            method: `POST`,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ email, password, gToken }),
        })
            .then((res) => res.json())
            .then((response) => {
                if (response.error) {
                    return reject(response.error)
                }

                resolve(response)
                return console.log(response)
            })
            .catch((error) => reject(error))
    })
}

const login = (form) => {
    const inputMail = form.querySelector('.loginMail')
    const inputPassword = form.querySelector('.loginPassword')

    form.classList.add('was-validated')

    if (!inputMail.value) {
        return inputMail.classList.add('is-invalid')
    } else {
        inputMail.classList.remove('is-invalid')
        inputMail.classList.add('is-valid')
        //
    }
    if (!inputPassword.value) return inputPassword.classList.add('is-invalid')

    grecaptcha.ready(function () {
        grecaptcha.execute('6LeM9q0ZAAAAAPJ827IgGMXdYRB9NdnNkbfrmaEY', { action: 'login' }).then(function (token) {
            // Add your logic to submit to your backend server here.
            return requestLogin({ email: inputMail.value, password: inputPassword.value, gToken: token })
                .then((res) => {
                    ///dashboard
                    window.location.href = '/dashboard'
                })
                .catch((error) => {
                    const divAlert = document.createElement('div')
                    divAlert.classList.add('alert', 'alert-danger')
                    divAlert.setAttribute('role', 'alert')
                    divAlert.innerHTML = error

                    form.prepend(divAlert)

                    setTimeout(() => {
                        divAlert.remove()
                    }, 4000)
                })
        })
    })
}

const btnLogin = document.querySelector('.btnLogin')

if (btnLogin) {
    btnLogin.addEventListener('click', (e) => {
        e.preventDefault()

        login(btnLogin.closest('form'))
    })
}

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
        const elements = [...form.elements]

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

const newsletter = (() => {
    //private var/functions
    const request = (object) => {
        const { name, email } = object
        return new Promise((resolve, reject) => {
            fetch('/api/subscriber', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ name, email }),
            })
                .then((r) => r.json())
                .then((res) => {
                    if (res.error) return reject(res.error)
                    return resolve(res)
                })
                .catch((err) => reject(err))
        })
    }

    const validate = (list) => {
        const object = {}
        return new Promise((resolve, reject) => {
            list.map((item) => {
                const { input, msg } = item

                console.log(input.value)

                if (input.tagName != `BUTTON`) {
                    if (!input.value || input.value == `Selecione...`) {
                        input.setCustomValidity(msg)

                        input.reportValidity()

                        return reject(msg)
                    }
                }

                if (input.classList.contains('subName')) object.name = input.value
                if (input.classList.contains('subEmail')) object.email = input.value
            })

            return resolve(object)
        })
    }

    const formsubmit = (form) => {
        form.addEventListener('submit', function (e) {
            e.preventDefault()

            const list = Array.from(form.elements).map((input) => {
                return { input, msg: `Por favor preencha este campo` }
            })

            return validate(list)
                .then((res) => {
                    return request(res)
                        .then((response) => {
                            return Swal.fire({
                                title: `Cadastrado com sucesso!`,
                                text: `Olá ${res.name} você se cadastrou com sucesso em nossa newsletter`,
                                icon: 'success',
                                confirmButtonText: 'Ok',
                            })
                        })
                        .catch((err) => {
                            return Swal.fire({
                                title: `Erro ao cadastrar-se`,
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
        subscribe: formsubmit,
    }
})()

const newsForm = document.querySelector('.newsForm')

if (newsForm) newsletter.subscribe(newsForm)

const partner = (() => {
    const table = $('#dataTable').DataTable()
    //private var/functions
    const fileChange = (input) => {
        input.addEventListener('change', (e) => {
            const filename = input.value.split(/(\\|\/)/g).pop()

            input.closest('.custom-file').querySelector('label').innerHTML = filename

            //action in change
            const containerImages = document.querySelector('.imagePartner')

            const files = [...input.files]

            console.log(`Lista de imagens`, files)

            files.map((file) => {
                if (file.type != `image/png`) {
                    input.value = ``

                    return Swal.fire({
                        title: `Imagem invlálida`,
                        text: `A imagem deve ser no formato png`,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                    })
                }

                const imageContainer = document.createElement('div')

                imageContainer.classList.add(`mb-2`, `col-12`)

                imageContainer.innerHTML = `
                <img class="img-thumbnail" src="">
                `

                const image = imageContainer.querySelector('img')

                // FileReader support
                if (FileReader && file) {
                    var fr = new FileReader()
                    fr.onload = function () {
                        image.src = fr.result
                    }
                    fr.readAsDataURL(file)

                    containerImages.innerHTML = ``

                    return containerImages.append(imageContainer)
                }

                // Not supported
                else {
                    // fallback -- perhaps submit the input to an iframe and temporarily store
                    // them on the server until the user's session ends.
                }
            })
        })
    }

    const request = (object) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token

            const { url, method, body, headers } = object

            const options = {
                method: method || `GET`,
                headers: {
                    authorization: `Bearer ${token}`,
                    'content-type': headers['content-type'] || null,
                },
            }

            if (body) options.body = JSON.stringify(body)

            fetch(url, options)
                .then((r) => r.json())
                .then((res) => {
                    if (res.error) return reject(res.error)

                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    const requestImg = (file) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token

            const form = new FormData()
            form.append('file', file)

            const reqUrl = `/api/image`

            fetch(reqUrl, {
                method: `POST`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
                body: form,
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
        const inputImage = form.querySelector('input[type="file"]')

        if (inputImage) {
            fileChange(inputImage)
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault()

            if (form.checkValidity()) {
                putSpinnet(form, `insert`)
                const object = {
                    title: form.querySelector('.partnerTitle').value,
                    company: form.querySelector('.partnerCompany').value,
                    content: form.querySelector('.partnerContent').value,
                    position: form.querySelector('.partnerPosition').value,
                }

                const url = form.dataset.id ? `/api/partner/${form.dataset.id}` : `/api/partner`

                const options = {
                    url,
                    method: form.dataset.id ? `PUT` : `POST`,
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: {
                        title: object.title,
                        company: object.company,
                        content: object.content,
                        position: object.position,
                    },
                }

                return request(options)
                    .then((response) => {
                        const { title, company, position, id, createdAt } = response

                        const elements = [...form.elements]

                        form.classList.remove('was-validated')

                        document.querySelector('.imagePartner').innerHTML = ``

                        elements.map((element) => {
                            element.value = ``
                        })

                        const data = new Intl.DateTimeFormat('pt-BR').format(new Date(createdAt))

                        if (form.dataset.id) {
                            table
                                .row($(`.partner-${id}`))
                                .remove()
                                .draw()

                            form.dataset.id = ``
                        }

                        const newRow = table.row
                            .add([
                                id,
                                title,
                                company,
                                position,
                                data,
                                `<button type="button"
                                    class="btn btn-datatable btn-icon btn-transparent-dark partnerDestroy py-0"
                                    data-id="${id}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="feather feather-trash-2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path
                                            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                        </path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                </button>
                                
                                <button type="button" class="btn btn-datatable btn-icon btn-transparent-dark partnerEdit"
                                    data-id="${id}">
                                    <i class="fas fas-fw fa-edit"></i>
                                </button>
                                `,
                            ])
                            .draw()
                            .node()

                        newRow.classList.add(`partner-${id}`)

                        const btnDestroy = newRow.querySelector('button.partnerDestroy')
                        const btnEditAction = newRow.querySelector('button.partnerEdit')

                        btnEdit(btnEditAction, form)
                        destroy(btnDestroy)

                        putSpinnet(form, `remove`)

                        $(form.closest('#modalPartner')).modal('hide')

                        return Swal.fire({
                            title: `Sucesso!`,
                            text: `Parceiro ${title} criado com sucesso!`,
                            icon: 'success',
                            confirmButtonText: 'Ok',
                        })
                    })
                    .catch((err) => {
                        putSpinnet(form, `remove`)
                        return Swal.fire({
                            title: `Erro`,
                            text: err,
                            icon: 'error',
                            confirmButtonText: 'Ok',
                        })
                    })
            }
        })
    }

    const destroy = (button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault()

            const id = button.dataset.id

            const options = {
                url: `/api/partner/${id}`,
                method: `DELETE`,
                headers: {
                    'content-type': 'application/json',
                },
            }

            return request(options)
                .then((res) => {
                    table
                        .row($(button.closest('tr')))
                        .remove()
                        .draw()

                    return Swal.fire({
                        title: `Sucesso!`,
                        text: `Parceiro ${res.title} deletado com sucesso!`,
                        icon: 'success',
                        confirmButtonText: 'Ok',
                    })
                })
                .catch((err) => {
                    return Swal.fire({
                        title: `Erro!`,
                        text: err,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                    })
                })
        })
    }

    const btnEdit = (button, form) => {
        button.addEventListener('click', (e) => {
            e.preventDefault()

            const id = button.dataset.id

            if (!form)
                return Swal.fire({
                    title: `Formulário não existe`,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                })

            form.dataset.id = id
            form.classList.add('edit')

            getValues(id)
                .then(edit)
                .then(putValues)
                .catch((err) => {
                    return Swal.fire({
                        title: `Erro ao editar`,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                    })
                })

            //return edit(form)
        })
    }

    const getValues = (id) => {
        return new Promise((resolve, reject) => {
            //Get all values

            return request({
                method: `GET`,
                url: `/api/partner/${id}`,
                headers: {
                    'content-type': `application/json`,
                },
            })
                .then((res) => resolve(res))
                .catch((err) => reject(err))
        })
    }

    const putValues = (values) => {
        return new Promise((resolve, reject) => {
            const { company, content, id, title, position } = values

            //inputs
            const inputCompany = document.querySelector('.partnerCompany')
            const inputTitle = document.querySelector('.partnerTitle')
            const inputContent = document.querySelector('.partnerContent')
            const inputPosition = document.querySelector('.partnerPosition')

            inputCompany.value = company
            inputTitle.value = title
            inputContent.value = content
            inputPosition.value = position

            $(inputContent.closest('#modalPartner')).modal('show')

            resolve(values)
        })
    }

    const edit = (values) => {
        return new Promise((resolve, reject) => {
            //Get new values
            //const id = form.dataset.id

            //Submit form
            return resolve(values)
        })
    }

    return {
        //public var/functions
        create,
        destroy,
        edit: btnEdit,
    }
})()

//Edit partners
const btnEditPartn = document.querySelectorAll('.partnerEdit')

if (btnEditPartn) Array.from(btnEditPartn).forEach((btn) => partner.edit(btn, document.querySelector('.partnerForm')))

const formPartner = document.querySelector('.partnerForm')

const partnerDestroy = document.querySelectorAll('.partnerDestroy')

if (formPartner) partner.create(formPartner)

if (partnerDestroy) {
    Array.from(partnerDestroy).forEach((button) => {
        partner.destroy(button)
    })
}

//hidden form partner

$('#modalPartner').on('hidden.bs.modal', function (e) {
    let form = this.querySelector('form')

    const elements = [...form.elements]

    form.dataset.id = ``

    elements.map((input) => (input.value = ``))

    console.log(form)
})

const btnsProduct = document.querySelectorAll('.productDelete')

const requestDeleteProduct = (id) => {
    return new Promise((resolve, reject) => {
        const token = document.body.dataset.token

        const reqUrl = `/api/product/${id}`
        fetch(reqUrl, {
            method: `DELETE`,
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.error) return reject(res.error)

                return resolve(res)
            })
            .catch((err) => reject(err))
    })
}

if (btnsProduct) {
    Array.from(btnsProduct).forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const Id = btn.dataset.product

            requestDeleteProduct(Id)
                .then((res) => {
                    btn.closest('.col-12').remove()
                    return Swal.fire({
                        title: `Produto excluido com sucesso!`,
                        text: `O produto ${res.name} foi excluído`,
                        icon: 'success',
                        confirmButtonText: 'Ok',
                    })
                })
                .catch((err) => {
                    return Swal.fire({
                        title: `Arro ao remover produto`,
                        text: err,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                    })
                })
        })
    })
}

const productResource = `product`

let codesInsert = [],
    productImages = []

const imgProduct = (() => {
    //private vars/functions
    const images = []
    const imagesId = []
    let imageDefault = 0
    //.imagesProductContainer

    const setImageDefault = (image) => {
        image.addEventListener('click', (e) => {
            const index = image.dataset.index

            allImages = image.closest('.imagesProductContainer').querySelectorAll('img')

            Array.from(allImages).forEach((img) => {
                img.classList.remove('active')
            })

            image.classList.add('active')

            imageDefault = parseInt(index)

            return console.log(imageDefault)
        })
    }

    const imageProductChange = (input) => {
        input.addEventListener('change', (e) => {
            e.preventDefault()

            //if (!input.closest('form').querySelector('.spinner-border')) putSpinnet(input.closest('form'), `insert`)

            const containerImages = document.querySelector('.imagesProductContainer')

            const inputFiles = [...input.files]

            input.closest('.custom-file').querySelector('label').innerHTML = inputFiles.length + ` imagens`

            console.log(`Lista de imagens`, inputFiles)

            inputFiles.map((file) => {
                const imageContainer = document.createElement('div')

                imageContainer.classList.add(`mb-2`, `col-sm-3`)

                imageContainer.innerHTML = `
                <img class="img-thumbnail" src="">
                `

                const image = imageContainer.querySelector('img')

                // FileReader support
                if (FileReader && file) {
                    var fr = new FileReader()
                    fr.onload = function () {
                        image.src = fr.result
                    }
                    fr.readAsDataURL(file)

                    images.push(file)

                    image.dataset.index = images.indexOf(file)

                    if (images.length === 1) image.classList.add('active')

                    setImageDefault(image)

                    return containerImages.append(imageContainer)
                }

                // Not supported
                else {
                    // fallback -- perhaps submit the input to an iframe and temporarily store
                    // them on the server until the user's session ends.
                }
            })
        })
    }

    //Send request to upload images
    const imageProductApi = () => {
        return new Promise(async (resolve, reject) => {
            const token = document.body.dataset.token

            const imagesUploaded = images.map(async (image) => {
                const form = new FormData()
                form.append('file', image)

                const reqUrl = `/api/image/product`

                image = await fetch(reqUrl, {
                    method: `POST`,
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                    body: form,
                })
                    .then((r) => r.json())
                    .then((res) => {
                        if (res.error) return reject(res.error)

                        imagesId.push(res.id)

                        return res
                    })
                    .catch((error) => reject(error))

                return await image[0]
            })

            const result = await Promise.all(imagesUploaded)

            /* console.log(`Resultado`, result)

            if (result) {
                result[imageDefault].default = true
            } */

            console.log(`Resultado retornado: `, result)

            return resolve(result)
        })
    }

    return {
        create: imageProductApi,
        change: imageProductChange,
        images: imagesId,
        default: setImageDefault,
    }
})()

const product = (() => {
    //private var/functions
    let codes = []

    const codesClear = () => {
        codes = []
    }

    const changePDF = (input) => {
        input.addEventListener('change', async (e) => {
            e.preventDefault()
        })
    }

    const filePDF = (input, action, id) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (input.files[0]) {
                    const file = input.files[0]

                    //check data type

                    if (input.value) {
                        //request insert pdf
                        if (file.type != `application/pdf`) return reject(`Selecione um arquivo do tipo PDF`)

                        const form = new FormData()

                        form.append('file', file)

                        if (action && action == `update`) {
                            const bull = await request({
                                url: `/api/bull/${id}`,
                                method: `PUT`,
                                body: form,
                            })

                            return resolve(bull)
                        }

                        const bull = await request({
                            url: `/api/bull`,
                            method: `POST`,
                            body: form,
                        })

                        document.querySelector('.idBullProduct').value = bull.id

                        return resolve(bull)
                    } else {
                        return reject(`O campo de bula está vazío`)
                    }
                } else {
                    resolve('Criado')
                }
            } catch (error) {
                return reject(error)
            }
        })
    }

    const insertSingleCode = (btn) => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault()

            const product_id = btn.dataset.id

            const form = btn.closest('form')

            if (form.checkValidity()) {
                const name = document.querySelector('.productItemName').value
                const code = document.querySelector('.productCode').value

                const container = document.querySelector('.listItensProduct')

                if (name && code) {
                    try {
                        const codeCreat = await request({
                            url: `/api/product-item/${product_id}`,
                            method: `POST`,
                            headers: {
                                'content-type': `application/json`,
                            },
                            body: JSON.stringify({ name, code }),
                        })

                        const codigo = document.createElement('div')

                        codigo.classList.add('col-12', 'mb-3')

                        codigo.innerHTML = `
                        <div class="card">
                            <div class="card-header">
                                ${codeCreat.name}
                                <button type="button" class="float-right raiz btn btn-danger btn-sm" data-code="${codeCreat.code.code}" data-id="68"><i class="fas fa-trash-alt"></i></button>
                            </div>
                            <div class="card-body">
                                ${codeCreat.code.code}
                            </div>
                        </div>
                        `

                        container.append(codigo)
                    } catch (error) {
                        return Swal.fire({
                            title: error,
                            icon: 'error',
                            confirmButtonText: 'Ok',
                        })
                        console.log(error)
                    }
                }
            }
        })
    }

    const codeRemove = (code) => {
        const obj = codesInsert.find((x) => x.code === code)

        //pega o indice
        let index = codes.indexOf(obj)

        //Remove o objeto
        codes.splice(index, 1)
    }

    const codeDestroy = (button) => {
        button.addEventListener('click', async (e) => {
            try {
                if (button.classList.contains('raiz')) {
                    const id = button.dataset.id
                    const code = await request({
                        url: `/api/code/${id}`,
                        method: `DELETE`,
                    })

                    button.closest('.col-12.mb-3').remove()

                    console.log(codes)
                } else {
                    const cod = button.dataset.code

                    const obj = codesInsert.find((x) => x.code === cod)

                    //pega o indice
                    let index = codes.indexOf(obj)

                    //Remove o objeto
                    codes.splice(index, 1)

                    button.closest('.col-12.mb-3').remove()

                    console.log(codes)
                }
            } catch (error) {}
        })
    }

    const putcodes = (list, name, output) => {
        list.map((code) => {
            const cod = document.createElement('div')

            cod.classList.add('col-12', 'mb-3')

            cod.innerHTML = `
            <div class="card">
                <div class="card-header">
                    ${name}
                    <button type="button" class="float-right btn btn-danger btn-sm" data-code="${code.text}"><i class="fas fa-trash-alt"></i></button>
                </div>
                <div class="card-body">
                    ${code.text}
                </div>
            </div>
            `

            codeDestroy(cod.querySelector('button'))
            codes.push({ name, code: code.text })

            output.append(cod)
        })
    }

    const fileChange = (input) => {
        const form = input.closest('form')
        input.addEventListener('change', async (e) => {
            const file = input.files[0]

            e.preventDefault()

            if (form.querySelector('.productItemName').value) {
                try {
                    if (file.type != `text/plain`)
                        return Swal.fire({
                            title: `Tipo inválido`,
                            icon: 'error',
                            confirmButtonText: 'Ok',
                        })

                    const check = await readFile(file)

                    putcodes(
                        check,
                        form.querySelector('.productItemName').value,
                        document.querySelector('.listItensProduct')
                    )
                } catch (error) {
                    console.log(error)
                }
            } else {
                input.value = ``
                return Swal.fire({
                    title: `Informe um nome para os itens`,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                })
            }
        })
    }

    const request = (object) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token

            const { url, method, body, headers } = object

            const options = {
                method: method || `GET`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }

            if (headers) options.headers['content-type'] = headers['content-type']

            if (body) options.body = body

            fetch(url, options)
                .then((r) => r.json())
                .then((res) => {
                    if (res.error) return reject(res.error)

                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    const codescheck = (list) => {
        return new Promise(async (resolve, reject) => {
            const lista = [...list]

            if (!lista.length) {
                return reject('Nenhum item selecionado')
            } else {
                return resolve(list)
            }
        })
    }

    const update = (form) => {
        form.addEventListener('submit', async (e) => {
            // body
            e.preventDefault()
            if (form.checkValidity()) {
                try {
                    const product_id = form.dataset.id
                    const name = form.querySelector('.productName').value
                    const description = form.querySelector('.productDescription').value
                    const weight = form.querySelector('.productWeight').value
                    const lot = form.querySelector('.productLot').value
                    const type = form.querySelector('.productType').value
                    const availability = form.querySelector('.productAvailability').value
                    const brand = form.querySelector('.productBrand').value
                    const excerpt = form.querySelector('.productExcerpt').value
                    const category = document.querySelectorAll('.productCategory:checked')
                    const images = form.querySelector('.productImages')
                    const pdf = form.querySelector('.productPDF')

                    const listCodes = document.querySelectorAll('.listItensProduct > div')

                    const categories = [...category]

                    //Validar categorias
                    if (!categories.length)
                        return Swal.fire({
                            title: `Selecione uma categoria`,
                            icon: 'error',
                            confirmButtonText: 'Ok',
                        })

                    //Images product
                    if (images.value) {
                        const productImages = await Images(product_id, images)

                        const imagesContainer = document.querySelector('.imagesProductContainer')

                        if (productImages) {
                            productImages.map((image) => {
                                const img = document.createElement('div')

                                img.classList.add('mb-2', 'col-sm-3')

                                img.innerHTML = `
                                <button class="btn btn-danger btn-sm" data-id="${image.id}" data-product="${
                                    image.product_id
                                }">
                                    <i class="far fa-trash-alt"></i>
                                </button>
                                <img class="img-thumbnail ${image.default ? `active` : ``}" src="${
                                    image.url
                                }" data-index="0">
                                `

                                imgDestroy(img.querySelector('button'))

                                imagesContainer.append(img)
                            })
                        }
                    }

                    //Codes
                    const codesExist = await codescheck(listCodes)

                    if (pdf.value) {
                        const resPDF = await filePDF(pdf, 'update', product_id)
                        console.log(`new pdf: `, resPDF)
                    }

                    //Product Infos
                    const product = await request({
                        url: `/api/product/${product_id}`,
                        method: `PUT`,
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            name,
                            description,
                            weight,
                            lot,
                            type,
                            availability,
                            brand,
                            excerpt,
                            items: codes,
                            category: categories.map((input) => parseInt(input.value)),
                        }),
                    })

                    codesClear()

                    images.value = ``

                    pdf.value = ``

                    return Swal.fire({
                        title: `Produto atualizado com sucesso`,
                        text: `O produto ${product.name} foi atualizado com sucesso!`,
                        icon: 'success',
                        confirmButtonText: 'Ok',
                    })
                } catch (error) {
                    console.log(error)
                    return Swal.fire({
                        title: error,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                    })
                    console.log(error)
                }
            }
        })
    }

    //image
    const Images = (id, input) => {
        return new Promise(async (resolve, reject) => {
            if (input.value) {
                const images = [...input.files]

                const form = new FormData()

                images.map((image) => form.append('file', image))

                try {
                    const imagesProduct = await request({
                        url: `/api/image/product/${id}`,
                        method: `POST`,
                        body: form,
                    })

                    return resolve(imagesProduct)
                } catch (error) {
                    return reject(error)
                }
            } else {
                return reject('Nenhuma imagem selecionada')
            }
        })
    }

    const imgDestroy = (button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault()

            button.closest('div').style.display = `none`

            return imageDestroy(button)
                .then((res) => {
                    button.closest('.mb-2.col-sm-3').remove()
                })
                .catch((err) => {
                    button.closest('div').style.display = `none`
                    console.log(err)
                })
        })
    }

    const imageDestroy = (image) => {
        return new Promise(async (resolve, reject) => {
            const id = image.dataset.id

            if (id) {
                try {
                    const imagem = await request({
                        url: `/api/image/product/${id}`,
                        method: `DELETE`,
                    })

                    return resolve(imagem)
                } catch (error) {
                    return reject(error)
                }
            } else {
                return reject('Faltam parametros na imagem')
            }
        })
    }

    return {
        //public var/functions
        update,
        imgDestroy,
        fileChange,
        codesClear,
        codeDestroy,
        codeRemove,
        singleCode: insertSingleCode,
        filePDF,
    }
})()

const btnSingleCode = document.querySelector(
    '.editProductsCodes .form-edit-product-codes > button.btn.btn-primary.mb-2'
)

if (btnSingleCode) product.singleCode(btnSingleCode)

//get all codes
const listCodes = document.querySelectorAll('.listItensProduct > div button')

if (listCodes) {
    Array.from(listCodes).forEach((btn) => product.codeDestroy(btn))
}

//fileChange
const fileToRead = document.querySelector('.form-edit-product-codes .fileToRead')

if (fileToRead) product.fileChange(fileToRead)

//Edit product
const formEditProduct = document.querySelector('.editProduct')

//Remove images
const imagesProduct = document.querySelectorAll('.editProduct .imagesProductContainer > div button')

if (imagesProduct) {
    Array.from(imagesProduct).forEach((image) => product.imgDestroy(image))
}

if (formEditProduct) product.update(formEditProduct)

const clearListItems = () => {
    codesInsert = []
    product.codesClear()

    const Codes = document.querySelectorAll('.colapseCodes > div > .row > div')

    if (Codes) {
        Array.from(Codes).forEach((code) => {
            if (code) return code.remove()
        })

        return (document.querySelector('.headerListItem span.badge,badge-primary').innerHTML = codesInsert.length)
    }
}

const putSpinnet = (target, action) => {
    const spinner = document.createElement('div')

    spinner.classList.add('spinner-border', 'text-primary', 'float-right')

    spinner.setAttribute('role', 'status')

    spinner.innerHTML = `<span class="sr-only">Loading...</span>`
    if (action === `insert`) {
        return target.append(spinner)
    }

    if (action === `remove`) {
        if (target.querySelector('.spinner-border')) return target.querySelector('.spinner-border').remove()
    }
}

const changeBadgeForm = (num) => {
    //colapseCodes
    const colapseCodes = document.querySelector('.colapseCodes')

    const badge = colapseCodes.closest('.accordion').querySelector('.card-header .badge')

    //Alterar numero
    if (colapseCodes) return (badge.innerHTML = num)
}

const removeCodeForm = (btn) => {
    btn.addEventListener('click', (e) => {
        const code = btn.dataset.code

        //check if code exist
        const obj = codesInsert.find((x) => x.code === code)

        product.codeRemove(code)

        if (obj) {
            //pega o indice
            let index = codesInsert.indexOf(obj)

            //Remove o objeto
            codesInsert.splice(index, 1)

            btn.closest('.col-12').remove()

            //Alterar quantidade
            return changeBadgeForm(codesInsert.length)
        } else {
            console.log(`código não esta presente`)
        }
    })
}

const checkCodeInList = (code) => {
    if (codesInsert.find((x) => x.code === code)) return false

    return true
}

const createItem = (object) => {
    const { prefix, code } = object
    const div = document.createElement('div')

    div.classList.add('col-12', 'mb-3')

    div.innerHTML = `
    <div class="card">
        <div class="card-header">
            ${prefix}
            <button type="button" class="float-right btn btn-danger btn-sm" data-code="${code}"><i class="fas fa-trash-alt"></i></button>
        </div>
        <div class="card-body">
        ${code}
        </div>
    </div>
    `

    //removeCodeForm

    removeCodeForm(div.querySelector('button'))

    return div
}

const formValidate = (array) => {
    return new Promise((resolve, reject) => {
        if (typeof array != `object`) return reject(`O parametro deve ser um array`)

        const invalids = array.filter((item) => {
            if (!item.value) return item
        })

        const valids = array.filter((item) => {
            if (item.value) return item
        })

        return resolve({ valids, invalids })
    })
}

const insertSingleCode = (btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault()

        if (btn.disabled) return false

        const form = btn.closest('form')

        putSpinnet(form, `insert`)

        const inputPrefix = form.querySelector('.productItemName')
        const productCode = form.querySelector('.productCode')

        return formValidate([inputPrefix, productCode]).then((validates) => {
            const { valids, invalids } = validates

            //Caso não validado
            if (invalids.length) {
                return invalids.map((input) => {
                    input.classList.remove('is-valid')
                    input.classList.add('is-invalid')
                })
            }

            if (!checkCodeInList(productCode.value)) {
                putSpinnet(form, `remove`)
                return Swal.fire({
                    title: `O Código duplicado`,
                    text: `O Código ${productCode.value} já está cadastrado em um item`,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                })
            }

            codesInsert.push({ code: productCode.value, name: inputPrefix.value })

            //validados
            const item = createItem({ prefix: inputPrefix.value, code: productCode.value })

            const colapseCodes = document.querySelector('.colapseCodes')

            if (colapseCodes) {
                colapseCodes.querySelector('.card-body > .row').append(item)

                changeBadgeForm(codesInsert.length)

                putSpinnet(form, `remove`)

                return colapseCodes.classList.add('show')
            }
        })
    })
}

const changeFileProduct = (input) => {
    input.addEventListener('change', (e) => {
        const filename = input.value.split(/(\\|\/)/g).pop()

        input.closest('.custom-file').querySelector('label').innerHTML = filename

        const PrefixName = document.querySelector('.productItemName')

        putSpinnet(PrefixName.closest('form'), `insert`)

        return formValidate([PrefixName]).then((validate) => {
            const { invalids, valids } = validate

            //Caso validado
            if (!invalids.length) {
                return readFile(input.files[0])
                    .then((res) => {
                        //colapseCodes
                        const colapseCodes = document.querySelector('.colapseCodes')

                        //Mostrar container e contador
                        if (colapseCodes) colapseCodes.classList.add('show')

                        //validar prefixo
                        const { invalids, valids } = validate

                        valids.map((input) => {
                            input.classList.remove('is-invalid')
                            input.classList.add('is-valid')
                        })

                        //list codes
                        res.map((code) => {
                            const div = createItem({ prefix: PrefixName.value, code: code.text })

                            //check if code already exist in list
                            if (!checkCodeInList(code.text)) {
                                putSpinnet(PrefixName.closest('form'), `remove`)
                                return Swal.fire({
                                    title: `O Código duplicado`,
                                    text: `O Código ${code.text} já está cadastrado em um item`,
                                    icon: 'error',
                                    confirmButtonText: 'Ok',
                                })
                            }

                            codesInsert.push({ code: code.text, name: PrefixName.value })

                            changeBadgeForm(codesInsert.length)

                            colapseCodes.querySelector('.card-body > .row').append(div)
                        })

                        return putSpinnet(PrefixName.closest('form'), `remove`)
                    })
                    .catch((err) => {
                        putSpinnet(PrefixName.closest('form'), `remove`)
                        return Swal.fire({
                            title: err,
                            icon: 'error',
                            confirmButtonText: 'Ok',
                        })
                    })
            }

            putSpinnet(PrefixName.closest('form'), `remove`)

            //Caso tenha erros
            input.value = ``
            return invalids.map((input) => {
                input.classList.remove('is-valid')
                input.classList.add('is-invalid')
            })
        })
    })
}

const readFile = (file) => {
    return new Promise((resolve, reject) => {
        const token = document.body.dataset.token

        const form = new FormData()
        form.append('file', file)

        const { type } = file

        if (type != `text/plain`) {
            reject('O tipo de arquivo deve ser .txt')
            return Swal.fire({
                title: 'O tipo de arquivo deve ser .txt',
                text: 'Selecione um arquivo com extensão txt',
                icon: 'error',
                confirmButtonText: 'Ok',
            })
        }

        const reqUrl = `/api/file`
        fetch(reqUrl, {
            method: `POST`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            body: form,
        })
            .then((res) => res.json())
            .then((response) => {
                if (response.error) return reject(response.error)
                return resolve(response)
            })
            .catch((error) => {
                return reject(error)
            })
    })
}

const requestInsertProduct = (object) => {
    return new Promise((resolve, reject) => {
        const {
            name,
            description,
            weight,
            brand,
            lot,
            type,
            excerpt,
            availability,
            items,
            image_id,
            categories,
            pdf,
        } = object

        const token = document.body.dataset.token

        if (!categories.length) return reject(`Selecione ao menos 1 categoria`)

        const reqUrl = `/api/product`
        fetch(reqUrl, {
            method: `POST`,
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
                description,
                weight,
                brand,
                lot,
                type,
                categories,
                availability,
                items,
                image_id,
                excerpt,
                pdf,
            }),
        })
            .then((res) => res.json())
            .then((response) => {
                if (response.error) {
                    return reject(response.error.replace(/(\r\n|\n|\r)/gm, '<br>'))
                }

                resolve(response)
                return console.log(response)
            })
            .catch((error) => reject(error))
    })
}

const productCreate = (form) => {
    const inputName = form.querySelector('.productName')
    const inputDescription = form.querySelector('.productDescription')
    const inputExcerpt = form.querySelector('.productExcerpt')
    const inputWeight = form.querySelector('.productWeigth')
    const inputBrand = form.querySelector('.productBrand')
    const inputLot = form.querySelector('.productLot')
    const inputType = form.querySelector('.productType')
    const inputAvailability = form.querySelector('.productAvailability')
    const inputPrefix = document.querySelector('.productItemName')
    const Checkswitch = document.querySelector('.multCodes')
    const productCode = document.querySelector('.productCode')
    const fileToRead = document.querySelector('.fileToRead')
    const imageId = imgProduct.images
    const productCategory = document.querySelectorAll('.productCategory')
    const inputPDF = document.querySelector('.productBull')
    const codePDF = document.querySelector('.idBullProduct')
    let categories = []

    //validate categories
    if (productCategory) {
        Array.from(productCategory).forEach((checkbox) => {
            if (checkbox.checked) categories.push(parseInt(checkbox.value))
        })
    }

    if (!categories.length)
        return Swal.fire({
            title: `Selecione a categoria`,
            text: `Por favor selecione ao menos 1 categoria`,
            icon: 'error',
            confirmButtonText: 'Ok',
        })

    console.log(`Categorias`, categories)

    form.classList.add('was-validated')

    putSpinnet(form.closest('form'), `insert`)

    const itensValidate = [inputName, inputWeight, inputBrand, inputLot, inputType, inputAvailability, inputPrefix]

    if (!Checkswitch.checked) {
        itensValidate.push(productCode)
    } else {
        itensValidate.push(fileToRead)
    }
    //Validação do formulário de produto

    return formValidate(itensValidate)
        .then((inputs) => {
            const { valids, invalids } = inputs

            if (invalids.length) {
                putSpinnet(form.closest('form'), `remove`)
                //itens invalidos
                invalids.forEach((input) => {
                    input.classList.remove('is-valid')
                    input.classList.add('is-invalid')
                })
            }

            //check if exist itens
            if (!codesInsert.length) {
                putSpinnet(form.closest('form'), `remove`)
                return Swal.fire({
                    title: `Nenhum item cadastrado`,
                    text: `Por favor ensira ao menos 1 item no produto`,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                })
            }

            //itens validos
            valids.forEach((input) => {
                input.classList.remove('is-invalid')
                input.classList.add('is-valid')
            })

            //Criar bula
            return product
                .filePDF(inputPDF)
                .then(imgProduct.create)
                .then((res) => {
                    return requestInsertProduct({
                        name: inputName.value,
                        description: inputDescription.value,
                        excerpt: inputExcerpt.value,
                        weight: inputWeight.value,
                        brand: inputBrand.value,
                        lot: inputLot.value,
                        type: inputType.value,
                        availability: inputAvailability.value,
                        items: codesInsert,
                        categories,
                        image_id: res,
                        pdf: codePDF.value,
                    })
                        .then((res) => {
                            //erro
                            if (res.error) {
                                const divAlert = document.createElement('div')
                                divAlert.classList.add('alert', 'alert-danger')
                                divAlert.setAttribute('role', 'alert')
                                divAlert.innerHTML = res.error

                                form.prepend(divAlert)

                                setTimeout(() => {
                                    divAlert.remove()
                                }, 4000)
                            }
                            ///dashboard
                            //limpar formulário
                            const allInputs = form.querySelectorAll('input, textarea, .is-valid')

                            //limpar imagens
                            document.querySelector('.imagesProductContainer').innerHTML = ``

                            form.classList.remove('was-validated')

                            Array.from(allInputs).forEach((input) => {
                                input.value = ``
                                return input.classList.remove('is-valid')
                            })

                            clearListItems()

                            putSpinnet(form.closest('form'), `remove`)
                            return Swal.fire({
                                title: `Produto cadastrado`,
                                text: `O produto ${res.name} foi cadastrado com sucesso`,
                                icon: 'success',
                                confirmButtonText: 'Ok',
                            })
                        })
                        .catch((error) => {
                            const divAlert = document.createElement('div')
                            divAlert.classList.add('alert', 'alert-danger')
                            divAlert.setAttribute('role', 'alert')
                            divAlert.innerHTML = error

                            form.prepend(divAlert)

                            putSpinnet(form.closest('form'), `remove`)

                            setTimeout(() => {
                                divAlert.remove()
                            }, 4000)
                        })
                })
                .catch((error) => {
                    return Swal.fire({
                        title: `Erro ao criar bula`,
                        text: error,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                    })
                })

            return imgProduct.create().then((res) => {})
        })
        .catch((err) => {
            putSpinnet(form.closest('form'), `remove`)
            console.log(err)
        })
}

const btnInsertProduct = document.querySelector('.btnInsertProduct')

if (btnInsertProduct) {
    btnInsertProduct.addEventListener('click', (e) => {
        e.preventDefault()
        productCreate(btnInsertProduct.closest('form'))
    })
}

//Show file from codes
const switchMultCodes = document.querySelector('.multCodes')

if (switchMultCodes) {
    switchMultCodes.addEventListener('change', function (e) {
        if (switchMultCodes.checked === true) {
            document.querySelector('.form-items-codes .custom-file-wrapper').classList.add('show')

            document.querySelector('.form-items-codes .singleCode').classList.add('hide')

            document.querySelector('.btnInsertItemProduct').disabled = true
        } else {
            document.querySelector('.form-items-codes .custom-file-wrapper').classList.remove('show')
            document.querySelector('.form-items-codes .singleCode').classList.remove('hide')
            document.querySelector('.btnInsertItemProduct').disabled = false
        }
    })
}

//clear items
btnClearCodes = document.querySelector('.btnCleamListProduct')
if (btnClearCodes) {
    btnClearCodes.addEventListener('click', (e) => {
        e.preventDefault()
        return clearListItems()
    })
}

//change inpiut file
const inputFileProduct = document.querySelector('form:not(.form-edit-product-codes) .fileToRead')

if (inputFileProduct) changeFileProduct(inputFileProduct)

//insert single code insertSingleCode
const btnInsertItemProduct = document.querySelector('.btnInsertItemProduct')

if (btnInsertItemProduct) insertSingleCode(btnInsertItemProduct)

//image products
const ImageProduct = document.querySelector('.productImage')

if (ImageProduct) imgProduct.change(ImageProduct)

const profile = (() => {
    //private functions/var
    const request = (file) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token

            const reqUrl = `/api/user/image`

            const form = new FormData()
            form.append('file', file)

            fetch(reqUrl, {
                method: 'PUT',
                headers: {
                    authorization: `Bearer ${token}`,
                },
                body: form,
            })
                .then((res) => res.json())
                .then((res) => resolve(res))
                .catch((error) => reject(error))
        })
    }

    const requestProfile = (object) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token

            const { name, email, phone, cell, currentPassword, newPassword, address, about, city } = object

            const reqUrl = `/api/user`

            fetch(reqUrl, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, email, phone, cell, currentPassword, newPassword, address, about, city }),
            })
                .then((res) => res.json())
                .then((res) => resolve(res))
                .catch((error) => reject(error))
        })
    }

    const changeState = (input) => {
        input.addEventListener('change', function (e) {
            editAvatar(input)
        })
    }

    const editAvatar = (input) => {
        console.log(input.files)
        return request(input.files[0])
            .then((res) => {
                if (res.error) return console.log(res.error)

                document.querySelector('.img-profile').src = res.url

                return (document.querySelector('.profile-avatar').src = res.url)
            })
            .catch((err) => console.log(err))
    }

    const enableForm = (button) => {
        if (!button) console.log(`Botão não existe`)
        button.addEventListener('click', (e) => {
            e.preventDefault()

            const form = document.querySelectorAll('.formEditUser input, .formEditUser textarea')

            const formulario = document.querySelector('.formEditUser')

            if (button.classList.contains('save')) {
                Array.from(form).forEach((input) => {
                    input.disabled = true
                })

                button.innerHTML = `Edit profile`

                if (formulario) getFields(formulario)

                return button.classList.remove('save')
            } else {
                Array.from(form).forEach((input) => {
                    input.disabled = false
                })

                button.innerHTML = `Salvar alterações`

                return button.classList.add('save')
            }
        })
    }

    //get all fields
    const validate = (list) => {
        return new Promise((resolve, reject) => {
            list.map((item) => {
                const { input, msg } = item

                console.log()

                if (!input.value || input.value == `Selecione...`) {
                    input.setCustomValidity(msg)

                    input.reportValidity()

                    return reject(msg)
                }

                return resolve()
            })
        })
    }

    const getFields = (form) => {
        if (!form) return console.log(`Formulário não existe`)

        const listElements = Array.from(form.elements)

        const object = {
            name: form.querySelector('#input-username').value,
            email: form.querySelector('#input-email').value,
            currentPassword: form.querySelector('#input-current-password').value,
            newPassword: form.querySelector('#input-new-password').value,
            address: form.querySelector('#input-address').value,
            city: form.querySelector('#input-city').value,
            phone: form.querySelector('#input-phone').value,
            cell: form.querySelector('#input-cell').value,
            about: form.querySelector('#textarea-about').value,
        }

        return requestProfile(object)
            .then((res) => {
                if (res.error)
                    return Swal.fire({
                        title: `Erro ao atualizar usuário`,
                        text: res.error,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                    })

                return Swal.fire({
                    title: `Perfil atualizado`,
                    text: `O Usuário ${res.name} foi atualizado com sucesso!`,
                    icon: 'success',
                    confirmButtonText: 'Ok',
                })
            })
            .catch((err) =>
                Swal.fire({
                    title: `Erro ao atualizar usuário`,
                    text: err,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                })
            )

        console.log(object)
    }

    //requestSaveProfile

    return {
        //public var/functions
        edit: changeState,
        enableEdit: enableForm,
        save: getFields,
    }
})()

const inputEditAvatar = document.querySelector('.inputProfileAvatar')

if (inputEditAvatar) profile.edit(inputEditAvatar)

//btnEditUser
const btnEditUser = document.querySelector('.btnEditUser')

if (btnEditUser) profile.enableEdit(btnEditUser)

const search = (() => {
    //validate form
    const validate = (list) => {
        return new Promise((resolve, reject) => {
            list.map((item) => {
                const { input, msg } = item

                if (!input.value) {
                    input.setCustomValidity(msg)

                    input.reportValidity()

                    return reject(msg)
                }

                return resolve()
            })
        })
    }

    //private vars/functions
    const search = (btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault()

            console.log()

            const inputCode = document.querySelector('input.Code')

            const inputName = document.querySelector('input.name')
            const inputSurname = document.querySelector('input.surname')
            const inputMail = document.querySelector('input.mail')

            if (inputName && inputSurname && inputMail) {
                const objectValidate = [
                    { input: inputName, msg: `Informe seu nome` },
                    { input: inputSurname, msg: `Informe seu sobrenome` },
                    { input: inputMail, msg: `Informe seu e-mail` },
                ]

                return validate(objectValidate)
                    .then((res) => {
                        return request({
                            code: inputCode.value,
                            name: inputName.value,
                            surname: inputSurname.value,
                            email: inputMail.value,
                        })
                            .then((res) => {
                                const { device, code, ip, city, address } = res
                                const clientInfo = document.querySelector('.clientInfo')

                                return (clientInfo.innerHTML = `
                            <p>
                                <strong>Código: </strong> ${code.code}
                            </p>
                            <p>
                                <strong>Produto: </strong> ${code.product.name}
                            </p>
                            <p>
                                <strong>Item: </strong> ${code.item.name}
                            </p>
                            <p>
                                <strong>Device: </strong> ${device}
                            </p>
                            <p>
                                <strong>Cidade: </strong> ${city}
                            </p>
                            <p>
                                <strong>Estado: </strong> ${address}
                            </p>
                            <p>
                                <strong>Endereço IP: </strong> ${ip}
                            </p>
                        `)
                            })
                            .catch((err) => {
                                return Swal.fire({
                                    title: err,
                                    icon: 'error',
                                    confirmButtonText: 'Ok',
                                })
                            })
                    })
                    .catch((err) => console.log(err))
            }
        })
    }

    const request = (object) => {
        return new Promise((resolve, reject) => {
            const { name, surname, email, code } = object

            fetch(`/api/search`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ name, surname, email, code, ip, city, region }),
            })
                .then((res) => res.json())
                .then((res) => {
                    console.log(res)
                    if (res.error) return reject(res.error)
                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    const requestShow = (id) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token

            fetch(`/api/search/${id}`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.error) return reject(res.error)
                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    const show = (searche) => {
        //modalShowConsult
        searche.addEventListener('click', (e) => {
            e.preventDefault()

            const id = searche.dataset.id

            return requestShow(id).then((res) => {
                const date = new Intl.DateTimeFormat('pt-BR').format(new Date(res.createdAt))
                document.querySelector('.consultId').innerHTML = res.id
                document.querySelector('.consultName').innerHTML = res.name
                document.querySelector('.consultSurname').innerHTML = res.surname
                document.querySelector('.consultMail').innerHTML = res.email
                document.querySelector('.consultCity').innerHTML = res.city
                document.querySelector('.consultAddress').innerHTML = res.address
                document.querySelector('.consultCode').innerHTML = res.code.code
                document.querySelector('.consultIp').innerHTML = res.ip
                document.querySelector('.constData').innerHTML = date
                $('#modalShowConsult').modal('show')
            })
        })
    }
    return {
        //piblic vars/function
        search,
        show,
    }
})()

const consults = document.querySelectorAll('.listConsults > tr')

if (consults) {
    Array.from(consults).forEach((consult) => {
        search.show(consult)
    })
}

$('.page-adm-consults #dataTable').on('draw.dt', function () {
    const elementsConsults = document.querySelectorAll('.listConsults > tr')

    if (elementsConsults) {
        Array.from(elementsConsults).forEach((consult) => {
            search.show(consult)
        })
    }
})

const btnSearchCode = document.querySelector('.submitSearch')

if (btnSearchCode) search.search(btnSearchCode)

const userResource = `user`

const user = (() => {
    //private vars/functions

    const requestForgot = (email) => {
        return new Promise((resolve, reject) => {
            const reqUrl = `/api/forgot`

            fetch(reqUrl, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })
                .then((res) => res.json())
                .then((res) => resolve(res))
                .catch((error) => reject(error))
        })
    }

    const forgot = (button) => {
        button.addEventListener('click', function (e) {
            e.preventDefault()

            const email = document.querySelector('#input-forgot-email')

            if (email) {
                requestForgot(email.value)
                    .then((res) => {
                        if (res.erro) return alert(res.erro)
                        return (window.location.href = `/login`)
                    })
                    .catch((err) => console.log(err))
            }
        })
    }

    return {
        //public vars/functions
        forgot,
    }
})()

const btnForgot = document.querySelector('.btnForgot')

if (btnForgot) user.forgot(btnForgot)

const requestInsertAvatar = (file) => {
    return new Promise((resolve, reject) => {
        const token = document.body.dataset.token

        const form = new FormData()
        form.append('file', file)

        const reqUrl = `/api/user/image`
        fetch(reqUrl, {
            method: `POST`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            body: form,
        })
            .then((res) => res.json())
            .then((response) => {
                console.log(response)
                return resolve(response)
            })
    })
}

const requestInsertUser = (object) => {
    return new Promise((resolve, reject) => {
        const { name, email, password, phone, cell, type, image_id } = object

        const token = document.body.dataset.token

        const reqUrl = `/api/${userResource}`
        fetch(reqUrl, {
            method: `POST`,
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name, email, password, phone, cell, type, image_id }),
        })
            .then((res) => res.json())
            .then((response) => {
                if (response.error) {
                    return reject(response.error)
                }

                resolve(response)
                return console.log(response)
            })
            .catch((error) => reject(error))
    })
}

const userCreate = (form) => {
    const inputName = form.querySelector('input.userName')
    const inputMail = form.querySelector('.userMail')
    const inputPhone = form.querySelector('.userPhone')
    const inputCell = form.querySelector('.userCell')
    const inputType = form.querySelector('.userType')
    const inputPassword = form.querySelector('.userPassword')
    const inputImage = form.querySelector('.inputUserImage')

    form.classList.add('was-validated')

    //Validação do formulário de produto

    //Nome do usuário
    if (!inputName.value) {
        return inputName.classList.add('is-invalid')
    } else {
        inputName.classList.remove('is-invalid')
        inputName.classList.add('is-valid')
        //
    }

    //Email do usuário
    if (!inputMail.value) {
        return inputMail.classList.add('is-invalid')
    } else {
        inputMail.classList.remove('is-invalid')
        inputMail.classList.add('is-valid')
        //
    }

    //Phone do usuário
    if (!inputPhone.value) {
        return inputPhone.classList.add('is-invalid')
    } else {
        inputPhone.classList.remove('is-invalid')
        inputPhone.classList.add('is-valid')
        //
    }

    //Cell do usuário
    if (!inputCell.value) {
        return inputCell.classList.add('is-invalid')
    } else {
        inputCell.classList.remove('is-invalid')
        inputCell.classList.add('is-valid')
        //
    }

    //Senha do usuário
    if (!inputPassword.value) {
        return inputPassword.classList.add('is-invalid')
    } else {
        inputPassword.classList.remove('is-invalid')
        inputPassword.classList.add('is-valid')
        //
    }
    //Tipo do usuário
    if (!inputType.value) {
        return inputType.classList.add('is-invalid')
    } else {
        inputType.classList.remove('is-invalid')
        inputType.classList.add('is-valid')
        //
    }

    return requestInsertUser({
        name: inputName.value,
        email: inputMail.value,
        phone: inputPhone.value,
        cell: inputCell.value,
        type: inputType.value,
        password: inputPassword.value,
        image_id: inputImage.value,
    })
        .then((res) => {
            //erro
            if (res.error) {
                const divAlert = document.createElement('div')
                divAlert.classList.add('alert', 'alert-danger')
                divAlert.setAttribute('role', 'alert')
                divAlert.innerHTML = res.error

                form.prepend(divAlert)

                setTimeout(() => {
                    divAlert.remove()
                }, 4000)
            }
            ///dashboard
            //limpar formulário
            const allInputs = form.querySelectorAll('input, textarea, .is-valid')

            form.classList.remove('was-validated')

            Array.from(allInputs).forEach((input) => {
                input.value = ``
                return input.classList.remove('is-valid')
            })
            return alert(`Usuário ${res.name} cadastrado!`)
        })
        .catch((error) => {
            const divAlert = document.createElement('div')
            divAlert.classList.add('alert', 'alert-danger')
            divAlert.setAttribute('role', 'alert')
            divAlert.innerHTML = error

            form.prepend(divAlert)

            setTimeout(() => {
                divAlert.remove()
            }, 4000)
        })
}

//User image
const inputImageUser = document.querySelector('.userFile')

if (inputImageUser) {
    inputImageUser.addEventListener('change', (e) => {
        console.log(inputImageUser.files[0])
        return requestInsertAvatar(inputImageUser.files[0]).then((res) => {
            document.querySelector('.insertUserAvatar').setAttribute('src', res.url)
            document.querySelector('.inputUserImage').value = res.id
        })
    })
}

const btnInsertUser = document.querySelector('.btnCreateUser')

if (btnInsertUser) {
    btnInsertUser.addEventListener('click', (e) => {
        e.preventDefault()
        userCreate(btnInsertUser.closest('form'))
    })
}

const contact = (() => {
    //private var/functions
    const request = (object) => {
        return new Promise((resolve, reject) => {
            const { url, method, body, headers } = object

            const options = {
                method: method || `GET`,
                headers: {
                    'content-type': headers['content-type'] || null,
                },
            }

            if (body) options.body = JSON.stringify(body)

            console.log(`Options request: `, options)

            fetch(url, options)
                .then((r) => r.json())
                .then((res) => {
                    if (res.error) return reject(res.error)

                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    const create = (form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault()

            if (form.checkValidity()) {
                const fullname = form.querySelector('.contactFullName').value
                const email = form.querySelector('.contactMail').value
                const subject = form.querySelector('.contactSubject').value
                const message = form.querySelector('.contactMessage').value

                const options = {
                    url: `/api/contact`,
                    method: `POST`,
                    headers: {
                        'content-type': `application/json`,
                    },
                    body: { fullname, email, subject, message },
                }

                return request(options)
                    .then((res) => {
                        const elements = [...form.elements]

                        form.classList.remove('was-validated')

                        elements.map((element) => {
                            element.value = ``
                        })

                        return Swal.fire({
                            title: `Sucesso!`,
                            text: `Foi solicitado um contato para ${res.email}`,
                            icon: 'success',
                            confirmButtonText: 'Ok',
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                        return Swal.fire({
                            title: `Erro!`,
                            text: err,
                            icon: 'error',
                            confirmButtonText: 'Ok',
                        })
                    })
            }
        })
    }

    return {
        //public var/functions
        create,
    }
})()

const formContact = document.querySelector('.form-contact')

if (formContact) contact.create(formContact)

const consult = (() => {
    //private var/functions
    const consult = (form) => {
        form.addEventListener('submit', function (e) {
            e.preventDefault()

            const list = Array.from(form.elements).map((input) => {
                return { input, msg: `Por favor preencha este campo` }
            })

            const barcodeContainer = document.querySelector('.barCode')

            return validate(list)
                .then((res) => {
                    return requestIP()
                        .then((r) => {
                            const { ip, city, region } = r
                            return request({
                                code: res.code,
                                ip,
                                city,
                                region,
                                email: res.email,
                            })
                                .then((response) => {
                                    barcodeContainer.innerHTML = response.code.code
                                    $('#modalConsult').modal('show')

                                    return Array.from(form.elements).map((input) => {
                                        if (input.tagName != `BUTTON`) {
                                            input.value = ``
                                        }
                                    })
                                })
                                .catch((err) => {
                                    if (err.status) {
                                        //modalConsultError
                                        barcodeContainer.innerHTML = res.code
                                        return $('#modalConsultError').modal('show')
                                    }

                                    $('#modalErrValidation').modal('show')
                                })
                        })
                        .catch((erro) => {
                            return Swal.fire({
                                title: `Erro ao coletar informações se segurança`,
                                icon: 'error',
                                confirmButtonText: 'Ok',
                            })
                        })
                })
                .catch((err) => {
                    console.log(err)
                })
        })
    }

    const requestIP = () => {
        return new Promise((resolve, reject) => {
            fetch(`https://ipapi.co/json/`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                },
            })
                .then((res) => {
                    if (!res.ok) return reject(`Erro ao pesquisar codigo`)
                    return res.json()
                })
                .then((res) => resolve(res))
                .catch((error) => reject(error))
        })
    }

    const request = (object) => {
        return new Promise((resolve, reject) => {
            const { email, code, ip, city, region } = object

            fetch(`/api/search`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ email, code, ip, city, region }),
            })
                .then((r) => {
                    if (r.status === 204) return reject({ error: `Não encontrado`, status: 204 })
                    return r.json()
                })
                .then((res) => {
                    if (res.error) return reject(res.error)
                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    const validate = (list) => {
        const object = {}
        return new Promise((resolve, reject) => {
            list.map((item) => {
                const { input, msg } = item

                if (input.tagName != `BUTTON`) {
                    if (!input.value || input.value == `Selecione...`) {
                        input.setCustomValidity(msg)

                        input.reportValidity()

                        return reject(msg)
                    }
                }

                if (input.classList.contains('consultMail')) object.email = input.value
                if (input.classList.contains('consultCode')) object.code = input.value
            })

            return resolve(object)
        })
    }

    return {
        //public var/functions
        consult,
    }
})()

const mobileMenu = (() => {
    //private var/functions
    const dropdown = (button) => {
        button.addEventListener('click', function (e) {
            e.preventDefault()
            console.log('cliquei')
            button.closest('li').querySelector('.dropdown-menu').classList.toggle('show')
        })
    }

    return {
        //public var/functions
        dropdown,
    }
})()

const mobilteToggle = document.querySelectorAll('li > a.dropdown-toggle')

Array.from(mobilteToggle).forEach((button) => {
    if (button) mobileMenu.dropdown(button)
})

const overlay = document.querySelector('.mobile-back')

if (overlay) {
    overlay.addEventListener('click', function (e) {
        const allShow = document.querySelectorAll('.show')
        Array.from(allShow).forEach((show) => {
            show.classList.remove('show')
        })
    })
}

const formConsultCode = document.querySelector('.formValidateCode')

if (formConsultCode) consult.consult(formConsultCode)
