import {promisify} from 'util'
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
            passwordConfirm: request.body.passwordConfirm,
            passwordChangedAt : request.body.passwordChangedAt
        })

        const token = signToken(newUser._id)

        return response.status(201).json({
            status: 'success',
            token: token,
            data : newUser
        })
    } catch(err) {

        var message = err.message

        if (err.code === 11000) {
            const value = err.message.match(/"(.*?)"/)[0].replace(/\"/gi,'')
            message = `Duplicate field value: ${value}. Please use another value!`
        }
        
        return response.status(400).json({
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

            return response.status(201).json({
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

export const protect = async (request: Request, response:Response, next:NextFunction) => {
    try {
        // 1) Get the token and check if exists
        let token
        if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
            token = request.headers.authorization.split(' ')[1]
            // 2) Verification token
            const decoded:any = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
            // 3) Check if user still exists
            const freshUser = await userModel.findById(decoded.id)
            if (!freshUser) throw new Error ('The user belonging to this token no longer exists')
            // 4) Check if user changed after the token was issued
            const changed = freshUser.changedPasswordAfter(decoded.iat)
            if (changed) throw new Error('User recently changed password, please log in again')
        }
        else {
            throw new Error('You dont have access, please log in')
        }

        // Garantindo acesso à rota protegida
        // request.user = freshUser // Temos acesso ao objeto request, portando podemos atribuir qualquer coisa para depois aproveitar no próximo middleware que esse vai ser chamado
        next()
    } catch(err) {

        if (err.name === 'TokenExpiredError') {
            err.message = "Your token has expired, please sign up again for full privileges"
        }

        return response.status(401).json({
            status: 'failure',
            message: err.message,
    }) }
} 