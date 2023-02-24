const { protect, restrictTo } = require('../../middleware/authenticate')
const fileupload = require('../../storage/fileUpload')
const upload = require('../../storage/multer')
const Account = require('../auth/account.service')
const { userSignUp, userVerifyAccount, userLogIn, userForgotPassword, userResetPassword, userUpdatePassword, userLogOut, userGetProfile, userUpdateProfile, userDeleteAccount } = require('./user.controller')
const User = require('./user.model')

const userRoute = require('express').Router()

// userRoute.use(restrictTo('user'))

userRoute.post('/signup', userSignUp)
userRoute.get('/verifyEmail/:token', userVerifyAccount);
userRoute.post('/login', userLogIn)
userRoute.post('/forgotPassword', userForgotPassword)
userRoute.patch('/resetPassword/:token', userResetPassword)

userRoute.patch('/updateMyPassword', protect([User]), restrictTo('user'), userUpdatePassword)
userRoute.get('/logout', protect([User]), restrictTo('user'), userLogOut)

userRoute.get('/me', protect([User]), restrictTo('user'), Account.getMe, userGetProfile)
userRoute.patch('/updateAccount', protect([User]), restrictTo('user'), upload.single('photo'), fileupload, userUpdateProfile)
userRoute.delete('/deleteAccount', protect([User]), restrictTo('user'), userDeleteAccount)

module.exports = userRoute