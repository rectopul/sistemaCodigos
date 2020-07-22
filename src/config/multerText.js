const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')

const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err)

                file.key = `${hash.toString('hex')}-${file.originalname}`

                cb(null, file.key)
            })
        },
    }),
    s3: multerS3({
        s3: new aws.S3(),
        bucket: 'uploadwecheckout',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err)

                const filename = `${hash.toString('hex')}-${file.originalname}`

                cb(null, filename)
            })
        },
    }),
}

module.exports = {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: storageTypes[`local`],
    limits: {
        fileSize: 20 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMines = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'text/plain', 'application/pdf']

        if (allowedMines.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb({
                name: `multerError`,
                message: `Invalid file Type`,
            })
        }
    },
}
