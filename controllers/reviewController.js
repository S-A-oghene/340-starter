const reviewModel = require("../models/review-model");
const utilities = require("../utilities/");
const invModel = require("../models/inventory-model");

const reviewController = {};

/* ***************************
 *  Process new review
 * ************************** */
reviewController.addReview = async function (req, res) {
  let nav = await utilities.getNav();
  const { review_text, review_rating, inv_id } = req.body;
  const account_id = res.locals.accountData.account_id; // Get from logged-in user data
  const reviewResult = await reviewModel.addReview(
    review_text,
    review_rating,
    inv_id,
    account_id
  );

  if (reviewResult.rowCount) {
    req.flash("notice", `Your review has been posted.`);
    res.redirect(`/inv/detail/${inv_id}`);
  } else {
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

    req.flash("notice", "Sorry, the review could not be posted.");
    res.status(501).render("./inventory/detail", {
      title: vehicleData.inv_make + " " + vehicleData.inv_model,
      nav,
      grid: vehicleDetail,
      reviews: reviewsHTML,
      errors: null,
      inv_id,
      messages: () => utilities.buildMessagesHTML(req),
    });
  }
};

/* ***************************
 *  Build edit review view
 * ************************** */
reviewController.buildEditReview = async function (req, res, next) {
  const review_id = parseInt(req.params.review_id);
  let nav = await utilities.getNav();
  const reviewData = await reviewModel.getReviewById(review_id);

  // Authorization Check
  if (
    reviewData.account_id !== res.locals.accountData.account_id &&
    res.locals.accountData.account_type !== "Admin"
  ) {
    req.flash("notice", "You are not authorized to edit this review.");
    return res.redirect("/account/");
  }

  const view = await utilities.buildEditReviewForm(reviewData);
  res.render("./review/edit-review", {
    title: "Edit Review",
    nav,
    view,
    errors: null,
    messages: () => utilities.buildMessagesHTML(req),
  });
};

/* ***************************
 *  Process review update
 * ************************** */
reviewController.updateReview = async function (req, res, next) {
  const { review_id, review_text, review_rating } = req.body;

  // Authorization Check before updating
  const reviewDataForAuth = await reviewModel.getReviewById(review_id);
  if (
    reviewDataForAuth.account_id !== res.locals.accountData.account_id &&
    res.locals.accountData.account_type !== "Admin"
  ) {
    req.flash("notice", "You are not authorized to perform this action.");
    return res.redirect("/account/");
  }

  const updateResult = await reviewModel.updateReview(
    review_id,
    review_text,
    review_rating
  );

  if (updateResult) {
    req.flash("notice", "The review was successfully updated.");
    res.redirect("/account/");
  } else {
    let nav = await utilities.getNav();
    // Re-fetch original data to get vehicle info for the view
    const reviewData = await reviewModel.getReviewById(review_id);
    // Overwrite with user's submitted data to show their changes
    reviewData.review_text = review_text;
    reviewData.review_rating = review_rating;
    const view = await utilities.buildEditReviewForm(reviewData);
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("./review/edit-review", {
      title: "Edit Review",
      nav,
      view,
      errors: null,
      messages: () => utilities.buildMessagesHTML(req),
    });
  }
};

/* ***************************
 *  Build delete confirmation view
 * ************************** */
reviewController.buildDeleteConfirm = async function (req, res, next) {
  const review_id = parseInt(req.params.review_id);
  let nav = await utilities.getNav();
  const reviewData = await reviewModel.getReviewById(review_id);

  // Authorization Check
  if (
    reviewData.account_id !== res.locals.accountData.account_id &&
    res.locals.accountData.account_type !== "Admin"
  ) {
    req.flash("notice", "You are not authorized to delete this review.");
    return res.redirect("/account/");
  }

  const view = await utilities.buildDeleteConfirmation(reviewData);
  res.render("./review/delete-review", {
    title: "Delete Review",
    nav,
    view,
    errors: null,
    messages: () => utilities.buildMessagesHTML(req),
  });
};

/* ***************************
 *  Process review deletion
 * ************************** */
reviewController.deleteReview = async function (req, res, next) {
  const { review_id } = req.body;

  // Authorization Check before deleting
  const reviewDataForAuth = await reviewModel.getReviewById(review_id);
  if (
    reviewDataForAuth.account_id !== res.locals.accountData.account_id &&
    res.locals.accountData.account_type !== "Admin"
  ) {
    req.flash("notice", "You are not authorized to perform this action.");
    return res.redirect("/account/");
  }

  const deleteResult = await reviewModel.deleteReview(review_id);

  if (deleteResult) {
    req.flash("notice", "The review was successfully deleted.");
    res.redirect("/account/");
  } else {
    let nav = await utilities.getNav();
    const reviewData = await reviewModel.getReviewById(review_id);
    const view = await utilities.buildDeleteConfirmation(reviewData);
    req.flash("notice", "Sorry, the delete failed.");
    res.render("./review/delete-review", {
      title: "Delete Review",
      nav,
      view,
      errors: null,
      messages: () => utilities.buildMessagesHTML(req),
    });
  }
};

module.exports = reviewController;
