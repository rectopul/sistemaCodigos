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
