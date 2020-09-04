import {Request, Response, NextFunction} from 'express'
import fs from 'fs'

const data = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8'))

export const checkId = (request:Request, response:Response, next:NextFunction, value:{id : string}) => {
    if (value >= data.length)
    return response.status(404).json({
        status : "failure",
        message : " Não há nenhuma Tour com esse ID"
    })
    next()
}

export const getAllTours = (request: Request, response: Response) => {
    response.status(200).json({
        status: 'success',
        results: data.length,
        // requestedAt : request.requestTime, // Procurar solução para o typescript
        data: data
    })
}

export const checkBody = (request:Request, response:Response, next:NextFunction) => {

    if(!request.body.name || !request.body.price)
        return response.status(400).json({
            status: 'failure',
            message: 'Must specify a name and a price'
        })

    next()
}

export const createTour = (request: Request, response: Response) => {

    const Name = request.body.name.trim()

    const searchForName = data.find((item: {name : string}) => item.name === Name)

    if (searchForName) 
    return response.status(400).send('Este destino já existe.')


    const newId = data.length
    const newTour = Object.assign({id : newId, name : Name}, request.body)

data.push(newTour)

fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(data),'utf-8', (err) => {
    err && console.log(err)
    response.status(201).json({
        status: 'success',
        data: data
    })
})
}

export const getSingleTour = (request: Request, response:Response) => {

const filteredData = data.find((item: {id : number}) => item.id === parseInt(request.params.id))

return response.status(200).json({
    status: 'success',
    data: filteredData
})


}

export const updateTour = (request:Request, response: Response) => {

const filteredData = data.find((item: {id : number}) => item.id === parseInt(request.params.id))

return response.status(200).json({
    status: 'success',
    data: filteredData
})
}

export const deleteTour = (request:Request, response: Response) => {

const filteredData = data.find((item: {id : number}) => item.id === parseInt(request.params.id))

const removedData = data.filter((item:any) => item != filteredData)

fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(removedData),'utf-8', (err) => {
    if (err) return console.log(err)

    response.status(200).json({
        status : "success",
        data : data
    })
})

}