const search = (() => {
    //private vars/functions
    const search = (btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault()

            console.log()

            const inputCode = btn.closest('form').querySelector('input.Code')

            return requestIP().then((res) => {
                const { ip, city, region } = res
                return request({ code: inputCode.value, ip, city, region })
                    .then((res) => {
                        const { device, code, ip, city, region, product, item } = res
                        const clientInfo = document.querySelector('.clientInfo')

                        console.log(res)

                        return (clientInfo.innerHTML = `
                        <p>
                            <strong>Código: </strong> ${code}
                        </p>
                        <p>
                            <strong>Produto: </strong> ${product.name}
                        </p>
                        <p>
                            <strong>Item: </strong> ${item.name}
                        </p>
                        <p>
                            <strong>Device: </strong> ${device}
                        </p>
                        <p>
                            <strong>Cidade: </strong> ${city}
                        </p>
                        <p>
                            <strong>Estado: </strong> ${region}
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
            const { code, ip, city, region } = object

            fetch(`/api/search`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ code, ip, city, region }),
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
    return {
        //piblic vars/function
        search,
    }
})()

const btnSearchCode = document.querySelector('.btnSearchCode')

if (btnSearchCode) search.search(btnSearchCode)