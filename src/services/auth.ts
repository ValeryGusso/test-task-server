import * as UserModel from '../models/user.js'
import bcrypt from 'bcrypt'

class AuthService {
  async registration(login: string, password: string) {
    const sameUSer = await UserModel.User.findOne({
      where: { login },
    })

    if (sameUSer) {
      throw new Error('Пользователь с таким именем уже существует!')
    }

    const salt = await bcrypt.genSalt(13)
    const hash = await bcrypt.hash(password, salt)

    const user = await UserModel.User.create({
      login,
      password: hash,
    })

    await UserModel.TokenList.create({ UserId: user.id })

    return user
  }

  async login(login: string, password: string) {
    const user = await UserModel.User.findOne({
      where: { login },
    })

    if (!user) {
      throw new Error('Неверно указано имя или пароль.')
    }

    const isEquival = await bcrypt.compare(password, user.password)

    if (!isEquival) {
      throw new Error('Неверно указано имя или пароль.')
    }

    return user
  }
}

export default new AuthService()
