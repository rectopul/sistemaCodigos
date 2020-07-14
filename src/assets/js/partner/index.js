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
                }

                const options = {
                    url: `/api/partner`,
                    method: `POST`,
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: {
                        title: object.title,
                        company: object.company,
                        content: object.content,
                    },
                }

                return request(options)
                    .then((response) => {
                        const { title, company, id, createdAt } = response

                        const elements = [...form.elements]

                        form.classList.remove('was-validated')

                        document.querySelector('.imagePartner').innerHTML = ``

                        elements.map((element) => {
                            element.value = ``
                        })

                        const data = new Intl.DateTimeFormat('pt-BR').format(new Date(createdAt))

                        const newRow = table.row
                            .add([
                                id,
                                title,
                                company,
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
                                </button>`,
                            ])
                            .draw()
                            .node()

                        const btnDestroy = newRow.querySelector('button')

                        destroy(btnDestroy)

                        console.log(`Criated Partner: `, newRow)

                        putSpinnet(form, `remove`)

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

    return {
        //public var/functions
        create,
        destroy,
    }
})()

const formPartner = document.querySelector('.partnerForm')

const partnerDestroy = document.querySelectorAll('.partnerDestroy')

if (formPartner) partner.create(formPartner)

if (partnerDestroy) {
    Array.from(partnerDestroy).forEach((button) => {
        partner.destroy(button)
    })
}
