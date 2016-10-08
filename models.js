'use strict';

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var sortAnswers = function(a, b){
    // - negative a before b
    // 0 no change
    // + positive a after b
    if(a.votes === b.votes)
    {
        return b.updateAt - a.updateAt;
    }
    return b.votes - a.votes;
};

var AnswersSchema = new Schema({
    text: String,
    createdAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now},
    votes: {type: Number, default: 0}
});

// 建立instance method
// === AnswresSchema.methods.update = function(updates, callback){};
AnswersSchema.method("update", function(updates, callback){
    // merge the updates into the answer document
    Object.assign(this, updates, {updateAt: new Date()});
    // save the parent document, means that the question associated with the answer
    this.parent().save(callback);
});

AnswersSchema.method("vote", function(vote, callback){
    if(vote === "up")
    {   
        this.votes += 1;
    }
    else
    {
        this.votes -= 1;
    }
    this.parent().save(callback);
});

var QuestionSchema = new Schema({
    text: String,
    createdAt: {type: Date, default: Date.now},
    answers: [AnswersSchema]
});

// 在儲存之前，先做sort
QuestionSchema.pre("save", function(next){
    // call自定義好的sortAnswres function
    this.answers.sort(sortAnswers);
    next();
});


// create a "collection" which name is "questions"
var Question = mongoose.model("Question", QuestionSchema);

module.exports.Question = Question;
