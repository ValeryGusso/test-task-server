import { Request, Response } from 'express'
import AuthService from '../services/auth.js'
import TokenService from '../services/token.js'
import UserService from '../services/user.js'
import Cookie from '../utils/cookie.js'
import { validationResult } from 'express-validator'

class AuthController {
  async registration(req: Request, res: Response) {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() })
      }

      const { login, password } = req.body

      const user = await AuthService.registration(login, password)

      const access = TokenService.createAccess(user)
      const refresh = TokenService.createRefresh(user.id)

      await TokenService.save(user.id, refresh)
      await TokenService.clearDB()

      Cookie.set(res, refresh)

      return res.json({ success: true, user, access })
    } catch (err: any) {
      if (
        err?.name === 'SequelizeUniqueConstraintError' ||
        err?.message === 'Пользователь с таким именем уже существует!'
      ) {
        return res.status(400).json({ message: 'Пользователь с таким именем уже существует!' })
      }

      return res.status(500).json({ message: 'Непредвиденная ошибка сервера.' })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() })
      }

      const { login, password } = req.body

      const user = await AuthService.login(login, password)

      const access = TokenService.createAccess(user)
      const refresh = TokenService.createRefresh(user.id)

      await TokenService.save(user.id, refresh)
      await TokenService.clearDB()

      Cookie.set(res, refresh)

      return res.json({ success: true, user, access })
    } catch (err: any) {
      console.log(err)
      if (err?.message === 'Неверно указано имя или пароль.') {
        return res.status(400).json({ success: false, message: 'Неверно указано имя или пароль.' })
      }
      return res.status(500).json({ success: false, message: err?.message })
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies

      const success = await TokenService.deleteToken(refreshToken)

      Cookie.clear(res)

      return res.json({ success })
    } catch (err: any) {
      console.log(err)
      return res.status(500).json({ message: err?.message })
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const token = req.cookies.refreshToken

      if (!token) {
        return res.status(401).json({ message: 'Пользователь не авторизован!' })
      }

      const verify = TokenService.verifyRefresh(token)

      if (!verify || typeof verify === 'string') {
        return res.status(401).json({ message: 'Пользователь не авторизован!' })
      }

      const user = await UserService.getOnyById(verify.id)

      const access = TokenService.createAccess(user)
      const refresh = TokenService.createRefresh(user.id)

      await TokenService.save(user.id, refresh, token)
      await TokenService.clearDB()

      Cookie.set(res, refresh)

      return res.json({ user, access })
    } catch (err: any) {
      console.log(err)
      return res.status(500).json({ message: err?.message })
    }
  }

  async getMe(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Пользователь не авторизован!' })
      }

      const user = await UserService.getOnyById(req.user.id)

      return res.json({ success: true, user })
    } catch (err: any) {
      console.log(err)
      return res.status(500).json({ success: false, message: err?.message })
    }
  }
}

export default new AuthController()
