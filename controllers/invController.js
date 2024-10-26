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


// Add-Classification controller
invCont.renderClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

// // Management view controller
// invCont.renderManagementView = async function (req, res, next) {
//   let nav = await utilities.getNav() 
//   const classificationSelect = await utilities.buildClassificationList()
//   res.render("inventory/management", {
//     title: "Management",
//     nav,
//     classificationSelect,
//     errors: null,
//   })
// }

/* ***************************
 *  Add classification to list
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const unit = await invModel.addClassificationModel(classification_name)
  const classificationList = await utilities.buildClassificationList()
  let nav = await utilities.getNav()
  if (unit){
    req.flash(
      "notice", 'Yay, you have succeded.')
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
  
    })
  } else {
    req.flash("notice", "Sorry, the action has failed.")
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
  }
}


invCont.renderAddInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null
  })
}


// invCont.addInventory = async function (req, res, next) {
//   const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
//   const inv = await invModel.addInventoryModel( 
//     inv_make, 
//     inv_model, 
//     inv_description, 
//     inv_image, 
//     inv_thumbnail, 
//     inv_price, 
//     inv_year,
//     inv_miles, 
//     inv_color,
//     classification_id
//   )
//   let nav = await utilities.getNav()
//   let classificationList = await utilities.buildClassificationList();
//   if (inv){
//     req.flash(
//       "notice", 'Yay, you have succeded.')
//     res.status(201).render("inventory/management", {
//       title: "Management",
//       nav
//     })
//   } else {
//     req.flash("notice", "Unforutly, this action has failed.")
//     res.status(500).render("inventory/add-inventory", {
//       title: "Add Inventory",
//       nav,
//       classificationList
//     })
//   }
// }

invCont.addInventory = async function (req, res, next) {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  const inv = await invModel.addInventoryModel( 
    inv_make, 
    inv_model, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_year,
    inv_miles, 
    inv_color,
    classification_id
  )
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList();
  if (inv){
    req.flash(
      "notice", 'Congratulations, you did it!.')
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      classificationList
    })
  } else {
    req.flash("notice", "Sorry, adding inventory items failed!")
    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList
    })
  }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}
/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByClassificationId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

invCont.renderManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Management",
    nav,
    errors: null,
    classificationList,
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/delete-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

// Add a Review to single vehicle view 
invCont.addReview = async function (req, res, next) {
  const { inv_id, review_title, review_text, review_rating } = req.body
  const review = await invModel.addReview(inv_id, review_title, review_text, review_rating)
  if (review) {
    req.flash("notice", "Review added.")
    res.redirect(`/inv/detail/${inv_id}`)
  } else {
    req.flash("notice", "Review failed.")
    res.redirect(`/inv/detail/${inv_id}`)
  }
}

// Delete Review from single vehicle view
invCont.deleteReview = async function (req, res, next) {
  const { review_id, inv_id } = req.body
  const review = await invModel.deleteReview(review_id)
  if (review) {
    req.flash("notice", "Review deleted.")
    res.redirect(`/inv/detail/${inv_id}`)
  } else {
    req.flash("notice", "Review delete failed.")
    res.redirect(`/inv/detail/${inv_id}`)
  }
}

// Update Review from single vehicle view
invCont.updateReview = async function (req, res, next) {
  const { review_id, inv_id, review_title, review_text, review_rating } = req.body
  const review = await invModel.updateReview(review_id, review_title, review_text, review_rating)
  if (review) {
    req.flash("notice", "Review updated.")
    res.redirect(`/inv/detail/${inv_id}`)
  } else {
    req.flash("notice", "Review update failed.")
    res.redirect(`/inv/detail/${inv_id}`)
  }
}

invCont.addReviewView = async function (req, res, next) {
  const inv_id = req.params.invId
  let nav = await utilities.getNav()
  res.render("inventory/add-review", {
    title: "Add Review",
    nav,
    inv_id,
    errors: null,
  })
}



module.exports = invCont
