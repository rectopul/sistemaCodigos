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
