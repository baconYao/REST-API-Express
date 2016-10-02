'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');


var routes = require('./route.js');


var app = express();

// 載入日誌中介軟體
app.use(logger('dev'));
// 載入解析json的中介軟體
app.use(bodyParser.json());

// 路由控制
app.use('/questions', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next){
    var err = new Error("Not Found!");
    err.status = 404;
    // 將request交給(Error handler處理)
    next(err);
});

// Error handler
// 有第一個err(這樣就會有四個參數)可讓express知道這是一個error handler，而不是一個middleware(三個參數)
app.use(function(err, req, res, next){
    // 若有設定狀態就用，沒有的話就顯示500
    res.status(err.status || 500);
    // 傳一個json格式的error message到用戶端
    res.json({
        error: {
            message: err.message
        }
    });
});


var port = process.env.PORT || 3000;

app.listen(port, function(){
    console.log("Express server is listening on port", port);
});
