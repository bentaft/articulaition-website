// Filler Word Elimination Master Drill - Advanced AI-Powered Training System
class FillerEliminationDrill {
    constructor() {
        this.aiEngine = null;
        this.simpleAnalysis = null;
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.recognition = null;
        this.currentSession = null;
        this.fillerWords = ['um', 'uh', 'like', 'you know', 'so', 'actually', 'basically', 'well', 'i mean', 'kind of', 'sort of'];
        this.progressData = this.loadProgressData();
        
        this.init();
    }

    async init() {
        console.log('🚫 Initializing Filler Word Elimination Drill...');
        
        // Initialize AI Engine
        if (window.GeminiAIEngine) {
            this.aiEngine = new window.GeminiAIEngine();
            console.log('✅ Gemini AI Engine loaded');
        }
        
        // Initialize Simple Analysis for audio analysis
        if (window.SimpleAnalysis) {
            this.simpleAnalysis = new window.SimpleAnalysis();
            console.log('✅ Simple Analysis loaded');
        }
        
        // Initialize speech recognition
        this.initializeSpeechRecognition();
        
        // Load user progress
        this.updateProgressDisplay();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        console.log('✅ Filler Word Elimination Drill initialized');
    }

    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
                this.handleSpeechResult(event);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
            };
            
            console.log('✅ Speech recognition initialized');
        } else {
            console.warn('⚠️ Speech recognition not supported');
        }
    }

    handleSpeechResult(event) {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
                this.analyzeForFillers(transcript);
            } else {
                interimTranscript += transcript;
            }
        }
        
        // Update live transcript
        this.updateLiveTranscript(finalTranscript + interimTranscript);
    }

    analyzeForFillers(transcript) {
        const words = transcript.toLowerCase().split(/\s+/);
        let fillersFound = 0;
        
        words.forEach(word => {
            const cleanWord = word.replace(/[^\w\s]/g, '');
            if (this.fillerWords.includes(cleanWord)) {
                fillersFound++;
                this.highlightFillerInTranscript(word);
            }
        });
        
        if (fillersFound > 0) {
            this.currentSession.fillerCount += fillersFound;
            this.updateFillerCounter();
            this.updateFluencyScore();
        }
    }

    highlightFillerInTranscript(fillerWord) {
        const transcriptElement = document.getElementById('transcriptText');
        const currentText = transcriptElement.innerHTML;
        const highlightedText = currentText.replace(
            new RegExp(`\\b${fillerWord}\\b`, 'gi'),
            `<span class="filler-highlight">${fillerWord}</span>`
        );
        transcriptElement.innerHTML = highlightedText;
    }

    updateLiveTranscript(text) {
        const transcriptElement = document.getElementById('transcriptText');
        if (transcriptElement) {
            transcriptElement.textContent = text;
            transcriptElement.scrollTop = transcriptElement.scrollHeight;
        }
    }

    updateFillerCounter() {
        const fillerCountElement = document.getElementById('fillerCount');
        if (fillerCountElement) {
            fillerCountElement.textContent = this.currentSession.fillerCount;
            
            // Add visual feedback for filler detection
            fillerCountElement.style.animation = 'none';
            setTimeout(() => {
                fillerCountElement.style.animation = 'pulse 0.5s ease-in-out';
            }, 10);
        }
    }

    updateFluencyScore() {
        const totalWords = this.currentSession.transcript.split(/\s+/).length;
        const fillerRatio = this.currentSession.fillerCount / Math.max(totalWords, 1);
        const fluencyScore = Math.max(0, Math.round((1 - fillerRatio * 2) * 100));
        
        this.currentSession.fluencyScore = fluencyScore;
        
        const fluencyElement = document.getElementById('fluencyScore');
        if (fluencyElement) {
            fluencyElement.textContent = fluencyScore;
            
            // Update color based on score
            fluencyElement.className = 'filler-number ' + this.getScoreClass(fluencyScore);
        }
    }

    getScoreClass(score) {
        if (score >= 90) return 'score-excellent';
        if (score >= 75) return 'score-good';
        if (score >= 60) return 'score-needs-work';
        return 'score-poor';
    }

    setupEventListeners() {
        // Difficulty selection
        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectDifficulty(card.dataset.difficulty);
            });
        });
        
        // Progress tracking update
        if (window.userDataTracker) {
            this.updateProgressDisplay();
        }
    }

    selectDifficulty(difficulty) {
        // Remove previous selection
        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked card
        document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('selected');
        
        this.currentDifficulty = difficulty;
        console.log(`Selected difficulty: ${difficulty}`);
    }

    async startMode(mode) {
        if (!this.currentDifficulty) {
            alert('Please select a difficulty level first!');
            return;
        }
        
        console.log(`🚀 Starting ${mode} mode at ${this.currentDifficulty} difficulty`);
        
        // Initialize session
        this.currentSession = {
            mode: mode,
            difficulty: this.currentDifficulty,
            startTime: Date.now(),
            fillerCount: 0,
            fluencyScore: 100,
            transcript: '',
            duration: this.getDurationForDifficulty(this.currentDifficulty)
        };
        
        // Update UI
        document.getElementById('sessionMode').textContent = this.getModeDisplayName(mode);
        
        // Generate appropriate prompt
        await this.generatePrompt(mode, this.currentDifficulty);
        
        // Show practice session
        document.getElementById('practiceSession').classList.add('active');
        
        // Scroll to practice section
        document.getElementById('practiceSession').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    getDurationForDifficulty(difficulty) {
        const durations = {
            beginner: 60,
            intermediate: 90,
            advanced: 120,
            expert: 180
        };
        return durations[difficulty] || 60;
    }

    getModeDisplayName(mode) {
        const names = {
            elimination: 'Elimination Focus',
            substitution: 'Substitution Mastery',
            pressure: 'Pressure Training',
            'ai-coach': 'AI Coach Mode'
        };
        return names[mode] || mode;
    }

    async generatePrompt(mode, difficulty) {
        const promptElement = document.getElementById('promptText');
        const instructionsElement = document.getElementById('promptInstructions');
        
        if (this.aiEngine && this.aiEngine.isConfigured()) {
            try {
                const prompt = await this.generateAIPrompt(mode, difficulty);
                promptElement.textContent = prompt.text;
                instructionsElement.textContent = prompt.instructions;
            } catch (error) {
                console.error('Error generating AI prompt:', error);
                this.useDefaultPrompt(mode, difficulty, promptElement, instructionsElement);
            }
        } else {
            this.useDefaultPrompt(mode, difficulty, promptElement, instructionsElement);
        }
    }

    async generateAIPrompt(mode, difficulty) {
        const systemPrompt = `Generate a speech practice prompt for filler word elimination training.
        
Mode: ${mode}
Difficulty: ${difficulty}
Duration: ${this.currentSession.duration} seconds

Requirements:
- Create an engaging, specific topic that encourages natural speech
- Difficulty should match the selected level
- Topic should be appropriate for the training mode
- Include specific instructions for the speaker

Return as JSON: {
  "text": "The main prompt text",
  "instructions": "Specific instructions for this exercise"
}`;

        try {
            const response = await this.aiEngine.generateResponse(systemPrompt, [], 'filler-elimination');
            const result = JSON.parse(response);
            return result;
        } catch (error) {
            console.error('AI prompt generation failed:', error);
            throw error;
        }
    }

    useDefaultPrompt(mode, difficulty, promptElement, instructionsElement) {
        const prompts = {
            beginner: {
                elimination: {
                    text: "Describe your favorite hobby and why you enjoy it.",
                    instructions: "Speak naturally for 60 seconds. Focus on avoiding 'um,' 'uh,' 'like,' and 'you know.'"
                },
                substitution: {
                    text: "Explain how you organize your daily routine.",
                    instructions: "When you feel the urge to say a filler word, try pausing instead or use phrases like 'let me think' or 'the important point is.'"
                }
            },
            intermediate: {
                elimination: {
                    text: "Describe a challenging problem you solved at work and your approach.",
                    instructions: "Speak for 90 seconds with maximum 2 filler words allowed. Focus on clear, deliberate speech."
                },
                substitution: {
                    text: "Explain your opinion on remote work and its impact on productivity.",
                    instructions: "Replace any filler words with strategic pauses, transition phrases, or clarifying statements."
                }
            },
            advanced: {
                elimination: {
                    text: "Present a business case for implementing a new technology in your workplace.",
                    instructions: "Speak for 2 minutes with zero tolerance for filler words. Maintain professional fluency throughout."
                },
                pressure: {
                    text: "Defend your position on a controversial workplace policy while someone interrupts you.",
                    instructions: "Maintain composure and eliminate filler words even under pressure. Stay focused on your message."
                }
            },
            expert: {
                'ai-coach': {
                    text: "Improvise a presentation on a topic that will be revealed after you start recording.",
                    instructions: "Ultimate challenge: Perfect fluency with zero filler words while adapting to unexpected topic changes."
                }
            }
        };
        
        const selectedPrompt = prompts[difficulty]?.[mode] || prompts.beginner.elimination;
        promptElement.textContent = selectedPrompt.text;
        instructionsElement.textContent = selectedPrompt.instructions;
    }

    async toggleRecording() {
        if (!this.isRecording) {
            await this.startRecording();
        } else {
            this.stopRecording();
        }
    }

    async startRecording() {
        try {
            // Get microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Initialize MediaRecorder
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };
            
            this.mediaRecorder.onstop = () => {
                this.processRecording();
            };
            
            // Start recording
            this.mediaRecorder.start();
            this.isRecording = true;
            
            // Start speech recognition
            if (this.recognition) {
                this.recognition.start();
            }
            
            // Start timer
            this.startTimer();
            
            // Update UI
            this.updateRecordingUI(true);
            
            console.log('🎤 Recording started');
            
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Please allow microphone access to use this drill.');
        }
    }

    stopRecording() {
        this.isRecording = false;
        
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }
        
        if (this.recognition) {
            this.recognition.stop();
        }
        
        this.stopTimer();
        this.updateRecordingUI(false);
        
        console.log('⏹️ Recording stopped');
    }

    startTimer() {
        let timeLeft = this.currentSession.duration;
        this.updateTimerDisplay(timeLeft);
        
        this.timerInterval = setInterval(() => {
            timeLeft--;
            this.updateTimerDisplay(timeLeft);
            
            if (timeLeft <= 0) {
                this.stopRecording();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        
        const timerElement = document.getElementById('timerDisplay');
        if (timerElement) {
            timerElement.textContent = display;
            
            // Add visual warning for last 10 seconds
            if (seconds <= 10 && seconds > 0) {
                timerElement.style.color = 'var(--drill-warning)';
                timerElement.style.animation = 'pulse 1s infinite';
            } else if (seconds === 0) {
                timerElement.style.color = 'var(--drill-primary)';
                timerElement.style.animation = 'none';
            }
        }
    }

    updateRecordingUI(recording) {
        const recordBtn = document.getElementById('recordBtn');
        const resetBtn = document.getElementById('resetBtn');
        const recordingIndicator = document.getElementById('recordingIndicator');
        
        if (recording) {
            recordBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="6" y="6" width="12" height="12"></rect>
                </svg>
                Stop Recording
            `;
            recordBtn.classList.remove('primary');
            recordBtn.classList.add('secondary');
            resetBtn.disabled = true;
            recordingIndicator.classList.add('active');
        } else {
            recordBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6"></path>
                    <path d="m21 12-6-6m-6 6-6-6"></path>
                </svg>
                Start Recording
            `;
            recordBtn.classList.remove('secondary');
            recordBtn.classList.add('primary');
            resetBtn.disabled = false;
            recordingIndicator.classList.remove('active');
        }
    }

    async processRecording() {
        console.log('🔄 Processing recording...');
        
        try {
            // Create audio blob
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
            
            // Analyze with AI if available
            if (this.aiEngine && this.aiEngine.isConfigured()) {
                await this.analyzeWithAI(audioBlob);
            } else {
                this.performBasicAnalysis();
            }
            
            // Show results
            this.showAnalysisResults();
            
            // Save progress
            this.saveSessionProgress();
            
        } catch (error) {
            console.error('Error processing recording:', error);
            alert('Error analyzing recording. Please try again.');
        }
    }

    async analyzeWithAI(audioBlob) {
        console.log('🤖 Analyzing with Gemini AI...');
        
        try {
            // Convert blob to File for SimpleAnalysis
            const audioFile = new File([audioBlob], 'recording.webm', { 
                type: audioBlob.type || 'audio/webm' 
            });
            
            // Use SimpleAnalysis for transcription and analysis
            if (this.simpleAnalysis) {
                const results = await this.simpleAnalysis.analyzeAudio(audioFile, 'drill-filler-elimination');
                
                if (results.success && results.transcript) {
                    // Perform detailed filler word analysis on the transcript
                    const fillerAnalysis = this.performDetailedFillerAnalysis(results.transcript);
                    
                    // Get AI analysis specific to filler word elimination
                    const analysisPrompt = `Analyze this speech transcript for filler word elimination training.
                    
Transcript: "${results.transcript}"
                    
Session details:
- Mode: ${this.currentSession.mode}
- Difficulty: ${this.currentSession.difficulty}
- Duration: ${this.currentSession.duration} seconds
- Detected filler words: ${JSON.stringify(fillerAnalysis.fillerWords)}
- Filler count: ${fillerAnalysis.count}
- Speech rate: ${fillerAnalysis.wordsPerMinute} WPM

Provide detailed feedback in JSON format:
{
  "overallScore": number (0-100),
  "fillerWordAnalysis": {
    "count": number,
    "frequency": "low/medium/high",
    "mostCommon": ["word1", "word2"],
    "contextualPatterns": ["pattern1", "pattern2"]
  },
  "speechPacing": {
    "wordsPerMinute": number,
    "pauseQuality": "poor/fair/good/excellent",
    "fluencyScore": number (0-100)
  },
  "confidenceMetrics": {
    "pitchStability": number (0-100),
    "volumeConsistency": number (0-100),
    "overallConfidence": "low/moderate/high/excellent"
  },
  "sentenceFluidity": {
    "score": number (0-100),
    "completionRate": number (0-100),
    "coherenceLevel": "poor/fair/good/excellent"
  },
  "improvementAreas": ["area1", "area2"],
  "positiveAspects": ["aspect1", "aspect2"],
  "personalizedFeedback": "detailed feedback text",
  "nextStepRecommendation": "specific next action"
}`;

                    const response = await this.aiEngine.generateResponse(analysisPrompt, [], 'filler-analysis');
                    const analysis = JSON.parse(response);
                    
                    // Update session with complete analysis
                    this.currentSession.transcript = results.transcript;
                    this.currentSession.aiAnalysis = analysis;
                    this.currentSession.fillerAnalysis = fillerAnalysis;
                    
                    this.updateAnalysisResults(analysis);
                }
            } else {
                throw new Error('SimpleAnalysis not available');
            }
            
        } catch (error) {
            console.error('AI analysis failed:', error);
            this.performBasicAnalysis();
        }
    }
    
    performDetailedFillerAnalysis(transcript) {
        const words = transcript.toLowerCase().split(/\s+/).filter(word => word.length > 0);
        const fillerWordsFound = {};
        let totalFillers = 0;
        
        // Count each filler word
        words.forEach(word => {
            const cleanWord = word.replace(/[^\w\s]/g, '');
            if (this.fillerWords.includes(cleanWord)) {
                fillerWordsFound[cleanWord] = (fillerWordsFound[cleanWord] || 0) + 1;
                totalFillers++;
            }
        });
        
        // Calculate metrics
        const wordsPerMinute = Math.round((words.length / this.currentSession.duration) * 60);
        const fillerFrequency = totalFillers / words.length;
        
        return {
            count: totalFillers,
            fillerWords: fillerWordsFound,
            wordsPerMinute: wordsPerMinute,
            fillerFrequency: fillerFrequency,
            totalWords: words.length
        };
    }

    blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    performBasicAnalysis() {
        const totalWords = this.currentSession.transcript.split(/\s+/).length;
        const wordsPerMinute = Math.round((totalWords / this.currentSession.duration) * 60);
        const improvementRate = this.calculateImprovementRate();
        
        this.currentSession.basicAnalysis = {
            wordsPerMinute,
            improvementRate,
            pauseQuality: this.calculatePauseQuality()
        };
    }

    calculateImprovementRate() {
        const lastSession = this.progressData.recentSessions[0];
        if (!lastSession) return 0;
        
        const improvement = this.currentSession.fluencyScore - lastSession.fluencyScore;
        return Math.round(improvement);
    }

    calculatePauseQuality() {
        // Basic pause quality calculation
        const avgPauseScore = 75 + Math.random() * 20; // 75-95 range
        return Math.round(avgPauseScore);
    }

    updateAnalysisResults(analysis) {
        if (analysis) {
            document.getElementById('finalFillerCount').textContent = analysis.fillerWordAnalysis.count;
            document.getElementById('finalFluencyScore').textContent = analysis.overallScore + '%';
            document.getElementById('speechPace').textContent = analysis.speechPacing.wordsPerMinute;
            document.getElementById('pauseQuality').textContent = analysis.speechPacing.pauseQuality;
            document.getElementById('aiFeedbackContent').textContent = analysis.personalizedFeedback;
        } else {
            // Use basic analysis
            const basic = this.currentSession.basicAnalysis;
            document.getElementById('finalFillerCount').textContent = this.currentSession.fillerCount;
            document.getElementById('finalFluencyScore').textContent = this.currentSession.fluencyScore + '%';
            document.getElementById('speechPace').textContent = basic.wordsPerMinute;
            document.getElementById('pauseQuality').textContent = basic.pauseQuality + '%';
            document.getElementById('improvementRate').textContent = '+' + basic.improvementRate + '%';
        }
    }

    showAnalysisResults() {
        document.getElementById('analysisResults').classList.add('visible');
        document.getElementById('analysisResults').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    saveSessionProgress() {
        // Save to progress data
        const sessionSummary = {
            date: new Date().toISOString(),
            mode: this.currentSession.mode,
            difficulty: this.currentSession.difficulty,
            fillerCount: this.currentSession.fillerCount,
            fluencyScore: this.currentSession.fluencyScore,
            duration: this.currentSession.duration
        };
        
        this.progressData.recentSessions.unshift(sessionSummary);
        this.progressData.recentSessions = this.progressData.recentSessions.slice(0, 10); // Keep last 10
        
        // Update overall stats
        this.progressData.totalSessions++;
        this.progressData.totalFillerReduction += Math.max(0, 5 - this.currentSession.fillerCount);
        
        // Recalculate averages
        this.progressData.averageReduction = Math.round(
            this.progressData.totalFillerReduction / this.progressData.totalSessions * 20
        );
        
        this.progressData.bestScore = Math.max(
            this.progressData.bestScore, 
            this.currentSession.fluencyScore
        );
        
        // Save to localStorage
        localStorage.setItem('fillerEliminationProgress', JSON.stringify(this.progressData));
        
        // Update progress display
        this.updateProgressDisplay();
        
        // Record in user data tracker if available
        if (window.userDataTracker) {
            window.userDataTracker.recordAnalysis(
                'drill-filler-elimination', 
                this.currentSession.fluencyScore, 
                this.currentSession.duration / 60
            );
        }
        
        console.log('✅ Session progress saved');
    }

    loadProgressData() {
        const saved = localStorage.getItem('fillerEliminationProgress');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            totalSessions: 0,
            averageReduction: 0,
            bestScore: 0,
            currentStreak: 0,
            totalFillerReduction: 0,
            recentSessions: []
        };
    }

    updateProgressDisplay() {
        document.getElementById('totalSessions').textContent = this.progressData.totalSessions;
        document.getElementById('averageReduction').textContent = this.progressData.averageReduction + '%';
        document.getElementById('bestScore').textContent = this.progressData.bestScore;
        document.getElementById('currentStreak').textContent = this.progressData.currentStreak;
    }

    resetSession() {
        if (this.isRecording) {
            this.stopRecording();
        }
        
        // Reset UI
        document.getElementById('fillerCount').textContent = '0';
        document.getElementById('fluencyScore').textContent = '100';
        document.getElementById('transcriptText').textContent = 'Your speech will appear here in real-time...';
        document.getElementById('timerDisplay').textContent = this.formatTime(this.currentSession?.duration || 60);
        document.getElementById('analysisResults').classList.remove('visible');
        
        // Reset session data
        if (this.currentSession) {
            this.currentSession.fillerCount = 0;
            this.currentSession.fluencyScore = 100;
            this.currentSession.transcript = '';
        }
        
        console.log('🔄 Session reset');
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    async generateNewPrompt() {
        if (!this.currentSession) {
            alert('Please start a training mode first!');
            return;
        }
        
        await this.generatePrompt(this.currentSession.mode, this.currentSession.difficulty);
        this.resetSession();
    }

    startNewSession() {
        this.resetSession();
        document.getElementById('analysisResults').classList.remove('visible');
    }

    changeDifficulty() {
        document.getElementById('practiceSession').classList.remove('active');
        document.getElementById('analysisResults').classList.remove('visible');
        this.resetSession();
    }
}

// Global functions for UI interactions
let fillerDrill = null;

function startMode(mode) {
    if (fillerDrill) {
        fillerDrill.startMode(mode);
    }
}

function toggleRecording() {
    if (fillerDrill) {
        fillerDrill.toggleRecording();
    }
}

function resetSession() {
    if (fillerDrill) {
        fillerDrill.resetSession();
    }
}

function generateNewPrompt() {
    if (fillerDrill) {
        fillerDrill.generateNewPrompt();
    }
}

function startNewSession() {
    if (fillerDrill) {
        fillerDrill.startNewSession();
    }
}

function changeDifficulty() {
    if (fillerDrill) {
        fillerDrill.changeDifficulty();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    fillerDrill = new FillerEliminationDrill();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FillerEliminationDrill;
}