const Factory = require("../../auth/handler.factory.service");
const Document = require("./document.model");

const uploadDocument = Factory.createOne(Document)
const deleteDocument = Factory.deleteOne(Document)
const getDocument = Factory.getOne(Document)

module.exports = { uploadDocument, deleteDocument, getDocument }