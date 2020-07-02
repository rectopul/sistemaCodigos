const productResource = `product`

let codesInsert = [],
    productImages = []

const clearListItems = () => {
    codesInsert = []

    const Codes = document.querySelectorAll('.colapseCodes > div > .row > div')

    if (Codes) {
        Array.from(Codes).forEach((code) => {
            if (code) return code.remove()
        })

        return (document.querySelector('.headerListItem span.badge,badge-primary').innerHTML = codesInsert.length)
    }
}

const putSpinnet = (target, action) => {
    const spinner = document.createElement('div')

    spinner.classList.add('spinner-border', 'text-primary', 'float-right')

    spinner.setAttribute('role', 'status')

    spinner.innerHTML = `<span class="sr-only">Loading...</span>`
    if (action === `insert`) {
        return target.append(spinner)
    }

    if (action === `remove`) {
        if (target.querySelector('.spinner-border')) return target.querySelector('.spinner-border').remove()
    }
}

const changeBadgeForm = (num) => {
    //colapseCodes
    const colapseCodes = document.querySelector('.colapseCodes')

    const badge = colapseCodes.closest('.accordion').querySelector('.card-header .badge')

    //Alterar numero
    if (colapseCodes) return (badge.innerHTML = num)
}

const removeCodeForm = (btn) => {
    btn.addEventListener('click', (e) => {
        const code = btn.dataset.code

        //check if code exist
        const obj = codesInsert.find((x) => x.code === code)

        if (obj) {
            //pega o indice
            let index = codesInsert.indexOf(obj)

            //Remove o objeto
            codesInsert.splice(index, 1)

            btn.closest('.col-12').remove()

            //Alterar quantidade
            return changeBadgeForm(codesInsert.length)
        } else {
            console.log(`código não esta presente`)
        }
    })
}

const checkCodeInList = (code) => {
    if (codesInsert.find((x) => x.code === code)) return false

    return true
}

const createItem = (object) => {
    const { prefix, code } = object
    const div = document.createElement('div')

    div.classList.add('col-12', 'mb-3')

    div.innerHTML = `
    <div class="card">
        <div class="card-header">
            ${prefix}
            <button type="button" class="float-right btn btn-danger btn-sm" data-code="${code}"><i class="fas fa-trash-alt"></i></button>
        </div>
        <div class="card-body">
        ${code}
        </div>
    </div>
    `

    //removeCodeForm

    removeCodeForm(div.querySelector('button'))

    return div
}

const formValidate = (array) => {
    return new Promise((resolve, reject) => {
        if (typeof array != `object`) return reject(`O parametro deve ser um array`)

        const invalids = array.filter((item) => {
            if (!item.value) return item
        })

        const valids = array.filter((item) => {
            if (item.value) return item
        })

        return resolve({ valids, invalids })
    })
}

const insertSingleCode = (btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault()

        if (btn.disabled) return false

        const form = btn.closest('form')

        putSpinnet(form, `insert`)

        const inputPrefix = form.querySelector('.productItemName')
        const productCode = form.querySelector('.productCode')

        return formValidate([inputPrefix, productCode]).then((validates) => {
            const { valids, invalids } = validates

            //Caso não validado
            if (invalids.length) {
                return invalids.map((input) => {
                    input.classList.remove('is-valid')
                    input.classList.add('is-invalid')
                })
            }

            if (!checkCodeInList(productCode.value)) {
                putSpinnet(form, `remove`)
                return Swal.fire({
                    title: `O Código duplicado`,
                    text: `O Código ${productCode.value} já está cadastrado em um item`,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                })
            }

            codesInsert.push({ code: productCode.value, name: inputPrefix.value })

            //validados
            const item = createItem({ prefix: inputPrefix.value, code: productCode.value })

            const colapseCodes = document.querySelector('.colapseCodes')

            if (colapseCodes) {
                colapseCodes.querySelector('.card-body > .row').append(item)

                changeBadgeForm(codesInsert.length)

                putSpinnet(form, `remove`)

                return colapseCodes.classList.add('show')
            }
        })
    })
}

const changeFileProduct = (input) => {
    input.addEventListener('change', (e) => {
        const filename = input.value.split(/(\\|\/)/g).pop()

        input.closest('.custom-file').querySelector('label').innerHTML = filename

        const PrefixName = document.querySelector('.productItemName')

        putSpinnet(PrefixName.closest('form'), `insert`)

        return formValidate([PrefixName]).then((validate) => {
            const { invalids, valids } = validate

            //Caso validado
            if (!invalids.length) {
                return readFile(input.files[0])
                    .then((res) => {
                        //colapseCodes
                        const colapseCodes = document.querySelector('.colapseCodes')

                        //Mostrar container e contador
                        if (colapseCodes) colapseCodes.classList.add('show')

                        //validar prefixo
                        const { invalids, valids } = validate

                        valids.map((input) => {
                            input.classList.remove('is-invalid')
                            input.classList.add('is-valid')
                        })

                        //list codes
                        res.map((code) => {
                            const div = createItem({ prefix: PrefixName.value, code: code.text })

                            //check if code already exist in list
                            if (!checkCodeInList(code.text)) {
                                putSpinnet(PrefixName.closest('form'), `remove`)
                                return Swal.fire({
                                    title: `O Código duplicado`,
                                    text: `O Código ${code.text} já está cadastrado em um item`,
                                    icon: 'error',
                                    confirmButtonText: 'Ok',
                                })
                            }

                            codesInsert.push({ code: code.text, name: PrefixName.value })

                            changeBadgeForm(codesInsert.length)

                            colapseCodes.querySelector('.card-body > .row').append(div)
                        })

                        return putSpinnet(PrefixName.closest('form'), `remove`)
                    })
                    .catch((err) => {
                        putSpinnet(PrefixName.closest('form'), `remove`)
                        return Swal.fire({
                            title: err,
                            icon: 'error',
                            confirmButtonText: 'Ok',
                        })
                    })
            }

            putSpinnet(PrefixName.closest('form'), `remove`)

            //Caso tenha erros
            input.value = ``
            return invalids.map((input) => {
                input.classList.remove('is-valid')
                input.classList.add('is-invalid')
            })
        })
    })
}

const readFile = (file) => {
    return new Promise((resolve, reject) => {
        const token = document.body.dataset.token

        const form = new FormData()
        form.append('file', file)

        const { type } = file

        if (type != `text/plain`) {
            reject('O tipo de arquivo deve ser .txt')
            return Swal.fire({
                title: 'O tipo de arquivo deve ser .txt',
                text: 'Selecione um arquivo com extensão txt',
                icon: 'error',
                confirmButtonText: 'Ok',
            })
        }

        const reqUrl = `/api/file`
        fetch(reqUrl, {
            method: `POST`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            body: form,
        })
            .then((res) => res.json())
            .then((response) => {
                if (response.error) return reject(response.error)
                return resolve(response)
            })
            .catch((error) => {
                return reject(error)
            })
    })
}

const requestInsertProduct = (object) => {
    return new Promise((resolve, reject) => {
        const { name, description, weight, brand, lot, type, availability, items, image_id, category_id } = object

        const token = document.body.dataset.token

        const reqUrl = `/api/${productResource}`
        fetch(reqUrl, {
            method: `POST`,
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
                description,
                weight,
                brand,
                lot,
                type,
                category_id,
                availability,
                items,
                image_id,
            }),
        })
            .then((res) => res.json())
            .then((response) => {
                if (response.error) {
                    return reject(response.error.replace(/(\r\n|\n|\r)/gm, '<br>'))
                }

                resolve(response)
                return console.log(response)
            })
            .catch((error) => reject(error))
    })
}

const imageProductApi = (file) => {
    return new Promise((resolve, reject) => {
        const token = document.body.dataset.token

        const form = new FormData()
        form.append('file', file)

        const reqUrl = `/api/image/product`

        fetch(reqUrl, {
            method: `POST`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            body: form,
        })
            .then((res) => res.json())
            .then((response) => {
                if (response.error) return reject(response.error)

                return resolve(response)
            })
            .catch((error) => reject(error))
    })
}

const imageProductChange = (input) => {
    input.addEventListener('change', (e) => {
        e.preventDefault()

        putSpinnet(input.closest('form'), `insert`)

        const filename = input.value.split(/(\\|\/)/g).pop()
        const containerImages = document.querySelector('.imagesProductContainer')

        input.closest('.custom-file').querySelector('label').innerHTML = filename

        console.log(input.files[0])

        return imageProductApi(input.files[0])
            .then((res) => {
                const imageId = document.querySelector('.idProductImage')

                putSpinnet(input.closest('form'), `remove`)

                if (imageId) imageId.value = res.id

                const image = document.createElement('img')

                image.setAttribute('src', res.url)
                image.setAttribute('width', 150)

                image.classList.add('img-thumbnail', 'mx-2')

                containerImages.append(image)

                if (productImages.length === 0) return productImages.push({ id: res.id, default: true })

                return productImages.push({ id: res.id, default: false })
            })
            .catch((err) => {
                putSpinnet(input.closest('form'), `remove`)
                console.log(err)
            })
    })
}

const productCreate = (form) => {
    const inputName = form.querySelector('.productName')
    const inputDescription = form.querySelector('.productDescription')
    const inputWeight = form.querySelector('.productWeigth')
    const inputBrand = form.querySelector('.productBrand')
    const inputLot = form.querySelector('.productLot')
    const inputType = form.querySelector('.productType')
    const inputAvailability = form.querySelector('.productAvailability')
    const inputPrefix = document.querySelector('.productItemName')
    const Checkswitch = document.querySelector('.multCodes')
    const productCode = document.querySelector('.productCode')
    const fileToRead = document.querySelector('.fileToRead')
    const imageId = productImages
    const productCategory = form.querySelector('.productCategory')

    form.classList.add('was-validated')

    putSpinnet(form.closest('form'), `insert`)

    const itensValidate = [
        inputName,
        inputWeight,
        inputBrand,
        inputLot,
        inputType,
        inputAvailability,
        inputPrefix,
        productCategory,
    ]

    if (!Checkswitch.checked) {
        itensValidate.push(productCode)
    } else {
        itensValidate.push(fileToRead)
    }
    //Validação do formulário de produto

    return formValidate(itensValidate)
        .then((inputs) => {
            const { valids, invalids } = inputs

            if (invalids.length) {
                putSpinnet(form.closest('form'), `remove`)
                //itens invalidos
                invalids.forEach((input) => {
                    input.classList.remove('is-valid')
                    input.classList.add('is-invalid')
                })
            }

            //check if exist itens
            if (!codesInsert.length) {
                return Swal.fire({
                    title: `Nenhum item cadastrado`,
                    text: `Por favor ensira ao menos 1 item no produto`,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                })
            }

            //itens validos
            valids.forEach((input) => {
                input.classList.remove('is-invalid')
                input.classList.add('is-valid')
            })

            return requestInsertProduct({
                name: inputName.value,
                description: inputDescription.value,
                weight: inputWeight.value,
                brand: inputBrand.value,
                lot: inputLot.value,
                type: inputType.value,
                availability: inputAvailability.value,
                items: codesInsert,
                category_id: productCategory.value,
                image_id: imageId,
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

                    putSpinnet(form.closest('form'), `remove`)
                    return Swal.fire({
                        title: `Produto cadastrado`,
                        text: `O produto ${res.name} foi cadastrado com sucesso`,
                        icon: 'success',
                        confirmButtonText: 'Ok',
                    })
                })
                .catch((error) => {
                    const divAlert = document.createElement('div')
                    divAlert.classList.add('alert', 'alert-danger')
                    divAlert.setAttribute('role', 'alert')
                    divAlert.innerHTML = error

                    form.prepend(divAlert)

                    putSpinnet(form.closest('form'), `remove`)

                    setTimeout(() => {
                        divAlert.remove()
                    }, 4000)
                })
        })
        .catch((err) => {
            console.log(err)
        })
}

const btnInsertProduct = document.querySelector('.btnInsertProduct')

if (btnInsertProduct) {
    btnInsertProduct.addEventListener('click', (e) => {
        e.preventDefault()
        productCreate(btnInsertProduct.closest('form'))
    })
}

//Show file from codes
const switchMultCodes = document.querySelector('.multCodes')

if (switchMultCodes) {
    switchMultCodes.addEventListener('change', function (e) {
        if (switchMultCodes.checked === true) {
            document.querySelector('.form-items-codes .custom-file-wrapper').classList.add('show')

            document.querySelector('.form-items-codes .singleCode').classList.add('hide')

            document.querySelector('.btnInsertItemProduct').disabled = true
        } else {
            document.querySelector('.form-items-codes .custom-file-wrapper').classList.remove('show')
            document.querySelector('.form-items-codes .singleCode').classList.remove('hide')
            document.querySelector('.btnInsertItemProduct').disabled = false
        }
    })
}

//clear items
btnClearCodes = document.querySelector('.btnCleamListProduct')
if (btnClearCodes) {
    btnClearCodes.addEventListener('click', (e) => {
        e.preventDefault()
        return clearListItems()
    })
}

//change inpiut file
const inputFileProduct = document.querySelector('.fileToRead')

if (inputFileProduct) changeFileProduct(inputFileProduct)

//insert single code insertSingleCode
const btnInsertItemProduct = document.querySelector('.btnInsertItemProduct')

if (btnInsertItemProduct) insertSingleCode(btnInsertItemProduct)

//image products
const ImageProduct = document.querySelector('.productImage')

if (ImageProduct) imageProductChange(ImageProduct)
