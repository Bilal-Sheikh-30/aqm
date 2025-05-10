const SensorData = require('../models/SensorData');

// POST data
exports.postSensorData = async (req, res) => {
  try {
    const { temperature, humidity } = req.body;
    
    const newData = new SensorData({ temperature, humidity });
    // console.log(`${temperature}`);
    
    await newData.save();
    res.status(201).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// GET data
exports.getSensorData = async (req, res) => {
  try {
    const data = await SensorData.find().sort({ timestamp: -1 });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};
