import express from 'express'
import fs from 'fs'

const server = express()

server.use(express.json())

// Ler o arquivo de dados que vamos enviar
const data = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8'))

server.get('/api/v1/tours', (request, response) => {
    response.status(200).json({
        status: 'success',
        results: data.length,
        data: data
    })
})

server.get('/api/v1/tours/:id', (request, response) => {

    const filteredData = data.find((item: {id : number}) => item.id === parseInt(request.params.id))

    if (!filteredData)
        return response.status(400).json({
            status : "failure",
            message : " Não há nenhuma Tour com esse ID"
        })


    return response.status(200).json({
        status: 'success',
        data: filteredData
    })

    
})

server.post('/api/v1/tours', (request, response) => {

    
    // Verify if already exist the tour
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
    
})
 

server.listen(3333, () => console.log('Server rodando pela porta 3333...'))