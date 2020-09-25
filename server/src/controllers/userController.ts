import {NextFunction, Request, Response} from 'express'
import userModel from '../models/userModel'

export const getAllUsers = async (request:Request, response: Response) => {

    const userResponse = await userModel.find().select('-__v')

    return response.status(200).json({
        status: 'success',
        data : userResponse
    })
}

export const updateMe = async (request:Request, response: Response, next: NextFunction) => {
    try { 
        const user = response.locals.user
        // 1) Create error if user Post Password Data
        if(request.body.password || request.body.passwordConfirm) throw new Error('This route is not for update password')
         
        // 2) Update user document. Método save() não é o correto dessa vez porque se atualizar só o nome ele vai pedir
        // Os outros campos que são requeridos para atualizar o documento no MongoDB
        const userFromDb = await userModel.findByIdAndUpdate(user._id, {
            $set : { name : request.body.name}
        }, {new : true, runValidators: true})

        response.status(200).json({
            status : 'success',
            data : userFromDb
        })
    } catch(err) {
        response.status(400).json({
            status: 'failure',
            message: err.message,
        })
    }
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
            response.status(400).json({
                status: 'failure',
                message: `Can't find ${request.originalUrl}. Invalid path`,
            })
        }

        response.status(400).json({
            status: 'failure',
            message: err.message,
            name: err.name,
        })
    }
}

export const deleteMe = async (request:Request, response:Response) => {
    try{
        const user = response.locals.user
    
        await userModel.findByIdAndUpdate(user._id, { $set : { active : false}})
    
        response.status(204).json({
            status: 'success',
        })
    } catch(err) {
        response.status(400).json({
            status: 'failure',
            message: err.message
        })
    }
}