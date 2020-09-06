const whatsapp = (() => {
    //private var/functions
    function store(form) {
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault()

                const body = JSON.stringify(util.serialize(form))

                fetch(`/api/v1/whatsapp`, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${document.body.dataset.token}`,
                    },
                    body,
                })
                    .then((r) => r.json())
                    .then((res) => {
                        if (res.error)
                            return Swal.fire({
                                title: res.error,
                                icon: 'error',
                                confirmButtonText: 'Ok',
                            })

                        return Swal.fire({
                            title: `O número ${res.number} foi cadastrado com sucesso!`,
                            icon: 'success',
                            confirmButtonText: 'Ok',
                        })
                    })
                    .catch((error) => console.log(error))
            })
        }
    }

    return {
        //public var/functions
        store,
    }
})()

const formWhats = document.querySelector('.formWhats')

if (formWhats) whatsapp.store(formWhats)
