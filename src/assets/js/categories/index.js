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

            const { name, description, slug, parent, position } = object

            fetch(`/api/category`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description, slug, parent, position }),
            })
                .then((r) => r.json())
                .then((res) => {
                    if (res.error) return reject(res.error)
                    resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    //Create category in front
    const createFront = (object) => {
        const { id, name, description, createdAt, position } = object

        let data = new Date(createdAt)

        data = new Intl.DateTimeFormat('pt-BR').format(data)

        const newRow = table.row
            .add([
                id,
                name,
                description,
                position,
                0,
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
            const inputPosition = document.querySelector('.categoryPosition')

            const inputsValidate = [{ input: inputName, msg: `Informe um nome para a categoria` }]

            return validateForm(inputsValidate)
                .then(() => {
                    return requestCreate({
                        name: inputName.value,
                        description: inputDescription.value,
                        slug: inputSlug.value,
                        parent: inputParent.value || null,
                        position: inputPosition.value,
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

            const { id, name, description, slug, parent, position } = object

            fetch(`/api/category/${id}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description, slug, parent, position }),
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
            table.row($(category)).remove().draw()

            createFront(object)

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
                    const inputPosition = document.querySelector('.editCategoryPosition')

                    const { id, name, description, slug, parent, position } = res

                    if (inputParent.querySelector(`option[value="${parent}"]`)) {
                        inputParent.querySelector(`option[value="${parent}"]`).selected = true
                    }

                    inputName.value = name
                    inputDescription.value = description
                    inputSlug.value = slug
                    inputPosition.value = position

                    return btnModal.addEventListener('click', (e) => {
                        return edit({
                            id,
                            name: inputName.value,
                            description: inputDescription.value,
                            slug: inputSlug.value,
                            parent: inputParent.value || null,
                            position: inputPosition.value,
                        }).then((res) => {
                            console.log(res)
                            return updateFront(res)
                        })
                    })
                })
                .catch((err) => {
                    console.log(err)
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
