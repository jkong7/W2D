import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
    location: {type: String, required: true},
    day: {type: Number, required: true}, 
    description: {type: String, }
})

const tripSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, 
    name: {type: String, required: true}, 
    items: [itemSchema]
})

const Trip = mongoose.model('Trip', tripSchema)
export default Trip; 