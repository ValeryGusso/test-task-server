import { body } from 'express-validator'

export const userValidation = [
	body('login', 'Имя должно состоять из 3х и более символов').isLength({ min: 3 }),
	body('password', 'Пароль не может быть короче 5 символов').isLength({ min: 5 }),
]

