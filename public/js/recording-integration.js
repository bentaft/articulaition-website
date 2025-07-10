// Recording Integration for Analysis Pages
// This script integrates the AudioRecorder with existing UI elements

let audioRecorder = null;
let recordingTimer = null;
let recordingStartTime = null;

// Initialize recording functionality when DOM is ready
function initializeRecording() {
    // Check if we're on a page with recording functionality
    const micButton = document.getElementById('micButton') || document.getElementById('recordButton');
    if (!micButton) return;
    
    // Create audio recorder instance
    audioRecorder = new AudioRecorder();
    
    // Set up callbacks
    audioRecorder.onRecordingStart = handleRecordingStart;
    audioRecorder.onRecordingStop = handleRecordingStop;
    audioRecorder.onError = handleRecordingError;
    audioRecorder.onVisualizerUpdate = handleVisualizerUpdate;
    audioRecorder.onSilenceDetected = handleSilenceDetected;
    
    // Enable advanced features
    // Note: Advanced features like silence detection would need to be implemented
    // audioRecorder.enableSilenceDetection(true, 0.01, 3000); // 3 seconds of silence
    // audioRecorder.noiseReduction.enabled = true;
    // audioRecorder.noiseReduction.adaptiveThreshold = true;
    
    // Override existing event listener
    // Remove any existing event listeners
    const newMicButton = micButton.cloneNode(true);
    micButton.parentNode.replaceChild(newMicButton, micButton);
    
    // Add new event listener
    newMicButton.addEventListener('click', handleMicButtonClick);
    
    // Add visual indicators
    setupVisualEnhancements();
    
    // Test microphone availability
    testMicrophoneAvailability();
    
    console.log('Recording functionality initialized');
}

// Set up visual enhancements
function setupVisualEnhancements() {
    const recordingInterface = document.getElementById('recordingInterface');
    // Skip visual enhancements if no recording interface (e.g., client calls page)
    if (!recordingInterface) {
        console.log('No recording interface found, skipping visual enhancements');
        return;
    }
    
    // Add volume indicator
    const volumeIndicator = document.createElement('div');
    volumeIndicator.className = 'volume-indicator';
    volumeIndicator.innerHTML = '<div class="volume-bar"></div>';
    recordingInterface.appendChild(volumeIndicator);
    
    // Add recording quality indicator
    const qualityIndicator = document.createElement('div');
    qualityIndicator.className = 'recording-quality';
    qualityIndicator.id = 'recordingQuality';
    qualityIndicator.textContent = 'Good signal quality';
    recordingInterface.appendChild(qualityIndicator);
    
    // Add playback controls
    const playbackControls = document.createElement('div');
    playbackControls.className = 'playback-controls';
    playbackControls.id = 'playbackControls';
    playbackControls.innerHTML = `
        <button class="playback-btn" id="playRecordingBtn" disabled>
            <i data-lucide="play" class="w-4 h-4"></i>
            Play Recording
        </button>
        <button class="playback-btn" id="downloadRecordingBtn" disabled>
            <i data-lucide="download" class="w-4 h-4"></i>
            Download
        </button>
    `;
    recordingInterface.appendChild(playbackControls);
    
    // Initialize lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Test microphone availability
async function testMicrophoneAvailability() {
    const micButton = document.getElementById('micButton') || document.getElementById('recordButton');
    if (!micButton) return;
    
    try {
        // Test if we can get media devices
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Browser not supported');
        }
        
        // Add ready indicator
        micButton.classList.add('recording-ready');
        
        // Add enhanced CSS if not already present
        if (!document.querySelector('link[href*="recording-enhancements.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/recording-enhancements.css';
            document.head.appendChild(link);
        }
        
    } catch (error) {
        console.warn('Microphone test failed:', error);
        micButton.classList.add('recording-error');
        showBrowserWarning();
    }
}

// Show browser compatibility warning
function showBrowserWarning() {
    const recordingInterface = document.getElementById('recordingInterface');
    if (!recordingInterface) return;
    
    const warning = document.createElement('div');
    warning.className = 'browser-warning show';
    warning.innerHTML = `
        <p>
            <i data-lucide="alert-triangle" class="w-4 h-4 inline mr-2"></i>
            Your browser may not support audio recording. For the best experience, please use Chrome, Firefox, or Edge.
        </p>
    `;
    
    recordingInterface.parentNode.insertBefore(warning, recordingInterface);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Handle mic button click
async function handleMicButtonClick() {
    const micButton = document.getElementById('micButton') || document.getElementById('recordButton');
    const isRecording = micButton.classList.contains('recording');
    
    if (!isRecording) {
        // Start recording
        const success = await audioRecorder.startRecording();
        if (!success) {
            console.error('Failed to start recording');
        }
    } else {
        // Stop recording
        audioRecorder.stopRecording();
    }
}

// Handle recording start
function handleRecordingStart() {
    const micButton = document.getElementById('micButton') || document.getElementById('recordButton');
    const recordingStatus = document.getElementById('recordingStatus');
    const recordingTimerEl = document.getElementById('recordingTimer');
    const recordingInterface = document.getElementById('recordingInterface');
    
    // Update UI
    micButton.classList.add('recording');
    micButton.innerHTML = '<i data-lucide="square" class="w-4 h-4"></i>';
    
    if (recordingStatus) {
        recordingStatus.textContent = 'Recording your response...';
    }
    
    if (recordingInterface) {
        recordingInterface.classList.add('active');
    }
    
    // Start timer
    recordingStartTime = Date.now();
    recordingTimer = setInterval(() => {
        const duration = Date.now() - recordingStartTime;
        if (recordingTimerEl) {
            recordingTimerEl.textContent = audioRecorder.formatDuration(duration);
        }
    }, 100);
    
    // Recreate lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    console.log('Recording started');
}

// Handle recording stop
function handleRecordingStop(recordingData) {
    const micButton = document.getElementById('micButton') || document.getElementById('recordButton');
    const recordingStatus = document.getElementById('recordingStatus');
    const recordingTimerEl = document.getElementById('recordingTimer');
    const recordingInterface = document.getElementById('recordingInterface');
    const endConversationBtn = document.getElementById('endConversation');
    
    // Stop timer
    if (recordingTimer) {
        clearInterval(recordingTimer);
        recordingTimer = null;
    }
    
    // Update UI
    micButton.classList.remove('recording');
    micButton.innerHTML = '<i data-lucide="mic" class="w-4 h-4"></i>';
    
    if (recordingStatus) {
        recordingStatus.textContent = 'Audio captured successfully! Ready for analysis.';
    }
    
    if (recordingTimerEl) {
        recordingTimerEl.textContent = '00:00';
    }
    
    if (recordingInterface) {
        recordingInterface.classList.remove('active');
    }
    
    // Show end conversation button if it exists
    if (endConversationBtn) {
        endConversationBtn.style.display = 'inline-flex';
    }
    
    // Recreate lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    console.log('Recording stopped', recordingData);
    
    // Store recording data for later use
    window.lastRecording = recordingData;
    
    // If there's a conversation flow, simulate adding user message
    const conversationFlow = document.getElementById('conversationFlow');
    if (conversationFlow && typeof addUserMessage === 'function') {
        // Simulate transcription (in real app, this would use speech-to-text)
        setTimeout(() => {
            addUserMessage("[Your recorded response is being processed...]");
            
            // Trigger AI response if available
            if (typeof generateAIResponse === 'function') {
                generateAIResponse();
            }
        }, 500);
    }
    
    // Enable playback controls
    const playbackControls = document.getElementById('playbackControls');
    const playRecordingBtn = document.getElementById('playRecordingBtn');
    const downloadRecordingBtn = document.getElementById('downloadRecordingBtn');
    
    if (playbackControls) {
        playbackControls.classList.add('show');
    }
    
    if (playRecordingBtn) {
        playRecordingBtn.disabled = false;
        playRecordingBtn.onclick = () => playRecording(recordingData.url);
    }
    
    if (downloadRecordingBtn) {
        downloadRecordingBtn.disabled = false;
        downloadRecordingBtn.onclick = downloadRecording;
    }
    
    // Add recording complete styling
    if (recordingInterface) {
        recordingInterface.classList.add('recording-complete');
    }
}

// Handle recording error
function handleRecordingError(error) {
    console.error('Recording error:', error);
    
    const recordingStatus = document.getElementById('recordingStatus');
    if (recordingStatus) {
        recordingStatus.textContent = error;
        recordingStatus.style.color = '#ef4444';
        
        // Reset color after 3 seconds
        setTimeout(() => {
            recordingStatus.style.color = '';
            recordingStatus.textContent = 'Click the microphone to try again';
        }, 3000);
    }
    
    // Show alert for critical errors
    if (error.includes('permission') || error.includes('support')) {
        alert(error);
    }
}

// Handle silence detection
function handleSilenceDetected() {
    console.log('Silence detected - auto-stopping recording');
    
    const recordingStatus = document.getElementById('recordingStatus');
    if (recordingStatus) {
        recordingStatus.textContent = 'Silence detected - stopping recording...';
        recordingStatus.style.color = '#f97316'; // Orange color
        
        // Reset after 2 seconds
        setTimeout(() => {
            recordingStatus.style.color = '';
        }, 2000);
    }
}

// Handle audio visualizer update (optional)
function handleVisualizerUpdate(volume, frequencyData, metadata = {}) {
    // Add visual feedback to mic button based on volume
    const micButton = document.getElementById('micButton') || document.getElementById('recordButton');
    if (micButton && micButton.classList.contains('recording')) {
        const scale = 1 + (volume * 0.2); // Scale between 1 and 1.2
        micButton.style.transform = `scale(${scale})`;
    }
    
    // Update volume indicator
    const volumeBar = document.querySelector('.volume-bar');
    if (volumeBar) {
        const volumePercentage = Math.min(volume * 100, 100);
        volumeBar.style.width = `${volumePercentage}%`;
    }
    
    // Update recording quality indicator with enhanced feedback
    const qualityIndicator = document.getElementById('recordingQuality');
    if (qualityIndicator) {
        qualityIndicator.className = 'recording-quality';
        
        // Check if we're below noise floor (silence)
        if (metadata.isSilent) {
            qualityIndicator.classList.add('silent');
            qualityIndicator.textContent = 'Silence detected - speak up';
        } else if (volume > 0.6) {
            qualityIndicator.classList.add('good');
            qualityIndicator.textContent = 'Excellent signal quality';
        } else if (volume > 0.3) {
            qualityIndicator.classList.add('fair');
            qualityIndicator.textContent = 'Good signal quality';
        } else if (volume > 0.1) {
            qualityIndicator.classList.add('fair');
            qualityIndicator.textContent = 'Fair signal quality - speak louder';
        } else {
            qualityIndicator.classList.add('poor');
            qualityIndicator.textContent = 'Poor signal - check microphone';
        }
        
        // Show noise floor info if available
        if (metadata.noiseFloor) {
            qualityIndicator.setAttribute('data-noise-floor', 
                `Noise floor: ${(metadata.noiseFloor * 100).toFixed(1)}%`);
        }
    }
}

// Play recording
function playRecording(audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play().catch(error => {
        console.error('Error playing audio:', error);
        alert('Failed to play recording');
    });
}

// Download recording
function downloadRecording() {
    if (window.lastRecording && audioRecorder) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `articulaition-recording-${timestamp}.webm`;
        audioRecorder.saveRecording(filename);
    } else {
        alert('No recording available to download');
    }
}

// Get recording for analysis
async function getRecordingForAnalysis() {
    if (!window.lastRecording) {
        console.error('No recording available');
        return null;
    }
    
    try {
        // Get base64 encoded audio
        const base64Audio = await audioRecorder.getRecordingAsBase64();
        
        return {
            audio: base64Audio,
            duration: window.lastRecording.duration,
            mimeType: window.lastRecording.mimeType,
            blob: window.lastRecording.blob
        };
    } catch (error) {
        console.error('Error preparing recording for analysis:', error);
        return null;
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRecording);
} else {
    initializeRecording();
}

// Export functions for use in other scripts
window.recordingIntegration = {
    getRecordingForAnalysis,
    downloadRecording,
    playRecording
};