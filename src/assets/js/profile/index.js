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
