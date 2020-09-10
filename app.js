var express = require("express");
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));``
app.set("view engine","ejs");


var campgrounds = [
    {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Granite Hill", image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Mountain Goat's Rest", image: "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"}
];


app.get("/", (req,res) => {
    res.render("landing");
})
app.get("/campgrounds", (req,res) => {

    res.render("campgrounds", {campgrounds: campgrounds});
})

app.post("/campgrounds", (req,res) => {
    
    // get data from form and add that to campgrounds page
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    // redirect to the campgrounds page
    res.redirect("/campgrounds")
});

app.get("/campgrounds/new", (req,res) => {
    res.render('new');
});
app.listen(3000, () => {
    console.log("The YelpCamp Server has started!");
})