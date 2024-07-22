// In routes/user.js
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users");

// Route for user sign-up
router.route("/signup")
    .get(userController.renderSignUpForm) // Render sign-up form
    .post(wrapAsync(userController.signUpUser)); // Handle user sign-up

// Route for user login
router.route("/login")
    .get(userController.renderLoginForm) // Render login form
    .post(
        saveRedirectUrl,
        passport.authenticate("local", { failureRedirect: "/user/login", failureFlash: true }),
        userController.loginUser
    ); // Handle user login

// Handle user logout
router.get("/logout", userController.logout);

module.exports = router;
