const request = require('request');
const AppError = require('./../utils/appError');

exports.protect = async (req, res, next) => {
    try{
        let token = '';

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
    
        if(token.length === 0){
            return next(new AppError('You sould enter your token!', 401));
        }

        request('https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization='+token, 
        async function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const obj = JSON.parse(body);
                const result = obj['success']; //讀取gov回傳的狀態, success === true 代表 token 合法
                
                if(result === 'true')
                    next(); 
            }else{
                console.log('Invalid Token');
                return next(new AppError('You sould use a valid token!', 401));
            }
        })
    }
    catch(err){
        next(err);
    }
};