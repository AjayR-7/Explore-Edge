const user = require("../models/user.js");

//signup
module.exports.rendersignupform = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newuser = new user({ username, email });

    const registereduser = await user.register(newuser, password);
    req.login(registereduser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Explore Edge");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

//login

module.exports.renderloginform = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Explore Edge !  You are logged in");
  let redirecturl = res.locals.redirecturl || "/listings";
  res.redirect(redirecturl);
};

//logout

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are Logged Out !!");
    res.redirect("/listings");
  });
};
