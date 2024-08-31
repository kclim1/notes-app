const path = require("path");
const mainController = require(path.join(__dirname, "..", "controllers", "mainController"));
const dashboardController = require(path.join(__dirname, "..", "controllers", "dashboardController"));
const express = require("express");
const User = require("../config/user.js");
const passport = require("passport");
const crypto = require("crypto");
const secret = crypto.randomBytes(64).toString("hex"); //console.log to generate random password if needed
const bcryptjs = require("bcryptjs");
const mongoose = require('mongoose')
const { body, validationResult } = require('express-validator');


exports.homepage = async (req,res)=>{
    try{
        const locals = {
            title : "notes app",
            description:"a full stack notes app"
        }
        res.render('index',locals)
    }catch(error){
        res.status(500).send('error while loading homepage')
    }
}


exports.pricing = async (req,res) =>{
    const locals = {
        title: "Pricing- Notes app ",
        description:"notes app that's hosted on AWS "
    }
    res.render('pricing',locals)
}

exports.reviews = async(req,res)=>{
    try{
        res.status(200).render('reviews')
    }catch(error){
        res.status(500).send("error loading reviews")
    }
}
// exports.page404 = async (req,res) =>{
//     res.status(404).render('page404')
// }
exports.page404 = async (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        // User is authenticated, render the authenticated 404 page
        res.status(404).render('authenticated404', {
            layout: 'layouts/dashboard' // Use the authenticated layout
        });
    } else {
        // User is not authenticated, render the regular 404 page
        res.status(404).render('page404');
    }
};


exports.login = async (req,res)=>{
    try{
        console.log('header login button hit')
        res.status(200).render('login')
    }catch(error){
        console.error(error)
        res.render('page404')
    }
}

exports.signup = (req, res) => {
    res.render('signup', {
      errors: [], // Pass an empty array if no errors
      data: {} // Initialize empty data object for inputs
    });
  };
  
  // Controller to handle signup logic
  exports.postSignUp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('signup', {
        errors: errors.array(),
        data: req.body 
      });
    }
    
    try {
      const { username, password, email, firstName, lastName } = req.body;
      if (!username || !password) {
        return res.status(400).send("Username and passwords are required");
      }
  
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        console.log('User already exists');
        return res.render('page404');
      } 
  
      // Hash password
      const hashedPassword = await bcryptjs.hash(password, 10);
  
      const newUser = new User({
        profileId: new mongoose.Types.ObjectId(),
        username,
        password: hashedPassword,
        email,
        givenName: firstName,
        familyName: lastName,
        dateCreated: Date.now(),
      });
      
      console.log(newUser);
      await newUser.save();
      res.redirect("/login");
      console.log("User created");
  
    } catch (error) {
      console.error('Error creating user:', error);
      res.render('page404'); 
    }
  };

  exports.postLogin = async (req, res, next) => {
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
  };


  exports.logout= (req,res,next)=>{
    req.logout((error)=>{
      if(error){
        return next(err)
      }
      req.session.destroy((error)=>{
        if(error){
          return next (error)
        }
        console.log('succesful logout')
        res.redirect('/')
      })
    })
  }