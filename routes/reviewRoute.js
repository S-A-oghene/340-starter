// Needed Resources
const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities");
const regValidate = require("../utilities/review-validation");

// Route to add a new review
router.post(
  "/add",
  utilities.checkLogin,
  regValidate.reviewRules(),
  regValidate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
);

// Route to show edit review form
router.get(
  "/edit/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildEditReview)
);

// Route to process review update
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.reviewRules(),
  regValidate.checkUpdateReviewData,
  utilities.handleErrors(reviewController.updateReview)
);

// Route to show delete confirmation
router.get(
  "/delete/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildDeleteConfirm)
);

// Route to process review deletion

// Route to process review deletion
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.deleteReview)
);

module.exports = router;
