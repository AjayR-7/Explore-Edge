const express = require('express');
const router = express.Router();
const user = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveredirecturl } = require('../middleware.js');
const usercontroller =  require('../controllers/users.js');

//signup
router.get("/signup", usercontroller.rendersignupform);

router.post("/signup", wrapAsync(usercontroller.signup));

//login
router.get("/login", usercontroller.renderloginform);

router.post("/login", saveredirecturl,passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), usercontroller.login);

//logout
router.get("/logout" ,usercontroller.logout);

module.exports = router;
