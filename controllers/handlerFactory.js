const request = require('request');
const weather = require('./../models/weatherModel');

//每小時抓取三縣市資料並存入db
module.exports = class GovAPI{
  getAllWeatherFromGov(){
    //台北 新北 桃園
    const locations = ['%E8%87%BA%E5%8C%97%E5%B8%82', '%E6%96%B0%E5%8C%97%E5%B8%82', '%E6%A1%83%E5%9C%92%E5%B8%82'];
    try{
      locations.map(location => {
        //console.log('https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-87CEFFCA-8985-4DCB-BDAA-0BAABBF26E29&format=JSON&locationName='+ location +'&elementName=');
        request('https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-87CEFFCA-8985-4DCB-BDAA-0BAABBF26E29&format=JSON&locationName='+ location +'&elementName=', 
        async function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const obj = JSON.parse(body);
                const counterForTimePeriod = obj['records']['location'][0]['weatherElement'][0]['time'].length; //記錄不同時段
                const location = obj['records']['location'][0]['locationName'];

                //insert weathers to db
                for(let i=0; i<counterForTimePeriod; i++){
                    const startTime = obj['records']['location'][0]['weatherElement'][0]['time'][i]['startTime'];
                    const endTime = obj['records']['location'][0]['weatherElement'][0]['time'][i]['endTime'];
                    const weatherStatus = obj['records']['location'][0]['weatherElement'][0]['time'][i]['parameter']['parameterName'];
                    
                    
                    console.log(location) // Print the google web page.
                    console.log(startTime) // Print the google web page.
                    console.log(endTime) // Print the google web page.
                    console.log(weatherStatus) // Print the google web page.
                    

                    const testWeather = new weather({
                        location: location,
                        startTime: startTime,
                        endTime: endTime,
                        weatherStatus: weatherStatus,
                    })
                    const doc = await testWeather.save();
                }
            }else{
              return console.error('something when wrong when getting data from gov api');
            }
        })
      })  
    }
    catch(err){
      next(err);
    }
  }
}



