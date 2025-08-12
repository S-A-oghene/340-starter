const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
      // classification_name is required and must be string with no special characters or spaces
      body("classification_name")
        .trim()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Please provide a valid classification name (letters only)."), // on error
    ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add New Classification",
        nav,
        messages: () => utilities.buildMessagesHTML(req),
        classification_name,
      })
      return
    }
    next()
}

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
      body("inv_make").trim().isLength({ min: 3 }).withMessage("Please provide a make."),
      body("inv_model").trim().isLength({ min: 3 }).withMessage("Please provide a model."),
      body("inv_year").trim().isLength({ min: 4, max: 4 }).isNumeric().withMessage("Please provide a 4-digit year."),
      body("inv_description").trim().isLength({ min: 1 }).withMessage("Please provide a description."),
      body("inv_image").trim().isLength({ min: 1 }).withMessage("Please provide an image path."),
      body("inv_thumbnail").trim().isLength({ min: 1 }).withMessage("Please provide a thumbnail path."),
      body("inv_price").trim().isNumeric().withMessage("Please provide a valid price."),
      body("inv_miles").trim().isNumeric().withMessage("Please provide valid mileage."),
      body("inv_color").trim().isLength({ min: 1 }).withMessage("Please provide a color."),
      body("classification_id").trim().isNumeric().withMessage("Please select a classification."),
    ]
}

/* ******************************
 * Check inventory data and return errors or continue
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let classificationList = await utilities.buildClassificationList(classification_id)
      res.render("inventory/add-inventory", {
        errors,
        title: "Add New Vehicle",
        nav,
        classificationList,
        messages: () => utilities.buildMessagesHTML(req),
        inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
      })
      return
    }
    next()
}

/* ******************************
 * Check update data and return errors to edit view or continue
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let classificationSelect = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      res.render("inventory/edit-inventory", {
        errors,
        title: "Edit " + itemName,
        nav,
        classificationSelect,
        messages: () => utilities.buildMessagesHTML(req),
        inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
      })
      return
    }
    next()
}

module.exports = validate