const utilities = require(".");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_type } =
    req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      messages: () => utilities.buildMessagesHTML(req),
      account_firstname,
      account_lastname,
      account_email,
      account_type,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    // password is required
    body("account_password")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a password."),
  ];
};

/* ******************************
 * Check login data and return errors or continue
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      messages: () => utilities.buildMessagesHTML(req),
      account_email,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Update Account Data Validation Rules
 * ********************************* */
validate.updateInfoRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const account_id = req.body.account_id;
        const account = await accountModel.getAccountByEmail(account_email);
        if (account && account.account_id != account_id) {
          throw new Error("Email exists. Please use a different email");
        }
      }),
  ];
};

/* ******************************
 * Check update data and return errors or continue
 * ***************************** */
validate.checkUpdateInfoData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/update", {
      errors,
      title: "Update Account",
      nav,
      messages: () => utilities.buildMessagesHTML(req),
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Change Password Validation Rules
 * ********************************* */
validate.changePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check password data and return errors or continue
 * ***************************** */
validate.checkChangePasswordData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(req.body.account_id);
    res.render("account/update", {
      errors,
      title: "Update Account",
      nav,
      messages: () => utilities.buildMessagesHTML(req),
      ...accountData,
    });
    return;
  }
  next();
};

module.exports = validate;
