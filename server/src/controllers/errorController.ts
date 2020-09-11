import {NextFunction, Request, Response } from 'express'
// import AppError from '../utils/AppError'

interface NewError extends Error {
     statusCode : number,
     status: string,
     stack: string | undefined,
     isOperational : boolean,
     error: any
  }

const handleCastErrorDB = (err:any) => {
    const message = `Ìnvalid ${err.path}: ${err.value}.`
    // return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (err:any) => {
    const value = err.errmsg.match(/"(.*?)"/)[0]
    const message = `Duplicate field value: ${value}. Please use another value!`
    // return new AppError(message, 400)
}

const sendErrorForDev = (error:NewError, response:Response) => {
    response.status(error.statusCode).json({
        status: error.status,
        error: error,
        message: error.message, // vem da mensagem do erro criado
        stack: error.stack
    })
}

const sendErrorProduction = (error:NewError, response:Response) => {
    // Operational, trusted error : send message to the client
    if(error.isOperational) {
        response.status(error.statusCode).json({
            status: error.status,
            message: error.message, // vem da mensagem do erro criado
        })
    } 
    // Erro de programação, algum erro desconhecido
    else {
        console.error('ERROR 💥', error)
        response.status(500).json({
            status: 'error',
            message: 'Something went very wrong'
        })
    }
}
export const errorController = (error:any, request:Request, response:Response, next:NextFunction) => {
  
    error.statusCode = error.statusCode || 500
    error.message = error.message || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorForDev(error, response)
    } else if (process.env.NODE_ENV === 'production'){

        let err = { ...error}

        if(err.kind === 'ObjectId') err = handleCastErrorDB(err)
        if(err.code === 11000) err = handleDuplicateFieldsDB(err)
        
        sendErrorProduction(err, response)
    }
    
}