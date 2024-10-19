// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const invController = require("../controllers/invController")
const invValidate = require('../utilities/inventory-validation');
const accountController = require("../controllers/accountController");

// Route to build inventory by classification view & single view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/detail/:invId", invController.buildSingleVehicle);

// Management routes
router.get("/", invController.renderManagementView);
router.get("/add-classification", invController.renderClassificationView);
router.get("/add-inventory", invController.renderAddInventoryView);
router.get('/management', accountController.buildManagement)

// Add classification route
router.post("/add-classification", invValidate.inventoryRules(), invValidate.checkInvData, invController.addClassification);

// add inventory items to classification
router.post('/add-inventory', invValidate.addInventoryRules(), invValidate.checkAddInvData, invController.addInventory)

router.get('./inventory/edit-inventory', invController.editInventoryView);
router.post('./inventory/edit-inventory', invValidate.addInventoryRules(), invValidate.checkAddInvData);
router.post("/update/", invController.updateInventory)

// router.get('./inventory/delete-confirm', invController.editInventoryView);
router.post("/delete/", invController.deleteInventory)
router.get("/edit/:invId", invController.editInventoryView);

module.exports = router;

