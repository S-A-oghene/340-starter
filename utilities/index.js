const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* **************************************
 * Build the reviews view HTML
 * ************************************ */
Util.buildReviews = async function (reviews, inv_id, accountData) {
  let reviewList;
  if (reviews && reviews.length > 0) {
    reviewList = '<ul class="review-list">';
    reviews.forEach((review) => {
      reviewList += "<li>";
      reviewList += `<div class="review-header"><strong>${review.account_firstname.charAt(
        0
      )}. ${review.account_lastname}</strong> rated it ${
        review.review_rating
      } stars on ${new Date(review.review_date).toLocaleDateString()}</div>`;
      reviewList += `<p class="review-text">${review.review_text}</p>`;
      if (accountData && accountData.account_id === review.account_id) {
        reviewList += `<div class="review-actions">
          <a href="/review/edit/${review.review_id}">Edit</a> | 
          <a href="/review/delete/${review.review_id}">Delete</a>
        </div>`;
      }
      reviewList += "</li>";
    });
    reviewList += "</ul>";
  } else {
    reviewList = "<p>Be the first to write a review!</p>";
  }
  return reviewList;
};

/* **************************************
 * Build the add review form HTML
 * ************************************ */
Util.buildAddReviewForm = function (
  inv_id,
  accountData,
  review_text = "",
  review_rating = ""
) {
  if (accountData) {
    let form = `
      <h3>Add Your Review</h3>
      <form id="addReviewForm" action="/review/add" method="post">
        <label for="review_text">Review:</label>
        <textarea id="review_text" name="review_text" required>${review_text}</textarea>
        <label for="review_rating">Rating (1-5):</label>
                <input type="number" id="review_rating" name="review_rating" min="1" max="5" required value="${review_rating}">
        <input type="hidden" name="inv_id" value="${inv_id}">
        <button type="submit">Submit Review</button>
      </form>
    `;
    return form;
  }
  return '<p>You must be <a href="/account/login">logged in</a> to post a review.</p>';
};

/* **************************************
 * Build the user reviews list HTML for account management
 * ************************************ */
Util.buildUserReviewsList = async function (reviews) {
  let reviewList = "<h3>My Reviews</h3>";
  if (reviews && reviews.length > 0) {
    reviewList += '<ul class="user-review-list">';
    reviews.forEach((review) => {
      reviewList += `<li>Review for ${review.inv_make} ${
        review.inv_model
      } on ${new Date(
        review.review_date
      ).toLocaleDateString()}: <a href="/review/edit/${
        review.review_id
      }">Edit</a> | <a href="/review/delete/${review.review_id}">Delete</a></li>`;
    });
    reviewList += "</ul>";
  } else {
    reviewList += "<p>You have not written any reviews yet.</p>";
  }
  return reviewList;
};

/* **************************************
 * Build the edit review form HTML
 * ************************************ */
Util.buildEditReviewForm = async function (reviewData) {
  return `
    <h3>Review for ${reviewData.inv_make} ${reviewData.inv_model}</h3>
    <form id="editReviewForm" action="/review/update" method="post">
      <label for="review_text">Review Text:</label>
      <textarea id="review_text" name="review_text" required>${
        reviewData.review_text
      }</textarea>
      <label for="review_rating">Rating (1-5):</label>
      <input type="number" id="review_rating" name="review_rating" min="1" max="5" required value="${
        reviewData.review_rating
      }">
      <input type="hidden" name="review_id" value="${reviewData.review_id}">
      <button type="submit">Update Review</button>
    </form>
  `;
};

/* **************************************
 * Build the delete confirmation view HTML
 * ************************************ */
Util.buildDeleteConfirmation = async function (reviewData) {
  return `
    <p>Confirm Deletion of your review for the ${reviewData.inv_make} ${
    reviewData.inv_model
  } made on ${new Date(reviewData.review_date).toLocaleDateString()}</p>
    <form id="deleteReviewForm" action="/review/delete" method="post">
      <input type="hidden" name="review_id" value="${reviewData.review_id}">
      <button type="submit">Delete Review</button>
    </form>
  `;
};

/* **************************************
 * Build the error list HTML
 * ************************************ */
Util.buildErrorList = function (errors) {
  let errorList = '<ul class="notice error-list">';
  errors.array().forEach((error) => {
    errorList += `<li>${error.msg}</li>`;
  });
  errorList += "</ul>";
  return errorList;
};
/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications();
  let list = '<ul id="navigation">';
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the detail view HTML
 * ************************************ */
Util.buildDetailGrid = async function (data) {
  let grid = "";
  if (data) {
    grid = `
      <div id="detail-view">
        <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${
      data.inv_model
    }">
        <div id="detail-data">
          <h2>${data.inv_make} ${data.inv_model} Details</h2>
          <p><strong>Price: $${new Intl.NumberFormat("en-US").format(
            data.inv_price
          )}</strong></p>
          <p><strong>Description:</strong> ${data.inv_description}</p>
          <p><strong>Color:</strong> ${data.inv_color}</p>
          <p><strong>Miles:</strong> ${new Intl.NumberFormat("en-US").format(
            data.inv_miles
          )}</p>
        </div>
      </div>
    `;
  } else {
    grid = '<p class="notice">Sorry, no vehicle details could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the classification list for forms
 * ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 * Build message HTML
 ************************************ */
Util.buildMessagesHTML = (req) => {
  const messages = req.flash();
  let messageHTML = "";
  if (messages.notice && messages.notice.length > 0) {
    messageHTML = '<ul class="notice">';
    messages.notice.forEach((message) => {
      messageHTML += `<li>${message}</li>`;
    });
    messageHTML += "</ul>";
  }
  if (messages.error && messages.error.length > 0) {
    messageHTML += '<ul class="error">';
    messages.error.forEach((message) => {
      messageHTML += `<li>${message}</li>`;
    });
    messageHTML += "</ul>";
  }
  return messageHTML;
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login - Middleware to check if user is logged in
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 * Middleware for Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 *  Check Account Type - Middleware to check if user is Employee or Admin
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  const accountType = res.locals.accountData.account_type;
  if (accountType === "Employee" || accountType === "Admin") {
    next();
  } else {
    req.flash("notice", "You are not authorized to access this page.");
    return res.redirect("/account/login");
  }
};

module.exports = Util;
