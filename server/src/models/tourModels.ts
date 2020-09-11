import mongoose from 'mongoose'
import slugify from 'slugify'

const TourSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: [true, 'A tour must have a Name'],
        unique: true,
        trim: true,
        minlength : [5, 'A tour must have more than 5 characters'],
        maxlength : [30, 'A tour must have less than 20 characters'],
    },
    duration : {
        type: Number,
        required: [true, 'A Tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A Tour must have a group size']
    },
    difficulty: {
        type: String,   
        enum : {
            values: ['easy', 'medium', 'difficult'],
            message : ' Must be easy, medium or difficult'
        },
        required: [true, 'A Tour must have a diffculty']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    slug : String,
    secretTour : {
        type: Boolean,
        default:false
    },
    price: {
        type: Number, 
        required: [true, 'A tour must have a price'],
        default: 0
    },
    priceDiscount: {
        type : Number,
        validate : {
            validator : function(val: Number) {
            return val < this.price },
        message : 'The discount is greater than price',
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A Tour must have a description']
    }, 
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A Tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date]
}, {timestamps : true, toJSON: {virtuals : true}, toObject: {virtuals: true}})

// Essa propriedade virtual será criada cada vez que pegar dados do banco de dados, por isso o 'get' que é um getter 
TourSchema.virtual('durationWeeks').get(function() {
    const result  = this.duration / 7
    return (result.toFixed(2) as any) * 1
})

// Document Middleware, runs before .save() and .create()
// No THIS temos acesso ao documento que está prestes a ser salvo
TourSchema.pre('save', function(this: any, next) {
    this.slug = slugify(this.name, {lower: true})
    next()
})

// Query middleware
TourSchema.pre(/^find/, function(this: any, next) {
    this.find({secretTour: {$ne : true}})
    next()
})

// Aggregation middleware
TourSchema.pre('aggregate', function(this, next){ 
    this.pipeline().unshift({ $match : { secretTour : { $ne : true }} })
    next()
})

const Tour = mongoose.model('Tour', TourSchema)

export default Tour
