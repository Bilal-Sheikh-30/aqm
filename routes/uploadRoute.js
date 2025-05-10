// routes/uploadRoute.js

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const uploadToGitHub = require("../upload-to-github");

const upload = multer({ dest: "uploads/" });

router.post("/upload-firmware", upload.single("firmware"), async (req, res) => {
  const localPath = req.file.path;

  try {
    await uploadToGitHub(localPath);
    res.send("✅ Firmware uploaded to GitHub successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Firmware upload failed.");
  } finally {
    fs.unlinkSync(localPath); // clean up
  }
});

module.exports = router;
