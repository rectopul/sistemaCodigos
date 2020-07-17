const productResource = `product`

let codesInsert = [],
    productImages = []

const imgProduct = (() => {
    //private vars/functions
    const images = []
    const imagesId = []
    let imageDefault = 0
    //.imagesProductContainer
    const setImageDefault = (image) => {
        image.addEventListener('click', (e) => {
            const index = image.dataset.index

            allImages = image.closest('.imagesProductContainer').querySelectorAll('img')

            Array.from(allImages).forEach((img) => {
                img.classList.remove('active')
            })

            image.classList.add('active')

            imageDefault = parseInt(index)

            return console.log(imageDefault)
        })
    }

    const imageProductChange = (input) => {
        input.addEventListener('change', (e) => {
            e.preventDefault()

            //if (!input.closest('form').querySelector('.spinner-border')) putSpinnet(input.closest('form'), `insert`)

            const containerImages = document.querySelector('.imagesProductContainer')

            const inputFiles = [...input.files]

            input.closest('.custom-file').querySelector('label').innerHTML = inputFiles.length + ` imagens`

            console.log(`Lista de imagens`, inputFiles)

            inputFiles.map((file) => {
                const imageContainer = document.createElement('div')

                imageContainer.classList.add(`mb-2`, `col-sm-3`)

                imageContainer.innerHTML = `
                <img class="img-thumbnail" src="">
                `

                const image = imageContainer.querySelector('img')

                // FileReader support
                if (FileReader && file) {
                    var fr = new FileReader()
                    fr.onload = function () {
                        image.src = fr.result
                    }
                    fr.readAsDataURL(file)

                    images.push(file)

                    image.dataset.index = images.indexOf(file)

                    if (images.length === 1) image.classList.add('active')

                    setImageDefault(image)

                    return containerImages.append(imageContainer)
                }

                // Not supported
                else {
                    // fallback -- perhaps submit the input to an iframe and temporarily store
                    // them on the server until the user's session ends.
                }
            })
        })
    }

    //Send request to upload images
    const imageProductApi = () => {
        return new Promise(async (resolve, reject) => {
            const token = document.body.dataset.token

            const imagesUploaded = images.map(async (image) => {
                const form = new FormData()
                form.append('file', image)

                const reqUrl = `/api/image/product`

                image = await fetch(reqUrl, {
                    method: `POST`,
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                    body: form,
                })
                    .then((r) => r.json())
                    .then((res) => {
                        if (res.error) return reject(res.error)

                        imagesId.push(res.id)

                        return res
                    })
                    .catch((error) => reject(error))

                return await image[0]
            })

            const result = await Promise.all(imagesUploaded)

            /* console.log(`Resultado`, result)

            if (result) {
                result[imageDefault].default = true
            } */

            console.log(`Resultado retornado: `, result)

            return resolve(result)
        })
    }

    return {
        create: imageProductApi,
        change: imageProductChange,
        images: imagesId,
        default: setImageDefault,
    }
})()

const product = (() => {
    //private var/functions
    let codes = []

    const codesClear = () => {
        codes = []
    }

    const codeRemove = (code) => {
        const obj = codesInsert.find((x) => x.code === code)

        //pega o indice
        let index = codes.indexOf(obj)

        //Remove o objeto
        codes.splice(index, 1)
    }

    const codeDestroy = (button) => {
        button.addEventListener('click', async (e) => {
            try {
                if (button.classList.contains('raiz')) {
                    const id = button.dataset.id
                    const code = await request({
                        url: `/api/code/${id}`,
                        method: `DELETE`,
                    })

                    button.closest('.col-12.mb-3').remove()

                    console.log(codes)
                } else {
                    const cod = button.dataset.code

                    const obj = codesInsert.find((x) => x.code === cod)

                    //pega o indice
                    let index = codes.indexOf(obj)

                    //Remove o objeto
                    codes.splice(index, 1)

                    button.closest('.col-12.mb-3').remove()

                    console.log(codes)
                }
            } catch (error) {}
        })
    }

    const putcodes = (list, name, output) => {
        list.map((code) => {
            const cod = document.createElement('div')

            /* cod.classList.add('col-12', 'mb-3')

            cod.innerHTML = `
            <div class="card">
                <div class="card-header">
                    ${name}
                    <button type="button" class="float-right btn btn-danger btn-sm" data-code="${code.text}"><i class="fas fa-trash-alt"></i></button>
                </div>
                <div class="card-body">
                    ${code.text}
                </div>
            </div>
            `

            codeDestroy(cod.querySelector('button')) */
            codes.push({ name, code: code.text })

            //output.append(cod)
        })
    }

    const fileChange = (input) => {
        const form = input.closest('form')
        input.addEventListener('change', async (e) => {
            const file = input.files[0]

            e.preventDefault()

            console.log(file)

            if (form.querySelector('.productItemName').value) {
                try {
                    if (file.type != `text/plain`)
                        return Swal.fire({
                            title: `Tipo inválido`,
                            icon: 'error',
                            confirmButtonText: 'Ok',
                        })

                    const check = await readFile(file)

                    putcodes(
                        check,
                        form.querySelector('.productItemName').value,
                        document.querySelector('.listItensProduct')
                    )

                    console.log(codes)
                } catch (error) {
                    console.log(error)
                }
            } else {
                input.value = ``
                return Swal.fire({
                    title: `Informe um nome para os itens`,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                })
            }
        })
    }

    const request = (object) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token

            const { url, method, body, headers } = object

            const options = {
                method: method || `GET`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }

            if (headers) options.headers['content-type'] = headers['content-type']

            if (body) options.body = body

            fetch(url, options)
                .then((r) => r.json())
                .then((res) => {
                    if (res.error) return reject(res.error)

                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    const codescheck = (list) => {
        return new Promise(async (resolve, reject) => {
            const lista = [...list]

            if (!lista.length) {
                return reject('Nenhum item selecionado')
            } else {
                return resolve(list)
            }
        })
    }

    const update = (form) => {
        form.addEventListener('submit', async (e) => {
            // body
            e.preventDefault()
            if (form.checkValidity()) {
                try {
                    const product_id = form.dataset.id
                    const name = form.querySelector('.productName').value
                    const description = form.querySelector('.productDescription').value
                    const weight = form.querySelector('.productWeight').value
                    const lot = form.querySelector('.productLot').value
                    const type = form.querySelector('.productType').value
                    const availability = form.querySelector('.productAvailability').value
                    const brand = form.querySelector('.productBrand').value
                    const excerpt = form.querySelector('.productExcerpt').value
                    const category = document.querySelectorAll('.productCategory:checked')
                    const images = form.querySelector('.productImages')

                    const listCodes = document.querySelectorAll('.listItensProduct > div')

                    const categories = [...category]

                    //Validar categorias
                    if (!categories.length)
                        return Swal.fire({
                            title: `Selecione uma categoria`,
                            icon: 'error',
                            confirmButtonText: 'Ok',
                        })

                    //Images product
                    if (images.value) {
                        const productImages = await Images(product_id, images)

                        const imagesContainer = document.querySelector('.imagesProductContainer')

                        if (productImages) {
                            productImages.map((image) => {
                                const img = document.createElement('div')

                                img.classList.add('mb-2', 'col-sm-3')

                                img.innerHTML = `
                                <button class="btn btn-danger btn-sm" data-id="${image.id}" data-product="${
                                    image.product_id
                                }">
                                    <i class="far fa-trash-alt"></i>
                                </button>
                                <img class="img-thumbnail ${image.default ? `active` : ``}" src="${
                                    image.url
                                }" data-index="0">
                                `

                                imgDestroy(img.querySelector('button'))

                                imagesContainer.append(img)
                            })
                        }
                    }

                    //Codes
                    const codesExist = await codescheck(listCodes)

                    //Product Infos
                    const product = await request({
                        url: `/api/product/${product_id}`,
                        method: `PUT`,
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            name,
                            description,
                            weight,
                            lot,
                            type,
                            availability,
                            brand,
                            excerpt,
                            items: codes,
                            category: categories.map((input) => parseInt(input.value)),
                        }),
                    })

                    return Swal.fire({
                        title: `Produto atualizado com sucesso`,
                        text: `O produto ${product.name} foi atualizado com sucesso!`,
                        icon: 'success',
                        confirmButtonText: 'Ok',
                    })
                } catch (error) {
                    return Swal.fire({
                        title: error,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                    })
                    console.log(error)
                }
            }
        })
    }

    //image
    const Images = (id, input) => {
        return new Promise(async (resolve, reject) => {
            if (input.value) {
                const images = [...input.files]

                const form = new FormData()

                images.map((image) => form.append('file', image))

                try {
                    const imagesProduct = await request({
                        url: `/api/image/product/${id}`,
                        method: `POST`,
                        body: form,
                    })

                    return resolve(imagesProduct)
                } catch (error) {
                    return reject(error)
                }
            } else {
                return reject('Nenhuma imagem selecionada')
            }
        })
    }

    const imgDestroy = (button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault()

            button.closest('div').style.display = `none`

            return imageDestroy(button)
                .then((res) => {
                    button.closest('.mb-2.col-sm-3').remove()
                })
                .catch((err) => {
                    button.closest('div').style.display = `none`
                    console.log(err)
                })
        })
    }

    const imageDestroy = (image) => {
        return new Promise(async (resolve, reject) => {
            const id = image.dataset.id

            if (id) {
                try {
                    const imagem = await request({
                        url: `/api/image/product/${id}`,
                        method: `DELETE`,
                    })

                    return resolve(imagem)
                } catch (error) {
                    return reject(error)
                }
            } else {
                return reject('Faltam parametros na imagem')
            }
        })
    }

    return {
        //public var/functions
        update,
        imgDestroy,
        fileChange,
        codesClear,
        codeDestroy,
        codeRemove,
    }
})()

//get all codes
const listCodes = document.querySelectorAll('.listItensProduct > div button')

if (listCodes) {
    Array.from(listCodes).forEach((btn) => product.codeDestroy(btn))
}

//fileChange
const fileToRead = document.querySelector('.form-edit-product-codes .fileToRead')

if (fileToRead) product.fileChange(fileToRead)

//Edit product
const formEditProduct = document.querySelector('.editProduct')

//Remove images
const imagesProduct = document.querySelectorAll('.editProduct .imagesProductContainer > div button')

if (imagesProduct) {
    Array.from(imagesProduct).forEach((image) => product.imgDestroy(image))
}

if (formEditProduct) product.update(formEditProduct)

const clearListItems = () => {
    codesInsert = []
    product.codesClear()

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

        product.codeRemove(code)

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
        const {
            name,
            description,
            weight,
            brand,
            lot,
            type,
            excerpt,
            availability,
            items,
            image_id,
            categories,
        } = object

        const token = document.body.dataset.token

        if (!categories.length) return reject(`Selecione ao menos 1 categoria`)

        const reqUrl = `/api/product`
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
                categories,
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

const productCreate = (form) => {
    const inputName = form.querySelector('.productName')
    const inputDescription = form.querySelector('.productDescription')
    const inputExcerpt = form.querySelector('.productExcerpt')
    const inputWeight = form.querySelector('.productWeigth')
    const inputBrand = form.querySelector('.productBrand')
    const inputLot = form.querySelector('.productLot')
    const inputType = form.querySelector('.productType')
    const inputAvailability = form.querySelector('.productAvailability')
    const inputPrefix = document.querySelector('.productItemName')
    const Checkswitch = document.querySelector('.multCodes')
    const productCode = document.querySelector('.productCode')
    const fileToRead = document.querySelector('.fileToRead')
    const imageId = imgProduct.images
    const productCategory = document.querySelectorAll('.productCategory')
    let categories = []

    //validate categories
    if (productCategory) {
        Array.from(productCategory).forEach((checkbox) => {
            if (checkbox.checked) categories.push(parseInt(checkbox.value))
        })
    }

    if (!categories.length)
        return Swal.fire({
            title: `Selecione a categoria`,
            text: `Por favor selecione ao menos 1 categoria`,
            icon: 'error',
            confirmButtonText: 'Ok',
        })

    console.log(`Categorias`, categories)

    form.classList.add('was-validated')

    putSpinnet(form.closest('form'), `insert`)

    const itensValidate = [inputName, inputWeight, inputBrand, inputLot, inputType, inputAvailability, inputPrefix]

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
                putSpinnet(form.closest('form'), `remove`)
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

            return imgProduct.create().then((res) => {
                return requestInsertProduct({
                    name: inputName.value,
                    description: inputDescription.value,
                    excerpt: inputExcerpt.value,
                    weight: inputWeight.value,
                    brand: inputBrand.value,
                    lot: inputLot.value,
                    type: inputType.value,
                    availability: inputAvailability.value,
                    items: codesInsert,
                    categories,
                    image_id: res,
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

                        //limpar imagens
                        document.querySelector('.imagesProductContainer').innerHTML = ``

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
        })
        .catch((err) => {
            putSpinnet(form.closest('form'), `remove`)
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

if (ImageProduct) imgProduct.change(ImageProduct)
