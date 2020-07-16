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
