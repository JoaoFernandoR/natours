import express from 'express'
import { signUp, logIn, protect, forgotPassword, resetPassword, updatePassword } from '../controllers/authController'
import { getAllUsers, removeUser, updateMe, deleteMe } from '../controllers/userController'

const routes = express.Router()

// /api/v1/users
routes.route('/signup').post(signUp)
routes.route('/login').post(logIn)

routes.route('/forgotpassword').post(forgotPassword)
routes.route('/resetpassword/:token').patch(resetPassword)

routes.route('/updateMe').patch(protect, updateMe)
routes.route('/deleteMe').patch(protect, deleteMe)


routes.route('/updatemypassword').patch(protect, updatePassword)

routes.route('/')
    .get(protect, getAllUsers)
    
routes.route('/:id')
    .delete(removeUser)

export default routes