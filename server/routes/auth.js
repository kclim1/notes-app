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



function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log('user not authenticated.redirected to login')
  res.redirect('/login');
}


router.get("/login", mainController.login);
router.get("/sign-up", mainController.signup);
router.get("/dashboard/note/add",ensureAuthenticated, dashboardController.addNotePage);
router.post("/dashboard/note/add",ensureAuthenticated, dashboardController.addNote);
router.get("/dashboard/notes",ensureAuthenticated, dashboardController.notes); //done 
router.get("/dashboard/notes/:id",ensureAuthenticated, dashboardController.editNote); //redirect them to addnote page and allow editing 
router.post('/dashboard/notes/:id',ensureAuthenticated, dashboardController.updateNote)
router.delete('/dashboard/notes/:id/delete', ensureAuthenticated, dashboardController.deleteNote);

// router.get('*', ensureAuthenticated, dashboardController.authenticated404);


//googleauth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
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
//googleauth

//sign up
router.post("/sign-up", async (req, res) => {
  try {
    const { username, password, email, firstName, lastName  } = req.body;
    if (!username || !password) {
      return res.status(400).send("Username and passwords are required");
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('page404');
    } else {
      //hash password
      const hashedPassword = await bcryptjs.hash(password, 10);

      const newUser = new User({
        profileId : new mongoose.Types.ObjectId(),
        username,
        password: hashedPassword,
        email,
        givenName: firstName,
        familyName: lastName,
        dateCreated: Date.now(),
      });
      console.log(newUser)
      await newUser.save();
      res.redirect("/login")
      console.log("user created");
    }
  } catch (error) {
    res.render('page404')
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
      return done(err)
    }
  })
);

//local login
router.post("/log-in", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    try {
      if (err) {
        console.error(err);
        res.redirect('/page404')
        return next(err);
      }
      if (!user) {
        console.log("username not found");
        return res.redirect('/page404')
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error(err);
          return res.redirect('/page404');
        }
        console.log("successful login");
        res.redirect("/dashboard");
      });
    } catch (error) {
      res.redirect('/page404')
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
        console.log('github' , profile)
        let githubUser = await User.findOne({ profileId: profile.id });
        if (!githubUser) {
          githubUser = await User.create({
            profileId: profile.id,
            username: profile.username,
            displayName:profile.displayName,
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

router.get('/dashboard', ensureAuthenticated, dashboardController.dashboard);


module.exports = router;
