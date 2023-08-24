import util from 'util'
import multer from 'multer'
import path from 'path'

const maxSize = 2 * 1024 * 1024

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/../../resources/static/assets/uploads/'))
  },
  filename: (req, file, cb) => {
    req.fileName = `${Date.now()}-${req.user?.id as string}-${
      file.originalname
    }`
    cb(null, `${Date.now()}-${req.user?.id as string}-${file.originalname}`)
  },
})

const uploadFile = multer({
  storage,
  limits: { fileSize: maxSize },
}).single('file')

const uploadFileMiddleware = util.promisify(uploadFile)
export { uploadFileMiddleware }
