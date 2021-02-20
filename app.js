const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
// flash & session to display a successful flash message after login
const flash = require("connect-flash");
const session = require("express-session");
// Passport authentication
const passport = require("passport");

// Read env file
require('dotenv').config();


const app = express();

// Passport config
require("./config/passport.js")(passport);

// DB config
const db = process.env.mongoURI;

// Connect to Mongodb
mongoose
  .connect('mongodb+srv://larryolguin:CSPlol86753099@test-cluster1.j3x0i.gcp.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

// add custom style sheet
app.use(express.static(__dirname + "/public"));

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// BodyParser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
