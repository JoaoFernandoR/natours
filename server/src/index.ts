import express from 'express'
import morgan from 'morgan'
import fs from 'fs'
// Rotas
import tourRoutes from './routes/tourRoutes'

const server = express()

// Middlewares
if(process.env.NODE_ENV === 'development') {
  server.use(morgan(':date - :method :status :res[content-length] - :response-time ms', {
      stream: fs.createWriteStream('./src/access.log', { flags: 'a' })
  }))
}

server.use(express.json())

server.use(express.static('public'))

//Rotas
server.use('/api/v1/tours', tourRoutes)


export default server