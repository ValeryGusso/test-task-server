import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import DBService from './services/db.js'
import cookieParser from 'cookie-parser'
import { UserToken } from './services/token.js'
import AuthController from './controllers/auth.js'
import UserController from './controllers/user.js'
import { checkAuth } from './middlewares/checkAuth.js'
import { userValidation } from './validator/request.js'
import { uploadImage } from './middlewares/upload.js'

dotenv.config()

declare global {
  namespace Express {
    interface Request {
      user?: UserToken
    }
  }
}

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static('uploads'))
app.use(
  cors({
    credentials: true,
    origin: true,
  }),
)

/* FEATURE FOR "RENDER" FREE PLAN TO UP THE SERVER */
app.get('/wakeup', (_, res) => {
  return res.json({ message: 'Im alive!', success: true })
})

app.get('/auth/me', checkAuth, AuthController.getMe)
app.get('/auth/logout', checkAuth, AuthController.logout)
app.get('/auth/refresh', AuthController.refresh)
app.post('/auth/login', userValidation, AuthController.login)
app.post('/auth/registration', userValidation, AuthController.registration)

app.get('/users/all', checkAuth, UserController.getAll)
app.get('/users/byId/:id', checkAuth, UserController.getOne)
app.post('/users/updateMe', checkAuth, uploadImage, UserController.update)

/////**********  Start  **********/////
;(async () => {
  try {
    await DBService.connect()
    app.listen(process.env.PORT, () => console.log('Server UP!'))
  } catch (err) {
    console.log(err)
  }
})()
