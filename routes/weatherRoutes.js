const express = require('express');
const weatherController =  require('./../controllers/weatherController');
const authController = require('./../controllers/authController');

const weatherRouter = express.Router();

//token protection
weatherRouter.use(authController.protect);

//撈出三縣市最新天氣狀況
weatherRouter.route('/')
    .get(weatherController.getNewestWeatherFromDB);

//撈出三縣市所有的天氣狀況
weatherRouter.route('/AllWeather')
    .get(weatherController.getAllWeatherFromDB);

module.exports = weatherRouter;
