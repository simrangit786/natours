//const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  console.log(err);
  message: `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFields = (err) => {
  const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  console.log(value);
  message: `Duplicate field value : x. please choose another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  message: `Invalid input data`;
  return new AppError(message, 400);
};
const handleJWTError = (err) =>
  new AppError("Invalid token.Please login again !", 401);

const handleJWTExpiredError = (err) =>
  new AppError("your token has expired.please login again", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    error: err,
    stack: err.stack,
    status: err.statusCode,
    message: err.message,
  });
};

const sendErrorProd = (err, res) => {
  //Operational or trusted error : send message to client

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });

    //Programming or other unknown error : don't leak error details
  } else {
    // 1. log error
    console.error("error", err);
    //2. send some generic message
    res.status(500).json({
      status: "error",
      message: " something went very wrong",
    });
  }
};

const AppError = require("../utils/appError");
const { application } = require("express");

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    console.log(error);
    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFields(error);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError(error);
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError(error);
    sendErrorProd(err, res);
  }
};

// res.status(err.statusCode).json({
// status: err.statusCode,
// message: err.message,
// });
