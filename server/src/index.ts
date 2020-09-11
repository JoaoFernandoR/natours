import express, {NextFunction } from 'express'
import 'express-async-errors'
import morgan from 'morgan'
import errorController2 from './controllers/errorController2'
import fs from 'fs'
// Rotas
import tourRoutes from './routes/tourRoutes'
import userRoutes from './routes/userRoutes'

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
server.use('/api/v1/users', userRoutes)

server.all('*', (req, response, next: NextFunction) => {
  // next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})

// server.use(errorController2)

export default server


