// Audio Recorder Module
class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecording = false;
    this.stream = null;
    this.recordingStartTime = null;
    this.recordingDuration = 0;
    this.maxRecordingTime = 300000; // 5 minutes in milliseconds
    this.recordingTimer = null;

    // Audio analysis settings
    this.apiKey = "AIzaSyBGvwarFw2FbxgxOMnFchyji6G-zYkrgV8";
    this.serverUrl = "http://localhost:3001";

    // Event listeners
    this.onRecordingStart = null;
    this.onRecordingStop = null;
    this.onRecordingComplete = null;
    this.onAnalysisComplete = null;
    this.onError = null;
    this.onProgress = null;
  }

  async initializeRecorder() {
    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
          channelCount: 1,
        },
      });

      // Create MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: this.getSupportedMimeType(),
      });

      // Set up event handlers
      this.setupMediaRecorderEvents();

      console.log("✅ Audio recorder initialized successfully");
      return true;
    } catch (error) {
      console.error("❌ Error initializing audio recorder:", error);
      this.handleError(
        "Failed to initialize audio recorder. Please ensure microphone access is granted."
      );
      return false;
    }
  }

  setupMediaRecorderEvents() {
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = async () => {
      console.log("🎵 Recording stopped, processing audio...");
      const audioBlob = new Blob(this.recordedChunks, {
        type: this.mediaRecorder.mimeType,
      });

      if (this.onRecordingComplete) {
        this.onRecordingComplete(audioBlob, this.recordingDuration);
      }

      // Reset chunks for next recording
      this.recordedChunks = [];
    };

    this.mediaRecorder.onerror = (event) => {
      console.error("❌ MediaRecorder error:", event.error);
      this.handleError("Recording error occurred");
    };
  }

  getSupportedMimeType() {
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/mpeg",
      "audio/wav",
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return "audio/webm"; // fallback
  }

  async startRecording() {
    if (!this.mediaRecorder) {
      const initialized = await this.initializeRecorder();
      if (!initialized) return false;
    }

    if (this.isRecording) {
      console.warn("⚠️ Recording is already in progress");
      return false;
    }

    try {
      this.recordedChunks = [];
      this.recordingStartTime = Date.now();
      this.isRecording = true;

      // Start recording
      this.mediaRecorder.start(1000); // Collect data every second

      // Start timer
      this.startTimer();

      // Auto-stop after max time
      setTimeout(() => {
        if (this.isRecording) {
          this.stopRecording();
        }
      }, this.maxRecordingTime);

      console.log("🎙️ Recording started");
      if (this.onRecordingStart) {
        this.onRecordingStart();
      }

      return true;
    } catch (error) {
      console.error("❌ Error starting recording:", error);
      this.handleError("Failed to start recording");
      return false;
    }
  }

  stopRecording() {
    if (!this.isRecording) {
      console.warn("⚠️ No recording in progress");
      return;
    }

    this.isRecording = false;
    this.recordingDuration = Date.now() - this.recordingStartTime;

    // Stop timer
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }

    // Stop recording
    this.mediaRecorder.stop();

    console.log(`🛑 Recording stopped after ${this.recordingDuration}ms`);
    if (this.onRecordingStop) {
      this.onRecordingStop(this.recordingDuration);
    }
  }

  startTimer() {
    this.recordingTimer = setInterval(() => {
      const elapsed = Date.now() - this.recordingStartTime;
      if (this.onProgress) {
        this.onProgress(elapsed, this.maxRecordingTime);
      }
    }, 100);
  }

  async uploadAndAnalyze(
    audioBlob,
    analysisType = "general",
    situationType = "casual"
  ) {
    try {
      console.log("📤 Uploading audio for analysis...");

      // Create FormData
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("speechType", analysisType);
      formData.append("situationType", situationType);
      formData.append("conversationTurn", "1");

      // Upload to server
      const response = await fetch(`${this.serverUrl}/api/analyze-audio`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Analysis failed");
      }

      console.log("✅ Audio uploaded successfully");

      // Now analyze with Gemini
      const analysis = await this.analyzeWithGemini(
        result.audioData,
        analysisType,
        situationType
      );

      if (this.onAnalysisComplete) {
        this.onAnalysisComplete(analysis);
      }

      return analysis;
    } catch (error) {
      console.error("❌ Error uploading and analyzing audio:", error);
      this.handleError("Failed to analyze audio: " + error.message);
      throw error;
    }
  }

  async analyzeWithGemini(audioData, analysisType, situationType) {
    try {
      console.log("🧠 Analyzing audio with Gemini AI...");

      // Prepare the prompt based on analysis type
      const prompt = this.generateAnalysisPrompt(analysisType, situationType);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                  {
                    inline_data: {
                      mime_type: audioData.mimeType,
                      data: audioData.base64,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.candidates || !result.candidates[0]) {
        throw new Error("No analysis generated");
      }

      const analysisText = result.candidates[0].content.parts[0].text;

      // Parse the analysis into structured data
      const structuredAnalysis = this.parseAnalysis(analysisText, analysisType);

      console.log("✅ Analysis completed successfully");
      return structuredAnalysis;
    } catch (error) {
      console.error("❌ Error analyzing with Gemini:", error);
      throw error;
    }
  }

  generateAnalysisPrompt(analysisType, situationType) {
    const basePrompt = `
            Please analyze this audio recording for communication effectiveness. 
            
            Analysis Type: ${analysisType}
            Situation Type: ${situationType}
            
            Please provide a comprehensive analysis covering:
            
            1. OVERALL SCORE (0-100): Rate the overall communication effectiveness
            
            2. PACE & RHYTHM:
               - Speaking pace (too fast, too slow, or just right)
               - Use of pauses and timing
               - Rhythm and flow
               
            3. VOCAL QUALITIES:
               - Clarity and articulation
               - Tone and emotional resonance
               - Volume and projection
               - Vocal variety and engagement
               
            4. LANGUAGE & CONTENT:
               - Word choice and vocabulary
               - Sentence structure and grammar
               - Clarity of message
               - Use of filler words
               
            5. CONFIDENCE & PRESENCE:
               - Confidence level
               - Authority and credibility
               - Engagement and energy
               
            6. SPECIFIC STRENGTHS (3-5 specific positive aspects)
            
            7. AREAS FOR IMPROVEMENT (3-5 specific suggestions)
            
            8. ACTIONABLE RECOMMENDATIONS (3-5 concrete steps to improve)
            
            Format your response as JSON with the following structure:
            {
                "overallScore": number,
                "analysis": {
                    "pace": { "score": number, "feedback": "string" },
                    "vocal": { "score": number, "feedback": "string" },
                    "language": { "score": number, "feedback": "string" },
                    "confidence": { "score": number, "feedback": "string" }
                },
                "strengths": ["string", "string", "string"],
                "improvements": ["string", "string", "string"],
                "recommendations": ["string", "string", "string"]
            }
        `;

    return basePrompt;
  }

  parseAnalysis(analysisText, analysisType) {
    try {
      // Try to parse as JSON first
      if (analysisText.includes("{") && analysisText.includes("}")) {
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }

      // If JSON parsing fails, create structured response from text
      return {
        overallScore: 75, // Default score
        analysis: {
          pace: { score: 70, feedback: "Analysis of speaking pace" },
          vocal: { score: 75, feedback: "Analysis of vocal qualities" },
          language: { score: 80, feedback: "Analysis of language use" },
          confidence: { score: 70, feedback: "Analysis of confidence level" },
        },
        strengths: ["Clear articulation", "Good pacing", "Engaging tone"],
        improvements: [
          "Reduce filler words",
          "Vary vocal pitch",
          "Add more pauses",
        ],
        recommendations: [
          "Practice speaking exercises",
          "Record yourself regularly",
          "Focus on breathing",
        ],
        rawAnalysis: analysisText,
      };
    } catch (error) {
      console.error("Error parsing analysis:", error);
      return {
        overallScore: 50,
        analysis: {
          pace: { score: 50, feedback: "Unable to analyze pace" },
          vocal: { score: 50, feedback: "Unable to analyze vocal qualities" },
          language: { score: 50, feedback: "Unable to analyze language" },
          confidence: { score: 50, feedback: "Unable to analyze confidence" },
        },
        strengths: ["Recording received successfully"],
        improvements: ["Analysis system needs improvement"],
        recommendations: ["Please try again with a clearer recording"],
        rawAnalysis: analysisText,
        error: "Analysis parsing failed",
      };
    }
  }

  handleError(message) {
    console.error("AudioRecorder Error:", message);
    if (this.onError) {
      this.onError(message);
    }
  }

  cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }

    this.isRecording = false;
    this.recordedChunks = [];
  }

  // Utility methods
  formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  getRecordingDuration() {
    return this.recordingDuration;
  }

  isCurrentlyRecording() {
    return this.isRecording;
  }
}

// Export for use in other files
window.AudioRecorder = AudioRecorder;
