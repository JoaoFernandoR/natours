import {Request, Response, NextFunction} from 'express'
import Tour from '../models/tourModels'
// import AppError from '../utils/AppError'

export const getFiveTop = (request: Request, response: Response, next: NextFunction) => {
    request.query.sort = '-ratingsAverage,price'
    request.query.limit = '5'
    request.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next()
}

export const getAllTours = async (request: Request, response: Response) => {
    // Importante aqui nas lógicas pelo visto é usar o método JSON pra mudar pra string e vice-versa pro mongoose
    // e o Mongo entender os dados que estão sendo passados

    // Lógica para remover os campos que não são para filtrar o documento BUILD THE QUERY
    try {
        const queryCopy = {...request.query}
        
        const excludesFields = ['page', 'sort', 'limit', 'fields']
        
        excludesFields.forEach(item => delete queryCopy[item])
        // Fim da lógica
    
        // Lógica avançada de condição
        let queryStr = JSON.stringify(queryCopy)    
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    
        let query = Tour.find(JSON.parse(queryStr))
    
        // Sorting
        if(request.query.sort) {
            const sortBy = (request.query.sort as string).split(",").join(" ")
            
            query.sort(sortBy)   //price, ratingAverage
        } else {
            query.sort('-createdAt')
        }
    
        // Field limits to show up
        if(request.query.fields) {
            const sortBy = (request.query.fields as string).split(",").join(" ")
    
            console.log(sortBy)
            query.select(sortBy)
        } else {
            query.select('-__v')
        }
    
        // Pagination
        const page = (request.query.page as any) * 1 || 1
        const limit = (request.query.limit as any) * 1 || 100
    
        const skip = (page - 1) * limit
    
        query = query.skip(skip).limit(limit)
    
        // Execute Query
        const result = await query
    
        response.status(200).json({
            status: 'success',
            results: result.length,
            data: result
        })

    } catch(err) {
        return response.status(400).json({
            status: 'failure',
            message: err.message
        })
    }
}



export const createTour = async(request: Request, response: Response, next:NextFunction) => {

        const savedDocument = await Tour.create(request.body)
        
        return response.status(200).json({
            status: 'succesfull',
            data : savedDocument
        })

        

}

export const getSingleTour = async(request: Request, response:Response, next:NextFunction) => {

    const documentFound = await Tour.findById(request.params.id)
    
    if(!documentFound) {
        // return next(new AppError('No Tour found with that id', 404))
        throw Error('acess denied')
    }

    return response.status(200).json({
        status: 'success',
        data: documentFound
    })
   
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

export const getToursStats = async (request:Request, response: Response) => {
    try {
        const stats = await Tour.aggregate([
            { 
                $match: { ratingsAverage : { $gte : 4.5} }
            },
            {
                $group: {
                    _id: '$difficulty', 
                    avgRating: { $avg: '$ratingsAverage'},
                    numTours: { $sum: 1},
                    numRatings: { $sum: '$ratingsQuantity'},
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price'},
                    maxPrice: { $max: '$price'},
                }
            },
            {
                $sort: {
                    avgPrice: 1 
                }
            }
        ])
    
        response.status(200).json({
            status : "success",
            data : stats
        })
        
    } catch(err) {
        response.status(400).json({
            status: "failure",
            message: err
        })
    }
}

export const getMonthlyPlan = async (request:Request, response: Response) => {

    try {

        const year = (request.params.year as any) * 1 // 2021

        const plan = await Tour.aggregate([
            {
                $unwind : '$startDates',
            },
            {
                $match : {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    }
                }
            },
            {
                $group : {
                    _id: { $month : '$startDates'},
                    numTourStarts : { $sum: 1},
                    tours: { $push : '$name'}
                }
            },
            {
                $addFields: {
                    month : '$_id'
                }
            },
            {
                $project: {
                    _id : 0
                }
            },
            {
                $sort: {
                    numTourStarts: -1
                }
            },
            // {
            //     $limit : 12
            // }
        ])

        response.status(200).json({
            status : "success",
            result: plan.length,
            data : plan
        })

    } catch(err) {
        response.status(400).json({
            status: "failure",
            message: err
        })
    }

}