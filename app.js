if (process.env.NODE_ENV != "Production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Expresserrors = require("./utils/expresserrors.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localstrategy = require("passport-local");
const User = require("./models/user.js");

// importing the routes
const listingsrouter = require("./routes/listing.js");
const reviewsrouter = require("./routes/review.js");
const userrouter = require("./routes/user.js");

// importing the db connection

//from our localmachine
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

//from atlas
const dburl = process.env.ATLAS_DB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dburl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const store = MongoStore.create({
  mongoUrl: dburl,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("error",() => {
  console.log("Error in the mongo secssion store" , err)
})

// session options (middleware for cookies coustomization)

const sessionoptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

// home page

//  app.get("/", (req, res) => {
//   res.render("users/home.ejs");
//  });



app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));

// to serialize and deserialize the user to the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curruser = req.user;
  next();
});

// adding the routes

app.use("/listings", listingsrouter);

app.use("/listings/:id/reviews", reviewsrouter);

app.use("/", userrouter);

// error handling middleware

app.all("*", (req, res, next) => {
  next(new Expresserrors(404, "Page not found !!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message } = err; // Default to 500 if statusCode is undefined
  res.status(statusCode).render("error.ejs", { err });
  // res.status(statusCode).send(message);
});

// connecting to the server

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
