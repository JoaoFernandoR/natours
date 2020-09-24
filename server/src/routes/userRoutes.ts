import express from 'express'
import { signUp, logIn, protect } from '../controllers/authController'
import { getAllUsers, removeUser } from '../controllers/userController'

const routes = express.Router()



// /api/v1/users
routes.route('/signup').post(signUp)
routes.route('/login').post(logIn)

routes.route('/')
    .get(protect, getAllUsers)
    
routes.route('/:id')
    .delete(removeUser)

export default routes