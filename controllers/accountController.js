const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

//   Deliver registration view
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

    let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if ( await bcrypt.compare(account_password, accountData.account_password) ) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if (process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/management")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }


 

async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Management",
    nav,
  })
}

//  Client to update thier information.
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/management")
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
}

// add a function to handle the "account update" process, including: Return data to the update view for correction if errors are found. Set a success or failure message to inform the client. Query the account data from the database after the update is done. Deliver the management view where the updated account information will be displayed along with the success or failure message.
async function buildUpdateAccount(req, res) {
  let nav = await utilities.getNav()
  const { id } = req.params
  const accountData = await accountModel.getAccountById(id)
  if (!accountData) {
    req.flash("notice", "Sorry, the account was not found.")
    res.status(404).render("account/management", {
      title: "Management",
      nav,
    })
    return
  }
  res.render("account/update-account", {
    title: "Update Account",
    nav,
    accountData,
  })
}

// add a function to handle the "password change" process: If there is an error with the new password, set an error message and return to the update view to be fixed. If no error is found, the password must be hashed then sent to a function to be updated in the database. Determine the result of the update. Set a success or failure message to inform the client. Deliver the management view where the account information will be displayed along with the success or failure message.
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { id } = req.params
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  const accountData = await accountModel.getAccountById(id)
  if (!accountData) {
    req.flash("notice", "Sorry, the account was not found.")
    res.status(404).render("account/management", {
      title: "Management",
      nav,
    })
    return
  }
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the update.")
    res.status(500).render("account/update-account", {
      title: "Update Account",
      nav,
      accountData,
    })
  }
  const updateResult = await accountModel.updateAccount(id, account_firstname, account_lastname, account_email, hashedPassword)
  if (updateResult) {
    req.flash("notice", "The account was updated successfully.")
    res.status(200).render("account/management", {
      title: "Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update-account", {
      title: "Update Account",
      nav,
      accountData,
    })
  }
}


  module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, updateAccount, buildUpdateAccount, updateAccount } 

