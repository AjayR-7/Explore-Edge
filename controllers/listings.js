const Listing = require("../models/listing");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: mapToken });

//index route

module.exports.index = async (req, res) => {
  try {
    const allListings = await Listing.find({});
    //console.log(allListings); // Log the fetched listings to the console
    res.render("listings/index.ejs", { allListings }); // Render the view and pass the listings
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).send("Internal Server Error");
  }
};

//new route

module.exports.rendernewform = (req, res) => {
  res.render("listings/new.ejs");
};

//show route

module.exports.showlisting = async (req, res) => {
  let { id } = req.params;
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(400).send("Invalid ID format");
  // }
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing u requested doesent exist !!");
    res.redirect("/listings");
  }
  console.log("The listing are  : ", listing);
  res.render("listings/show.ejs", { listing });
};

// create route
module.exports.createlisting = async (req, res, next) => {

  let response = await geocodingClient.forwardGeocode({ 
    query: req.body.listing.location,
    limit: 1
  })
    .send();



  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url,filename};
  //coorrdinates
  newListing.geometry = response.body.features[0].geometry;
  let savedlisting = await newListing.save();
  console.log("The ssaved listing :",savedlisting);
  req.flash("success", "Successfully made a new listing!");
  res.redirect("/listings");
};

//Edit Route
module.exports.editlisting = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing u requested doesent exist !!");
    res.redirect("/listings");
  }
  // blues the original image url
  let originalimageurl = listing.image.url;
  originalimageurl = originalimageurl.replace("/upload", "/upload/w_250,c_thumb");
  res.render("listings/edit.ejs", { listing ,originalimageurl});
};

//Update Route
module.exports.updatelisting = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if(typeof req.file !== "undefined") {
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url,filename};
  await listing.save();
  }

  req.flash("success", "listing Updated !");
  res.redirect(`/listings/${id}`);
};

//delete route
module.exports.deletelisting = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(" The deleated listing : ",deletedListing);
  req.flash("success", " listing Deleted!");
  res.redirect("/listings");
};
