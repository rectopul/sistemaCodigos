const URL = `http://192.168.0.10:3333/api`

const util = (() => {
    const images = []
    let imageDefault = 0
    //private var/functions
    const setImageDefault = (image, container) => {
        image.addEventListener('click', (e) => {
            const index = image.dataset.index

            allImages = container.querySelectorAll('img')

            Array.from(allImages).forEach((img) => {
                img.classList.remove('active')
            })

            image.classList.add('active')

            imageDefault = parseInt(index)

            return console.log(imageDefault)
        })
    }

    image = (input, output, mode, size) => {
        input.addEventListener('change', (e) => {
            e.preventDefault()

            input.closest('form').classList.add('changed')

            const sizes = {
                large: [`my-2`, `col-12`],
                medium: [`my-2`, `col-6`],
                small: [`my-2`, `col-3`],
            }

            if (!size && !sizes[size]) return console.log(`Informe o tamanho entre (large, medium e small)`)

            const containerImages = output

            const inputFiles = [...input.files]

            const file = input.files[0]

            input.closest('.custom-file').querySelector('label').innerHTML = inputFiles.length + ` imagens`

            if (mode === `mult`) {
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

                        setImageDefault(image, output)

                        return containerImages.append(imageContainer)
                    }

                    // Not supported
                    else {
                        // fallback -- perhaps submit the input to an iframe and temporarily store
                        // them on the server until the user's session ends.
                    }
                })
            } else {
                const imageContainer = document.createElement('div')

                imageContainer.classList.add(...sizes[size])

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

                    images[0] = file

                    containerImages.innerHTML = ``

                    return containerImages.append(imageContainer)
                }

                // Not supported
                else {
                    // fallback -- perhaps submit the input to an iframe and temporarily store
                    // them on the server until the user's session ends.
                }
            }
        })
    }

    const request = (url, method, useToken, object, contentType) => {
        return new Promise((resolve, reject) => {
            const token = `Bearer ${document.body.dataset.token}`

            const headers = {}

            if (contentType) headers['content-type'] = contentType

            const body = object || null

            if (useToken) headers.authorization = token

            fetch(`/api/${url}`, { method, headers, body })
                .then((r) => r.json())
                .then((res) => {
                    if (res.error) return reject(res.error)

                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    const scroll = (link) => {
        $(link).on('click', function (event) {
            // Make sure this.hash has a value before overriding default behavior
            if (this.hash !== '') {
                // Prevent default anchor click behavior
                event.preventDefault()

                // Store hash
                var hash = this.hash

                // Using jQuery's animate() method to add smooth page scroll
                // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
                $('html, body').animate(
                    {
                        scrollTop: $(hash).offset().top,
                    },
                    800,
                    function () {
                        // Add hash (#) to URL when done scrolling (default click behavior)
                        window.location.hash = hash
                    }
                )
            } // End if
        })
    }

    return {
        //public var/functions
        image,
        images,
        request,
        scroll,
    }
})()

const allprods = document.querySelector('.nav-link.dropdown-toggle')
const hoverMenu = document.querySelector('.nav-item.dropdown')

if (hoverMenu) {
    hoverMenu.onmouseover = () => {
        document.querySelector('.nav-item.dropdown > ul').classList.add('show')
    }
    hoverMenu.onmouseout = () => {
        document.querySelector('.nav-item.dropdown > ul').classList.remove('show')
    }
}

if (allprods) {
    allprods.addEventListener('click', function (e) {
        e.preventDefault()

        url = allprods.getAttribute('href')

        if (window.matchMedia('(min-width:800px)').matches) {
            window.location.href = url
        }
    })
}

const btnValidat = document.querySelector('.btn-validateProd')

if (btnValidat) util.scroll(btnValidat)
;(function () {
    'use strict'
    window.addEventListener(
        'load',
        function () {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('needs-validation')
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function (form) {
                form.addEventListener(
                    'submit',
                    (event) => {
                        if (form.checkValidity() === false) {
                            event.preventDefault()
                            event.stopPropagation()
                        }
                        form.classList.add('was-validated')
                    },
                    false
                )
            })
        },
        false
    )
})()
