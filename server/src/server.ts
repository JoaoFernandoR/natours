// Aqui fica as coisas que são relacionadas ao servidor, mas não relacionada ao express
import dotenv from 'dotenv'
dotenv.config({path : './config.env'})

import server from './'

console.log(server.get('env'))
console.log(process.env)

server.listen(3333, () => console.log('Server rodando pela porta 3333...'))