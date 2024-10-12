const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

// Single view
invCont.buildSingleVehicle = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getClassificationById(inv_id)
  const html = await utilities.buildSingleVehicle(data)
  let nav = await utilities.getNav()
  const vehicle = data
  res.render("./inventory/inventory", {
    title: vehicle + "TITLE",
    nav,
    html,
    errors: null,
  })
}

// contor for an error button
invCont.buildError = async function (req, res, next) {
  next({ status: 500, message: "This is a test error message." })
}


// Add Classification controller
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

// Add inventory controller
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
  })
}






module.exports = invCont