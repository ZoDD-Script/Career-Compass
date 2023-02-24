const mongoose = require('mongoose')

const jobOfferSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Jobs",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ['ACCEPTED', 'DECLINED', 'PENDING'],
    default: 'PENDING'
  }
})

const JobOffer = mongoose.model('JobOffer', jobOfferSchema)

module.exports = JobOffer