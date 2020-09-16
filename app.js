var express     = require("express"),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    Campground  = require('./models/campground'),
    seedDB      = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
    

app.get("/", (req,res) => {
    res.render("landing");
})
// INDEX Route - Display a list of all campgrounds
app.get("/campgrounds", (req,res) => {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
})
// CREATE Route - Add a new campground "to the data base"
app.post("/campgrounds", (req,res) => {
    // get data from form and add that to campgrounds page
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
    // Create a new campground and save it to database
    Campground.create(newCampground, function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            // redirect to the campgrounds page
            res.redirect('/campgrounds');
        }
    });
});
//NEW Route - Display a form to create a new campground via CREATE Route    
app.get("/campgrounds/new", (req,res) => {
    res.render('new');
});

// SHOW - shows more information about one campground
app.get("/campgrounds/:id", (req,res) => {
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec( (err, foundCampground) => {
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            // render show template of that campground
            res.render("show", {campground: foundCampground});
        }
    })
})

app.listen(3000, () => {
    console.log("The YelpCamp Server has started!");
})