const express = require('express');
const weatherRouter = require('./routes/weatherRoutes');
const app = express();
const AppError = require('./utils/appError');
const globalErrorController = require('./controllers/errorController');
const compression = require('compression');

//routes
app.use('/api/v1/weather', weatherRouter);

//handling unexisted routes
app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404))
});

app.use(globalErrorController);

app.use(compression()); //壓縮傳回給 client side 文字

module.exports = app;


