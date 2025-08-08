const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const classification = await invModel.getClassificationById(classification_id);
  const className = classification ? classification.classification_name : "No";
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    messages: () => utilities.buildMessagesHTML(req),
  })
};

/* ***************************
 *  Build detail view by inventory_id
 * ************************** */
invCont.buildByInvId = async function (req, res, next) { // Corrected to match user's naming
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryByInvId(inv_id);
  const grid = await utilities.buildDetailGrid(data);
  let nav = await utilities.getNav();
  let className = "Vehicle Details"; // Default title
  if (data) {
    className = data.inv_year + " " + data.inv_make + " " + data.inv_model;
  }
  res.render("./inventory/detail", {
    title: className,
    nav,
    grid,
    messages: () => utilities.buildMessagesHTML(req),
  });
};

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    messages: () => utilities.buildMessagesHTML(req),
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    messages: () => utilities.buildMessagesHTML(req),
  })
}

/* ***************************
 *  Process new classification
 * ************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const classificationResult = await invModel.addClassification(
    classification_name
  )

  if (classificationResult) {
    let nav = await utilities.getNav() // Update nav with new classification
    req.flash(
      "notice",
      `Congratulations, you\'ve added the ${classification_name} classification.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      messages: () => utilities.buildMessagesHTML(req),
    })
  } else {
    req.flash("notice", "Sorry, adding the classification failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,      
      messages: () => utilities.buildMessagesHTML(req),
      errors: null,
    })
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    messages: () => utilities.buildMessagesHTML(req),
  })
}

/* ***************************
 *  Process new inventory
 * ************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const inventoryResult = await invModel.addInventory(
    inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
  )

  if (inventoryResult) {
    req.flash(
      "notice",
      `Congratulations, you've added the ${inv_make} ${inv_model} to the inventory.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      messages: () => utilities.buildMessagesHTML(req),
    })
  } else {
    let classificationList = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Sorry, adding the vehicle failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      messages: () => utilities.buildMessagesHTML(req),
      errors: null,
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    })
  }
}

module.exports = invCont;
