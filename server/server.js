const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs-extra");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:8080",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
fs.ensureDirSync(uploadsDir);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "audio-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept audio files (including browser recording formats)
    const allowedTypes = /\.(mp3|wav|m4a|webm|mp4|mpeg|ogg|aac|flac)$/i;
    const allowedMimeTypes = /^audio\/|^video\/(mp4|webm)/;

    if (
      allowedTypes.test(file.originalname) ||
      allowedMimeTypes.test(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed"), false);
    }
  },
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Articulaition Audio Server",
    gemini_configured: process.env.GEMINI_API_KEY ? true : false,
  });
});

// Simple audio receive endpoint (files are processed on frontend with Gemini)
app.post("/api/analyze-audio", upload.single("audio"), async (req, res) => {
  console.log("📤 Audio file received for processing");
  console.log(
    "📁 File info:",
    req.file
      ? {
          filename: req.file.filename,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        }
      : "No file"
  );

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    const { speechType, situationType, conversationTurn } = req.body;
    const audioFilePath = req.file.path;

    console.log(`🎵 Processing audio file: ${req.file.filename}`);
    console.log(`📊 Speech type: ${speechType}`);

    // Since we're using Gemini on the frontend, just acknowledge receipt
    // and return basic file info for frontend processing

    // Convert file to base64 for frontend
    const audioBuffer = await fs.readFile(audioFilePath);
    const base64Audio = audioBuffer.toString("base64");

    // Clean up uploaded file immediately
    try {
      await fs.remove(audioFilePath);
      console.log("🗑️  Temporary file cleaned up");
    } catch (cleanupError) {
      console.warn(
        "⚠️  Failed to clean up temporary file:",
        cleanupError.message
      );
    }

    // Return audio data for frontend processing
    res.json({
      success: true,
      audioData: {
        base64: base64Audio,
        mimeType: req.file.mimetype,
        size: req.file.size,
        filename: req.file.originalname,
      },
      metadata: {
        speechType,
        situationType,
        conversationTurn,
        timestamp: new Date().toISOString(),
        processingMethod: "frontend_gemini",
      },
    });

    console.log("✅ Audio data prepared for frontend processing");
  } catch (error) {
    console.error("❌ Error processing audio:", error);

    // Clean up file on error
    if (req.file && req.file.path) {
      try {
        await fs.remove(req.file.path);
      } catch (cleanupError) {
        console.warn(
          "⚠️  Failed to clean up file after error:",
          cleanupError.message
        );
      }
    }

    res.status(500).json({
      success: false,
      error: "Audio processing failed",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Articulaition server running on port ${PORT}`);
  console.log(
    `🌐 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:8080"}`
  );
  console.log(
    `🔑 Gemini API configured: ${process.env.GEMINI_API_KEY ? "Yes" : "No"}`
  );
  console.log("📡 Server ready to receive audio files for frontend processing");
});
