const review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

//reviews post review Route
module.exports.createreview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newreview = new review(req.body.review);
  newreview.author = req.user._id;

  listing.reviews.push(newreview);
  await newreview.save();
  await listing.save();
  req.flash("success", "Successfully made a new Review !");
  res.redirect(`/listings/${listing._id}`);
};

// reviews delete review Route
module.exports.deletereview = async (req, res) => {
  let { id, reviewid } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  await review.findByIdAndDelete(reviewid);
  req.flash("success", "Review Deleted !");
  res.redirect(`/listings/${id}`);
};
