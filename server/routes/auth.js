const mainController = require("../controllers/mainController");
const dashboardController = require("../controllers/dashboardController");
const express = require("express");
const path = require("path");
const router = express.Router();
const User = require("../config/user.js");
const passport = require("passport");
const connectMongo = require("connect-mongo");
const googleStrategy = require("passport-google-oauth20").Strategy;
const localStrategy = require("passport-local").Strategy;
const githubStrategy = require("passport-github2").Strategy;
const session = require("express-session");
const crypto = require("crypto");
const secret = crypto.randomBytes(64).toString("hex");
const bcryptjs = require("bcryptjs");

router.get("/login", mainController.login);
router.get("/sign-up", mainController.signup);

//googleauth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect('/dashboard');
    console.log("google logged in ");
  }
);

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        let googleUser = await User.findOne({ googleId: profile.id });
        console.log("google profile :", profile);
        if (!googleUser) {
          googleUser = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            familyName: profile.name.familyName,
            givenName: profile.name.givenName,
            loginTime: Date.now(),
          });
        }
        cb(null, googleUser);
      } catch (error) {
        console.error(error);
        cb(error);
      }
    }
  )
);
//googleauth

//sign up
router.post("/sign-up", async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password) {
      return res.status(400).send("Username and passwords are required");
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("username already exists");
    } else {
      //hash password
      const hashedPassword = await bcryptjs.hash(password, 10);

      const newUser = new User({
        username,
        password: hashedPassword,
        email,
        givenName: firstName,
        familyName: lastName,
        dateCreated: Date.now(),
      });
      await newUser.save();
      res.status(201).send("user created");
      console.log("user created");
    }
  } catch (error) {
    res.status(500).send("error creating user");
    console.error(error);
    console.log("not created");
  }
});
//sign up

//local
passport.use(
  new localStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcryptjs.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "try again" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

//local login
router.post("/log-in", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    try {
      if (err) {
        console.error(err);
        return next(err);
      }
      if (!user) {
        res.send("please create account");
        console.log("username not found");
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error(err);
          return next(err);
        }
        console.log("successful login");
        res.redirect("/dashboard");
      });
    } catch (error) {
      console.error(error);
      return next(error); // Added return next to pass the error to the next middleware
    }
  })(req, res, next); // Ensure the authenticate function is invoked correctly
});
//local

//github auth

router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log("github login success");
    res.redirect('/dashboard')
  }
);

passport.use(
  new githubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let githubUser = await User.findOne({ githubId: profile.id });
        if (!githubUser) {
          githubUser = await User.create({
            githubId: profile.id,
            username: profile.username,
            githubUrl: profile.profileUrl,
          });
        }
        done(null,githubUser) 
      } catch (error) {
        console.error(error);
        done(error);
      }
    }
  )
);

//serialize and deserealize
passport.serializeUser((user, done) => {
  try {
    console.log("serialize:", user);
    done(null, user);
  } catch (error) {
    console.error(error);
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error(error);
    done(error);
  }
});

//logout
router.get('/log-out',(req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next(err)
    }
    req.session.destroy((err)=>{
      if(err){
        return next (err)
      }
      res.redirect('/')
    })
  })
})



module.exports = router;
