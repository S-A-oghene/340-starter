// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Route to build management view
router.get(
    "/", 
    utilities.checkLogin, 
    utilities.checkAccountType, 
    utilities.handleErrors(invController.buildManagementView)
);

// Route to get inventory for AJAX route
router.get(
    "/getInventory/:classification_id", 
    utilities.checkLogin, 
    utilities.checkAccountType, 
    utilities.handleErrors(invController.getInventoryJSON)
)

// Route to build add classification view
router.get(
    "/add-classification", 
    utilities.checkLogin, 
    utilities.checkAccountType, 
    utilities.handleErrors(invController.buildAddClassificationView)
);

// Process new classification
router.post(
    "/add-classification", 
    utilities.checkLogin, 
    utilities.checkAccountType, 
    invValidate.classificationRules(), 
    invValidate.checkClassificationData, 
    utilities.handleErrors(invController.addClassification)
);

// Route to build add inventory view
router.get(
    "/add-inventory", 
    utilities.checkLogin, 
    utilities.checkAccountType, 
    utilities.handleErrors(invController.buildAddInventoryView)
);

// Process new inventory
router.post(
    "/add-inventory", 
    utilities.checkLogin, 
    utilities.checkAccountType, 
    invValidate.inventoryRules(), 
    invValidate.checkInventoryData, 
    utilities.handleErrors(invController.addInventory)
);

// Route to build edit inventory view
router.get(
    "/edit/:inv_id",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.editInventoryView)
);

// Process the update data
router.post(
    "/update",
    utilities.checkLogin,
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);


// Route to build delete confirmation view
router.get(
    "/delete/:inv_id",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildDeleteConfirmationView)
);

// Process the delete request
router.post(
    "/delete",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteInventoryItem)
);

module.exports = router;