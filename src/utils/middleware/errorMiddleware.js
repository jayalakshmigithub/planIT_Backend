
const notFoundHandler = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};


const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
    });
};

export { notFoundHandler, errorHandler };
