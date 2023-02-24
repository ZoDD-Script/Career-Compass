const { protect, restrictTo } = require("../../../middleware/authenticate");
const User = require("../user.model");
const { editAboutMe, createAboutMe, getAboutMe } = require("./about.me.controller");

const aboutMeRoute = require('express').Router({ mergeParams: true })

aboutMeRoute.post('/', protect([User]), restrictTo('user'), createAboutMe)
aboutMeRoute.patch('/update', protect([User]), restrictTo('user'), editAboutMe)
aboutMeRoute.get('/', protect([User]), restrictTo('user'), getAboutMe)

module.exports = aboutMeRoute