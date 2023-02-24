const catchAsync = require('./../../utils/catchAsync');
const AppError = require('./../../utils/appError');
// const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

class Account {
  static getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
  };
  
  static updateMe = Model => 
    catchAsync(async (req, res, next) => {
      console.log('it got here')
      // 1) Create error if user POSTs password data
      if (req.body.password || req.body.passwordConfirm) {
        return next(
          new AppError(
            'This route is not for password updates. Please use /updateMyPassword.',
            400
          )
        );
      }
    
      // 2) Filtered out unwanted fields names that are not allowed to be updated
      const filteredBody = filterObj(req.body, 'name', 'email');
      if (req.file) filteredBody.photo = req.url;
    
      // 3) Update user document
      const updatedUser = await Model.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
      });
    
      res.status(200).json({
        status: 'success',
        data: {
          user: updatedUser
        }
      });
    });
  
  static deleteMe = Model => 
    catchAsync(async (req, res, next) => {
      await Model.findByIdAndUpdate(req.user.id, { active: false });
    
      res.status(204).json({
        status: 'success',
        data: null
      });
    });
  
  static createUser = () =>
    (req, res) => {
      res.status(500).json({
        status: 'error',
        message: 'This route is not defined! Please use /signup instead'
      });
    };
  
  // static getUser = factory.getOne(User);
  // static getAllUsers = factory.getAll(User);
  
  // // Do NOT update passwords with this!
  // static updateUser = factory.updateOne(User);
  // static deleteUser = factory.deleteOne(User);
  
}

module.exports = Account