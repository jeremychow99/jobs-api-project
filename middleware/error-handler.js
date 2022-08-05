const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    //set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later'
  }

  // to handle error when user does not provide name/email/password when registering
  if (err.name === 'ValidationError') {
    // Object.values() gives us an array of objects
    //console.log(Object.values(err.error))

    // get error messages from err object, by iterating over each object in the array of objects,
    // accessing the message in each object with map() and then joining them
    customError.msg = Object.values(err.errors).map((item) => item.message).join(',')
    customError.statusCode = 400
  }

  // to handle if email already exists/ duplication error
  if (err.code && err.code == 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please input another value`
    customError.statusCode = 400
  }

  //to handle error when user inputs non-existent job id
  if (err.name === 'CastError'){
    customError.msg = `No item found with id: ${err.value}`
    customError.statusCode = 404
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
