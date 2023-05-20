const express = require("express");
const {userModel,validateEmail} = require("../models/userModel");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const APIFeatures = require("../utils/apiFeatures");



const sendData = (user, statusCode, res) => {
  const token = user.getJWTToken();

  res.status(statusCode).json({
    user,
    token,
  });
};

exports.register = catchAsyncError(async (req, res, next) => {

  const { firstname, lastname, email, password } = req.body;
  if (!email || !password || !firstname ||!lastname)
    return next(new ErrorHandler("Please enter all fields", 400));

  const user = await userModel.create({ firstname, lastname, email, password });

  sendData(user, 200, res);
});


exports.login = catchAsyncError(async (req, res, next) => {
  
  const { email, password } = req.body;
console.log("gfhgfhf")
  if (!email || !password || !validateEmail(email))
    return next(new ErrorHandler("Please enter valid email and password", 400));

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched)
    return next(new ErrorHandler("Invalid email or password!", 401));

  sendData(user, 200, res);
});



