const loginResource = `login`

const requestLogin = (object) => {
    return new Promise((resolve, reject) => {
        const { email, password } = object

        const reqUrl = `${URL}/${loginResource}`
        fetch(reqUrl, {
            method: `POST`,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
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

    return requestLogin({ email: inputMail.value, password: inputPassword.value })
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
}

const btnLogin = document.querySelector('.btnLogin')

if (btnLogin) {
    btnLogin.addEventListener('click', (e) => {
        e.preventDefault()

        login(btnLogin.closest('form'))
    })
}
