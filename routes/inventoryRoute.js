// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
 

router.get("/detail/:invId", invController.buildSingleVehicle);

// Management routes

router.get("/", invController.renderManagementView);
// router.get("/add-classification", invController.renderClassificationView);
// router.get("/add-inventory", invController.renderInventoryView);

// Route to build adding-classification view
router.get("/add-classification", invController.buildAddClassification);

// route to build adding-inventory view
router.get("/add-inventory", invController.buildAddInventory);

router.post("/add-classification", invController.buildAddClassification);

module.exports = router;

