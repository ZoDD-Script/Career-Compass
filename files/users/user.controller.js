const Account = require("../auth/account.service");
const Auth = require("../auth/auth.service");
const Factory = require("../auth/handler.factory.service");
const User = require("./user.model");

const userSignUp = Auth.signup(User)
const userVerifyAccount = Auth.confirmEmail(User)
const userLogIn = Auth.login(User)
const userLogOut = Auth.logout(User)
const userForgotPassword = Auth.forgotPassword(User)
const userResetPassword = Auth.resetPassword(User)
const userUpdatePassword = Auth.updatePassword(User)

const userGetProfile = Factory.getOne(User)
const userUpdateProfile = Account.updateMe(User)
const userDeleteAccount = Account.deleteMe(User)

module.exports = { userSignUp, userVerifyAccount, userLogIn, userForgotPassword, userResetPassword, userUpdatePassword, userLogOut, userGetProfile, userUpdateProfile, userDeleteAccount }