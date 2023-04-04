import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

export interface UserInstance
  extends Model<InferAttributes<UserInstance>, InferCreationAttributes<UserInstance>> {
  id: CreationOptional<number>
  login: string
  password: string
  name: CreationOptional<string>
  avatar: CreationOptional<string>
  about: CreationOptional<string>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

export interface TokenListModel
  extends Model<InferAttributes<TokenListModel>, InferCreationAttributes<TokenListModel>> {
  id: CreationOptional<number>
  UserId: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

export interface TokenModel
  extends Model<InferAttributes<TokenModel>, InferCreationAttributes<TokenModel>> {
  id: CreationOptional<number>
  token: string
  TokenListId: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}
