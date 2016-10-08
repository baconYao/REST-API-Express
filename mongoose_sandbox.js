'use strict';


var mongoose = require("mongoose");


// sandbox is db name
mongoose.connect("mongodb://localhost:27017/sandbox");

var db = mongoose.connection;

db.on("error", function(err){
    console.log("connection error: ", err);
});

db.once("open", function(){
    console.log("db connection successful");
    // All database communication goes here

    var Schema = mongoose.Schema;
    var AnimalSchema = new Schema({
        type:  {type: String, default: "goldfish"},
        size:  String,
        color: {type: String, default: "golden"},
        mass:  {type: Number, default: 0.007},
        name:  {type: String, default: "Angela"}
    });

    // 在資料存進db前，先去給定size
    AnimalSchema.pre("save", function(next){
        if(this.mass >= 100)
        {
            this.size = "big";
        }
        else if(this.mass >= 5 && this.mass < 100)
        {
            this.size = "medium";
        }
        else
        {
            this.size = "small";
        }
        next();
    });

    // A static method can be called by a model object
    // An instance method can be called by a document object
    AnimalSchema.statics.findSize = function(size, callback){
        // this == Animal
        return this.find({size: size}, callback);
    }

    AnimalSchema.methods.findSameColor = function(callback){
        // this == document
        return this.model("Animal").find({color: this.color}, callback);
    }

    // create a "collection" which name is "animals"
    var Animal = mongoose.model("Animal", AnimalSchema);

    var elephant = new Animal({
        type: "elephant",
        color: "gray",
        mass: 6000,
        name: "Lawrance"
    });

    var animal = new Animal({});    //Goldfish

    var whale = new Animal({
        type: "whale",
        color: "gray",
        mass: 190500,
        name: "Fig"
    });

    var animalData = [
        {
            type: "mouse",
            color: "gray",
            mass: 0.035,
            name: "Marvin"
        },
        {
            type: "nutria",
            color: "brown",
            mass: 6.35,
            name: "Gretchen"
        },
        {
            type: "wolf",
            color: "gray",
            mass: 45,
            name: "Iris"
        },
        elephant,
        animal,
        whale
    ];

    // // save data to db
    // elephant.save(function(err){
    //     if(err)
    //     {
    //         console.log("Svae Failed.", err);
    //     }
    //     else
    //     {
    //         console.log("Saved!");
    //     }
    //     db.close(function(){
    //         console.log("db connection closed");
    //     });
    // });


    // // 將animals這個collection清空
    // Animal.remove({}, function(err){
    //     if(err)
    //     {
    //         console.err(err);
    //     }
    //     // 儲存資料到db
    //     Animal.create(animalData, function(err, animals){
    //         if(err)
    //         {
    //             console.err(err);
    //         }
    //         // {}:代表回傳全部的object data
    //         Animal.find({}, function(err, animals){
    //             animals.forEach(function(animal){
    //                 console.log(animal.name + " the " + animal.color + " " + animal.type + " is a " + animal.size + "-sized animal.");
    //             });
    //             db.close(function(){
    //                 console.log("db connection closed");
    //             });
    //         });
    //     });
    // });

    // // 將animals這個collection清空
    // Animal.remove({}, function(err){
    //     if(err)
    //     {
    //         console.err(err);
    //     }
    //     // 儲存資料到db
    //     Animal.create(animalData, function(err, animals){
    //         if(err)
    //         {
    //             console.err(err);
    //         }
    //         // 利用之前定義的statics來找尋size
    //         Animal.findSize("medium", function(err, animals){
    //             animals.forEach(function(animal){
    //                 console.log(animal.name + " the " + animal.color + " " + animal.type + " is a " + animal.size + "-sized animal.");
    //             });
    //             db.close(function(){
    //                 console.log("db connection closed");
    //             });
    //         });
    //     });
    // });

    // 將animals這個collection清空
    Animal.remove({}, function(err){
        if(err)
        {
            console.err(err);
        }
        // 儲存資料到db
        Animal.create(animalData, function(err, animals){
            if(err)
            {
                console.err(err);
            }
            // {type: "elephant"}:代表回傳elephant 類型的data
            Animal.findOne({type: "elephant"}, function(err, elephant){
                // 利用之前定義的instance method來找尋顏色與elephant相同的物件資料
                elephant.findSameColor(function(err, animals){
                    if(err)
                    {
                        console.err(err);
                    }
                    animals.forEach(function(animal){
                        console.log(animal.name + " the " + animal.color + " " + animal.type + " is a " + animal.size + "-sized animal.");
                    });
                    db.close(function(){
                        console.log("db connection closed");
                    });
                });
            });
        });
    });
});

