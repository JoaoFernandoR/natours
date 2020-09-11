import {Request, Response, NextFunction} from 'express'


const errorController2 = (error:Error, request:Request, response:Response, next:NextFunction) => {

    // error tem as propriedades : message, stack, name, code
    
    response.status(400).json({
        status: 'failure',
        message: error
    })
}


export default errorController2