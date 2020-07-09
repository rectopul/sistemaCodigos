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
                        return requestIP().then((res) => {
                            const { ip, city, region } = res
                            return request({
                                code: inputCode.value,
                                ip,
                                city,
                                region,
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
                    })
                    .catch((err) => console.log(err))
            }
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
            const { name, surname, email, code, ip, city, region } = object

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
                    console.log(res)
                    if (res.error) return reject(res.error)
                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    show = (searche) => {
        const id = searche.dataset.id

        return requestShow()
    }
    return {
        //piblic vars/function
        search,
    }
})()

const btnSearchCode = document.querySelector('.submitSearch')

if (btnSearchCode) search.search(btnSearchCode)
