// utilities/index.js
Util.buildVehicleDetail = function (vehicle) {
  return `
    <div class="vehicle-detail">
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      <div class="details">
        <h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>
        <p><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p><strong>Mileage:</strong> ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)} miles</p>
        <p><strong>Year:</strong> ${vehicle.inv_year}</p>
      </div>
    </div>
  `;
};

// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const invModel = require("../models/inventory-model");
// const accModel = require("../models/account-model");
// const Util = {};

// /* ************************
//  * Constructs the nav HTML unordered list
//  ************************** */
// Util.getNav = async function (req, res, next) {
//   let data = await invModel.getClassifications();
//   let list = "<ul>";
//   data.rows.forEach((row) => {
//     list += "<li>";
//     list +=
//       '<a href="/inv/type/' +
//       row.classification_id +
//       '" title="See our inventory of ' +
//       row.classification_name +
//       ' vehicles">' +
//       row.classification_name +
//       "</a>";
//     list += "</li>";
//   });
//   list += "</ul>";
//   return list;
// };

// /* ************************
//  * Build the classification view HTML
//  ************************** */
// Util.buildClassificationGrid = async function (data) {
//   let grid;
//   if (data.length > 0) {
//     grid = '<ul class="vehicle-grid" id="inv-display">';
//     data.forEach((vehicle) => {
//       grid += "<li>";
//       grid +=
//         '<a href="../../inv/detail/' +
//         vehicle.inv_id +
//         '" title="View ' +
//         vehicle.inv_make +
//         "" +
//         vehicle.inv_model +
//         'details"><img src="' +
//         vehicle.inv_thumbnail +
//         '" alt="Image of ' +
//         vehicle.inv_make +
//         "" +
//         vehicle.inv_model +
//         ' on CSE Motors" /></a>';
//       grid += '<div class="namePrice">';
//       grid += "<hr />";
//       grid += "<h2>";
//       grid +=
//         '<a href="../../inv/detail/' +
//         vehicle.inv_id +
//         '" title="View ' +
//         vehicle.inv_make +
//         "" +
//         vehicle.inv_model +
//         ' details">' +
//         vehicle.inv_make +
//         "" +
//         vehicle.inv_model +
//         "</a>";
//       grid += "</h2>";
//       grid +=
//         "<span>$" +
//         new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
//         "</span>";
//       grid += "</div>";
//       grid += "</li>";
//     });
//     grid += "</ul>";
//   } else {
//     grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
//   }
//   return grid;
// };

// Util.buildVehicleDetail = function (vehicle) {
//   return `
//     <div class="vehicle-detail">
      
//       <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${
//     vehicle.inv_model
//   }">
//       <div class="details">
//       <h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>
//         <p><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(
//           vehicle.inv_price
//         )}</p>
//         <p><strong>Description:</strong> ${vehicle.inv_description}</p>
//         <p><strong>Color:</strong> ${vehicle.inv_color}</p>
//         <p><strong>Mileage:</strong> 
//           ${vehicle.inv_miles}
//          miles</p>
//       </div>
//     </div>
//   `;
// };

// /**
//  * Build the classification drop-down list
//  * @param {number} classification_id - The ID of the classification to select by default (optional)
//  * @returns {string} - The HTML string for the select element
//  */
// Util.buildClassificationList = async function (classification_id = null) {
//   let data = await invModel.getClassifications();
//   let classificationList =
//     '<select name="classification_id" id="classificationList" required>';
//   classificationList += "<option value=''>Choose a Classification</option>";
//   data.rows.forEach((row) => {
//     classificationList += '<option value="' + row.classification_id + '"';
//     if (
//       classification_id != null &&
//       row.classification_id == classification_id
//     ) {
//       classificationList += " selected ";
//     }
//     classificationList += ">" + row.classification_name + "</option>";
//   });
//   classificationList += "</select>";
//   return classificationList;
// };

// Util.handleError = (fn) => (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch(next);
// };
// /* ****************************************
//  * Middleware to check token validity
//  **************************************** */
// Util.checkJWTToken = (req, res, next) => {
//   if (req.cookies.jwt) {
//     jwt.verify(
//       req.cookies.jwt,
//       process.env.ACCESS_TOKEN_SECRET,
//       function (err, accountData) {
//         if (err) {
//           req.flash("Please log in");
//           res.clearCookie("jwt");
//           return res.redirect("/account/login");
//         }
//         res.locals.accountData = accountData;
//         res.locals.loggedin = 1;
//         next();
//       }
//     );
//   } else {
//     next();
//   }
// };

// /* ****************************************
//  *  Check Login
//  * ************************************ */
// Util.checkLogin = (req, res, next) => {
//   if (res.locals.loggedin) {
//     next();
//   } else {
//     req.flash("notice", "Please log in.");
//     return res.redirect("/account/login");
//   }
// };

// /******************************
//  * Check account type
//  **************************/
// Util.accountType = (req, res, next) => {
//   if (res.locals.accountData) {
//     if (res.locals.accountData.account_type != "Client") {
//       next();
//     } else {
//       req.flash("notice", "Access is forbidden.");
//       return res.redirect("account");
//     }
//   } else {
//     req.flash("notice", "You don't have the required account to access.");
//     return res.redirect("/account/login");
//   }
// };

// /******************************
//  * Check account type of is Admin
//  **************************/
// Util.adminType = (req, res, next) => {
//   if (res.locals.accountData) {
//     if (res.locals.accountData.account_type == "Admin") {
//       next();
//     } else {
//       req.flash("notice", "Access is forbidden.");
//       return res.redirect("/account/");
//     }
//   } else {
//     req.flash("notice", "You don't have the required account to access.");
//     return res.redirect("/account/login");
//   }
// };

// /************************
//  * Build drop-down select list of mails.
//  ********************/
// Util.buildEmailList = async function (account_id = null) {
//   let data = await accModel.getAccounts();
//   let emailList = '<select name="account_id" id="emailList" required>';
//   emailList += "<option value=''>Choose an Email</option>";
//   data.rows.forEach((row) => {
//     emailList += '<option value="' + row.account_id + '"';
//     if (account_id != null && row.account_id == account_id) {
//       emailList += " selected ";
//     }
//     emailList += ">" + row.account_email + "</option>";
//   });
//   emailList += "</select>";
//   return emailList;
// };

// /* ****************************************
//  *  Check Login for Comments
//  * ************************************ */
// Util.checkLoginComment = (req, res, next) => {
//   if (res.locals.loggedin) {
//     next();
//   } else {
//     req.flash("notice", "Please log in if you want to comment.");
//     return res.redirect("/account/login");
//   }
// };

// /************************
//  * Build the comment HTML
//  ********************/
// Util.buildCommentsSection = async function (data) {
//   let comments = "";
//   if (!data) {
//     comments = "<li>There are no comments.</li>";
//   } else {
//     data.forEach((comment) => {
//       comments +=
//         "<li class='comment-list'> <strong>" +
//         comment.account_firstname +
//         " commented :</strong> " +
//         comment.comment_text +
//         "</li>";
//     });
//   }
//   return comments;
// };

module.exports = Util;