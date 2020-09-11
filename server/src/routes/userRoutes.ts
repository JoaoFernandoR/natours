import express from 'express'
import { signUp } from '../controllers/authController'
import { getAllUsers } from '../controllers/userController'

const routes = express.Router()



// /api/v1/users
routes.route('/signup').post(signUp)


routes.route('/')
    .get(getAllUsers)
    

export default routes