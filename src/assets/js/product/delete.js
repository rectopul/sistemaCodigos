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
