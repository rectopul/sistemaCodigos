const URL = `http://192.168.0.10:3333/api`

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

const btnsProduct = document.querySelectorAll('.productDelete')

const requestDeleteProduct = (id) => {
    return new Promise((resolve, reject) => {
        const token = document.body.dataset.token

        const reqUrl = `/api/product/${id}`
        fetch(reqUrl, {
            method: `DELETE`,
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
            .catch((err) => reject(err))
    })
}

if (btnsProduct) {
    Array.from(btnsProduct).forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const Id = btn.dataset.product

            requestDeleteProduct(Id)
                .then((res) => {
                    btn.closest('.col-12').remove()
                    return Swal.fire({
                        title: `Produto excluido com sucesso!`,
                        text: `O produto ${res.name} foi excluído`,
                        icon: 'success',
                        confirmButtonText: 'Ok',
                    })
                })
                .catch((err) => {
                    return Swal.fire({
                        title: `Arro ao remover produto`,
                        text: err,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                    })
                })
        })
    })
}

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

const loginResource = `login`

const requestLogin = (object) => {
    return new Promise((resolve, reject) => {
        const { email, password } = object

        const reqUrl = `/api/${loginResource}`
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

const category = (() => {
    const table = $('#dataTable').DataTable()

    //Private vars/functions
    const btnClick = (btn) => {
        const id = btn.dataset.id

        btn.addEventListener('click', (e) => {
            e.preventDefault()
            return removeCategory(btn, id)
        })
    }

    const removeCategory = (element, id) => {
        requestDestroy(id)
            .then((res) => {
                table
                    .row($(element.closest('tr')))
                    .remove()
                    .draw()
                /* if (element.closest('tr')) {
                    element.closest('tr').remove()
                } */

                return Swal.fire({
                    title: `Categoria ${res.name} removida com sucesso!`,
                    icon: 'success',
                    confirmButtonText: 'Ok',
                })
            })
            .catch((err) => {
                return Swal.fire({
                    title: err,
                    text: `Ocorreu um erro ao remover a categoria`,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                })
            })
    }

    const requestDestroy = (id) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token

            fetch(`/api/category/${id}`, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    if (!res.ok) return reject(`Erro ao deletar categoria`)
                    return res.json()
                })
                .then((res) => resolve(res))
                .catch((error) => reject(error))
        })
    }

    const destroy = (btn) => {
        return btnClick(btn)
    }

    //Validate form
    const validateForm = (list) => {
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

    //Create new category
    const requestCreate = (object) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token

            const { name, description, slug, parent } = object

            fetch(`/api/category`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description, slug, parent }),
            })
                .then((res) => {
                    if (!res.ok) return reject(`Erro ao criar categoria`)
                    return res.json()
                })
                .then((res) => resolve(res))
                .catch((error) => reject(error))
        })
    }

    //Create category in front
    const createFront = (object) => {
        const { id, name, description, createdAt } = object

        let data = new Date(createdAt)

        data = new Intl.DateTimeFormat('pt-BR').format(data)

        const newRow = table.row
            .add([
                id,
                name,
                description,
                0,
                data,
                `<!-- Botão de ação Editar // -->
            <button type="button" class="btn btn-datatable btn-icon btn-transparent-dark editCategory py-0" data-toggle="modal" data-target="#modalEditCategory" data-id="${id}">
                <i class="fas fa-edit"></i>
            </button>
            <!-- Botão de ação Editar // -->
            <button type="button" class="btn btn-datatable btn-icon btn-transparent-dark categoryDestroy py-0" data-id="${id}">
                <i class="far fa-trash-alt"></i>
            </button>`,
            ])
            .draw()
            .node()

        newRow.classList.add(`category-${id}`)

        const btnEdit = newRow.querySelector('.editCategory')

        openModal(btnEdit)

        const btnDestroy = newRow.querySelector('.categoryDestroy')

        destroy(btnDestroy)

        //document.querySelector('.listCaregories').append(tr)
    }

    const create = (btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault()

            const inputName = document.querySelector('.categoryName')
            const inputDescription = document.querySelector('.categoryDescription')
            const inputSlug = document.querySelector('.categorySlug')
            const inputParent = document.querySelector('.categoryParent')

            const inputsValidate = [{ input: inputName, msg: `Informe um nome para a categoria` }]

            return validateForm(inputsValidate)
                .then(() => {
                    return requestCreate({
                        name: inputName.value,
                        description: inputDescription.value,
                        slug: inputSlug.value,
                        parent: inputParent.value || null,
                    })
                        .then((res) => {
                            createFront(res)
                            return Swal.fire({
                                title: `Categoria ${res.name} criada com sucesso!`,
                                icon: 'success',
                                confirmButtonText: 'Ok',
                            })
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
        })
    }

    //Find category
    const find = (id) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token
            fetch(`/api/category/${id}`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((res) => resolve(res))
                .catch((error) => reject(error))
        })
    }

    //edit
    const edit = (object) => {
        return new Promise((resolve, reject) => {
            const token = document.body.dataset.token

            const { id, name, description, slug, parent } = object

            fetch(`/api/category/${id}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description, slug, parent }),
            })
                .then((res) => {
                    if (!res.ok) return reject(`Erro ao criar categoria`)
                    return res.json()
                })
                .then((res) => resolve(res))
                .catch((error) => reject(error))
        })
    }

    //Update category in front
    const updateFront = (object) => {
        const { id, name, description, slug, parent, createdAt } = object

        const category = document.querySelector(`.category-${id}`)

        if (category) {
            const fieldName = category.querySelector('td:nth-child(2)')
            const fieldDescription = category.querySelector('td:nth-child(3)')
            const fieldCreate = category.querySelector('td:nth-child(5)')

            let data = new Date(createdAt)
            data = new Intl.DateTimeFormat('pt-BR').format(data)

            let valuesEdit = table.row($(category)).data()

            console.log(category)

            valuesEdit[1] = name
            valuesEdit[2] = description
            valuesEdit[4] = data

            table.row($(category)).data(valuesEdit).draw()

            /* const btnEdit = category.querySelector('.editCategory')

            openModal(btnEdit) */

            /* const btnDestroy = category.querySelector('.categoryDestroy')

            destroy(btnDestroy) */

            return Swal.fire({
                title: `Categoria ${name} editada com sucesso!`,
                icon: 'success',
                confirmButtonText: 'Ok',
            })
        }
    }

    //Functions from edit categories
    const openModal = (btn) => {
        btn.addEventListener('click', (e) => {
            const id = btn.dataset.id
            const action = `editCategory`
            const btnModal = document.querySelector('.btnEditCategory')

            return find(id)
                .then((res) => {
                    const inputName = document.querySelector('.editCategoryName')
                    const inputDescription = document.querySelector('.editCategoryDescription')
                    const inputSlug = document.querySelector('.editCategorySlug')
                    const inputParent = document.querySelector('.editCategoryParent')

                    const { id, name, description, slug, parent } = res

                    if (inputParent.querySelector(`option[value="${parent}"]`)) {
                        inputParent.querySelector(`option[value="${parent}"]`).selected = true
                    }

                    inputName.value = name
                    inputDescription.value = description
                    inputSlug.value = slug

                    return btnModal.addEventListener('click', (e) => {
                        return edit({
                            id,
                            name: inputName.value,
                            description: inputDescription.value,
                            slug: inputSlug.value,
                            parent: inputParent.value || null,
                        }).then((res) => {
                            return updateFront(res)
                        })
                    })
                })
                .catch((err) => {
                    return Swal.fire({
                        title: `Erro ao editar categoria`,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                    })
                })
        })
    }

    return {
        destroy,
        create,
        edit: openModal,
    }
})()

const btnCategoryDestroy = document.querySelectorAll('.categoryDestroy')

if (btnCategoryDestroy) {
    Array.from(btnCategoryDestroy).forEach((btn) => {
        return category.destroy(btn)
    })
}

const btnModalEditCategory = document.querySelectorAll('.editCategory')

if (btnModalEditCategory) {
    Array.from(btnModalEditCategory).forEach((btn) => {
        return category.edit(btn)
    })
}

const btnCreateCategory = document.querySelector('.btnCreateCategory')

if (btnCreateCategory) category.create(btnCreateCategory)

const userResource = `user`

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
