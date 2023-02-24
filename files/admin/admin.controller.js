const Account = require("../auth/account.service");
const Auth = require("../auth/auth.service");
const Factory = require("../auth/handler.factory.service");
const Admin = require("./admin.model");


const adminSignUp = Auth.signup(Admin)
const adminLogIn = Auth.login(Admin)
const adminLogOut = Auth.logout(Admin)
const adminForgotPassword = Auth.forgotPassword(Admin)
const adminResetPassword = Auth.resetPassword(Admin)
const adminUpdatePassword = Auth.updatePassword(Admin)

module.exports = { adminSignUp, adminLogIn, adminLogOut, adminForgotPassword, adminResetPassword, adminUpdatePassword }