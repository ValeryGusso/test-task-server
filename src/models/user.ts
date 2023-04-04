import { TokenListModel, TokenModel, UserInstance } from '../interfaces/user.js'
import DBService from '../services/db.js'
import { DataTypes } from 'sequelize'

export const User = DBService.sequelize.define<UserInstance>('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  login: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING, defaultValue: 'Unnamed_user' },
  avatar: { type: DataTypes.STRING },
  about: {
    type: DataTypes.STRING,
    defaultValue:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus obcaecati alias quaerat quam sapiente animi necessitatibus minus soluta. Maiores, in.',
  },
  createdAt: { type: DataTypes.DATE },
  updatedAt: { type: DataTypes.DATE },
})

export const TokenList = DBService.sequelize.define<TokenListModel>('TokenList', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  UserId: { type: DataTypes.INTEGER },
  createdAt: { type: DataTypes.DATE },
  updatedAt: { type: DataTypes.DATE },
})

export const Token = DBService.sequelize.define<TokenModel>('Token', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  token: { type: DataTypes.STRING, unique: true },
  TokenListId: { type: DataTypes.INTEGER },
  createdAt: { type: DataTypes.DATE },
  updatedAt: { type: DataTypes.DATE },
})

User.hasOne(TokenList)
TokenList.belongsTo(User)

TokenList.hasMany(Token)
Token.belongsTo(TokenList)
