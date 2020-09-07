// Aqui fica as coisas que são relacionadas ao servidor, mas não relacionada ao express
import dotenv from 'dotenv'
dotenv.config({path : './config.env'})
import mongoose from 'mongoose'
import server from './'

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
	useNewUrlParser : true, 
	useUnifiedTopology : true, 
    useFindAndModify : false,
    useCreateIndex: true
}).then(() => {console.log('Successfully connected')})


server.listen(3333, () => console.log('Server rodando pela porta 3333...'))

