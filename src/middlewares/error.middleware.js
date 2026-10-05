const errorMiddleware = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = error.statusCode || error.status || 500;

  if (
    error.name === "ValidationError" ||
    error.name === "CastError"
  ) {
    statusCode = 400;
  }

  if (error.code === 11000) {
    statusCode = 409;
  }

  let message = error.message || "Ocurrió un error";

  if (statusCode === 500) {
    message = "Error interno del servidor";
    console.error(error);
  }

  if (error.code === 11000) {
    message = "Ya existe un registro con esos datos";
  }

  return res.status(statusCode).json({
    status: "error",
    message,
  });
};

export default errorMiddleware;
