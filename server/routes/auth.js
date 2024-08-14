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

router.get("/log-in", mainController.login);
router.get("/sign-up", mainController.signup);

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



//local login 
router.post('/login', 
  passport.authenticate('local',(err,user,info)=>{
    try{
      if(err){
        console.error(error)
        return next(err)
      }
      if(!user){
        res.send('please create account')
        console.log('username not found')
      }
      res.redirect('/')
      console.log('successful login')
    }catch(error){
      console.error(error)
    }
  }))




//googleauth 



//github auth 



//serialize and deserealize 
passport.serializeUser((user,done)=>{
  try{
    console.log('serialize:' , user)
    done(null,user)
  }catch(error){
    console.error(error)
  }
})

passport.deserializeUser(async(id,done)=>{
  try{
    const user = await User.findById({id})
    done(null,user)
  }catch(error){
    console.error(error)
    done(error)
  }
})


//logout 

module.exports = router;
