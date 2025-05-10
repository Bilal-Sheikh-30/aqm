const express = require('express');
const router = express.Router();

const { postSensorData, getSensorData } = require('../controllers/sensorController');

router.post('/', postSensorData);
router.get('/', getSensorData);

module.exports = router;




