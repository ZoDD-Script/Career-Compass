const { protect, restrictTo } = require("../../../middleware/authenticate");
const User = require("../user.model");
const { uploadDocument, deleteDocument, getDocument } = require("./document.controller");

const documentRoute = require('express').Router({ mergeParams: true })

documentRoute.post('/', protect([User]), restrictTo('user'), uploadDocument)
documentRoute.delete('/delete', protect([User]), restrictTo('user'), deleteDocument)
documentRoute.get('/', protect([User]), restrictTo('user'), getDocument)

module.exports = documentRoute