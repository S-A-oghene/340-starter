// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
// The validation file might be named differently in your project
const regValidate = require('../utilities/account-validation') 

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login request
// This route should use your validation rules for logging in
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Deliver the account management view
// This route is protected by the checkLogin middleware
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// Process logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

// Route to build account update view
router.get(
    "/update/:account_id",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountUpdateView)
);

// Process account info update
router.post(
    "/update-info",
    utilities.checkLogin,
    regValidate.updateInfoRules(),
    regValidate.checkUpdateInfoData,
    utilities.handleErrors(accountController.updateAccountInfo)
);

// Process password change
router.post(
    "/update-password",
    utilities.checkLogin,
    regValidate.changePasswordRules(),
    regValidate.checkChangePasswordData,
    utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;
