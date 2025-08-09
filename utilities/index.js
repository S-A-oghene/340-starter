const invModel = require("../models/inventory-model");
const Util = {};
const { body, validationResult } = require("express-validator")

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications();
  let list = '<ul class="navigation">';
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
* Build the classification select list
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0 && data[0].inv_id){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid +=  '<a href="/inv/detail/'+ vehicle.inv_id
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model
      + ' details"><img src="' + vehicle.inv_thumbnail
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="/inv/detail/' + vehicle.inv_id +'" title="View '
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetailGrid = async function(data){
  let grid = ''
  if(data){
    const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.inv_price);
    const mileage = new Intl.NumberFormat('en-US').format(data.inv_miles)
    grid = `
      <div class="detail-container">
        <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model}">
        <div class="detail-info">
          <h2>${data.inv_make} ${data.inv_model} Details</h2>
          <p class="detail-price"><strong>Price:</strong> ${price}</p>
          <p><strong>Description:</strong> ${data.inv_description}</p>
          <p><strong>Color:</strong> ${data.inv_color}</p>
          <p><strong>Miles:</strong> ${mileage}</p>
        </div>
      </div>
    `
  } else {
    grid = '<p class="notice">Sorry, no vehicle details could be found.</p>'
  }
  return grid
}

/* ****************************************
 *  Build messages HTML
 * ************************************ */
Util.buildMessagesHTML = (req) => {
  let messagesHTML = '';
  const flashMessages = req.flash();
  if (flashMessages.notice && flashMessages.notice.length > 0) {
    messagesHTML += '<ul class="notice">';
    flashMessages.notice.forEach(message => {
      messagesHTML += `<li>${message}</li>`;
    });
    messagesHTML += '</ul>';
  }
  if (flashMessages.error && flashMessages.error.length > 0) {
    messagesHTML += '<ul class="error">';
    flashMessages.error.forEach(message => {
      messagesHTML += `<li>${message}</li>`;
    });
    messagesHTML += '</ul>';
  }
  return messagesHTML;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util;
