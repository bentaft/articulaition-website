// Stronger Conclusions Master Drill - Advanced AI-Powered Training System
class StrongerConclusionsDrill {
    constructor() {
        this.aiEngine = null;
        this.simpleAnalysis = null;
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.recognition = null;
        this.currentSession = null;
        this.selectedScenario = null;
        this.progressData = this.loadProgressData();
        
        // Conclusion strength indicators
        this.conclusionKeywords = {
            power: ['therefore', 'in conclusion', 'the bottom line', 'here\'s what matters', 'let me be clear'],
            action: ['we need to', 'let\'s', 'the next step', 'i recommend', 'we must'],
            future: ['moving forward', 'going forward', 'from now on', 'in the future', 'next'],
            emotional: ['imagine', 'remember', 'consider this', 'think about', 'picture'],
            decisive: ['without question', 'clearly', 'absolutely', 'definitely', 'no doubt']
        };
        
        this.scenarios = {
            presentation: {
                'quarterly-results': {
                    title: 'Quarterly Results Presentation',
                    context: 'Board of directors meeting. Q3 exceeded revenue targets by 12% but customer acquisition costs increased by 18%.',
                    prompt: 'Present Q3 results addressing both successes and challenges while setting clear Q4 expectations.',
                    duration: 180,
                    framework: 'forward-launch',
                    difficulty: 'intermediate'
                },
                'product-launch': {
                    title: 'Product Launch Strategy',
                    context: 'Executive team meeting. New product has potential but requires significant investment and market risks.',
                    prompt: 'Pitch new product launch strategy requiring clear go/no-go decision and resource commitment.',
                    duration: 240,
                    framework: 'power-close',
                    difficulty: 'advanced'
                },
                'team-restructure': {
                    title: 'Team Restructuring Proposal',
                    context: 'Cross-departmental meeting. Restructuring is necessary but will affect multiple teams and workflows.',
                    prompt: 'Present team restructuring plan requiring buy-in from multiple departments.',
                    duration: 300,
                    framework: 'insight-bridge',
                    difficulty: 'expert'
                }
            },
            meeting: {
                'budget-discussion': {
                    title: 'Budget Allocation Discussion',
                    context: 'Heated budget meeting. Multiple departments competing for limited resources.',
                    prompt: 'Conclude budget discussion with clear next steps and compromise satisfying key stakeholders.',
                    duration: 120,
                    framework: 'power-close',
                    difficulty: 'intermediate'
                },
                'project-review': {
                    title: 'Project Status Review',
                    context: 'Project is behind schedule and over budget. Team morale is low and stakeholders are concerned.',
                    prompt: 'Wrap up project review with clear accountability, timeline adjustments, and resource needs.',
                    duration: 180,
                    framework: 'forward-launch',
                    difficulty: 'advanced'
                }
            },
            story: {
                'leadership-story': {
                    title: 'Leadership Challenge Story',
                    context: 'Team development session. Sharing personal experience to teach leadership principles.',
                    prompt: 'Share leadership challenge story illustrating key principles with actionable insights.',
                    duration: 240,
                    framework: 'emotional-anchor',
                    difficulty: 'intermediate'
                },
                'failure-story': {
                    title: 'Learning from Failure',
                    context: 'Mentoring conversation. Demonstrating how failure became a catalyst for growth.',
                    prompt: 'Tell failure story demonstrating growth, resilience, and value gained from experience.',
                    duration: 180,
                    framework: 'circle-back',
                    difficulty: 'advanced'
                }
            },
            persuasion: {
                'investment-pitch': {
                    title: 'Investment Pitch',
                    context: 'Investor meeting. Need to secure funding while addressing risk concerns and market timing.',
                    prompt: 'Conclude investment pitch with compelling call to action addressing risks and creating urgency.',
                    duration: 120,
                    framework: 'challenge-call',
                    difficulty: 'expert'
                },
                'policy-change': {
                    title: 'Policy Change Advocacy',
                    context: 'Stakeholder meeting. Advocating for important policy change with implementation challenges.',
                    prompt: 'Advocate for policy change with conclusion motivating action and addressing implementation.',
                    duration: 180,
                    framework: 'challenge-call',
                    difficulty: 'advanced'
                }
            },
            conflict: {
                'team-conflict': {
                    title: 'Team Conflict Resolution',
                    context: 'Team mediation session. Two team members have ongoing conflicts affecting productivity.',
                    prompt: 'Mediate team conflict with clear resolution, restored relationships, and prevention strategies.',
                    duration: 240,
                    framework: 'insight-bridge',
                    difficulty: 'advanced'
                },
                'vendor-dispute': {
                    title: 'Vendor Dispute Resolution',
                    context: 'Business relationship at risk. Vendor dispute requires resolution while preserving partnership.',
                    prompt: 'Resolve vendor dispute preserving business relationship while establishing clear boundaries.',
                    duration: 180,
                    framework: 'power-close',
                    difficulty: 'intermediate'
                }
            }
        };
        
        this.frameworks = {
            'power-close': {
                name: 'The Power Close',
                steps: ['Acknowledge', 'Synthesize', 'Decide', 'Energize'],
                description: 'End with undeniable clarity and conviction'
            },
            'insight-bridge': {
                name: 'The Insight Bridge',
                steps: ['Connect', 'Elevate', 'Apply', 'Transform'],
                description: 'Connect current discussion to bigger picture insights'
            },
            'forward-launch': {
                name: 'The Forward Launch',
                steps: ['Foundation', 'Vision', 'Action', 'Momentum'],
                description: 'Transform endings into beginnings'
            },
            'emotional-anchor': {
                name: 'The Emotional Anchor',
                steps: ['Experience', 'Emotion', 'Learning', 'Universal'],
                description: 'End with emotional resonance for lasting memory'
            },
            'circle-back': {
                name: 'The Circle Back',
                steps: ['Recall', 'Journey', 'Transform', 'Complete'],
                description: 'Return to opening theme with new understanding'
            },
            'challenge-call': {
                name: 'The Challenge Call',
                steps: ['Possibility', 'Readiness', 'Challenge', 'Action'],
                description: 'End with inspiring challenge that motivates action'
            }
        };
        
        this.init();
    }

    async init() {
        console.log('🎯 Initializing Stronger Conclusions Drill...');
        
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
        
        console.log('✅ Stronger Conclusions Drill initialized');
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
                this.analyzeConclusion(transcript);
            } else {
                interimTranscript += transcript;
            }
        }
        
        // Update live analysis
        this.updateLiveAnalysis(finalTranscript + interimTranscript);
        
        // Store complete transcript
        if (this.currentSession) {
            this.currentSession.transcript += finalTranscript;
        }
    }

    analyzeConclusion(transcript) {
        if (!this.currentSession) return;
        
        const analysis = this.performRealTimeAnalysis(transcript);
        this.updateConclusionScores(analysis);
    }

    performRealTimeAnalysis(transcript) {
        const text = transcript.toLowerCase();
        const words = text.split(/\s+/);
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        // Analyze conclusion strength indicators
        const strengthScore = this.calculateStrengthScore(text);
        const clarityScore = this.calculateClarityScore(text, sentences);
        const impactScore = this.calculateImpactScore(text, words);
        
        return {
            strengthScore,
            clarityScore,
            impactScore,
            keywordMatches: this.findKeywordMatches(text),
            structureAnalysis: this.analyzeStructure(sentences)
        };
    }

    calculateStrengthScore(text) {
        let score = 0;
        const maxScore = 100;
        
        // Check for conclusion keywords
        Object.entries(this.conclusionKeywords).forEach(([category, keywords]) => {
            keywords.forEach(keyword => {
                if (text.includes(keyword)) {
                    score += 15; // Each keyword adds strength
                }
            });
        });
        
        // Check for definitive language
        const definitiveWords = ['will', 'must', 'should', 'need to', 'going to'];
        definitiveWords.forEach(word => {
            if (text.includes(word)) score += 10;
        });
        
        // Penalize weak language
        const weakWords = ['maybe', 'perhaps', 'might', 'could', 'possibly'];
        weakWords.forEach(word => {
            if (text.includes(word)) score -= 10;
        });
        
        return Math.min(Math.max(score, 0), maxScore);
    }

    calculateClarityScore(text, sentences) {
        let score = 70; // Base score
        
        // Average sentence length (ideal: 15-25 words)
        const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length;
        if (avgSentenceLength >= 15 && avgSentenceLength <= 25) {
            score += 15;
        } else if (avgSentenceLength > 30) {
            score -= 20; // Too complex
        }
        
        // Check for clear structure words
        const structureWords = ['first', 'second', 'finally', 'in summary', 'to conclude'];
        structureWords.forEach(word => {
            if (text.includes(word)) score += 5;
        });
        
        return Math.min(Math.max(score, 0), 100);
    }

    calculateImpactScore(text, words) {
        let score = 60; // Base score
        
        // Check for emotional language
        const emotionalWords = ['believe', 'committed', 'excited', 'confident', 'determined'];
        emotionalWords.forEach(word => {
            if (text.includes(word)) score += 10;
        });
        
        // Check for action-oriented language
        const actionWords = ['implement', 'execute', 'deliver', 'achieve', 'accomplish'];
        actionWords.forEach(word => {
            if (text.includes(word)) score += 8;
        });
        
        // Check for future-focused language
        const futureWords = ['tomorrow', 'next', 'future', 'ahead', 'forward'];
        futureWords.forEach(word => {
            if (text.includes(word)) score += 5;
        });
        
        return Math.min(Math.max(score, 0), 100);
    }

    findKeywordMatches(text) {
        const matches = {};
        Object.entries(this.conclusionKeywords).forEach(([category, keywords]) => {
            matches[category] = keywords.filter(keyword => text.includes(keyword));
        });
        return matches;
    }

    analyzeStructure(sentences) {
        if (sentences.length < 2) return { quality: 'weak', feedback: 'Conclusion too short' };
        if (sentences.length > 5) return { quality: 'verbose', feedback: 'Conclusion too long' };
        
        return { quality: 'good', feedback: 'Good conclusion length' };
    }

    updateConclusionScores(analysis) {
        document.getElementById('strengthScore').textContent = Math.round(analysis.strengthScore);
        document.getElementById('clarityScore').textContent = Math.round(analysis.clarityScore);
        document.getElementById('impactScore').textContent = Math.round(analysis.impactScore);
        
        // Update visual feedback
        this.updateScoreColors(analysis);
    }

    updateScoreColors(analysis) {
        const strengthElement = document.getElementById('strengthScore');
        const clarityElement = document.getElementById('clarityScore');
        const impactElement = document.getElementById('impactScore');
        
        strengthElement.className = 'tracker-value ' + this.getScoreClass(analysis.strengthScore);
        clarityElement.className = 'tracker-value ' + this.getScoreClass(analysis.clarityScore);
        impactElement.className = 'tracker-value ' + this.getScoreClass(analysis.impactScore);
    }

    getScoreClass(score) {
        if (score >= 85) return 'score-excellent';
        if (score >= 70) return 'score-good';
        if (score >= 55) return 'score-needs-work';
        return 'score-poor';
    }

    updateLiveAnalysis(text) {
        const analysisElement = document.getElementById('analysisText');
        if (analysisElement && text.length > 0) {
            // Highlight conclusion keywords
            let highlightedText = text;
            Object.values(this.conclusionKeywords).flat().forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                highlightedText = highlightedText.replace(regex, `<span class="conclusion-highlight">${keyword}</span>`);
            });
            
            analysisElement.innerHTML = highlightedText;
            analysisElement.scrollTop = analysisElement.scrollHeight;
        }
    }

    setupEventListeners() {
        // Scenario tab switching
        document.querySelectorAll('.scenario-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchScenarioTab(tab.dataset.scenario);
            });
        });
        
        // Scenario selection
        document.querySelectorAll('.scenario-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectScenario(card);
            });
        });
        
        // Progress tracking update
        if (window.userDataTracker) {
            this.updateProgressDisplay();
        }
    }

    switchScenarioTab(scenario) {
        // Update tabs
        document.querySelectorAll('.scenario-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-scenario="${scenario}"]`).classList.add('active');
        
        // Update content
        document.querySelectorAll('.scenario-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${scenario}-scenarios`).classList.add('active');
        
        // Clear previous selection
        this.selectedScenario = null;
        document.querySelectorAll('.scenario-card').forEach(card => {
            card.classList.remove('selected');
        });
    }

    selectScenario(cardElement) {
        // Clear previous selection
        document.querySelectorAll('.scenario-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Select new scenario
        cardElement.classList.add('selected');
        this.selectedScenario = cardElement.dataset.id;
        
        console.log(`Selected scenario: ${this.selectedScenario}`);
    }

    async startSelectedScenario() {
        if (!this.selectedScenario) {
            alert('Please select a scenario first!');
            return;
        }
        
        console.log(`🚀 Starting scenario: ${this.selectedScenario}`);
        
        // Find scenario data
        let scenarioData = null;
        for (const [category, scenarios] of Object.entries(this.scenarios)) {
            if (scenarios[this.selectedScenario]) {
                scenarioData = scenarios[this.selectedScenario];
                break;
            }
        }
        
        if (!scenarioData) {
            console.error('Scenario data not found');
            return;
        }
        
        // Initialize session
        this.currentSession = {
            scenarioId: this.selectedScenario,
            scenarioData: scenarioData,
            startTime: Date.now(),
            transcript: '',
            strengthScore: 0,
            clarityScore: 0,
            impactScore: 0,
            duration: scenarioData.duration
        };
        
        // Update UI with scenario details
        await this.setupPracticeSession(scenarioData);
        
        // Show practice session
        document.getElementById('practiceSession').classList.add('active');
        
        // Scroll to practice section
        document.getElementById('practiceSession').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    async setupPracticeSession(scenarioData) {
        // Update prompt and context
        document.getElementById('promptText').textContent = scenarioData.prompt;
        document.getElementById('promptContext').textContent = scenarioData.context;
        
        // Update timer
        this.updateTimerDisplay(scenarioData.duration);
        
        // Update framework guidance
        const framework = this.frameworks[scenarioData.framework];
        if (framework) {
            this.updateFrameworkGuidance(framework);
        }
        
        // Reset scores
        document.getElementById('strengthScore').textContent = '0';
        document.getElementById('clarityScore').textContent = '0';
        document.getElementById('impactScore').textContent = '0';
        
        // Clear analysis
        document.getElementById('analysisText').textContent = 'AI will analyze your conclusion structure in real-time...';
    }

    updateFrameworkGuidance(framework) {
        const frameworkElement = document.querySelector('.conclusion-framework h4');
        if (frameworkElement) {
            frameworkElement.textContent = `Recommended Framework: ${framework.name}`;
        }
        
        const stepsContainer = document.querySelector('.framework-steps');
        if (stepsContainer) {
            stepsContainer.innerHTML = '';
            framework.steps.forEach((step, index) => {
                const stepElement = document.createElement('div');
                stepElement.className = 'framework-step';
                stepElement.innerHTML = `
                    <div class="step-number">${index + 1}. ${step}</div>
                    <div class="step-text">${this.getStepDescription(framework.name, step)}</div>
                `;
                stepsContainer.appendChild(stepElement);
            });
        }
    }

    getStepDescription(frameworkName, step) {
        const descriptions = {
            'The Power Close': {
                'Acknowledge': 'Acknowledge key findings honestly',
                'Synthesize': 'Connect insights to bigger picture',
                'Decide': 'State clear next steps',
                'Energize': 'Create momentum for action'
            },
            'The Insight Bridge': {
                'Connect': 'Link to broader context',
                'Elevate': 'Raise to universal principle',
                'Apply': 'Show practical application',
                'Transform': 'Change perspective'
            },
            'The Forward Launch': {
                'Foundation': 'Establish what we know',
                'Vision': 'Paint picture of future',
                'Action': 'Define specific steps',
                'Momentum': 'Generate excitement'
            },
            'The Emotional Anchor': {
                'Experience': 'Share the moment',
                'Emotion': 'Connect to feeling',
                'Learning': 'Extract the lesson',
                'Universal': 'Apply broadly'
            },
            'The Circle Back': {
                'Recall': 'Reference opening',
                'Journey': 'Acknowledge progress',
                'Transform': 'Show new understanding',
                'Complete': 'Close the circle'
            },
            'The Challenge Call': {
                'Possibility': 'Show what\'s possible',
                'Readiness': 'Question preparedness',
                'Challenge': 'Issue the challenge',
                'Action': 'Call for commitment'
            }
        };
        
        return descriptions[frameworkName]?.[step] || 'Apply this step effectively';
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
            
            // Add visual warning for last 30 seconds
            if (seconds <= 30 && seconds > 0) {
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
        console.log('🔄 Processing conclusion recording...');
        
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
        console.log('🤖 Analyzing conclusion with Gemini AI...');
        
        try {
            // Convert blob to File for SimpleAnalysis
            const audioFile = new File([audioBlob], 'recording.webm', { 
                type: audioBlob.type || 'audio/webm' 
            });
            
            // Use SimpleAnalysis for transcription and analysis
            if (this.simpleAnalysis) {
                const results = await this.simpleAnalysis.analyzeAudio(audioFile, 'drill-stronger-conclusions');
                
                if (results.success && results.transcript) {
                    // Update session transcript
                    this.currentSession.transcript = results.transcript;
                    
                    // Perform detailed conclusion analysis
                    const conclusionMetrics = this.analyzeConclusionStrength(results.transcript);
                    
                    // Get AI analysis specific to conclusion strength
                    const analysisPrompt = `Analyze this conclusion for a ${this.currentSession.scenarioData.title}.

Context: ${this.currentSession.scenarioData.context}
Framework Used: ${this.frameworks[this.currentSession.scenarioData.framework].name}
Transcript: "${results.transcript}"

Metrics detected:
- Power words used: ${conclusionMetrics.powerWords}
- Call to action: ${conclusionMetrics.hasCallToAction ? 'Yes' : 'No'}
- Summary included: ${conclusionMetrics.hasSummary ? 'Yes' : 'No'}
- Emotional appeal: ${conclusionMetrics.emotionalAppeal}

Analyze the conclusion's effectiveness and provide detailed feedback in JSON format:
{
  "overallScore": number (0-100),
  "conclusionAnalysis": {
    "strength": number (0-100),
    "clarity": number (0-100),
    "impact": number (0-100),
    "frameworkUsage": number (0-100),
    "actionClarity": number (0-100),
    "memoryFactor": number (0-100)
  },
  "speechMetrics": {
    "speechRate": number (words per minute),
    "confidenceLevel": number (0-100),
    "pitchVariability": "low/moderate/high",
    "pauseEffectiveness": "poor/fair/good/excellent"
  },
  "strengths": ["strength1", "strength2"],
  "improvementAreas": ["area1", "area2"],
  "frameworkFeedback": "How well the recommended framework was used",
  "specificSuggestions": ["suggestion1", "suggestion2"],
  "personalizedFeedback": "Detailed conclusion coaching feedback",
  "nextStepRecommendation": "Specific next action for improvement"
}`;

                    const response = await this.aiEngine.generateResponse(analysisPrompt, [], 'conclusion-analysis');
                    const analysis = JSON.parse(response);
                    
                    // Update session with complete analysis
                    this.currentSession.aiAnalysis = analysis;
                    this.currentSession.conclusionMetrics = conclusionMetrics;
                    
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
    
    analyzeConclusionStrength(transcript) {
        const text = transcript.toLowerCase();
        
        // Check for power words
        const powerWords = 0;
        Object.values(this.conclusionKeywords).forEach(words => {
            words.forEach(word => {
                if (text.includes(word)) powerWords++;
            });
        });
        
        // Check for call to action
        const actionWords = ['need to', 'must', 'should', 'will', 'let\'s', 'recommend'];
        const hasCallToAction = actionWords.some(word => text.includes(word));
        
        // Check for summary
        const summaryIndicators = ['in conclusion', 'to summarize', 'overall', 'the key'];
        const hasSummary = summaryIndicators.some(indicator => text.includes(indicator));
        
        // Emotional appeal
        const emotionalWords = ['imagine', 'feel', 'believe', 'excited', 'important'];
        const emotionalAppeal = emotionalWords.filter(word => text.includes(word)).length;
        
        return {
            powerWords,
            hasCallToAction,
            hasSummary,
            emotionalAppeal
        };
    }

    performBasicAnalysis() {
        const finalAnalysis = this.performRealTimeAnalysis(this.currentSession.transcript);
        
        this.currentSession.basicAnalysis = {
            strengthScore: finalAnalysis.strengthScore,
            clarityScore: finalAnalysis.clarityScore,
            impactScore: finalAnalysis.impactScore,
            frameworkUsage: this.calculateFrameworkUsage(),
            actionClarity: this.calculateActionClarity(),
            memoryFactor: this.calculateMemoryFactor()
        };
    }

    calculateFrameworkUsage() {
        // Basic framework usage calculation
        const framework = this.frameworks[this.currentSession.scenarioData.framework];
        const text = this.currentSession.transcript.toLowerCase();
        
        let usageScore = 0;
        framework.steps.forEach(step => {
            // Simple keyword matching for framework steps
            if (this.stepHasIndicators(text, step)) {
                usageScore += 25; // Each step worth 25 points
            }
        });
        
        return Math.min(usageScore, 100);
    }

    stepHasIndicators(text, step) {
        const indicators = {
            'Acknowledge': ['acknowledge', 'recognize', 'understand', 'see that'],
            'Synthesize': ['overall', 'big picture', 'what this means', 'essentially'],
            'Decide': ['decision', 'next step', 'we will', 'going to'],
            'Energize': ['excited', 'opportunity', 'forward', 'together'],
            'Connect': ['relates to', 'similar to', 'like when', 'reminds me'],
            'Foundation': ['established', 'proven', 'clear that', 'know that'],
            'Vision': ['imagine', 'picture', 'future', 'will be'],
            'Experience': ['when', 'happened', 'moment', 'time'],
            'Recall': ['remember', 'started', 'began', 'earlier']
        };
        
        const stepIndicators = indicators[step] || [];
        return stepIndicators.some(indicator => text.includes(indicator));
    }

    calculateActionClarity() {
        const text = this.currentSession.transcript.toLowerCase();
        const actionWords = ['will', 'must', 'need to', 'should', 'going to', 'plan to'];
        let score = 60; // Base score
        
        actionWords.forEach(word => {
            if (text.includes(word)) score += 8;
        });
        
        return Math.min(score, 100);
    }

    calculateMemoryFactor() {
        const text = this.currentSession.transcript.toLowerCase();
        const memorableElements = ['story', 'imagine', 'remember', 'picture', 'think about'];
        let score = 50; // Base score
        
        memorableElements.forEach(element => {
            if (text.includes(element)) score += 10;
        });
        
        return Math.min(score, 100);
    }

    updateAnalysisResults(analysis) {
        if (analysis && analysis.conclusionAnalysis) {
            const ca = analysis.conclusionAnalysis;
            document.getElementById('finalStrengthScore').textContent = ca.strength;
            document.getElementById('finalClarityScore').textContent = ca.clarity + '%';
            document.getElementById('finalImpactScore').textContent = ca.impact;
            document.getElementById('frameworkUsage').textContent = ca.frameworkUsage + '%';
            document.getElementById('actionClarity').textContent = ca.actionClarity + '%';
            document.getElementById('memoryFactor').textContent = ca.memoryFactor + '%';
            document.getElementById('aiFeedbackContent').textContent = analysis.personalizedFeedback;
        } else {
            // Use basic analysis
            const basic = this.currentSession.basicAnalysis;
            document.getElementById('finalStrengthScore').textContent = Math.round(basic.strengthScore);
            document.getElementById('finalClarityScore').textContent = Math.round(basic.clarityScore) + '%';
            document.getElementById('finalImpactScore').textContent = Math.round(basic.impactScore);
            document.getElementById('frameworkUsage').textContent = Math.round(basic.frameworkUsage) + '%';
            document.getElementById('actionClarity').textContent = Math.round(basic.actionClarity) + '%';
            document.getElementById('memoryFactor').textContent = Math.round(basic.memoryFactor) + '%';
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
            scenarioId: this.currentSession.scenarioId,
            scenarioTitle: this.currentSession.scenarioData.title,
            framework: this.currentSession.scenarioData.framework,
            strengthScore: this.currentSession.basicAnalysis?.strengthScore || 0,
            clarityScore: this.currentSession.basicAnalysis?.clarityScore || 0,
            impactScore: this.currentSession.basicAnalysis?.impactScore || 0,
            duration: this.currentSession.duration
        };
        
        this.progressData.recentSessions.unshift(sessionSummary);
        this.progressData.recentSessions = this.progressData.recentSessions.slice(0, 10); // Keep last 10
        
        // Update overall stats
        this.progressData.totalConclusions++;
        this.progressData.totalStrengthScore += sessionSummary.strengthScore;
        
        // Recalculate averages
        this.progressData.averageStrength = Math.round(
            this.progressData.totalStrengthScore / this.progressData.totalConclusions
        );
        
        this.progressData.bestImpact = Math.max(
            this.progressData.bestImpact, 
            sessionSummary.impactScore
        );
        
        // Track framework mastery
        if (sessionSummary.strengthScore >= 80) {
            if (!this.progressData.masteredFrameworks.includes(sessionSummary.framework)) {
                this.progressData.masteredFrameworks.push(sessionSummary.framework);
                this.progressData.frameworksMastered = this.progressData.masteredFrameworks.length;
            }
        }
        
        // Save to localStorage
        localStorage.setItem('strongerConclusionsProgress', JSON.stringify(this.progressData));
        
        // Update progress display
        this.updateProgressDisplay();
        
        // Record in user data tracker if available
        if (window.userDataTracker) {
            window.userDataTracker.recordAnalysis(
                'drill-stronger-conclusions', 
                Math.round((sessionSummary.strengthScore + sessionSummary.impactScore) / 2), 
                this.currentSession.duration / 60
            );
        }
        
        console.log('✅ Conclusion session progress saved');
    }

    loadProgressData() {
        const saved = localStorage.getItem('strongerConclusionsProgress');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            totalConclusions: 0,
            averageStrength: 0,
            bestImpact: 0,
            frameworksMastered: 0,
            totalStrengthScore: 0,
            masteredFrameworks: [],
            recentSessions: []
        };
    }

    updateProgressDisplay() {
        document.getElementById('totalConclusions').textContent = this.progressData.totalConclusions;
        document.getElementById('averageStrength').textContent = this.progressData.averageStrength + '%';
        document.getElementById('bestImpact').textContent = this.progressData.bestImpact;
        document.getElementById('frameworksMastered').textContent = this.progressData.frameworksMastered;
    }

    resetSession() {
        if (this.isRecording) {
            this.stopRecording();
        }
        
        // Reset UI
        document.getElementById('strengthScore').textContent = '0';
        document.getElementById('clarityScore').textContent = '0';
        document.getElementById('impactScore').textContent = '0';
        document.getElementById('analysisText').textContent = 'AI will analyze your conclusion structure in real-time...';
        document.getElementById('timerDisplay').textContent = this.formatTime(this.currentSession?.duration || 180);
        document.getElementById('analysisResults').classList.remove('visible');
        
        // Reset session data
        if (this.currentSession) {
            this.currentSession.transcript = '';
            this.currentSession.strengthScore = 0;
            this.currentSession.clarityScore = 0;
            this.currentSession.impactScore = 0;
        }
        
        console.log('🔄 Session reset');
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    async generateNewScenario() {
        if (!this.currentSession) {
            alert('Please start a scenario first!');
            return;
        }
        
        // Find a random scenario from the same category
        const currentCategory = Object.keys(this.scenarios).find(category => 
            this.scenarios[category][this.selectedScenario]
        );
        
        if (currentCategory) {
            const categoryScenarios = Object.keys(this.scenarios[currentCategory]);
            const randomScenario = categoryScenarios[Math.floor(Math.random() * categoryScenarios.length)];
            
            this.selectedScenario = randomScenario;
            const scenarioData = this.scenarios[currentCategory][randomScenario];
            await this.setupPracticeSession(scenarioData);
            this.resetSession();
        }
    }

    startNewConclusion() {
        this.resetSession();
        document.getElementById('analysisResults').classList.remove('visible');
    }

    changeScenario() {
        document.getElementById('practiceSession').classList.remove('active');
        document.getElementById('analysisResults').classList.remove('visible');
        this.resetSession();
        this.selectedScenario = null;
        document.querySelectorAll('.scenario-card').forEach(card => {
            card.classList.remove('selected');
        });
    }
}

// Global functions for UI interactions
let conclusionsDrill = null;

function startSelectedScenario() {
    if (conclusionsDrill) {
        conclusionsDrill.startSelectedScenario();
    }
}

function toggleRecording() {
    if (conclusionsDrill) {
        conclusionsDrill.toggleRecording();
    }
}

function resetSession() {
    if (conclusionsDrill) {
        conclusionsDrill.resetSession();
    }
}

function generateNewScenario() {
    if (conclusionsDrill) {
        conclusionsDrill.generateNewScenario();
    }
}

function startNewConclusion() {
    if (conclusionsDrill) {
        conclusionsDrill.startNewConclusion();
    }
}

function changeScenario() {
    if (conclusionsDrill) {
        conclusionsDrill.changeScenario();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    conclusionsDrill = new StrongerConclusionsDrill();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StrongerConclusionsDrill;
}