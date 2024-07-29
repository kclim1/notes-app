const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-auth20");

passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: "https://www.example.com/oauth2/authorize",
      tokenURL: "https://www.example.com/oauth2/token",
      OATH_CLIENTID: process.env.OATH_CLIENTID,
      OATH_CLIENTSECRET: process.env.OATH_CLIENTSECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    function (profile, cb) {
      
    }
  )
);

//Google login route
router.get("/google/callback", passport.authenticate("oauth2"));

//Retrieve User data
router.get(
  "/google/callback",
  passport.authenticate("oauth2", {
    failureRedirect: "/login-failure",
    successRedirect: "dashboard",
  })
);

router.get('/login-failure',(req,res)=>{
    res.send("Something went wrong...")
})

module.exports = router;
