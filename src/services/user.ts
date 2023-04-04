import dotenv from 'dotenv'
import * as UserModel from '../models/user.js'
import { removePrevAvatar } from '../middlewares/upload.js'

dotenv.config()

class UserService {
  async getAll() {
    const data = await UserModel.User.findAll()

    return data
  }

  async getOnyById(id: number) {
    const user = await UserModel.User.findByPk(id)
    if (!user) {
      throw new Error('Пользователь не найден.')
    }
    return user
  }

  async updateUser(id: number, avatar?: string, name?: string, about?: string) {
    const user = await this.getOnyById(id)

    let wasChanged = false

    if (avatar) {
      removePrevAvatar(user.avatar)
      user.avatar = `${process.env.SERVER_URL}/uploads/${avatar}`
      wasChanged = true
    }
    if (name) {
      user.name = name
      wasChanged = true
    }
    if (about) {
      user.about = about
      wasChanged = true
    }

    if (wasChanged) {
      await user.save()
    }

    return user
  }
}

export default new UserService()
