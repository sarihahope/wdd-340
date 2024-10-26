// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const invController = require("../controllers/invController")
const invValidate = require('../utilities/inventory-validation');

// Get Routes
// Single & classification inventory view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildSingleVehicle));
router.post("/detail/:inv_id/reviews", invController.addReview);

// Management route
router.get("/", utilities.handleErrors(invController.renderManagementView));

// Adding a classfication route & Inventory route
router.get("/add-classification", utilities.handleErrors(invController.renderClassificationView));
router.get("/add-inventory", utilities.handleErrors(invController.renderAddInventoryView));

// JSON route
router.get('/getInventory/:classification_id', utilities.handleErrors(invController.getInventoryJSON));

// view edit-inventory
router.get("/edit/:invId", utilities.handleErrors(invController.editInventoryView));
router.get("/delete/:invId", utilities.handleErrors(invController.deleteInventory));





// Post reoutes
// Update inventory
// Add a classification & inventory
router.post("/update", utilities.handleErrors(invController.updateInventory));
router.post("/add-classification", invValidate.inventoryRules(), invValidate.checkInvData, utilities.handleErrors(invController.addClassification));
router.post('/add-inventory', invValidate.addInventoryRules(), invValidate.checkAddInvData, utilities.handleErrors(invController.addInventory))
// route for adding review
router.post('/add-review', utilities.handleErrors(invController.addReview));




module.exports = router;