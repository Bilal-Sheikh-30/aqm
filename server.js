const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const sensorRoutes = require('./routes/sensorRoutes');
const uploadRoutes = require('./routes/uploadRoute');
const { MongoClient } = require('mongodb');


const fs = require('fs');
const app = express();
const cloudinary = require('cloudinary').v2;
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/data', sensorRoutes);
app.use('/', uploadRoutes); // mount the route

// Serve static files (images, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Default route (to serve the frontend)
app.get('/upload-firmware', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
//addded for weekly graphs
const client = new MongoClient(process.env.MONGO_URL);
const dbName = 'test';
const collectionName = 'sensordatas';

app.get('/api/data-chart', async (req, res) => {
    try {
        // Connect to the database
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Get today's date and the date 7 days ago (set time to midnight for comparison)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight (00:00)
        const fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 7); // 7 days ago

        // Log dates for verification
        console.log('From Date:', fromDate.toISOString());
        console.log('To Date:', today.toISOString());

        // Fetch sensor data from the last 7 days
        const readings = await collection
            .find({ timestamp: { $gte: fromDate, $lt: today } })
            .toArray();

        // Group the data by date
        const grouped = {};
        readings.forEach(({ timestamp, temperature, humidity }) => {
            const date = new Date(timestamp).toISOString().split('T')[0]; // Extract date (yyyy-mm-dd)
            if (!grouped[date]) grouped[date] = { temps: [], hums: [] };
            grouped[date].temps.push(temperature);
            grouped[date].hums.push(humidity);
        });

        // Calculate the average temperature and humidity for each date
        const dates = Object.keys(grouped).sort();

        const tempAvgs = dates.map(date => {
            const vals = grouped[date].temps;
            return vals.reduce((a, b) => a + b, 0) / vals.length;
        });

        const humAvgs = dates.map(date => {
            const vals = grouped[date].hums;
            return vals.reduce((a, b) => a + b, 0) / vals.length;
        });

        // Send the data to the client
        res.json({ dates, tempAvgs, humAvgs });
        
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//till here
app.listen(PORT, () => {
  console.log(`✅ Server is running at: http://localhost:${PORT}`);
});




