const contact = (() => {
    //private var/functions
    const table = $('#dataTable').DataTable()

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

    const change = (button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault()

            const id = button.dataset.id

            util.newRequest({
                url: `/api/contact/${id}`,
                method: 'PUT',
            }).then((res) => {
                const { createdAt, fullname, email, subject, id, status } = res

                const data = new Intl.DateTimeFormat('pt-br').format(new Date(createdAt))

                table
                    .row($(button.closest('tr')))
                    .remove()
                    .draw()

                const newRow = table.row
                    .add([
                        id,
                        fullname,
                        email,
                        subject,
                        data,
                        status,
                        `<button type="button" class="btn btn-datatable btn-icon btn-transparent-dark contactChange py-0" data-id="${id}" disabled>
                        <i class="fas fa-check"></i>
                        </button>`,
                    ])
                    .draw()
                    .node()

                return Swal.fire({
                    title: `Solicitação atendida`,
                    icon: 'success',
                    confirmButtonText: 'Ok',
                })
            })
        })
    }

    return {
        //public var/functions
        create,
        change,
    }
})()

const btnContactChange = document.querySelectorAll('.contactChange')

if (btnContactChange) Array.from(btnContactChange).forEach((btn) => contact.change(btn))

const formContact = document.querySelector('.form-contact')

if (formContact) contact.create(formContact)
