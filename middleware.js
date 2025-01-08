const Listing = require("./models/listing");
const Review = require("./models/reviews");
const { listingschema, reviewschema } = require("./schema.js");
const Expresserrors = require("./utils/expresserrors.js");

module.exports.isloggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirecturl = req.originalUrl;
    req.flash("error", "You must be Signed in to Create or Delete a Listing !");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveredirecturl = (req, res, next) => {
  if (req.session.redirecturl) {
    res.locals.redirecturl = req.session.redirecturl;
  }
  next();
};

module.exports.isowner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.curruser._id)) {
    req.flash("error", "You are not authorized to do that !");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingschema.validate(req.body);

  if (error) {
    let errormessage = error.details.map((el) => el.message).join(",");
    throw new Expresserrors(400, errormessage);
  } else {
    next();
  }
};

module.exports.validatrreview = (req, res, next) => {
  let { error } = reviewschema.validate(req.body);

  if (error) {
    let errormessage = error.details.map((el) => el.message).join(",");
    throw new Expresserrors(400, errormessage);
  } else {
    next();
  }
};

module.exports.isreviewauthor = async (req, res, next) => {
  let { id, reviewid } = req.params;
  let review = await Review.findById(reviewid);
  if (!review.author._id.equals(res.locals.curruser._id)) {
    req.flash("error", "You are not authorized to do that !");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
