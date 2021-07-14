const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app');
const factory = require('./controllers/handlerFactory'); 


//messagesDB: db name
mongoose.connect(process.env.DATABASE)
.then(result =>{
    console.log('connecting to the db !');
})
.catch(err =>{
    console.log(err);
});

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);

  const GovAPIObj = new factory();

  //setInterval(GovAPIObj.getAllWeatherFromGov, 3000); 

  setInterval(GovAPIObj.getAllWeatherFromGov, 1000 * 60 * 60); 

});
