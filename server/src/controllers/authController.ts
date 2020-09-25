import {promisify} from 'util'
import crypto from 'crypto'
import {NextFunction, Request, Response} from 'express'
import userModel from '../models/userModel'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { IUser } from '../models/types'
import sendEmail from '../utils/email'

export interface IRequest extends Request {
    user : IUser
}

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
            passwordChangedAt : request.body.passwordChangedAt,
            role: request.body.role
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
            response.locals.user = freshUser  // Passar parâmetro para o próximo middleware
        }
        else {
            throw new Error('You dont have access, please log in')
        }

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

export const restrictTo = (request: Request, response:Response, next:NextFunction) => {
    try {
        if(response.locals.user.role == 'user') throw new Error('You do not have permission')
    } catch (err) {
        response.status(403).json({
            status: 'failure',
            message : err.message
        })
    }
    next()
}

export const forgotPassword = async (request: Request, response:Response, next:NextFunction) => {
    // 1) Get User based on posted email
        const user = await userModel.findOne({email : request.body.email})

        if(!user) throw new Error('There is no user with that email adress')

    // 2) generate the random token
        const resetToken = user.createPasswordResetToken()
        await user.save({validateBeforeSave : false})

    // 3) Send it to user's email 
       const resetUrl = `${request.protocol}://${request.get('host')}/api/v1/users/resetpassword/${resetToken}`

       const message = `Forgot your password ? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didnt forget your password, please ignore this message`
        try {
            await sendEmail({
                email: user.email,
                subject: 'Your password reset token (valid for 10 minutes)',
                message: message
            })
     
            return response.status(200).json({
                status: 'success',
                message: 'Token sent to email'
            })
        } catch(err) {
            user.passwordResetToken = undefined
            user.passwordResetExpires = undefined
            await user.save({validateBeforeSave : false})

            return response.status(500).json({
                status: 'fail',
                message: 'There was an error sending the email. Try again later!'
            })
        }
}

export const resetPassword = async (request: Request, response:Response, next:NextFunction) => {

    try {
        // 1) Get user based on Token. O Token que temos no banco de dados é encriptado.
        const hashedToken = crypto.createHash('sha256').update(request.params.token).digest('hex')
    
        const user = await userModel.findOne({
            passwordResetToken: hashedToken, 
            passwordResetExpires: { $gt : new Date(Date.now())}
        })
    
        // 2) If token has to expired, and there is user, set the new password
        if(!user) throw new Error("The Token doesnt exist or has expired")

        user.password = request.body.password
        user.passwordConfirm = request.body.passwordConfirm
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined

        // 3) Update changedPasswordAt property for the user


        await user.save() // Nesse caso queremos que rode a validação
    
        // 4) log the user in, send JWT
        const token = signToken(user._id)

        return response.status(201).json({
            status: 'success',
            token: token,
        })



    } catch(err) {
        response.status(400).json({
            status: "failure",
            message: err.message
        })
    }
}
