var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require("./models/comment");

var data =[
    {
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7",
        description: "blah blah blah"
    },
    {
        name: "Willaim's Campground",
        image: "https://images.unsplash.com/photo-1496080174650-637e3f22fa03",
        description: "blah blah blah"
    },
    {
        name: "Mountain Hills",
        image: "https://images.unsplash.com/photo-1483381719261-6620dfa2d28a",
        description: "blah blah blah"
    }
];

function seedDB(){
    // Remove all campgrounds
    Campground.deleteMany({}, (err) => {
        if(err){
            console.log(err);
        }
        console.log("removed Campgrounds!");
        // add a few campgrounds 
        data.forEach( (seed) => {
            Campground.create(seed, (err,campground) => {
                if(err){
                    console.log(err);
                }else{
                    console.log("added a campground");
                    //create a comment
                    Comment.create({
                        text:"This place is great, but I wish there was Internet",
                        author: "Homer"
                    }, (err, comment) => {
                        if(err){
                            console.log(err);
                        }else{
                            campground.comments.push(comment);
                            campground.save();
                            console.log("created new comment")
                        }
                    });
                }
            })
        });
    });
}

module.exports = seedDB;