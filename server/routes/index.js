const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");
const dashboardController = require("../controllers/dashboardController");

router.get('/',mainController.homepage)
router.get('/pricing',mainController.pricing)
router.get('/reviews',mainController.reviews)
router.get('/dashboard',dashboardController.dashboard)

router.get('*',mainController.page404)

module.exports = router
