const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const reviewModel = require("../models/review-model");
const validate = {};

/*  **********************************
 *  Review Data Validation Rules
 * ********************************* */
validate.reviewRules = () => {
  return [
    // review_text is required and must be string
    body("review_text")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Review text is required."),

    // review_rating is required and must be an integer between 1 and 5
    body("review_rating")
      .trim()
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be a number between 1 and 5."),
  ];
};

/* ******************************
 * Check data and return errors or continue
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { inv_id } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const vehicleData = await invModel.getInventoryByInvId(inv_id);
    if (!vehicleData) {
      return next({
        status: 404,
        message: "Sorry, we couldn't find that vehicle.",
      });
    }
    const vehicleDetail = await utilities.buildDetailGrid(vehicleData);
    const reviews = await reviewModel.getReviewsByInventoryId(inv_id);
    const reviewsHTML = await utilities.buildReviews(
      reviews,
      inv_id,
      res.locals.accountData
    );
    res.render("inventory/detail", {
      errors,
      title: vehicleData.inv_make + " " + vehicleData.inv_model,
      nav,
      grid: vehicleDetail,
      reviews: reviewsHTML,
      inv_id,
      review_text: req.body.review_text,
      review_rating: req.body.review_rating,
      messages: () => utilities.buildMessagesHTML(req),
    });
    return;
  }
  next();
};

/* ******************************
 * Check update data and return errors or continue
 * ***************************** */
validate.checkUpdateReviewData = async (req, res, next) => {
  const { review_id, review_text, review_rating } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    // Re-fetch original data to get vehicle info for the view
    const reviewData = await reviewModel.getReviewById(review_id);
    // Overwrite with user's submitted data to show their changes
    reviewData.review_text = review_text;
    reviewData.review_rating = review_rating;
    const view = await utilities.buildEditReviewForm(reviewData);
    res.render("./review/edit-review", {
      errors,
      title: "Edit Review",
      nav,
      view,
      messages: () => utilities.buildMessagesHTML(req),
    });
    return;
  }
  next();
};

module.exports = validate;
