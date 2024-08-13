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

//importing index.js from routes folder
app.use("/", require("./server/routes/auth"));
app.use("/", require("./server/routes/index"));
app.use(express.urlencoded({ extended: true }));

mongooseConnect(); //connects to database

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: connectMongo.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

//wildcard to catch all other route params not defined
app.get("*", (req, res) => {
  res.status(404).render("page404");
  res.send("something went wrong");
});

//runs app on port
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
