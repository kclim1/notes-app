const dotenv = require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = 3000;
const path = require("path");
const mongooseConnect = require(path.join(__dirname, "server", "config", "db"));
const session = require("express-session");
const passport = require("passport");
const connectMongo = require("connect-mongo");
const user = require(path.join(__dirname, "server", "config", "db"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(expressLayouts);
app.set("layout", "./layouts/main"); // Ensure the layout path is correct
app.set("view engine", "ejs");

// Connect to the database
mongooseConnect(); 

// Set up session middleware before defining routes
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: connectMongo.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Define routes after session and passport setup
app.use("/", require("./server/routes/auth"));
app.use("/", require("./server/routes/index"));

// Wildcard to catch all other route params not defined
app.get("*", (req, res) => {
  res.status(404).render("page404");
  res.send("something went wrong");
});

// Runs app on port
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
