# Articulaition Backend - Gemini AI Integration

This backend server provides audio file handling for Articulaition speech analysis. All analysis is performed on the frontend using Google's Gemini AI.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

Create a `.env` file in this directory:

```env
# Gemini API Key (optional - used for validation)
# Get your key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Server configuration
PORT=3001
FRONTEND_URL=http://localhost:8080
```

### 3. Test Your Setup

```bash
npm run setup-check
```

### 4. Start the Server

```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

## 🎯 How It Works

### Audio Processing Flow

1. **Frontend Records Audio** - User records or uploads audio files
2. **Server Receives File** - Audio is temporarily stored and converted to base64
3. **Return to Frontend** - Server immediately returns audio data and cleans up files
4. **Frontend Analysis** - All AI processing happens on frontend using Gemini API
5. **Display Results** - Analysis results are shown directly to user

### Why This Architecture?

- **Faster Processing**: No server-side AI delays
- **Reduced Costs**: Direct browser-to-Gemini communication
- **Better Privacy**: Audio data doesn't persist on server
- **Simpler Deployment**: Minimal server requirements

## 🛠️ API Endpoints

### Health Check

```
GET /health
```

Returns server status and configuration info.

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00Z",
  "service": "Articulaition Audio Server",
  "gemini_configured": true
}
```

### Audio Processing

```
POST /api/analyze-audio
```

**Form Data:**

- `audio`: Audio file (MP3, WAV, M4A, WebM, etc.)
- `speechType`: "casual", "business", or "sales"
- `situationType`: Context description
- `conversationTurn`: Who initiated the conversation

**Response:**

```json
{
  "success": true,
  "audioData": {
    "base64": "data:audio/webm;base64,GkXf...",
    "mimeType": "audio/webm",
    "size": 156842,
    "filename": "recording.webm"
  },
  "metadata": {
    "speechType": "presentation",
    "timestamp": "2024-01-15T10:30:00Z",
    "processingMethod": "frontend_gemini"
  }
}
```

## 🔧 Configuration Options

### Environment Variables

- `GEMINI_API_KEY`: Your Gemini API key (optional, for validation)
- `PORT`: Server port (default: 3001)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:8080)
- `MAX_FILE_SIZE`: Upload limit (default: 50MB)

### Supported Audio Formats

- **WebM** (browser recording default)
- **MP3** (most common)
- **WAV** (high quality)
- **M4A** (Apple devices)
- **OGG** (open source)
- **AAC** (Advanced Audio Coding)
- **FLAC** (lossless)

## 📁 Project Structure

```
server/
├── server.js          # Main server file (simplified)
├── package.json       # Dependencies (no AssemblyAI)
├── setup-check.js     # Gemini validation tool
├── uploads/          # Temporary audio files (auto-cleanup)
├── .env              # Environment configuration
└── README.md         # This file
```

## 🎯 Frontend Integration

The server works with the frontend's `SimpleAnalysis` class:

```javascript
// Frontend usage
const analyzer = new SimpleAnalysis();
const results = await analyzer.analyzeAudio(audioFile, "presentation");
```

All actual AI processing happens in:

- `public/js/simple-analysis.js` - Main analysis engine
- `public/js/gemini-ai-engine.js` - Gemini API integration

## 🔧 Troubleshooting

### Common Issues

1. **"Server connection failed"**

   - Make sure server is running: `npm start`
   - Check port 3001 is available
   - Verify CORS settings match frontend URL

2. **"Audio file too large"**

   - Server has 50MB limit
   - Compress audio or reduce recording length

3. **"Invalid audio format"**
   - Check file extension is supported
   - Browser recordings use WebM format

### Development Tips

- Use `npm run dev` for auto-restart during development
- Check `uploads/` directory is empty (files should auto-delete)
- Monitor console for detailed logging

## 🚀 Deployment

### Local Development

```bash
npm run dev
```

### Production

```bash
npm start
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 📊 Performance

- **File Processing**: < 1 second (conversion only)
- **Memory Usage**: Minimal (immediate cleanup)
- **Concurrent Uploads**: Supported
- **Max File Size**: 50MB configurable

## 🔐 Security

- **File Validation**: Only audio files accepted
- **Immediate Cleanup**: Files deleted after processing
- **CORS Protection**: Restricted to frontend URL
- **No Data Persistence**: Audio data not stored

---

**Note**: This server only handles file upload/conversion. All AI analysis is performed on the frontend using Google's Gemini API for better performance and privacy.
