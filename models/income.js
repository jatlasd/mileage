import mongoose from 'mongoose'

const incomeSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    week: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Income = mongoose.models.Income || mongoose.model('Income', incomeSchema);

export default Income;


