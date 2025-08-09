// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const validate = require('../utilities/inventory-validation')
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to build add-classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));

// Route to post new classification
router.post(
    "/add-classification",
    validate.classificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
  )

// Route to build add-inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));

// --- Temporary Routes for Deleting Classifications ---
// Route to build the delete view
router.get("/delete-classification", utilities.handleErrors(invController.buildDeleteClassificationView));

// Route to process the deletion
router.post("/delete-classification", utilities.handleErrors(invController.deleteClassification));


// Route to post new inventory
router.post(
    "/add-inventory",
    validate.inventoryRules(),
    validate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
  )

module.exports = router;
