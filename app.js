var express     = require("express"),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose');

mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

// Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);        
// Campground <==> db.campgrounds

// Campground.create(
//     {
//         name: "Granite Hill", 
//         image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         }else{
//             console.log("Newly Created Campground :");
//             console.log(campground);
//         }
//     }
// );




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
            res.render("campgrounds", {campgrounds: allCampgrounds});
        }
    });
})
// CREATE Route - Add a new campground "to the data base"
app.post("/campgrounds", (req,res) => {
    // get data from form and add that to campgrounds page
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
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

app.get("/campgrounds/:id", (req,res) => {
    res.send("This will be the Show page one day!");
})

app.listen(3000, () => {
    console.log("The YelpCamp Server has started!");
})