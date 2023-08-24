import { Request, Response, Router } from 'express'
import path from 'path'
import fs from 'fs'
import { uploadFileMiddleware } from '../middlewares/uploadfile.middleware'
import { authenticateUser } from '../middlewares/authentication.middleware'

const router = Router()

router.post('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    await uploadFileMiddleware(req, res)

    if (!req.file) {
      return res.status(400).send({ message: 'Please upload a file!' })
    }

    res.status(200).json({
      message: 'Uploaded the file successfully: ' + req.file.originalname,
      url: req.fileName,
    })
  } catch (err) {
    res.status(500).send({
      message: 'Could not upload the file',
    })
  }
})

router.get('/', authenticateUser, async (req: Request, res: Response) => {
  const directoryPath = path.join(
    __dirname,
    '/../../resources/static/assets/uploads/'
  )

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: 'Unable to scan files!',
      })
    }

    const fileInfos: any = []

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: 'http://localhost:3000/api/files/' + file,
      })
    })

    res.status(200).send(fileInfos)
  })
})

router.get('/:name', async (req: Request, res: Response) => {
  const fileName = req.params.name
  const directoryPath = path.join(
    __dirname,
    '/../../resources/static/assets/uploads/'
  )

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: 'Could not download the file.',
      })
    }
  })
})

export { router as fileRouter }
