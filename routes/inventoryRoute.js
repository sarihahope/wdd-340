// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidate = require('../utilities/inventory-validation');

// Route to build inventory by classification view & single view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildSingleVehicle);

// Management routes
router.get("/", invController.renderManagementView);
router.get("/add-classification", invController.renderClassificationView);
router.get("/add-inventory", invController.renderAddInventoryView);

// Add classification route
router.post("/add-classification", invValidate.inventoryRules(), invValidate.checkInvData, invController.addClassification);

// add inventory items to classification
router.post('/add-inventory', invValidate.addInventoryRules(), invValidate.checkAddInvData, invController.addInventory)


module.exports = router;

