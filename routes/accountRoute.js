const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')



router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get('/register', accountController.buildRegister)
router.post('/register', regValidate.registationRules(), regValidate.checkRegData, accountController.registerAccount)
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)
// route for account view
router.get("/account", utilities.isLoggedIn, accountController.accountView)

// Error handler middleware
router.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})


module.exports = router;

