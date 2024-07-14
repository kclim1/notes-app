const express = require('express')
const router = express.Router()
const dashboardController = require('server/controllers/dashboardController.js')


// dashboard routes
router.get('/dashboard', dashboardController.dashboard)





module.exports = router; 

