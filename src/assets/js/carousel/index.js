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
                                url: form.elements['url'].value,
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

    const handleImageUpdate = (object) => {
        return new Promise((resolve, reject) => {
            const { id } = object.data

            const form = object.form

            const file = form.elements['file'].files[0]

            if (!file) return resolve(object.data)

            const formData = new FormData()

            formData.append('file', file)

            fetch(`/api/carousel_image/${id}`, {
                method: 'PUT',
                headers: {
                    authorization: `Bearer ${document.body.dataset.token}`,
                },
                body: formData,
            })
                .then((r) => r.json())
                .then((res) => resolve(res))
                .catch((error) => {
                    console.log(error)
                    reject(error)
                })
        })
    }

    const handleUpdate = (form) => {
        return new Promise((resolve, reject) => {
            const object = util.serialize(form)

            const id = form.dataset.id

            return util
                .newRequest({
                    url: `/api/carousel/${id}`,
                    method: `PUT`,
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(object),
                })
                .then((res) => resolve({ data: res, form: form }))
                .catch((err) => reject(err))
        })
    }

    const update = (form) => {
        form.addEventListener('submit', function (e) {
            e.preventDefault()

            const formId = form.dataset.id

            if (form.checkValidity()) {
                return handleUpdate(form)
                    .then(handleImageUpdate)
                    .then((res) => {
                        util.resetForm(form)

                        //update table

                        let temp = []

                        temp[0] = res.id
                        temp[1] = res.name
                        temp[2] = `<img src="${
                            res.image.url || `via.placeholder.com/200`
                        }" alt="..." class="img-thumbnail" style="max-width: 120px;">`

                        temp[3] = res.createdAt
                        temp[4] = `
                            <button type="button" class="btn btn-datatable btn-icon btn-transparent-dark carouselDestroy py-0" data-id="${res.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                    </path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                            </button>

                            <button type="button" class="btn btn-datatable btn-icon btn-transparent-dark carouselEdit py-0" data-id="${res.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                        `

                        const changed = table
                            .row($(`tr[data-carousel="${formId}"]`))
                            .data(temp)
                            .draw()
                            .node()

                        changed.dataset.carousel = res.id
                        console.log(changed)

                        const btnEdit = changed.querySelector('.carouselEdit')
                        const btnDelete = changed.querySelector('.carouselDestroy')

                        handleModalUpdate(btnEdit)
                        destroy(btnDelete)

                        return Swal.fire(`Sucesso!`, `Carrossel alterado com sucesso!`, 'success')
                    })
                    .catch((err) => {
                        console.log(err)
                        Swal.fire('Erro', err, 'warning')
                    })
            }
        })
    }

    const handleModalUpdate = (button) => {
        button.addEventListener('click', function (e) {
            e.preventDefault()

            const id = button.dataset.id

            const form = document.querySelector('.formEditCarousel')

            //console.log(form)

            form.dataset.id = id

            //get infos
            util.newRequest({
                url: `/api/carousel/${id}`,
                method: `GET`,
                headers: {
                    'content-type': 'application/json',
                },
            }).then((res) => {
                const { name, url } = res

                form.elements['name'].value = name
                form.elements['url'].value = url

                const modal = document.querySelector('#carouselEditModal')

                $(modal).modal('show')
            })
        })
    }

    return {
        //public var/functions
        change,
        create,
        destroy,
        update,
        handleModalUpdate,
    }
})()

//Edit carrousel
const btnEditCarousel = [...document.querySelectorAll('.carouselEdit')]

if (btnEditCarousel) btnEditCarousel.map((btn) => carousel.handleModalUpdate(btn))

//form = document.querySelector('.formEditCarousel')
const formEditCarousel = document.querySelector('.formEditCarousel')

if (formEditCarousel) carousel.update(formEditCarousel)

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

const translateCarousel = (() => {
    const theForm = document.querySelector('.formTranslateFile')
    //private var/functions
    function handleBtn(btn) {
        if (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault()

                const id = btn.dataset.id

                theForm.elements['carousel_id'].value = id
            })
        }
    }

    function image(element) {
        return new Promise((resolve, reject) => {
            const form = new FormData()

            const file = element.elements['file'].files[0]

            form.append('file', file)

            fetch(`/api/translate_carousel/image`, {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${document.body.dataset.token}`,
                },
                body: form,
            })
                .then((r) => r.json())
                .then((res) => resolve({ image: res, form: element }))
                .catch((err) => reject(err))
        })
    }

    function carousel(object) {
        return new Promise((resolve, reject) => {
            const language = object.form.elements['language'].value

            const image_id = object.image.id

            const carousel_id = object.form.elements['carousel_id'].value

            fetch(`/api/translate_carousel`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${document.body.dataset.token}`,
                },
                body: JSON.stringify({ language, image_id, carousel_id }),
            })
                .then((r) => r.json())
                .then(resolve)
                .catch((err) => reject(err))
        })
    }

    function store() {
        if (theForm) {
            theForm.addEventListener('submit', function (e) {
                e.preventDefault()

                return image(theForm)
                    .then(carousel)
                    .then((res) => {
                        //translateModal
                        $('#translateModal').modal('hide')
                        $('#translateModal').on('hidden.bs.modal', function (e) {
                            // do something...
                            $(this).off('hidden.bs.modal')
                            return Swal.fire({
                                title: `Banner traduzido con sucesso!`,
                                icon: 'success',
                                confirmButtonText: 'Ok',
                            })
                        })
                    })
            })
        }
    }

    return {
        //public var/functions
        store,
        handleBtn,
    }
})()

translateCarousel.store()

const btnTranslateCarousel = [...document.querySelectorAll('.editTranslateCarousel')]

if (btnTranslateCarousel) btnTranslateCarousel.map(translateCarousel.handleBtn)

$('#dataTable').on('draw.dt', function () {
    const btnTranslateCarousel = [...document.querySelectorAll('.editTranslateCarousel')]

    if (btnTranslateCarousel) btnTranslateCarousel.map(translateCarousel.handleBtn)
})
