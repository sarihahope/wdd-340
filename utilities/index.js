const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}



/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

// Build the spefic vehicle information view HTML
Util.buildSingleVehicle = async function(data){
  let html 
  if (data) {
  html = '<div id="inv-display">'
  const vehicle = data
  html += '<h1>' + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h1>'
  html += '<img src="' + vehicle.inv_image +'" />'
  html += '<h2>Details</h2>'
  html += '<ul>'
  html += '<li><strong>Price:</strong> $' + Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</li>'
  html += '<li><strong>Year:</strong> ' + vehicle.inv_year + '</li>'
  html += '<li><strong>Color:</strong> ' + vehicle.inv_color + '</li>'
  html += '<li><strong>Description:</strong> ' + vehicle.inv_description + '</li>'
  html += '<li><strong>Miles:</strong> ' + vehicle.inv_miles + '</li>'
  html += '</ul>'
  html += '</div>'
}
  return html
}

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

// Build the add classification form
Util.buildAddClassificationForm = async function () {
  let form = '<form action="/inv/add-classification" method="post">'
  form += '<label for="classification_name">Classification Name:</label>'
  form += '<input type="text" name="classification_name" id="classification_name" required />'
  form += '<button type="submit">Add Classification</button>'
  form += '</form>'
  return form
}

// Build the add inventory form
Util.buildAddInventoryForm = async function () {
  let form = '<form action="/inv/add-inventory" method="post">'
  form += '<label for="classification_id">Classification:</label>'
  form += await Util.buildClassificationList()
  form += '<label for="inv_year">Year:</label>'
  form += '<input type="number" name="inv_year" id="inv_year" required />'
  form += '<label for="inv_make">Make:</label>'
  form += '<input type="text" name="inv_make" id="inv_make" required />'
  form += '<label for="inv_model">Model:</label>'
  form += '<input type="text" name="inv_model" id="inv_model" required />'
  form += '<button type="submit">Add Inventory</button>'
  form += '</form>'
  return form
}


/* ****************************************
* middleware to clear jwt cookie on /logout
**************************************** */
Util.checkJWTTokenGlobally = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
      if (err) {
        res.clearCookie("jwt");
        res.locals.loggedin = false;
        return next();
      }
      res.locals.accountData = accountData;
      res.locals.loggedin = true;
      next();
    });
  } else {
    res.locals.loggedin = false;
    next();
  }
};

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkAccountTypeJWT = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
      if (err) {
        req.flash("notice", "Please log in");
        res.clearCookie("jwt");
        return res.redirect("/account/login");
      }
      if (accountData.account_type === 'employee' || accountData.account_type === 'admin') {
        res.locals.accountData = accountData;
        res.locals.loggedin = true;
        next();
      } else {
        req.flash("notice", "Access denied. Admin or Employee account required.");
        res.clearCookie("jwt");
        return res.redirect("/account/login");
      }
    });
  } else {
    req.flash("notice", "Please log in");
    return res.redirect("/account/login");
  }
};


  
 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
module.exports = Util
