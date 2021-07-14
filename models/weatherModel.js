const mongoose = require('mongoose');

//schema
const weatherSchema = new mongoose.Schema(
    {
        location: {
            type: String,
            required: [true, 'must have a location']
        },
        startTime: {
            type: String,
            required: [true, 'must have a startTime']
        },
        endTime: {
            type: String,
            required: [true, 'must have a endTime']
        },
        weatherStatus: {
            type: String,
            required: [true, 'must have a weather Status']
        }
    }
)

const Weather = mongoose.model('Weather', weatherSchema);

module.exports = Weather;