import { Document } from 'mongoose'
import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'

// Fala que não é pra exportar
interface User extends Document {
    name: string;
    photo?: string;
    email: string;
    password: string;
    passwordConfirm: string | undefined;
    passwordChangedAt: Date
  } 

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        trim: true,
        required: [true, 'Please, insert a valid username'],
        minlength: [5, 'The name must have more than 5 characters'],
        maxlength: [40, 'The name must have less than 40 characters'],
    },
    photo : {
        type: String
    },
    email : {
        type: String,
        required : [true, 'Must have a valid e-mail'],
        unique : true,
        lowercase : true,
        validate : [validator.isEmail, 'Please enter a valid e-mail']
    },
    password : {
        type: String,
        required : [true, 'Must enter a password'],
        minlength: [5, 'The password must have more than 5 characters'],
        select: false
    },
    passwordConfirm : {
        type: String,
        required: [true, 'Please confirm your password'],
        validate : {
            // Apenas funciona no SAVE !!! Assim na hora de atualizar não pode usar apenas findByIAndUpdate
            validator: function(value:string) {
                return this.password === value
            },
            message: 'Both Passwords must be the same'
        }
    },
    passwordChangedAt : Date
}, {timestamps: true})

userSchema.pre('save', async function(this:User, next) {
    // Apenas irá rodar essa função se a senha tiver sido modificada
    if (!this.isModified('password')) return next()

    // Encrypt or Hash the password
    this.password = await bcrypt.hash(this.password, 12)

    // Apenas precisamos desse campo pra hora do login, não precisamos guardar no banco de dados
    this.passwordConfirm = undefined

    next()
})

// Método que podemos utilizar em qualquer resposta do acesso ao banco de dados
// userSchema.methods.correctPassword = async (candidatePassword: string, userPassword:string) => {
//     return await bcrypt.compare(candidatePassword, userPassword)
// }

userSchema.methods.changedPasswordAfter = function(this:User, JWTTimestamp: number) {
    if(this.passwordChangedAt) {
        const time = this.passwordChangedAt.getTime()
        const changedTimeStamp =  time / 1000
        console.log(changedTimeStamp, JWTTimestamp)
        
        return JWTTimestamp < changedTimeStamp
    }
    // false means NOT changed
    return false 
}

const userModel = mongoose.model('User', userSchema)

export default userModel