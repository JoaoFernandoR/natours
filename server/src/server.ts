// Aqui fica as coisas que são relacionadas ao servidor, mas não relacionada ao express
import dotenv from 'dotenv'
dotenv.config({path : './config.env'})
import fs from 'fs'
import mongoose from 'mongoose'
import server from './'
import Tour from './models/tourModels'


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
	useNewUrlParser : true, 
	useUnifiedTopology : true, 
    useFindAndModify : false,
    useCreateIndex: true
}).then(() => console.log('Successfully connected'))

// COMEÇO DO SCRIPT

const tours= JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json', "utf-8"))


const importData = async () => {
    try {
        await Tour.create(tours)
        console.log('data successfully loaded')
    }catch(err) {
        console.log(err)
    }
}

const deleteData = async() => {
    try {
        await Tour.deleteMany({})
        console.log('data successfully deleted')
        process.exit()
    }catch(err) {
        console.log(err)
    }
}

if (process.argv[2] === '--import') {
     importData()
 } else if (process.argv[2] === '--delete') {
     deleteData()
}

// FIM DO SCRIPT

server.listen(3333, () => console.log('Server rodando pela porta 3333...'))

process.on('unhandledRejection', (err:Error) => {
    console.log(`Error 💥, cannot stablish connection with server.\nName: ${err.name}, Message: ${err.message}`)
    process.exit(1) // Is not working
})
