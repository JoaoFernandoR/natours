import mongoose from 'mongoose'

const TourSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: [true, 'A tour must have a Name'],
        unique: true,
        trim: true
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
    price: {
        type: Number, 
        required: [true, 'A tour must have a price'],
        default: 0
    },
    priceDiscount: Number,
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
    }
}, {timestamps : true})

const Tour = mongoose.model('Tour', TourSchema)

export default Tour
