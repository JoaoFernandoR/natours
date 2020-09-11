import {Request, Response} from 'express'
import userModel from '../models/userModel'

export const getAllUsers = async (request:Request, response: Response) => {

    const userResponse = await userModel.find().select('-__v')

    response.status(200).json({
        status: 'success',
        data : userResponse
    })
}

export const signUp = async (request:Request, response: Response) => {

    try {
        const userResponse = await userModel.create(request.body)
    
        response.status(201).json({
            status: 'success',
            data : userResponse
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
