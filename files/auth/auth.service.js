const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../../utils/catchAsync');
const AppError = require('./../../utils/appError');
const Email = require('./../../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

class Auth {
  static signup = Model => 
    catchAsync(async (req, res, next) => {
      const {email} = req.body

      const userExist = await Model.findOne({email})

      if (userExist) {
        return next(new AppError('A user with this email already exist', 400))
      }

      const newUser = await Model.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
      });

      const verifyToken = newUser.createResetToken();
      // console.log(verifyToken);
      await newUser.save({ validateBeforeSave: false });
    
      const url = `https://${req.get('host')}/api/v1/users/verifyEmail/${verifyToken}`;
      
      await new Email(newUser, url).sendWelcome();

      createSendToken(newUser, 201, req, res);
    });

  static confirmEmail = Model => 
    catchAsync(async (req, res, next) => {
      const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    
      const user = await Model.findOne({
        resetToken: hashedToken,
        resetTokenExpires: { $gt: Date.now() }
      });
    
      if(!user){
        return res.status(400).json({
          msg: 'Invalid or Expired Token, please try again'
        });
        // return next(new AppError('Invalid or Expired Token, please try again', 400))
      }
    
      await user.updateOne({confirmed: true});
    
      user.resetToken = undefined;
      user.resetTokenExpires = undefined;
      await user.save({validateBeforeSave: false});
    
      createSendToken(user, 200, req, res);
    })

  static login = Model =>
    catchAsync(async (req, res, next) => {
      const { email, password } = req.body;
    
      // 1) Check if email and password exist
      if(!email || !password) {
        return res.status(400).json({
          msg: 'Please provide email and password'
        });
        // return next(new AppError('Please provide email and password', 400))
      };
    
      // 2) Check if user exist and password is correct
      const user = await Model.findOne({ email }).select('+password');
    
      if(!user || !(await user.correctPassword(password, user.password))) {
        return res.status(401).json({
          msg: 'Incorrect email or password'
        });
        // return next(new AppError('Incorrect email or password', 401));
      };
    
      if(!user?.confirmed && user.role === 'user') {
        const verifyToken = user.createResetToken();
        // console.log(verifyToken);
        await user.save({ validateBeforeSave: false });
    
        const url = `https://${req.get('host')}/api/v1/users/verifyEmail/${verifyToken}`;
        
        await new Email(user, url).verifyEmail();
        return res.status(401).json({
          msg: 'A confirmation link has been sent to your mail! Please confirm your email to login'
        });
        // return next(new AppError('A confirmation link has been sent to your mail! Please confirm your email to login', 401))
      }
    
      // 3) If everything of, send token to client
      createSendToken(user, 200, req, res);
    });

  static logout = () =>
    (req, res) => {
      res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
      });
      res.status(200).json({ status: 'success' });
    };

  static forgotPassword = Model =>
    catchAsync(async (req, res, next) => {
      // 1) Get user based on POSTed email
      const user = await Model.findOne({ email: req.body.email });
      if(!user) {
        return next(new AppError('There is no user with that email address', 404));
      };
    
      // 2) Generate the random reset token
      const resetToken = user.createResetToken();
      await user.save({ validateBeforeSave: false });
    
      // 3) Send it to user's email
      try {
        const resetURL = `https://${req.get(
          'host'
        )}/api/v1/users/resetPassword/${resetToken}`;
        await new Email(user, resetURL).sendPasswordReset();
    
        res.status(200).json({
          status: 'success',
          message: 'Token sent to email!'
        });
      } catch(err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
    
        return res.status(400).json({
          msg: 'There was an error sending the email. Try again later!'
        });
        // return next(new AppError('There was an error sending the email. Try again later!'), 400);
      }
    });

  static resetPassword = Model =>
    catchAsync(async (req, res, next) => {
      // 1) Get user based on the token
      const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    
      const user = await Model.findOne({
        resetToken: hashedToken,
        resetTokenExpires: { $gt: Date.now() }
      });
    
      // 2) If token has not expired, and there is user, set the new password
      if (!user) {
        return res.status(400).json({
          msg: 'Token is invalid or has expired'
        });
        // return next(new AppError('Token is invalid or has expired', 400));
      }
    
      user.password = req.body.password;
      user.confirmPassword = req.body.confirmPassword;
      user.resetToken = undefined;
      user.resetTokenExpires = undefined;
      await user.save();
    
      // 3) Update changedPasswordAt property for the user
      // 4) Log the user in, send JWT
      createSendToken(user, 200, req, res);
    })

  static updatePassword = Model =>
    catchAsync(async (req, res, next) => {
      // 1) Get user from collection
      const user = await Model.findById(req.user._id).select('+password');
    
      // 2) Check if POSTed current password is correct
      if(!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return res.status(401).json({
          msg: 'Your current password is wrong.'
        });
        // return next(new AppError('Your current password is wrong.', 401));
      }
    
      // 3) check if user account have been verified
      if(!user.confirmed && user.role === 'user') {
        return res.status(401).json({
          msg: 'Please verify your email then log in to update your password.'
        });
        // return next(new AppError('Please verify your email then log in to update your password', 401));
      }
    
      // 4) If so, update password
      user.password = req.body.password;
      user.confirmPassword = req.body.confirmPassword;
      await user.save();
    
      // 5) Log user in, send JWT
      createSendToken(user, 200, req, res);
    });
  
}

module.exports = Auth