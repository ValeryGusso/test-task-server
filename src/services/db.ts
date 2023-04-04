import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

class DBService {
  readonly sequelize
  constructor(url: string) {
    this.sequelize = new Sequelize(url)
  }

  async connect() {
    try {
      await this.sequelize.authenticate()
      console.log('DB Up!')
      // await this.sequelize.sync({ alter: true })
    } catch (err) {
      console.log(err)
    }
  }
}

export default new DBService(process.env.DB_ACCESS_URL!)
