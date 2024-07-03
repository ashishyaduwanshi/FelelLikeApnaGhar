const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage });


// Route for displaying all listings and creating a new listing
router.route("/")
    .get(wrapAsync(listingController.index)) // Display all listings
    .post(isLoggedIn, upload.single("listing[image][url]"), wrapAsync(listingController.createNewListing));


// Render form to create a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);
// Route for displaying, updating, and deleting a specific listing
router.route("/:id")
    .get(wrapAsync(listingController.showListing)) // Display details of a specific listing
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing)) // Update a specific listing
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)); // Delete a specific listing


// Render form to edit details of a specific listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;
