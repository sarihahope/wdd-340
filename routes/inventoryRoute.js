// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const invController = require("../controllers/invController")
const invValidate = require('../utilities/inventory-validation');

// Route to build inventory by classification view & single view
// router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/detail/:invId", invController.buildSingleVehicle);

// Management routes
router.get("/", invController.renderManagementView);
router.get("/add-classification", invController.renderClassificationView);
router.get("/add-inventory", invController.renderAddInventoryView);

// Add classification route
router.post("/add-classification", invValidate.inventoryRules(), invValidate.checkInvData, invController.addClassification);

// add inventory items to classification
router.post('/add-inventory', invValidate.addInventoryRules(), invValidate.checkAddInvData, invController.addInventory)
// Add a new route that matches /inv/edit/, and add a parameter to the end of the route to represent the inventory_id value that will be passed in through the URL.
router.get('./inventory/edit-inventory', invController.editInventoryView);
router.post('./inventory/edit-inventory', invValidate.addInventoryRules(), invValidate.checkAddInvData);
router.post("/update/", invController.updateInventory)

module.exports = router;

