import multer from 'multer'
import fs from 'fs'
import { NextFunction, Request, Response } from 'express'
import { randomName } from '../utils/randomName.js'

const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    if (!fs.existsSync('./uploads')) {
      fs.mkdirSync('./uploads')
    }
    callback(null, './uploads')
  },
  filename: (req, file, callback) => {
    const extansion = file.originalname.match(/\.jpg|jpeg|png|gif|webp|svg|ico/i)
    if (extansion) {
      const newName = randomName(10) + extansion
      req.body.newFileName = newName
      callback(null, newName)
    }
  },
})

const upload = multer({ storage })

export async function uploadImage(req: Request, res: Response, next: NextFunction) {
  try {
    await new Promise((resolve, reject) => {
      upload.single('image')(req, res, err => {
        if (err instanceof multer.MulterError) {
          reject(err)
        } else {
          resolve(next())
        }
      })
    })
  } catch (err: any) {
    return res.status(500).json({ message: err.message })
  }
}

export async function removePrevAvatar(name: string) {
  if (!name) {
    return
  }
  let prevAvatar: string | RegExpMatchArray | null = name.match(/\/uploads\/[\w\d]+\.\w+/gi)

  if (prevAvatar) {
    prevAvatar = prevAvatar[0].replace('/uploads/', '')

    if (fs.existsSync(`./uploads/${prevAvatar}`)) {
      fs.rm('./uploads/' + prevAvatar, { recursive: true }, err => {
        if (err) {
          throw new Error('Ошибка файловой системы!')
        }
      })
    }
  }
}
