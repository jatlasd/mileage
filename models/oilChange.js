import mongoose from 'mongoose'

const oilChangeSchema = new mongoose.Schema({
    mileage: {
        type: Number,
        required: true
    },
    currentlyNeeds: {
        type: Boolean,
        default: false
    },
    lastChange: {
        type: Date
    }
})

const OilChange = mongoose.models.OilChange || mongoose.model('OilChange', oilChangeSchema);

export default OilChange;