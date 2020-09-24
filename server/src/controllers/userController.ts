import {Request, Response} from 'express'
import userModel from '../models/userModel'

export const getAllUsers = async (request:Request, response: Response) => {

    const userResponse = await userModel.find().select('-__v')

    return response.status(200).json({
        status: 'success',
        data : userResponse
    })
}

export const removeUser = async (request:Request, response:Response) => {
    try {
        const userResponse = await userModel.findByIdAndRemove(request.params.id)
    
        response.status(200).json({
            status: 'success',
            data : userResponse
        })

    } catch(err) {

        if(err.name === 'CastError') {

            return response.status(400).json({
                status: 'failure',
                message: `Can't find ${request.originalUrl}. Invalid path`,
            })

        }

        return response.status(400).json({
            status: 'failure',
            message: err.message,
            name: err.name,
        })

    }
}