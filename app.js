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

var mongoose = require('mongoose');

// qa is db name
mongoose.connect("mongodb://localhost:27017/qa");

var db = mongoose.connection;

db.on("error", function(err){
    console.log("connection error: ", err);
});

db.once("open", function(){
    console.log("db connection successful");
});

app.use(function(req , res, next){
    // restrict domains which the API can response to
    // This case means ti's ok to make request to this API from any domain
    res.header("Access-Control-Allow-Origin", "*");
    // field name tells the client which headers are permitted in their request
    res.header("Access-Control-Allow-Headers", "Orign, X-Requested-With, Content-Type, Accept");
    // pre-flight requests come in with the http method called options
    if(req.method === "OPTIONS")
    {   
        res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE");
        return res.status(200).jsonP({});
    }
    next()
});

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
