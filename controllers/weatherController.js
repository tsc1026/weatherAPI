const weather = require('./../models/weatherModel');
const AppError = require('../utils/appError');

class APIFeatures {
    //query: mongoose query obj, queryString: url path query string
    //只要new APIFeatures 物件, 就會自動執行此constructor function
    constructor(query, queryString){
        this.query = query; // query === Tour.find() 就是Mongoose Model 的 query object
        this.queryString = queryString; //queryString === req.query 就是 url path 上的 query parameters
        //console.log('this.query', this.query);
        //console.log('this.queryString', this.queryString);
    }
  
    filter(){
         const queryObj = {...this.queryString}; //...取出req.query內所有方法, 再放入{}中變成物件, 再指定給 queryObj, 這樣就不會動到原本的req.query 
         const excludedFields = ['page','sort','limit','fields']; //要去除之條件 
         excludedFields.forEach(el => delete queryObj[el]);//從queryObj中一一刪除這些條件
  
         //Advanced filtering
         let queryStr = JSON.stringify(queryObj);//把物件轉回JSON
         //get: greater than or equal, greater than, less than or equal, less than 
         queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

         this.query = this.query.find(JSON.parse(queryStr));
        
         return this; //回傳整個物件給 sort() 用
    }
  
    sort(){
        if(this.queryString.sort){ //如果url(query para)上有 sort關鍵字
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }else{
            this.query = this.query.sort('-createdAt');
        }
        return this; //回傳整個物件給下一個 funciton 用
    }
  
    limitFields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }else{
            this.query = this.query.select('-__v'); //排除__v 欄位
        }
        return this; //回傳整個物件給下一個 funciton 用
    }
  
    paginate(){
        //page=1&limit=10, page:目前在第幾頁, limit:一頁幾筆, page1:要顯示11-20的資料
        const page = this.queryString.page * 1 || 1;  //目前是第幾頁, *1 把將字串轉數字, 第二個數字是 default 表顯示第一頁之資料
        const limitPerPage = this.queryString.limit * 1 || 10; //每一頁顯示幾筆資料, *1將字串轉數字, 第二個數字是 default 表每頁顯示100筆資料
        const skipData = (page -1) * limitPerPage; //為了顯示目前頁數之資料, 計算要跳過多少筆資料
  
        this.query = this.query.skip(skipData).limit(limitPerPage);
  
        return this; //回傳整個物件給下一個 funciton 用
    }
}

exports.getNewestWeatherFromDB = async (req, res, next) => {
    try{
        const weatherFromdb = await weather.aggregate(
            [
                {
                    $group: 
                    {   
                        //$last 取最新
                        _id: '$location',
                        weatherStatus : { $last: '$weatherStatus' },
                        startTime : { $last: '$startTime' },
                        endTime : { $last: '$endTime' },
                    }
                },
                {
                    $addFields: { location: '$_id'}
                },
                {
                    $project: { _id: 0}
                }
            ]
        );

        res.status(200).json({
            status: 'success',
            dataLenght: weatherFromdb.length,
            data: weatherFromdb,
        })
    }
    catch(err){
        next(err);
    }
}

exports.getAllWeatherFromDB = async (req, res, next) => {
    try{
        const features = new APIFeatures(weather.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

        const AllWeatherDoc = await features.query;

        //throw new Error('something bad happened'); //testing globalErrorHandling

        res.status(200).json({
            status: 'success',
            dataLenght: AllWeatherDoc.length,
            data: {
              data: AllWeatherDoc
            }
        });

        
    }
    catch(err){
        next(err);
    }
}


