var express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../models/user");

// Root Route
router.get("/", (req, res) => {
  res.render("landing");
});

//==================================
// AUTH ROUTES
//==================================

// Register form Route
router.get("/register", (req, res) => {
  res.render("register");
});
// handle sign up logic
router.post("/register", (req, res) => {
  var newUser = new User({ username: req.body.username });

  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "Welcome to Yelpcamp " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

// Login form Route
router.get("/login", (req, res) => {
  res.render("Login");
});
// Login logic Route
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

// Logout Route
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged You Out!")
  res.redirect("/campgrounds");
});

module.exports = router;
