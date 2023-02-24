const mongoose = require('mongoose')

const aboutameSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  details: {
    type: String,
    maxlength: 10000,
    minlength: 50
  }
})

const AboutMe = mongoose.model('AboutMe', aboutameSchema)

module.exports = AboutMe