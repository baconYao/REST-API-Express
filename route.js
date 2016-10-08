'use strict';

var express = require('express');
var router = express.Router();

var Question = require("./models").Question;

// provide a documnet to routes its ID in a URL parameter
router.param("qID", function(req, res, next, id){
    Question.findById(id, function(err, doc){
        if(err)
        {
            return next(err);
        }
        if(!doc)
        {
            err = new Error("Not Found");
            err.status = 404;
            return next(err);
        }
        req.question = doc;
        return next();
    });
});

router.param("aID", function(req, res, next, id){
    req.answer = req.question.answers.id(id);
    if(!req.answer)
    {
        err = new Error("Not Found");
        err.status = 404;
        return next(err);
    }
    next();
});

// GET /questions
// Route for questions collection
router.get('/', function(req, res, next){
    // To get all documents from a collection , we can pass {} to the first parameter of the find query
    Question.find({})
                .sort({createdAt: -1})
                .exec(function(err, questions){     //執行query和callback function
                    if(err)
                    {
                        return next(err);
                    }
                    res.json(questions);
                });
});

// POST /questions
// Route for creating questions
router.post('/', function(req, res, next){
    var question = new Question(req.body);
    question.save(function(err, question){
        if(err)
        {
            return next(err);
        }
        res.status(201);
        res.json(question);
    });
});

// GET /questions/:qID
// Route for questions collection
router.get('/:qID', function(req, res, next){
    res.json(req.question);
});


// POST /questions/:qID/answers
// Route for creating an answer
router.post('/:qID/answers', function(req, res, next){
    req.question.answers.push(req.body);
    req.question.save(function(err, question){
        if(err)
        {
            return next(err);
        }
        res.status(201);
        res.json(question);
    });
});

// PUT /questions/:qID/answers/:aID
// Edit a specific answer
router.put('/:qID/answers/:aID', function(req, res){
    req.answer.update(req.body, function(err, result){
        if(err)
        {
            return next(err);
        }
        res.json(result);
    });
});

// DELETE /questions/:qID/answers/:aID
// delete a specific answer
router.delete('/:qID/answers/:aID', function(req, res){
    req.answer.remove(function(err){
        req.question.save(function(err, question){
            if(err)
            {
                return next(err);
            }
            res.json(question);
        });
    });
});


// POST /questions/:qID/answers/:aID/vote-up
// POST /questions/:qID/answers/:aID/vote-down
// Vote on a specific answer
router.post('/:qID/answers/:aID/vote-:dir', 
    function(req, res, next){
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
            req.vote = req.params.dir;
            // 沒有error發生，所以會傳給下一個handler(第三個function，也就是下一個function處理))
            next();
        }
    }, 
    function(req, res, next){
    // 我是第三個callback function
        req.answer.vote(req.vote, function(err, question){
            if(err)
            {
                return next(err);
                res.json(question);
            }
        });
});


module.exports = router;
