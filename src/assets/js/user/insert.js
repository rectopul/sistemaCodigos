const userResource = `user`

const user = (() => {
    //private vars/functions
    const img = document.querySelector('.insertUserAvatar')
    const table = $('#dataTable').DataTable()

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

    const handleImage = (input) => {
        input.addEventListener('change', function (e) {
            e.preventDefault()

            const file = input.files[0]

            const accept = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif']

            input.closest('div').querySelector('label').innerHTML = file.name

            if (accept.indexOf(file.type) === -1) {
                return Swal.fire({
                    title: `Selecione um arquivo de imagem`,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                })
            }

            // FileReader support
            if (FileReader && file) {
                //console.log(file)
                var fr = new FileReader()
                fr.onload = function () {
                    img.src = fr.result
                }
                fr.readAsDataURL(file)
            }
        })
    }

    const image = (object) => {
        return new Promise((resolve, reject) => {
            const input = document.querySelector('.userFile')

            if (!input) return reject(`Input not exist`)

            const file = input.files[0]

            if (file) {
                const form = new FormData()
                form.append('file', file)

                return util
                    .newRequest({
                        method: `POST`,
                        url: `/api/user/image/${object.id}`,
                        body: form,
                    })
                    .then((res) => resolve(res))
                    .catch((err) => reject(err))
            } else {
                return resolve({ user: object })
            }
        })
    }

    const create = (form) => {
        form.addEventListener('submit', function (e) {
            e.preventDefault()

            if (form.checkValidity()) {
                const name = form.querySelector('.userName').value
                const email = form.querySelector('.userMail').value
                const phone = form.querySelector('.userPhone').value
                const cell = form.querySelector('.userCell').value
                const password = form.querySelector('.userPassword').value

                return util
                    .newRequest({
                        method: `POST`,
                        url: `/api/user`,
                        headers: {
                            'content-type': `application/json`,
                        },
                        body: JSON.stringify({ name, email, phone, cell, password }),
                    })
                    .then(image)
                    .then((res) => {
                        const elements = [...form.elements]

                        elements.map((input) => (input.value = ``))

                        img.src = `https://via.placeholder.com/200`

                        const { id, name, email, type } = res.user

                        const newRow = table.row
                            .add([
                                name,
                                email,
                                type,
                                `<button type="button" class="btn btn-sm btn-danger excludeUser" data-id="${id}">excluir</button>`,
                            ])
                            .draw()
                            .node()

                        destroy(newRow.querySelector('button'))

                        return Swal.fire({
                            title: `${name} criado com sucesso!`,
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
            }
        })
    }

    const destroy = (button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault()

            const id = button.dataset.id

            util.newRequest({
                url: `/api/user/${id}`,
                method: `DELETE`,
            }).then((res) => {
                //Delete row

                table
                    .row($(button.closest('tr')))
                    .remove()
                    .draw()

                return Swal.fire({
                    title: `Usuário excluído!`,
                    icon: 'success',
                    confirmButtonText: 'Ok',
                })
            })
        })
    }

    return {
        //public vars/functions
        forgot,
        handleImage,
        create,
        destroy,
    }
})()

//Delete user
const btnDestroyUser = document.querySelectorAll('.excludeUser')

if (btnDestroyUser) Array.from(btnDestroyUser).forEach((btn) => user.destroy(btn))

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
    console.log(inputImageUser)
    user.handleImage(inputImageUser)
}

const formNewUser = document.querySelector('.formCreateUser')

if (formNewUser) user.create(formNewUser)
