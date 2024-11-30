const express = require("express");
const passport = require("passport");

const Router = express.Router();

// Google authentication routes
Router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

Router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/profile", // Redirect after successful login
    failureRedirect: "/",        // Redirect if authentication fails
  })
);

// Local login route
Router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile"); // Already logged in, redirect to profile
  }
  res.render("login", { error: req.flash("error") }); // Render login page with flash error messages
});

Router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err); // Handle any errors during authentication
    }
    if (!user) {
      req.flash("error", "Invalid credentials");
      return res.redirect("/login"); // Redirect back to login page if authentication fails
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err); // Handle any errors during login
      }
      res.redirect("/profile"); // Redirect to profile page after successful login
    });
  })(req, res, next);
});

// Logout route
Router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err); // Handle any errors during logout
    }
    res.redirect("/"); // Redirect to home page after logout
  });
});

module.exports = Router;
