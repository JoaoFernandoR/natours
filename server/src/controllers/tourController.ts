import {Request, Response} from 'express'
import Tour from '../models/tourModels'

export const getAllTours = async (request: Request, response: Response) => {
    const dbDatabase = await Tour.find().select('-__v')

    response.status(200).json({
        status: 'success',
        results: dbDatabase.length,
        data: dbDatabase
    })
}

export const createTour = async (request: Request, response: Response) => {

    const sentData = request.body


    try {

        const savedDocument = await Tour.create(sentData)
        
        response.status(200).json({
            status: 'succesfull',
            data : savedDocument
        })
    } catch(err) {
        console.log(err)
        response.status(400).json({
            status: 'failure',
            message: 'Something went wrong'
        })
    }

}

export const getSingleTour = async (request: Request, response:Response) => {

    try {
        const documentFound =await Tour.findById(request.params.id)

        response.status(200).json({
            status: 'success',
            data: documentFound
        })

    } catch(err) {
        response.status(404).json({
            status: 'failure',
            message: err
        })
    }

}

export const updateTour = async (request:Request, response: Response) => {

    try {
        const sentData = request.body
    
        const dataReceived = await Tour.findByIdAndUpdate(request.params.id, sentData, { new : true, runValidators : true})
    
        return response.status(200).json({
            status: 'success',
            data: dataReceived
        })
    } catch(err) {
        return response.status(400).json({
            status: "failure",
            message: err
        })
    }
}

export const deleteTour = async (request:Request, response: Response) => {

    try {
        await Tour.findByIdAndDelete(request.params.id)
    
        response.status(204).json({
            status : "success",
        })
        
    } catch(err) {
        response.status(400).json({
            status: "failure",
            message: err
        })
    }

}