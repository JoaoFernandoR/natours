import express, {Request, Response} from 'express'
import fs from 'fs'

const routes = express.Router()

// Ler o arquivo de dados que vamos enviar
const data = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8'))

const getAllTours = (request: Request, response: Response) => {
        response.status(200).json({
            status: 'success',
            results: data.length,
            data: data
        })
}

const createTour = (request: Request, response: Response) => {
    // Verify if already exists the tour
    const Name = request.body.name.trim()

    const searchForName = data.find((item: {name : string}) => item.name === Name)

    if (searchForName) 
        return response.status(400).send('Este destino já existe.')
    // End of verification

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

const getSingleTour = (request: Request, response:Response) => {

    const filteredData = data.find((item: {id : number}) => item.id === parseInt(request.params.id))

    if (!filteredData)
        return response.status(404).json({
            status : "failure",
            message : " Não há nenhuma Tour com esse ID"
        })


    return response.status(200).json({
        status: 'success',
        data: filteredData
    })

    
}

const updateTour = (request:Request, response: Response) => {

    const filteredData = data.find((item: {id : number}) => item.id === parseInt(request.params.id))

    if (!filteredData)
        return response.status(404).json({
            status : "failure",
            message : " Não há nenhuma Tour com esse ID"
        })


    return response.status(200).json({
        status: 'success',
        data: 'Updated tour'
    })
}

const deleteTour = (request:Request, response: Response) => {

    const filteredData = data.find((item: {id : number}) => item.id === parseInt(request.params.id))

    if (!filteredData)
        return response.status(404).json({
            status : "failure",
            message : " Não há nenhuma Tour com esse ID"
        })

    const removedData = data.filter((item:any) => item != filteredData)

    fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(removedData),'utf-8', (err) => {
        if (err) return console.log(err)

        response.status(200).json({
            status : "success",
            data : data
        })
    })

}

//rotas
routes.get('/api/v1/tours', getAllTours)
routes.post('/api/v1/tours', createTour)
routes.get('/api/v1/tours/:id', getSingleTour)
routes.patch('/api/v1/tours/:id', updateTour)
routes.delete('/api/v1/tours/:id', deleteTour)

export default routes 