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
const mongoose = require('mongoose')
const { body, validationResult } = require('express-validator');



function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log('user not authenticated.redirected to login')
  res.redirect('/login');
}


// Authentication routes
router.get("/sign-up", mainController.signup);
router.post(
  '/sign-up',
  [
    body('username')
      .isLength({ min: 6 })
      .withMessage('Username must be at least 6 characters long'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address'),
    body('firstName')
      .notEmpty()
      .withMessage('First Name is required'),
    body('lastName')
      .notEmpty()
      .withMessage('Last Name is required')
  ],
  mainController.postSignUp
);
router.get("/login", mainController.login);
router.post("/log-in", mainController.postLogin);
router.get('/log-out',mainController.logout)
// Dashboard routes
router.get('/dashboard', ensureAuthenticated, dashboardController.dashboard);

// Note-related routes
router.get("/dashboard/notes", ensureAuthenticated, dashboardController.notes); 
router.get("/dashboard/note/add", ensureAuthenticated, dashboardController.addNotePage); 
router.post("/dashboard/note/add", ensureAuthenticated, dashboardController.addNote); 
router.get("/dashboard/notes/:id", ensureAuthenticated, dashboardController.viewNote); 
router.post('/dashboard/notes/:id', ensureAuthenticated, dashboardController.updateNote); 
router.delete('/dashboard/notes/:id/delete', ensureAuthenticated, dashboardController.deleteNote); 
router.post('/dashboard/notes/:id/share', ensureAuthenticated, dashboardController.shareNote);


//strategies below 

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        let googleUser = await User.findOne({ profileId : profile.id });
        console.log("google profile :", profile);
        if (!googleUser) {
          googleUser = await User.create({
            profileId: profile.id,
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
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect('/dashboard');
    console.log("google logged in ");
  }
);

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
      return done(err)
    }
  })
);


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
      callbackURL: process.env.GITHUB_CALLBACK_URI, //set the value in env 
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        console.log('github' , profile)
        let githubUser = await User.findOne({ profileId: profile.id });
        if (!githubUser) {
          githubUser = await User.create({
            profileId: profile.id,
            username: profile.username,
            displayName:profile.displayName,
            githubUrl: profile.profileUrl,
            email : profile.email
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



module.exports = router;
