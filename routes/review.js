const express = require('express');
const router = express.Router({mergeParams : true});
const qwrapAsync = require("../utils/wrapAsync");
const Expresserrors = require("../utils/expresserrors.js");
const wrapAsync = require("../utils/wrapAsync");
const {validatrreview,isloggedin,isreviewauthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js")

//reviews post review Route
router.post("/" , isloggedin,validatrreview, wrapAsync(reviewController.createreview));
  
// reviews delete review Route
router.delete("/:reviewid" ,isloggedin,isreviewauthor, wrapAsync(reviewController.deletereview));
  
module.exports = router;