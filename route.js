'use strict';

var express = require('express');
var router = express.Router();

// GET /questions
// Route for questions collection
router.get('/', function(req, res){
    res.json({response: 'You sent me a GET request'});
});

// POST /questions
// Route for creating questions
router.post('/', function(req, res){
    res.json({
        response: 'You sent me a POST request',
        body: req.body
    });
});

// GET /questions/:qID
// Route for questions collection
router.get('/:qID', function(req, res){
    res.json({
        response: 'You sent me a GET request for ID ' + req.params.qID
    });
});


// POST /questions/:qID/answers
// Route for creating an answer
router.post('/:qID/answers', function(req, res){
    res.json({
        response: 'You sent me a POST request to /answers',
        questionID: req.params.qID,
        body: req.body
    });
});

// PUT /questions/:qID/answers/:aID
// Edit a specific answer
router.put('/:qID/answers/:aID', function(req, res){
    res.json({
        response: 'You sent me a PUT request to /answers',
        questionID: req.params.qID,
        answerID: req.params.aID,
        body: req.body
    });
});

// DELETE /questions/:qID/answers/:aID
// delete a specific answer
router.delete('/:qID/answers/:aID', function(req, res){
    res.json({
        response: 'You sent me a DELETE request to /answers',
        questionID: req.params.qID,
        answerID: req.params.aID,
    });
});


// POST /questions/:qID/answers/:aID/vote-up
// POST /questions/:qID/answers/:aID/vote-down
// Vote on a specific answer
router.post('/:qID/answers/:aID/vote-:dir', function(req, res, next){
    // 這是一個error handler的function(第二個function)
        // 有error發生
        if(req.params.dir.search(/^(up|down)$/) === -1)
        {
            var err = new Error("Not found!");
            err.status = 404;
            // 將request交給(err handler處理)
            next(err);
        } 
        else
        {
            // 沒有error發生，所以會傳給下一個handler(第三個function，也就是下一個function處理))
            next();
        }
    }, function(req, res){
        // 我是第三個function
        res.json({
            response: 'You sent me a POST request to /vote-' + req.params.dir,
            questionID: req.params.qID,
            answerID: req.params.aID,
            vote: req.params.dir
        });
});


module.exports = router;
