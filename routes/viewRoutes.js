const express = require('express');
const viewcontroller = require('../Controller/viewsController')

const router = express.Router();




router.get('/', viewcontroller.getOverview)

router.get('/tour', viewcontroller.getTour)

module.exports = router;
