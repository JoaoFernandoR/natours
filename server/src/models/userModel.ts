import mongoose, {HookNextFunction} from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
// Tipos
import { IUser} from './types'

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
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
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
    passwordChangedAt : Date,
    passwordResetToken : String,
    passwordResetExpires : Date,
    active : {
        type: Boolean,
        default: true,
        select: false
    }
}, {timestamps: true})

userSchema.pre('save', async function(this:IUser, next: HookNextFunction) {
    // Apenas irá rodar essa função se a senha tiver sido modificada
    if (!this.isModified('password')) return next()

    // Encrypt or Hash the password
    this.password = await bcrypt.hash(this.password, 12)

    // Apenas precisamos desse campo pra hora do login, não precisamos guardar no banco de dados
    this.passwordConfirm = undefined

    next()
})

userSchema.pre('save', function(this:IUser, next: HookNextFunction){
    // Poderíamos fazer no controller, mas é boa prática fazer em um pre middleware
    if (!this.isModified('password') || this.isNew ) return next()

    this.passwordChangedAt = new Date(Date.now() - 1000)
    next()

})

userSchema.pre(/^find/, function(this:any, next:HookNextFunction){
    // this irá aponta para qualquer query que começar com FIND
    // Esse Pre query middleware não irá selecionar nenhum documento que estiver com active false
    this.find({ active: { $ne : false} })
    next()
})

userSchema.methods.changedPasswordAfter = function(this:IUser, JWTTimestamp: number) {
    if(this.passwordChangedAt) {
        const time = this.passwordChangedAt.getTime()
        const changedTimeStamp =  time / 1000
        
        return JWTTimestamp < changedTimeStamp
    }
    // false means NOT changed
    return false 
}

userSchema.methods.createPasswordResetToken = function(this: IUser) {
    // Estamos criando esse token para não precisar guardar no banco de dados, é uma prática que tem que ser feita
    // Mas não precisa ser tão forte assim o token, portanto utilizamos o built-in crypto
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    console.log({resetToken}, this.passwordResetToken)

    const date = Date.now() + 10 * 60 * 1000

    this.passwordResetExpires = new Date(date)

    return resetToken
}

const userModel = mongoose.model<IUser>('User', userSchema)

export default userModel