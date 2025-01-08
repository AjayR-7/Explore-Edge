const express = require('express');
const router = express.Router();
const qwrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const {isloggedin,isowner,validateListing} = require("../middleware.js");
const listingcontroller = require("../controllers/listings.js");

//cloud storage (cloudinary)
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });



//Index Route
router.get("/", qwrapAsync(listingcontroller.index));
  
//New Route
router.get("/new", isloggedin ,listingcontroller.rendernewform);
  
//Show Route
router.get("/:id", qwrapAsync (listingcontroller.showlisting));

//Create Route
router.post("/" ,isloggedin,upload.single('listing[image]'), validateListing,qwrapAsync (listingcontroller.createlisting));

//Edit Route
router.get("/:id/edit",isloggedin,isowner, qwrapAsync(listingcontroller.editlisting));

//Update Route
router.put("/:id", isloggedin,isowner,upload.single('listing[image]') ,validateListing ,qwrapAsync(listingcontroller.updatelisting));

//Delete Route
router.delete("/:id", isloggedin,isowner,qwrapAsync(listingcontroller.deletelisting));


module.exports = router;