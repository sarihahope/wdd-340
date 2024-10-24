const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');
const utilities = require("../utilities/")

// Get routes
// Login route
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Register route
router.get('/register', regValidate.checkRegData, utilities.handleErrors(accountController.buildRegister))
// Management route
router.get('/management', utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))
// Process updateAccount using the id of the client
router.get('/updateAccount/:id', utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount))

// Post routes
router.post('/register', regValidate.regRules(), regValidate.checkRegData, accountController.registerAccount)

router.post('/login',  regValidate.loginRules(), regValidate.checkLoginData, accountController.accountLogin)

router.post('/update', accountController.updateAccount)


module.exports = router;
