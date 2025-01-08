import mongoose from 'mongoose'

const incomeSchema = new mongoose.Schema({
    amount: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Income = mongoose.models.Income || mongoose.model('Income', incomeSchema);

export default Income;


