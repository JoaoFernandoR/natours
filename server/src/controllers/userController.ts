import {Request, Response} from 'express'
import userModel from '../models/userModel'

export const getAllUsers = async (request:Request, response: Response) => {

    const userResponse = await userModel.find().select('-__v')

    response.status(200).json({
        status: 'success',
        data : userResponse
    })
}

export const createUser = async (request:Request, response: Response) => {

    try {
        const userResponse = await userModel.create(request.body)
    
        response.status(200).json({
            status: 'success',
            data : userResponse
        })
    } catch(err) {
        response.status(400).json({
            status: 'failure',
            message: err.message,
            name: err.name,
            stack: err.stack
        })
    }

}
