const search = (() => {
    //validate form
    const validate = (list) => {
        return new Promise((resolve, reject) => {
            list.map((item) => {
                const { input, msg } = item

                if (!input.value) {
                    input.setCustomValidity(msg)

                    input.reportValidity()

                    return reject(msg)
                }

                return resolve()
            })
        })
    }

    //private vars/functions
    const search = (btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault()

            console.log()

            const inputCode = document.querySelector('input.Code')

            const inputName = document.querySelector('input.name')
            const inputSurname = document.querySelector('input.surname')
            const inputMail = document.querySelector('input.mail')

            if (inputName && inputSurname && inputMail) {
                const objectValidate = [
                    { input: inputName, msg: `Informe seu nome` },
                    { input: inputSurname, msg: `Informe seu sobrenome` },
                    { input: inputMail, msg: `Informe seu e-mail` },
                ]

                return validate(objectValidate)
                    .then((res) => {
                        return request({
                            code: inputCode.value,
                            name: inputName.value,
                            surname: inputSurname.value,
                            email: inputMail.value,
                        })
                            .then((res) => {
                                const { device, code, ip, city, address } = res
                                const clientInfo = document.querySelector('.clientInfo')

                                return (clientInfo.innerHTML = `
                            <p>
                                <strong>Código: </strong> ${code.code}
                            </p>
                            <p>
                                <strong>Produto: </strong> ${code.product.name}
                            </p>
                            <p>
                                <strong>Item: </strong> ${code.item.name}
                            </p>
                            <p>
                                <strong>Device: </strong> ${device}
                            </p>
                            <p>
                                <strong>Cidade: </strong> ${city}
                            </p>
                            <p>
                                <strong>Estado: </strong> ${address}
                            </p>
                            <p>
                                <strong>Endereço IP: </strong> ${ip}
                            </p>
                        `)
                            })
                            .catch((err) => {
                                return Swal.fire({
                                    title: err,
                                    icon: 'error',
                                    confirmButtonText: 'Ok',
                                })
                            })
                    })
                    .catch((err) => console.log(err))
            }
        })
    }

    const request = (object) => {
        return new Promise((resolve, reject) => {
            const { name, surname, email, code } = object

            fetch(`/api/search`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ name, surname, email, code, ip, city, region }),
            })
                .then((res) => res.json())
                .then((res) => {
                    console.log(res)
                    if (res.error) return reject(res.error)
                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    const requestShow = (id) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token

            fetch(`/api/search/${id}`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.error) return reject(res.error)
                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    const show = (searche) => {
        //modalShowConsult
        searche.addEventListener('click', (e) => {
            e.preventDefault()

            const id = searche.dataset.id

            return requestShow(id).then((res) => {
                console.log(res)
                document.querySelector('.consultId').innerHTML = res.id
                document.querySelector('.consultName').innerHTML = res.name
                document.querySelector('.consultSurname').innerHTML = res.surname
                document.querySelector('.consultMail').innerHTML = res.email
                document.querySelector('.consultCity').innerHTML = res.city
                document.querySelector('.consultAddress').innerHTML = res.address
                document.querySelector('.consultCode').innerHTML = res.code.code
                document.querySelector('.consultIp').innerHTML = res.ip
                $('#modalShowConsult').modal('show')
            })
        })
    }
    return {
        //piblic vars/function
        search,
        show,
    }
})()

const consults = document.querySelectorAll('.listConsults > tr')

if (consults) {
    Array.from(consults).forEach((consult) => {
        search.show(consult)
    })
}

$('.page-adm-consults #dataTable').on('draw.dt', function () {
    const elementsConsults = document.querySelectorAll('.listConsults > tr')

    if (elementsConsults) {
        Array.from(elementsConsults).forEach((consult) => {
            search.show(consult)
        })
    }
})

const btnSearchCode = document.querySelector('.submitSearch')

if (btnSearchCode) search.search(btnSearchCode)
