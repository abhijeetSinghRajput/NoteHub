import mongoose from 'mongoose';
const contributionSchema = new mongoose.Schema({
    username: {
        type: String,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    count: {
        type: Number,
        default: 1,
    }

}, {timestamps: true});

contributionSchema.index({userId: 1, date: 1}, {unique: true});


const Contribution = mongoose.model('contribution', contributionSchema);
export default Contribution;