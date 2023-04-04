import { Request, Response } from 'express'
import UserService from '../services/user.js'

class UserController {
  async getAll(req: Request, res: Response) {
    try {
      const data = await UserService.getAll()

      return res.json({ success: true, data })
    } catch (err: any) {
      return res.status(500).json({ message: err.message, success: false })
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const id = +req.params.id

      if (!id) {
        return res.status(400).json({ success: false, message: 'Необходимо передать ID!' })
      }
      const user = await UserService.getOnyById(id)

      return res.json({ success: true, user })
    } catch (err: any) {
      return res.status(500).json({ success: false, message: 'Ошибка сервера' })
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: true, message: 'Пользователь не авторизован!' })
      }
      const id = req.user.id

      const { name, about } = req.body
      const filename = req.file?.filename

      const user = await UserService.updateUser(id, filename, name, about)

      return res.json({ success: true, user })
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message })
    }
  }
}

export default new UserController()
