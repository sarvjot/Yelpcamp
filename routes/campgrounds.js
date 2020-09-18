var express = require("express"),
  router = express.Router(),
  Campground = require("../models/campground");

// INDEX Route - Display a list of all campgrounds
router.get("/", (req, res) => {
  // Get all campgrounds from DB
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
    }
  });
});

// CREATE Route - Add a new campground "to the data base"
router.post("/", isLoggedIn, (req, res) => {
  // get data from form and add that to campgrounds page
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = { name: name, image: image, description: description, author: author};
  // Create a new campground and save it to database
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      // redirect to the campgrounds page
      res.redirect("/campgrounds");
    }
  });
});

//NEW Route - Display a form to create a new campground via CREATE Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("../views/campgrounds/new");
});

// SHOW - shows more information about one campground
router.get("/:id", (req, res) => {
  //find the campground with provided id
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        console.log(foundCampground);
        // render show template of that campground
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

//Edit Campground route
router.get("/:id/edit", (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if(err){
      res.redirect("/campgrounds");
    }else{
      res.render("campgrounds/edit",{campground: foundCampground});
    }
  })
});
//Update Campground route
router.put("/:id", (req, res) => {
  // find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    if(err){
      res.redirect("/campgrounds");
    }else{
      res.redirect("/campgrounds/"+req.params.id);
    }
  })
  // redirect somewhere
})

// Destroy Campground Route
router.delete("/:id", (req,res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if(err){
      res.redirect("/campgrounds");
    }else{
      res.redirect("/campgrounds");
    }
  })
})

// Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
