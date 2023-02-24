const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide a valid email'],
    unique: [true, 'Email already exist in our database'],
    lowercase:true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    default: 'default.png'
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This will only work for CREATE && SAVE!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same'
    }
  },
  photo: {
    type: String
  },
  address: {
    type: String,
    // required: [true, 'Please provide your address'],
  },
  state: {
    type: String,
    // required: [true, 'Please provide your state']
  },
  city: {
    type: String,
    // required: [true, 'Please provide your city']
  },
  phone: {
    type: String,
    // required: [true, 'Please provide your contact number']
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  amount: {
    type: Number,
    // required: true,
},
  passwordChangedAt: Date,
  resetToken: String,
  resetTokenExpires: Date,
  // list: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'ShoppingList'
  // },
},
{
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}
);

// Virtual populate
// userSchema.virtual('shoppingList', {
//   ref: 'ShoppingList',
//   foreignField: 'user',
//   localField: '_id',
//   justOne: false
// });

// userSchema.pre('save', function() {
//   this.populate({
//     path: 'list',
//     select: 'id'
//   });
// });

userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if(!this.isModified('password')) {
    return next();
  };

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete confirm password field
  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save',function(next) {
  if(!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000
  next();
});

// Query for accounts that are active
userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if(this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < changedTimeStamp; // returns true or false
  };

  // False means NOT changed
  return false;
};

userSchema.methods.createResetToken = function() {
  const token = crypto
    .randomBytes(32)
    .toString('hex');

  this.resetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.resetTokenExpires = Date.now() + 10 * 60 * 1000;

  return token;
}

const User = mongoose.model('User', userSchema);

module.exports = User;