// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
 

router.get("/detail/:invId", invController.buildSingleVehicle);



// Route to build adding-classification view
router.get("/add-classification", invController.buildAddClassification);

// route to build adding-inventory view
router.get("/add-inventory", invController.buildAddInventory);

module.exports = router;

