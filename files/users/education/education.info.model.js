const mongoose = require('mongoose')

const educationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  educationHistory: [
    {
      school: {
        type: String
      },
      course: {
        type: String
      },
      startDate: {
        type: Date
      },
      endDate: {
        type: Date
      }
    }
  ],
})

const Education = mongoose.model('Education', educationSchema)

module.exports = Education