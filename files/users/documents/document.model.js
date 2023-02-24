const mongoose = require('mongoose')

const documentSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  documents: [
    {
      docName: {
        type: String
      },
      file: {
        type: String
      }
    }
  ],
})

const Document = mongoose.model('Document', documentSchema)

module.exports = Document