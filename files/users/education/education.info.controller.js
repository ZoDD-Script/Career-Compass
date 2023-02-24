const Factory = require("../../auth/handler.factory.service");
const Education = require("./education.info.model");

const uploadEducation = Factory.createOne(Education)
const deleteEducation = Factory.deleteOne(Education)
const getEducation = Factory.getOne(Education)

module.exports = { uploadEducation, deleteEducation, getEducation }