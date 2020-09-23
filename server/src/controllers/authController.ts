import {NextFunction, Request, Response} from 'express'
import userModel from '../models/userModel'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const signToken = (id:string) => {
    const token = jwt.sign({id : id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
    return token
}

const correctPassword = async (candidatePassword: string, userPassword:string) => {
    return await bcrypt.compare(candidatePassword, userPassword)
}

export const signUp = async (request:Request, response: Response) => {

    try {
        const newUser = await userModel.create({
            name: request.body.name,
            email: request.body.email,
            password: request.body.password,
            passwordConfirm: request.body.passwordConfirm
        })

        const token = signToken(newUser._id)

        response.status(201).json({
            status: 'success',
            token: token,
            data : newUser
        })
    } catch(err) {

        var message = err.message

        if (err.code === 11000) {
            const value = err.message.match(/"(.*?)"/)[0]
            message = `Duplicate field value: ${value}. Please use another value!`
        }
        
        response.status(400).json({
            status: 'failure',
            message: message,
        })
    }

}

export const logIn = async (request: Request, response:Response, next:NextFunction) => {
    
    const { email, password }  = request.body

    try {
        
        // Check if email and password exist
        if (!email || !password) {
            throw new Error('Please provide a valid email and password')
        }
        // Check if user exists && password is correct
        const user:any = await userModel.findOne({email: email}).select('+password')

        const checkPassword = await correctPassword(password, user.password)

        if (!user || !checkPassword) {
            throw new Error('Incorrect email or password')
        }

        const token = signToken(user._id)

            return response.status(200).json({
                status: 'success',
                data: token
            })
            
    } catch(err) {
            return response.status(400).json({
            status: 'failure',
            message: err.message,
            name: err.name,
        })
    }
        
}
