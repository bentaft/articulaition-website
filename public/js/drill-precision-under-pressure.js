// Precision Under Pressure Master Drill - Advanced AI-Powered Training System
class PrecisionUnderPressureDrill {
    constructor() {
        this.aiEngine = null;
        this.simpleAnalysis = null;
        this.isActive = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.recognition = null;
        this.currentSession = null;
        this.selectedType = null;
        this.selectedIntensity = null;
        this.progressData = this.loadProgressData();
        this.pressureElements = [];
        this.stressFactors = [];
        
        // Pressure type configurations
        this.pressureTypes = {
            'time-pressure': {
                name: 'Time Pressure',
                icon: '🕐',
                description: 'Rapid-fire responses with strict time limits',
                stressFactors: ['countdown', 'time-acceleration', 'buzzer'],
                baseDuration: 60
            },
            'cognitive-load': {
                name: 'Cognitive Load',
                icon: '🧠',
                description: 'Complex information processing while speaking',
                stressFactors: ['multi-task', 'information-overload', 'memory-challenge'],
                baseDuration: 120
            },
            'interruption': {
                name: 'Interruption',
                icon: '🔄',
                description: 'Maintain focus despite constant interruptions',
                stressFactors: ['audio-interruption', 'visual-distraction', 'task-switching'],
                baseDuration: 90
            },
            'high-stakes': {
                name: 'High Stakes',
                icon: '🎯',
                description: 'Critical moments where every word counts',
                stressFactors: ['consequence-awareness', 'audience-pressure', 'performance-anxiety'],
                baseDuration: 180
            }
        };
        
        // Intensity configurations
        this.intensityLevels = {
            'mild': {
                name: 'Mild Pressure',
                multiplier: 1.0,
                stressCount: 1,
                accuracyTarget: 80,
                pressureLevel: 25
            },
            'moderate': {
                name: 'Moderate Pressure',
                multiplier: 0.8,
                stressCount: 2,
                accuracyTarget: 85,
                pressureLevel: 50
            },
            'intense': {
                name: 'Intense Pressure',
                multiplier: 0.6,
                stressCount: 3,
                accuracyTarget: 90,
                pressureLevel: 75
            },
            'extreme': {
                name: 'Extreme Pressure',
                multiplier: 0.4,
                stressCount: 4,
                accuracyTarget: 95,
                pressureLevel: 100
            }
        };
        
        this.init();
    }

    async init() {
        console.log('🎯 Initializing Precision Under Pressure Drill...');
        
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
        
        console.log('✅ Precision Under Pressure Drill initialized');
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
                this.analyzeTranscript(transcript);
            } else {
                interimTranscript += transcript;
            }
        }
        
        this.updateLiveTranscript(finalTranscript + interimTranscript);
    }

    analyzeTranscript(transcript) {
        if (!this.currentSession) return;
        
        // Update session transcript
        this.currentSession.transcript += transcript + ' ';
        
        // Analyze precision metrics
        this.updatePrecisionMetrics(transcript);
        
        // Check for accuracy under pressure
        this.assessAccuracyUnderPressure(transcript);
    }

    updatePrecisionMetrics(transcript) {
        const words = transcript.split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        
        // Calculate words per minute
        const elapsedTime = (Date.now() - this.currentSession.startTime) / 1000 / 60;
        const wordsPerMinute = Math.round(wordCount / Math.max(elapsedTime, 0.1));
        
        // Update metrics
        this.currentSession.wordsPerMinute = wordsPerMinute;
        this.updateMetricDisplay('paceScore', wordsPerMinute);
        
        // Calculate clarity score based on coherence
        const clarityScore = this.calculateClarityScore(transcript);
        this.currentSession.clarityScore = clarityScore;
        this.updateMetricDisplay('clarityScore', clarityScore + '%');
        
        // Update stress level based on speech patterns
        const stressLevel = this.calculateStressLevel(transcript);
        this.currentSession.stressLevel = stressLevel;
        this.updateMetricDisplay('stressLevel', this.getStressLevelLabel(stressLevel));
    }

    calculateClarityScore(transcript) {
        // Basic clarity scoring based on sentence structure and coherence
        const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const averageWordsPerSentence = transcript.split(/\s+/).length / Math.max(sentences.length, 1);
        
        // Optimal range is 10-20 words per sentence
        let clarityScore = 100;
        if (averageWordsPerSentence < 5) clarityScore -= 20;
        if (averageWordsPerSentence > 25) clarityScore -= 30;
        
        // Check for filler words
        const fillerWords = ['um', 'uh', 'like', 'you know', 'so', 'actually'];
        const fillerCount = fillerWords.reduce((count, filler) => {
            return count + (transcript.toLowerCase().split(filler).length - 1);
        }, 0);
        
        clarityScore -= fillerCount * 5;
        
        return Math.max(0, Math.min(100, clarityScore));
    }

    calculateStressLevel(transcript) {
        // Analyze speech patterns for stress indicators
        const indicators = {
            repetition: (transcript.match(/\b(\w+)\s+\1\b/gi) || []).length,
            hesitation: (transcript.match(/\b(um|uh|er)\b/gi) || []).length,
            incomplete: (transcript.match(/\w+\s*-\s*\w+/g) || []).length
        };
        
        const stressScore = (indicators.repetition * 2) + (indicators.hesitation * 3) + (indicators.incomplete * 1);
        
        // Convert to 0-100 scale
        return Math.min(100, stressScore * 5);
    }

    getStressLevelLabel(level) {
        if (level < 25) return 'Low';
        if (level < 50) return 'Moderate';
        if (level < 75) return 'High';
        return 'Extreme';
    }

    assessAccuracyUnderPressure(transcript) {
        // This would typically involve comparing against expected responses
        // For now, we'll use a simplified accuracy calculation
        const accuracy = Math.max(0, 100 - this.currentSession.stressLevel);
        this.currentSession.accuracy = accuracy;
        this.updateMetricDisplay('accuracyScore', accuracy + '%');
    }

    updateMetricDisplay(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    updateLiveTranscript(text) {
        const transcriptArea = document.getElementById('transcriptArea');
        if (transcriptArea) {
            transcriptArea.textContent = text;
            transcriptArea.scrollTop = transcriptArea.scrollHeight;
        }
    }

    setupEventListeners() {
        // Pressure type selection
        document.querySelectorAll('.pressure-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectPressureType(card.dataset.type);
            });
        });
        
        // Intensity selection
        document.querySelectorAll('.intensity-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectIntensity(btn.dataset.intensity);
            });
        });
        
        // Update progress display
        this.updateProgressDisplay();
    }

    selectPressureType(type) {
        // Remove previous selection
        document.querySelectorAll('.pressure-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked card
        document.querySelector(`[data-type="${type}"]`).classList.add('selected');
        
        this.selectedType = type;
        console.log(`Selected pressure type: ${type}`);
        
        // Check if we can start a session
        this.checkSessionReady();
    }

    selectIntensity(intensity) {
        // Remove previous selection
        document.querySelectorAll('.intensity-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selection to clicked button
        document.querySelector(`[data-intensity="${intensity}"]`).classList.add('selected');
        
        this.selectedIntensity = intensity;
        console.log(`Selected intensity: ${intensity}`);
        
        // Check if we can start a session
        this.checkSessionReady();
    }

    checkSessionReady() {
        if (this.selectedType && this.selectedIntensity) {
            this.prepareSession();
        }
    }

    async prepareSession() {
        console.log(`🚀 Preparing ${this.selectedType} session at ${this.selectedIntensity} intensity`);
        
        // Initialize session
        this.currentSession = {
            type: this.selectedType,
            intensity: this.selectedIntensity,
            startTime: null,
            transcript: '',
            accuracy: 0,
            clarityScore: 0,
            wordsPerMinute: 0,
            stressLevel: 0,
            duration: this.calculateSessionDuration(),
            challenge: null
        };
        
        // Generate challenge
        await this.generateChallenge();
        
        // Update UI
        this.updateSessionUI();
        
        // Show practice session
        document.getElementById('practiceSession').classList.add('active');
        document.getElementById('practiceSession').scrollIntoView({ behavior: 'smooth' });
    }

    calculateSessionDuration() {
        const baseTime = this.pressureTypes[this.selectedType].baseDuration;
        const multiplier = this.intensityLevels[this.selectedIntensity].multiplier;
        return Math.round(baseTime * multiplier);
    }

    async generateChallenge() {
        const typeConfig = this.pressureTypes[this.selectedType];
        const intensityConfig = this.intensityLevels[this.selectedIntensity];
        
        if (this.aiEngine && this.aiEngine.isConfigured()) {
            try {
                const challenge = await this.generateAIChallenge(typeConfig, intensityConfig);
                this.currentSession.challenge = challenge;
            } catch (error) {
                console.error('Error generating AI challenge:', error);
                this.useDefaultChallenge(typeConfig, intensityConfig);
            }
        } else {
            this.useDefaultChallenge(typeConfig, intensityConfig);
        }
    }

    async generateAIChallenge(typeConfig, intensityConfig) {
        const systemPrompt = `Generate a precision under pressure challenge for speech training.

Pressure Type: ${typeConfig.name}
Intensity: ${intensityConfig.name}
Duration: ${this.currentSession.duration} seconds
Accuracy Target: ${intensityConfig.accuracyTarget}%

Requirements:
- Create a specific scenario that requires precise, clear communication
- Include realistic pressure elements appropriate to the type
- Provide clear success criteria
- Make it challenging but achievable
- Include specific constraints or obstacles

Return as JSON:
{
  "title": "Challenge title",
  "scenario": "Detailed scenario description",
  "objective": "What the speaker needs to accomplish",
  "constraints": ["constraint1", "constraint2", "constraint3"],
  "successCriteria": ["criteria1", "criteria2"],
  "stressFactors": ["factor1", "factor2"]
}`;

        try {
            const response = await this.aiEngine.generateResponse(systemPrompt, [], 'precision-challenge');
            return JSON.parse(response);
        } catch (error) {
            console.error('AI challenge generation failed:', error);
            throw error;
        }
    }

    useDefaultChallenge(typeConfig, intensityConfig) {
        const defaultChallenges = {
            'time-pressure': {
                mild: {
                    title: 'Quick Status Update',
                    scenario: 'Your boss needs an immediate update on the project status for an urgent client call.',
                    objective: 'Provide a clear, comprehensive project update in 60 seconds',
                    constraints: ['60 second time limit', 'Must cover all key points', 'No notes allowed'],
                    successCriteria: ['Cover timeline, budget, risks', 'Speak clearly and confidently'],
                    stressFactors: ['Countdown timer', 'Time acceleration']
                },
                moderate: {
                    title: 'Emergency Response Brief',
                    scenario: 'Critical system failure requires immediate communication to stakeholders.',
                    objective: 'Deliver emergency response plan in 45 seconds',
                    constraints: ['45 second limit', 'Must include next steps', 'High-stakes situation'],
                    successCriteria: ['Clear action plan', 'Calm delivery', 'Complete information'],
                    stressFactors: ['Urgent countdown', 'Pressure sounds']
                },
                intense: {
                    title: 'Crisis Communication',
                    scenario: 'Major incident requires immediate executive briefing with media waiting.',
                    objective: 'Deliver crisis communication in 30 seconds',
                    constraints: ['30 second limit', 'Media pressure', 'Executive audience'],
                    successCriteria: ['Clear messaging', 'Confident delivery', 'Key facts only'],
                    stressFactors: ['Fast countdown', 'Pressure alerts', 'Time compression']
                },
                extreme: {
                    title: 'Split-Second Decision',
                    scenario: 'Board meeting requires instant decision communication with investors listening.',
                    objective: 'Communicate critical decision in 20 seconds',
                    constraints: ['20 second limit', 'Board pressure', 'Investor impact'],
                    successCriteria: ['Decision clarity', 'Rationale included', 'Confidence projected'],
                    stressFactors: ['Rapid countdown', 'High-pressure audio', 'Time distortion']
                }
            },
            'cognitive-load': {
                mild: {
                    title: 'Multi-Task Presentation',
                    scenario: 'Present quarterly results while monitoring incoming messages and calculating adjustments.',
                    objective: 'Deliver presentation while handling multiple information streams',
                    constraints: ['Process 3 data streams', 'Maintain presentation flow', 'Respond to interruptions'],
                    successCriteria: ['Clear presentation', 'Handle all tasks', 'No information drops'],
                    stressFactors: ['Information overload', 'Multi-tasking pressure']
                },
                moderate: {
                    title: 'Complex Problem Solving',
                    scenario: 'Explain technical solution while calculating costs and addressing stakeholder concerns.',
                    objective: 'Communicate solution while managing complex information',
                    constraints: ['Technical complexity', 'Cost calculations', 'Stakeholder management'],
                    successCriteria: ['Clear explanation', 'Accurate calculations', 'Stakeholder buy-in'],
                    stressFactors: ['Information complexity', 'Calculation pressure', 'Multiple audiences']
                },
                intense: {
                    title: 'High-Complexity Crisis',
                    scenario: 'Coordinate response to multi-faceted crisis while communicating to various stakeholders.',
                    objective: 'Manage crisis communication across multiple channels',
                    constraints: ['Multiple stakeholders', 'Complex situation', 'Coordination required'],
                    successCriteria: ['Clear coordination', 'Consistent messaging', 'Effective prioritization'],
                    stressFactors: ['Complexity overload', 'Coordination pressure', 'Information chaos']
                },
                extreme: {
                    title: 'Ultimate Multi-Task',
                    scenario: 'Lead critical negotiation while managing data analysis and stakeholder communications.',
                    objective: 'Execute high-stakes negotiation with maximum cognitive load',
                    constraints: ['Negotiation dynamics', 'Data analysis', 'Multiple communications'],
                    successCriteria: ['Successful negotiation', 'Data accuracy', 'Stakeholder satisfaction'],
                    stressFactors: ['Cognitive overload', 'Negotiation pressure', 'Information storm']
                }
            }
        };
        
        const typeDefaults = defaultChallenges[this.selectedType] || defaultChallenges['time-pressure'];
        const challenge = typeDefaults[this.selectedIntensity] || typeDefaults.mild;
        
        this.currentSession.challenge = challenge;
    }

    updateSessionUI() {
        const challenge = this.currentSession.challenge;
        const intensityConfig = this.intensityLevels[this.selectedIntensity];
        
        // Update session info
        document.getElementById('sessionType').textContent = this.pressureTypes[this.selectedType].name + ' Training';
        document.getElementById('pressureLabel').textContent = intensityConfig.name;
        
        // Update pressure gauge
        const pressureFill = document.getElementById('pressureFill');
        if (pressureFill) {
            pressureFill.style.width = intensityConfig.pressureLevel + '%';
        }
        
        // Update challenge display
        document.getElementById('challengeTitle').textContent = challenge.title;
        document.getElementById('challengeScenario').textContent = challenge.scenario;
        
        // Update constraints
        document.getElementById('timeConstraint').textContent = this.currentSession.duration + ' seconds';
        document.getElementById('accuracyTarget').textContent = intensityConfig.accuracyTarget + '% accuracy';
        
        // Update timer
        document.getElementById('timerDisplay').textContent = this.formatTime(this.currentSession.duration);
        
        // Reset metrics
        this.resetMetrics();
    }

    resetMetrics() {
        this.updateMetricDisplay('accuracyScore', '0%');
        this.updateMetricDisplay('clarityScore', '0%');
        this.updateMetricDisplay('paceScore', '0');
        this.updateMetricDisplay('stressLevel', 'Low');
        
        // Reset transcript
        document.getElementById('transcriptArea').textContent = 'Your speech will appear here in real-time...';
        
        // Reset pressure indicators
        document.querySelectorAll('.pressure-indicator').forEach(indicator => {
            indicator.classList.remove('active');
        });
    }

    async togglePractice() {
        if (!this.isActive) {
            await this.startPractice();
        } else {
            this.stopPractice();
        }
    }

    async startPractice() {
        if (!this.currentSession) {
            alert('Please select pressure type and intensity first!');
            return;
        }
        
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
            this.isActive = true;
            this.currentSession.startTime = Date.now();
            
            // Start speech recognition
            if (this.recognition) {
                this.recognition.start();
            }
            
            // Start timer and pressure effects
            this.startTimer();
            this.startPressureEffects();
            
            // Update UI
            this.updatePracticeUI(true);
            
            console.log('🎤 Practice session started');
            
        } catch (error) {
            console.error('Error starting practice:', error);
            alert('Please allow microphone access to use this drill.');
        }
    }

    stopPractice() {
        this.isActive = false;
        
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }
        
        if (this.recognition) {
            this.recognition.stop();
        }
        
        this.stopTimer();
        this.stopPressureEffects();
        this.updatePracticeUI(false);
        
        console.log('⏹️ Practice session stopped');
    }

    startTimer() {
        let timeLeft = this.currentSession.duration;
        this.updateTimerDisplay(timeLeft);
        
        this.timerInterval = setInterval(() => {
            timeLeft--;
            this.updateTimerDisplay(timeLeft);
            
            if (timeLeft <= 0) {
                this.stopPractice();
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
        const display = this.formatTime(seconds);
        const timerElement = document.getElementById('timerDisplay');
        if (timerElement) {
            timerElement.textContent = display;
            
            // Add visual effects for pressure
            if (seconds <= 10 && seconds > 0) {
                timerElement.style.color = 'var(--drill-warning)';
                timerElement.style.animation = 'pulse 0.5s infinite';
            } else if (seconds === 0) {
                timerElement.style.color = 'var(--drill-primary)';
                timerElement.style.animation = 'none';
            }
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    startPressureEffects() {
        const typeConfig = this.pressureTypes[this.selectedType];
        const intensityConfig = this.intensityLevels[this.selectedIntensity];
        
        // Activate pressure indicators
        this.activatePressureIndicators();
        
        // Start stress factors based on type and intensity
        this.startStressFactors(typeConfig, intensityConfig);
    }

    activatePressureIndicators() {
        const indicators = ['stressIndicator', 'focusIndicator', 'precisionIndicator'];
        indicators.forEach((id, index) => {
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.classList.add('active');
                }
            }, index * 1000);
        });
    }

    startStressFactors(typeConfig, intensityConfig) {
        // Implementation would depend on pressure type
        // For now, we'll simulate general pressure effects
        if (this.selectedType === 'time-pressure') {
            this.startTimePressureEffects(intensityConfig);
        } else if (this.selectedType === 'interruption') {
            this.startInterruptionEffects(intensityConfig);
        }
    }

    startTimePressureEffects(intensityConfig) {
        // Accelerate pressure as time runs out
        const pressureInterval = setInterval(() => {
            if (!this.isActive) {
                clearInterval(pressureInterval);
                return;
            }
            
            // Add visual pressure effects
            const practiceSession = document.getElementById('practiceSession');
            if (practiceSession) {
                practiceSession.classList.add('pressure-shake');
                setTimeout(() => {
                    practiceSession.classList.remove('pressure-shake');
                }, 500);
            }
        }, 3000 / intensityConfig.pressureLevel * 100);
        
        this.pressureEffects = [pressureInterval];
    }

    startInterruptionEffects(intensityConfig) {
        // Simulate interruptions
        const interruptionInterval = setInterval(() => {
            if (!this.isActive) {
                clearInterval(interruptionInterval);
                return;
            }
            
            // Flash pressure indicators
            document.querySelectorAll('.pressure-indicator').forEach(indicator => {
                indicator.style.opacity = '0.3';
                setTimeout(() => {
                    indicator.style.opacity = '1';
                }, 200);
            });
        }, 5000 / intensityConfig.stressCount);
        
        this.pressureEffects = [interruptionInterval];
    }

    stopPressureEffects() {
        // Clear all pressure effect intervals
        if (this.pressureEffects) {
            this.pressureEffects.forEach(effect => {
                clearInterval(effect);
            });
            this.pressureEffects = [];
        }
        
        // Reset pressure indicators
        document.querySelectorAll('.pressure-indicator').forEach(indicator => {
            indicator.classList.remove('active');
            indicator.style.opacity = '1';
        });
    }

    updatePracticeUI(active) {
        const startBtn = document.getElementById('startBtn');
        const resetBtn = document.getElementById('resetBtn');
        
        if (active) {
            startBtn.innerHTML = `
                <i data-lucide="square"></i>
                Stop Challenge
            `;
            startBtn.classList.remove('primary');
            startBtn.classList.add('secondary');
            resetBtn.disabled = true;
        } else {
            startBtn.innerHTML = `
                <i data-lucide="play"></i>
                Start Challenge
            `;
            startBtn.classList.remove('secondary');
            startBtn.classList.add('primary');
            resetBtn.disabled = false;
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
                const results = await this.simpleAnalysis.analyzeAudio(audioFile, 'drill-precision-pressure');
                
                if (results.success && results.transcript) {
                    // Update session transcript
                    this.currentSession.transcript = results.transcript;
                    
                    // Perform detailed precision analysis
                    const precisionMetrics = this.analyzePrecisionMetrics(results.transcript);
                    
                    // Get AI analysis specific to precision under pressure
                    const analysisPrompt = `Analyze this precision under pressure speech session.

Challenge: ${this.currentSession.challenge.title}
Scenario: ${this.currentSession.challenge.scenario}
Transcript: "${results.transcript}"

Session Details:
- Type: ${this.currentSession.type}
- Intensity: ${this.currentSession.intensity}
- Duration: ${this.currentSession.duration} seconds
- Word count: ${precisionMetrics.wordCount}
- Speech rate: ${precisionMetrics.wordsPerMinute} WPM
- Hesitations detected: ${precisionMetrics.hesitations}
- Incomplete thoughts: ${precisionMetrics.incompleteThoughts}
- Repetitions: ${precisionMetrics.repetitions}

Provide detailed analysis in JSON format:
{
  "overallScore": number (0-100),
  "responseTime": number (average seconds),
  "pressureAccuracy": number (0-100),
  "stressRecovery": number (0-100),
  "verbalFluency": number (0-100),
  "speechMetrics": {
    "speechRate": number (words per minute),
    "confidenceScore": number (0-100),
    "pitchStability": number (0-100),
    "sentenceFluidity": number (0-100)
  },
  "precisionUnderPressure": {
    "clarityMaintained": number (0-100),
    "accuracyUnderStress": number (0-100),
    "thoughtCompletionRate": number (0-100),
    "coherenceScore": number (0-100)
  },
  "strengthsUnderPressure": ["strength1", "strength2"],
  "improvementAreas": ["area1", "area2"],
  "personalizedCoaching": "detailed coaching feedback",
  "nextLevelRecommendation": "specific next steps"
}`;

                    const response = await this.aiEngine.generateResponse(analysisPrompt, [], 'precision-analysis');
                    const analysis = JSON.parse(response);
                    
                    // Update session with complete analysis
                    this.currentSession.aiAnalysis = analysis;
                    this.currentSession.precisionMetrics = precisionMetrics;
                    
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
    
    analyzePrecisionMetrics(transcript) {
        const words = transcript.split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        const wordsPerMinute = Math.round((wordCount / this.currentSession.duration) * 60);
        
        // Detect hesitations
        const hesitationPattern = /\b(um|uh|er|ah)\b/gi;
        const hesitations = (transcript.match(hesitationPattern) || []).length;
        
        // Detect incomplete thoughts (ending with ...)
        const incompletePattern = /\.\.\.(?!\s*[A-Z])/g;
        const incompleteThoughts = (transcript.match(incompletePattern) || []).length;
        
        // Detect repetitions
        const repetitionPattern = /\b(\w+)\s+\1\b/gi;
        const repetitions = (transcript.match(repetitionPattern) || []).length;
        
        return {
            wordCount,
            wordsPerMinute,
            hesitations,
            incompleteThoughts,
            repetitions
        };
    }

    performBasicAnalysis() {
        const elapsedTime = (Date.now() - this.currentSession.startTime) / 1000;
        const responseTime = elapsedTime / 10; // Average response time estimation
        
        this.currentSession.basicAnalysis = {
            overallScore: Math.round((this.currentSession.accuracy + this.currentSession.clarityScore) / 2),
            responseTime: responseTime.toFixed(1),
            pressureAccuracy: this.currentSession.accuracy,
            stressRecovery: Math.max(0, 100 - this.currentSession.stressLevel),
            verbalFluency: this.currentSession.clarityScore
        };
    }

    updateAnalysisResults(analysis) {
        if (analysis) {
            document.getElementById('overallScore').textContent = analysis.overallScore;
            document.getElementById('responseTime').textContent = analysis.responseTime + 's';
            document.getElementById('pressureAccuracy').textContent = analysis.pressureAccuracy + '%';
            document.getElementById('stressRecovery').textContent = analysis.stressRecovery + '%';
            document.getElementById('verbalFluency').textContent = analysis.verbalFluency + '%';
            document.getElementById('aiFeedbackContent').textContent = analysis.personalizedCoaching;
        } else {
            // Use basic analysis
            const basic = this.currentSession.basicAnalysis;
            document.getElementById('overallScore').textContent = basic.overallScore;
            document.getElementById('responseTime').textContent = basic.responseTime + 's';
            document.getElementById('pressureAccuracy').textContent = basic.pressureAccuracy + '%';
            document.getElementById('stressRecovery').textContent = basic.stressRecovery + '%';
            document.getElementById('verbalFluency').textContent = basic.verbalFluency + '%';
            document.getElementById('aiFeedbackContent').textContent = 'Complete more sessions to receive personalized AI coaching feedback.';
        }
    }

    showAnalysisResults() {
        document.getElementById('analysisResults').classList.add('visible');
        document.getElementById('analysisResults').scrollIntoView({ behavior: 'smooth' });
    }

    saveSessionProgress() {
        const analysis = this.currentSession.aiAnalysis || this.currentSession.basicAnalysis;
        
        // Save to progress data
        const sessionSummary = {
            date: new Date().toISOString(),
            type: this.currentSession.type,
            intensity: this.currentSession.intensity,
            score: analysis.overallScore,
            accuracy: this.currentSession.accuracy,
            duration: this.currentSession.duration
        };
        
        this.progressData.recentSessions.unshift(sessionSummary);
        this.progressData.recentSessions = this.progressData.recentSessions.slice(0, 10);
        
        // Update overall stats
        this.progressData.totalChallenges++;
        this.progressData.totalScore += analysis.overallScore;
        
        // Recalculate averages
        this.progressData.averageScore = Math.round(this.progressData.totalScore / this.progressData.totalChallenges);
        this.progressData.bestPerformance = Math.max(this.progressData.bestPerformance, analysis.overallScore);
        
        // Calculate improvement rate
        if (this.progressData.recentSessions.length >= 2) {
            const recent = this.progressData.recentSessions[0].score;
            const previous = this.progressData.recentSessions[1].score;
            this.progressData.improvementRate = Math.round(((recent - previous) / previous) * 100);
        }
        
        // Calculate stress resilience
        this.progressData.stressResilience = Math.round(
            this.progressData.recentSessions.reduce((sum, session) => sum + session.accuracy, 0) / 
            this.progressData.recentSessions.length
        );
        
        // Save to localStorage
        localStorage.setItem('precisionUnderPressureProgress', JSON.stringify(this.progressData));
        
        // Update progress display
        this.updateProgressDisplay();
        
        // Record in user data tracker if available
        if (window.userDataTracker) {
            window.userDataTracker.recordAnalysis(
                'drill-precision-pressure', 
                analysis.overallScore, 
                this.currentSession.duration / 60
            );
        }
        
        console.log('✅ Session progress saved');
    }

    loadProgressData() {
        const saved = localStorage.getItem('precisionUnderPressureProgress');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            totalChallenges: 0,
            totalScore: 0,
            averageScore: 0,
            bestPerformance: 0,
            improvementRate: 0,
            stressResilience: 0,
            recentSessions: []
        };
    }

    updateProgressDisplay() {
        document.getElementById('totalChallenges').textContent = this.progressData.totalChallenges;
        document.getElementById('averageScore').textContent = this.progressData.averageScore;
        document.getElementById('bestPerformance').textContent = this.progressData.bestPerformance + '%';
        document.getElementById('improvementRate').textContent = (this.progressData.improvementRate >= 0 ? '+' : '') + this.progressData.improvementRate + '%';
        document.getElementById('stressResilience').textContent = this.progressData.stressResilience + '%';
    }

    resetSession() {
        if (this.isActive) {
            this.stopPractice();
        }
        
        // Reset UI
        this.resetMetrics();
        document.getElementById('timerDisplay').textContent = this.formatTime(this.currentSession?.duration || 60);
        document.getElementById('analysisResults').classList.remove('visible');
        
        // Reset session data
        if (this.currentSession) {
            this.currentSession.accuracy = 0;
            this.currentSession.clarityScore = 0;
            this.currentSession.wordsPerMinute = 0;
            this.currentSession.stressLevel = 0;
            this.currentSession.transcript = '';
        }
        
        console.log('🔄 Session reset');
    }

    startNewSession() {
        this.resetSession();
        document.getElementById('analysisResults').classList.remove('visible');
        
        // Generate new challenge
        if (this.currentSession) {
            this.generateChallenge().then(() => {
                this.updateSessionUI();
            });
        }
    }

    changeIntensity() {
        document.getElementById('practiceSession').classList.remove('active');
        document.getElementById('analysisResults').classList.remove('visible');
        this.resetSession();
        
        // Reset selections
        this.selectedType = null;
        this.selectedIntensity = null;
        document.querySelectorAll('.pressure-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelectorAll('.intensity-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    }
}

// Global functions for UI interactions
let precisionDrill = null;

function togglePractice() {
    if (precisionDrill) {
        precisionDrill.togglePractice();
    }
}

function resetSession() {
    if (precisionDrill) {
        precisionDrill.resetSession();
    }
}

function startNewSession() {
    if (precisionDrill) {
        precisionDrill.startNewSession();
    }
}

function changeIntensity() {
    if (precisionDrill) {
        precisionDrill.changeIntensity();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    precisionDrill = new PrecisionUnderPressureDrill();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PrecisionUnderPressureDrill;
}