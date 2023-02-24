const { protect, restrictTo } = require("../../../middleware/authenticate");
const User = require("../user.model");
const { uploadEducation, deleteEducation, getEducation } = require("./education.info.controller");

const educationRoute = require('express').Router({ mergeParams: true })

educationRoute.post('/', protect([User]), restrictTo('user'), uploadEducation)
educationRoute.delete('/delete', protect([User]), restrictTo('user'), deleteEducation)
educationRoute.get('/', protect([User]), restrictTo('user'), getEducation)

module.exports = educationRoute