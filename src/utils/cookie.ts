import { Response } from 'express'

class Cookie {
  private readonly name

  constructor(name: string) {
    this.name = name
  }

  set(res: Response, cookie: string) {
    res.cookie(this.name, cookie, {
      maxAge: 30 * 24 * 3600 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      // domain: process.env.COOKIE_DOMAIN,
    })
  }
  clear(res: Response) {
    res.clearCookie(this.name)
  }
}

export default new Cookie('refreshToken')
