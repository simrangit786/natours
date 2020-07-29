const User = require("./../Model/Usermodel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require('./handlerFactory')

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  })
  return newObj
}

/*
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});
*/

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id
  next();
}
exports.updateMe = catchAsync(async (req, res, next) => {
  //1.Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password update.Please use update my Password', 400))
  }

  //2.Filtered out unwanted Fields names are not allowed to be updated
  const filteredbody = filterObj(req.body, 'name', 'email')

  //3.Update User Document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredbody, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: 'sucess',
    data: {
      user: updatedUser
    }
  })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});


exports.CreateNewUser = factory.createOne(User)
/*
 (req, res) => {
  res.status(500).json({
    status: "error",
    Message: "This route is not yet defined",
  });
};
*/
exports.getAllUsers = factory.getAll(User)
exports.getUser = factory.getOne(User)
exports.UpdateUser = factory.updateOne(User)

exports.deleteUser = factory.deleteOne(User)