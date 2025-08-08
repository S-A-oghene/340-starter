const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
      // classification_name is required and must be string
      body("classification_name")
        .trim()
        .isLength({ min: 1 })
        .isAlphanumeric()
        .withMessage("Please provide a classification name with only letters and numbers.") // on error
        .custom(async (classification_name) => {
            const classificationExists = await invModel.checkExistingClassification(classification_name)
            if (classificationExists){
              throw new Error("Classification exists. Please use a different name")
            }
          }),
    ]
}

/* ******************************
* Check data and return errors or continue
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
      // classification_id is required
      body("classification_id")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please select a classification."),

      // inv_make is required
      body("inv_make")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Please provide a make."),

      // inv_model is required
      body("inv_model")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Please provide a model."),

      // inv_year is required and must be a 4-digit number
      body("inv_year")
        .trim()
        .isNumeric({ no_symbols: true })
        .isLength({ min: 4, max: 4 })
        .withMessage("Please provide a valid 4-digit year."),

      // inv_description is required
      body("inv_description")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a description."),

      // inv_image is required
      body("inv_image")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide an image path."),

      // inv_thumbnail is required
      body("inv_thumbnail")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a thumbnail path."),

      // inv_price is required and must be a decimal or integer
      body("inv_price")
        .trim()
        .isNumeric({ no_symbols: true })
        .withMessage("Please provide a valid price."),

      // inv_miles is required and must be an integer
      body("inv_miles")
        .trim()
        .isNumeric({ no_symbols: true })
        .withMessage("Please provide valid mileage."),

      // inv_color is required
      body("inv_color")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a color."),
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
        messages: () => utilities.buildMessagesHTML(req),
        classificationList,
        inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
      })
      return
    }
    next()
}

module.exports = validate