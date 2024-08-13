const mainController = require("../controllers/mainController");
const dashboardController = require("../controllers/dashboardController");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const path = require("path");
const connectMongo = require("connect-mongo");
const googleStrategy = require("passport-google-oauth20").Strategy;
const localStrategy = require("passport-local").Strategy;
const githubStrategy = require("passport-github2").Strategy;
const session = require("express-session");
const crypto = require("crypto");
const secret = crypto.randomBytes(64).toString("hex");


router.get('/log-in',mainController.login)
router.get('/sign-up',mainController.signup)





module.exports = router;
