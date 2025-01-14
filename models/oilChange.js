import mongoose from 'mongoose'

const oilChangeSchema = new mongoose.Schema({
    mileage: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    lastChange: {
        type: Date
    }
})

const OilChange = mongoose.models.OilChange || mongoose.model('OilChange', oilChangeSchema);

export default OilChange;