
const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  console.log(err);
  err.message = err.message || "Internal Server Error";



  if (err.name === "CastError") {
    const msg = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(msg, 400);
  }

  if (err.name === "ValidationError") {
    let errors = Object.values(err.errors).map((el) => {
      console.log("properties", el.properties)
      let e;
      if(el.properties && el.properties.message) e = el.properties.message;
      else if (el.kind === "required") e = el.properties ? el.properties.message : err.message;
      else if (["minlength", "maxlength", "min", "max"].includes(el.kind))
        e = el.properties.message;
      else if (["string", "Number"].includes(el.kind))
        e = `Required ${el.kind} type value, provided ${el.valueType}`;
      else e = err.message;
      return JSON.stringify({ [el.path]: e });
    });

    const msg = `Validation Failed. ${errors.join(" ")}`;
    err = new ErrorHandler(msg, 400);
  }

  // mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    console.log(typeof field);
    let message;
    switch (field) {
      case "name":
        message = "Category with this name already exists.";
        break;
      case "email":
        message = "User with this email already exists.";
        break;
      default:
        message = `Duplicate Key Error ${field}.`;
    }
    err = new ErrorHandler(message, 400);
  }

  // wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }

  // JWT expire error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message,
    },
  });
};
