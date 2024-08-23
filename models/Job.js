const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    category: { type: String, required: true },
    jobTitle: { type: String, required: true },
    description: { type: String, required: true },
    timeline: { type: Date, required: true },
    price: { type: Number, required: true },
    paymentType: { type: String, enum: ['fixed', 'negotiable'], default: 'fixed' },
    town: { type: String, required: true },
    county: { type: String, required: true },
    status: { type: String, enum: ['active', 'done'], default: 'active' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Associated user
    interestedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Users who have shown interest
}, {
    timestamps: true,
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
