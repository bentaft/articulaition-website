const fs = require("fs");
const path = require("path");

console.log("🔍 Articulaition Gemini Setup Check\n");

// Check if .env file exists
const envPath = path.join(__dirname, ".env");
if (!fs.existsSync(envPath)) {
  console.log("❌ .env file missing - create it with your Gemini API key");
  console.log("   Copy .env.example to .env and add your API keys\n");
} else {
  console.log("✅ .env file found");

  // Check Gemini API key
  require("dotenv").config();
  if (process.env.GEMINI_API_KEY) {
    if (process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
      console.log(
        "⚠️  Please replace placeholder API key with your actual Gemini key"
      );
    } else {
      console.log("✅ Gemini API key configured");
    }
  } else {
    console.log("❌ GEMINI_API_KEY not found in environment");
  }

  // Check other environment variables
  console.log(`📊 Port: ${process.env.PORT || "3001 (default)"}`);
  console.log(
    `🌐 Frontend URL: ${
      process.env.FRONTEND_URL || "http://localhost:8080 (default)"
    }`
  );
}

console.log("\n📁 Checking project structure...");
const requiredFiles = ["server.js", "package.json"];
requiredFiles.forEach((file) => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ ${file} found`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Test Gemini connection (if API key is configured)
async function testGemini() {
  if (
    !process.env.GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY === "your_gemini_api_key_here"
  ) {
    console.log("⚠️  Skipping Gemini test - API key not configured");
    return;
  }

  try {
    console.log("🔄 Testing Gemini API connection...");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Hello, this is a test." }] }],
          generationConfig: { maxOutputTokens: 10 },
        }),
      }
    );

    if (response.ok) {
      console.log("✅ Gemini API connection successful!");
    } else {
      console.log(
        "❌ Gemini API connection failed:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.log("❌ Gemini API connection failed:", error.message);
  }
}

// Run tests
testGemini().then(() => {
  console.log("\n🎯 Setup Summary:");
  console.log("1. Make sure your .env file has GEMINI_API_KEY configured");
  console.log("2. Run 'npm install' to install dependencies");
  console.log("3. Run 'npm start' to start the server");
  console.log(
    "4. Configure your Gemini API key in public/js/gemini-ai-engine.js"
  );
  console.log("\n🚀 Ready to start your communication analysis server!");
});
