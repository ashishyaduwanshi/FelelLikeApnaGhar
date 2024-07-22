if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/expressError");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const userRouter = require("./routes/user");
const searchRouter = require('./routes/search');

const app = express();

const dbUrl = process.env.ATLASDB_URL;

main() 
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.error("Error connecting to DB:", err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser());

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});
store.on("error", (err) => {
    console.log("error in mongo session store", err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/search", searchRouter); // Place /search route before /:id routes
app.use("/user", userRouter);
app.use("/", listingsRouter); // Use root instead of /listings
app.use("/:id/reviews", reviewsRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { err });
});

app.listen(8080, () => {
    console.log("App is listening on port 8080");
});
