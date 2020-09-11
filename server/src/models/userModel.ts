import mongoose from 'mongoose'
import validator from 'validator'

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
    }
}, {timestamps: true})

const userModel = mongoose.model('User', userSchema)

export default userModel