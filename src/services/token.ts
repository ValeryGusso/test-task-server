import { UserInstance } from '../interfaces/user.js'
import jwt from 'jsonwebtoken'
import * as UserModel from '../models/user.js'

export interface UserToken extends jwt.JwtPayload {
  id: number
  login: string
  name: string
}

class TokenService {
  createAccess(user: UserInstance) {
    const { id, login, name } = user
    const token = jwt.sign({ id, login, name }, process.env.TOKEN_ACCESS_KEY!, { expiresIn: '15m' })
    return token
  }

  verifyAccess(token: string) {
    try {
      const verify = jwt.verify(token, process.env.TOKEN_ACCESS_KEY!)

      if (!verify || typeof verify === 'string') {
        return null
      }

      return { ...verify } as UserToken
    } catch (err) {
      return null
    }
  }

  createRefresh(id: number) {
    const token = jwt.sign({ id }, process.env.TOKEN_REFRESH_KEY!, { expiresIn: '30d' })
    return token
  }

  verifyRefresh(token: string) {
    try {
      const verify = jwt.verify(token, process.env.TOKEN_REFRESH_KEY!)

      if (!verify) {
        return null
      }

      return verify
    } catch (err) {
      return null
    }
  }

  async save(id: number, token: string, oldToken?: string) {
    const check = await UserModel.Token.findOne({ where: { token } })
    if (check) {
      await check.destroy()
      throw new Error('Токен уже существует.')
    }
    const tokenList = await UserModel.TokenList.findOne({ where: { UserId: id } })

    if (!tokenList) {
      throw new Error('ID пользователя указан неверно.')
    }

    if (oldToken) {
      const old = await UserModel.Token.findOne({ where: { token: oldToken } })
      await old?.destroy()
    }

    await UserModel.Token.create({ TokenListId: tokenList.id, token })
  }

  async clearDB() {
    const tokens = await UserModel.Token.findAll()

    for (let i = 0; i < tokens.length; ) {
      const created = new Date(tokens[i].createdAt).getTime()
      const updated = new Date(tokens[i].updatedAt).getTime()
      const now = new Date().getTime()
      const limit = 5_184_000_000

      if (created !== updated) {
        if (now - updated > limit) {
          await tokens[i].destroy()
        }
      } else {
        if (now - created > limit) {
          await tokens[i].destroy()
        }
      }
      i++
    }
  }

  async deleteToken(token: string) {
    const check = await UserModel.Token.findOne({ where: { token } })
    if (!check) {
      throw new Error('Токен не найден!')
    }
    await check.destroy()
    return true
  }
}

export default new TokenService()
