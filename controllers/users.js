const User = require("../models/user");

// Render the sign-up form
module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
};

// Handle user sign-up
module.exports.signUpUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/user/signup");
    }
};

// Render the login form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// Handle user login
module.exports.loginUser = async (req, res) => {
    req.flash("success", "Welcome to Wanderlust! You are logged in.");
    const redirectUrl = res.locals.redirectUrl || "/";
    res.redirect(redirectUrl);
};

// Handle user logout
module.exports.logout = (req, res,next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/");
    });
};
