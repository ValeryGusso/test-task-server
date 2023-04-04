import { NextFunction, Request, Response } from 'express'
import TokenService from '../services/token.js'

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace(/^bearer\s*/i, '')

    if (!token) {
      return res.status(401).json({ message: 'Пользователь не авторизован!' })
    }

    const verify = TokenService.verifyAccess(token)

    if (!verify || typeof verify === 'string') {
      return res.status(401).json({ message: 'Пользователь не авторизован!' })
    }

    req.user = verify

    return next()
  } catch (err: any) {
    return res.status(401).json({ message: err.message })
  }
}
