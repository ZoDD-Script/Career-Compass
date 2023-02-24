const { protect, restrictTo } = require("../../middleware/authenticate");
const { adminSignUp, adminLogIn, adminLogOut, adminForgotPassword, adminResetPassword, adminUpdatePassword } = require('./admin.controller');
const Admin = require("./admin.model");

const adminRoute = require('express').Router()

adminRoute.post('/signup', adminSignUp)
adminRoute.post('/login', adminLogIn)
adminRoute.post('/forgotPassword', adminForgotPassword)
adminRoute.patch('/resetPassword/:token', adminResetPassword)

adminRoute.get('/logout', protect(Admin), adminLogOut)
adminRoute.patch('/updatePassword', protect(Admin), adminUpdatePassword)

module.exports = adminRoute
