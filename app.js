var express     = require("express"),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    Campground  = require('./models/campground'),
    Comment     = require('./models/comment'),
    seedDB      = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
    

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
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
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
            res.render("campgrounds/show", {campground: foundCampground});
        }
    })
})
//============================================
// COMMENT ROUTES
//============================================
 
app.get('/campgrounds/:id/comments/new', (req,res) => {
    // find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
})

app.post("/campgrounds/:id/comments", (req,res) => {
    //lookup campground using ID
    Campground.findById(req.params.id, (err,campground) => {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            //create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    console.log(err);
                }else{
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect campground show page
                    res.redirect("/campgrounds/"+campground._id)
                }
            })
        }
    })
})

app.listen(3000, () => {
    console.log("The YelpCamp Server has started!");
})