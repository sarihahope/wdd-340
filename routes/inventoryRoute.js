// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view & single view
router.get("/type/:classificationId", invController.buildByClassificationId);
 router.get("/detail/:invId", invController.buildSingleVehicle);

// Management routes
router.get("/", invController.renderManagementView);
router.get("/add-classification", invController.renderClassificationView);
router.get("/add-inventory", invController.renderAddInventoryView);

// Add classification route
router.post("/add-classification", invController.addClassification);

// Add inventory route
router.post('/add-inventory', invController.addInventory)

module.exports = router;

