const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');
const utilities = require("../utilities/")



router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))
router.get('/login', accountController.buildLogin)
router.get('/register', accountController.buildRegister)
router.get('/management', accountController.buildManagement)

router.post('/register', regValidate.registationRules(), regValidate.checkRegData, accountController.registerAccount)
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  )

module.exports = router;


