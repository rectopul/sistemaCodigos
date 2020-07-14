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
