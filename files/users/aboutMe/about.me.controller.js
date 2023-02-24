const Factory = require("../../auth/handler.factory.service");
const AboutMe = require("./about.me.model");

const createAboutMe = Factory.createOne(AboutMe)
const editAboutMe = Factory.updateOne(AboutMe)
const getAboutMe = Factory.getOne(AboutMe)

module.exports = { createAboutMe, editAboutMe, getAboutMe }