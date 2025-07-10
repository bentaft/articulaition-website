/**
 * AI Conversation Engine - Powered by Gemini AI
 * Generates dynamic, contextual conversation scenarios for communication practice
 */

class AIConversationEngine {
    constructor() {
        this.apiKey = 'YOUR_GEMINI_API_KEY'; // Replace with actual API key
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
        this.conversationHistory = [];
        this.currentScenario = null;
        this.userProfile = {
            level: 'intermediate', // beginner, intermediate, advanced
            industry: 'general',
            focusAreas: []
        };
    }

    /**
     * Initialize a new practice session with context-specific scenarios
     */
    async initializeSession(analysisType, difficulty = 'intermediate') {
        this.conversationHistory = [];
        this.currentScenario = this.getScenarioConfig(analysisType);
        
        const prompt = this.buildInitialPrompt(analysisType, difficulty);
        
        try {
            const response = await this.callGeminiAPI(prompt);
            
            // Parse the response if it's a JSON string
            let parsedResponse;
            if (typeof response === 'string') {
                try {
                    parsedResponse = JSON.parse(response);
                } catch (e) {
                    // If not JSON, assume it's a direct response
                    parsedResponse = {
                        intro: this.currentScenario.title,
                        challenge: response
                    };
                }
            } else {
                parsedResponse = response;
            }
            
            return {
                scenario: this.currentScenario,
                initialMessage: parsedResponse.intro,
                firstChallenge: parsedResponse.challenge
            };
        } catch (error) {
            console.error('Error initializing session:', error);
            return this.getFallbackScenario(analysisType);
        }
    }

    /**
     * Generate AI response based on user input and conversation context
     */
    async generateResponse(userMessage, analysisType) {
        this.conversationHistory.push({
            role: 'user',
            message: userMessage,
            timestamp: Date.now()
        });

        const prompt = this.buildContextualPrompt(userMessage, analysisType);
        
        try {
            const response = await this.callGeminiAPI(prompt);
            
            this.conversationHistory.push({
                role: 'ai',
                message: response,
                timestamp: Date.now()
            });
            
            return {
                message: response,
                shouldContinue: this.shouldContinueConversation(),
                suggestedFollowUp: this.getSuggestedFollowUp(analysisType)
            };
        } catch (error) {
            console.error('Error generating response:', error);
            return this.getFallbackResponse(analysisType);
        }
    }

    /**
     * Get scenario configuration for different analysis types
     */
    getScenarioConfig(analysisType) {
        const scenarios = {
            'sales_objection': {
                title: 'Sales Objection Handling',
                context: 'client_meeting',
                difficulty_levels: ['price_concern', 'competitor_comparison', 'timing_objection', 'authority_objection'],
                role: 'potential_client',
                goals: ['overcome_objections', 'build_trust', 'close_deal']
            },
            'presentation': {
                title: 'Professional Presentation',
                context: 'Presentation scenario - respond naturally to presenter content',
                difficulty_levels: ['engaged_audience', 'thoughtful_questions', 'clarifying_questions', 'follow_up_questions', 'analytical_questions'],
                role: 'audience member',
                goals: ['respond_naturally_to_content', 'ask_relevant_questions', 'seek_clarification', 'provide_appropriate_feedback']
            },
            'leadership': {
                title: 'Leadership Conversation',
                context: 'team_management',
                difficulty_levels: ['performance_review', 'conflict_resolution', 'change_management'],
                role: 'team_member',
                goals: ['provide_feedback', 'motivate_team', 'resolve_issues']
            },
            'client_call': {
                title: 'Client Relationship',
                context: 'professional_service',
                difficulty_levels: ['project_delay', 'scope_change', 'budget_overrun'],
                role: 'concerned_client',
                goals: ['maintain_relationship', 'solve_problems', 'set_expectations']
            },
            'personal': {
                title: 'Personal Conversation',
                context: 'interpersonal',
                difficulty_levels: ['difficult_conversation', 'giving_feedback', 'conflict_resolution'],
                role: 'friend_colleague',
                goals: ['maintain_relationship', 'express_needs', 'find_resolution']
            }
        };

        return scenarios[analysisType] || scenarios['sales_objection'];
    }

    /**
     * Build initial prompt for scenario generation
     */
    buildInitialPrompt(analysisType, difficulty) {
        const scenario = this.getScenarioConfig(analysisType);
        const timestamp = new Date().toLocaleString();
        const randomSeed = Math.random(); // Ensure variety
        
        return `You are an AI communication coach creating a realistic practice scenario. 

IMPORTANT: Generate a UNIQUE scenario each time. Use the timestamp and random seed to ensure variety.
Timestamp: ${timestamp}
Random Seed: ${randomSeed}

Context: ${scenario.title}
Setting: ${scenario.context}
Your Role: Act as a ${scenario.role}
Difficulty: ${difficulty}

CRITICAL: You are NOT the presenter. You are the AUDIENCE. The user is the presenter who will be speaking TO you.
Your job is to act as the audience member and respond naturally to whatever the presenter actually says, not to predetermined business topics.

Create an engaging scenario with:
1. A brief scenario introduction describing the setting (2-3 sentences)
2. An opening response that invites the presenter to begin

Make it realistic and welcoming. As the audience, you should: ${scenario.goals.join(', ')}.

Vary your scenarios by creating different contexts, but always respond naturally to the presenter's actual content rather than bringing up specific business topics like budgets, marketing teams, or other predetermined subjects.

Format your response as JSON:
{
  "intro": "scenario introduction describing the setting",
  "challenge": "your opening response as the audience member"
}`;
    }

    /**
     * Build contextual prompt for ongoing conversation
     */
    buildContextualPrompt(userMessage, analysisType) {
        const scenario = this.getScenarioConfig(analysisType);
        const conversationContext = this.conversationHistory.slice(-4); // Last 4 exchanges
        const turnNumber = this.conversationHistory.filter(msg => msg.role === 'user').length + 1;
        
        return `Continue this ${scenario.title} practice session. 

You are playing the role of: ${scenario.role}
Context: ${scenario.context}
Your goals as the audience: ${scenario.goals.join(', ')}
Conversation Turn: ${turnNumber}

Recent conversation:
${conversationContext.map(msg => `${msg.role}: ${msg.message}`).join('\n')}

User just said: "${userMessage}"

CRITICAL: You are the AUDIENCE member, NOT the presenter. The user is the presenter speaking TO you.
Respond naturally as the ${scenario.role} based on what the presenter actually said. Your response should:
1. Acknowledge what the presenter (user) said
2. Present a realistic follow-up question, challenge, or comment based on their actual content
3. Keep the conversation flowing naturally
4. Test their presentation skills progressively
5. Adapt based on the conversation turn (early turns: establish context, middle turns: dig deeper, later turns: push for resolution)

IMPORTANT: Make each response unique and contextually appropriate. Don't repeat similar phrases or patterns. Base your response on the presenter's actual content, not on predetermined business topics.

Be conversational, realistic, and appropriately challenging as an audience member. Respond in 1-3 sentences.`;
    }

    /**
     * Call Gemini API with proper error handling
     */
    async callGeminiAPI(prompt) {
        // In production, this would make actual API calls to Gemini
        // For demo purposes, using sophisticated response simulation
        
        if (!this.apiKey || this.apiKey === 'YOUR_GEMINI_API_KEY') {
            return this.simulateGeminiResponse(prompt);
        }

        try {
            const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
            
        } catch (error) {
            console.error('Gemini API error:', error);
            return this.simulateGeminiResponse(prompt);
        }
    }

    /**
     * Simulate Gemini responses for development/demo
     */
    simulateGeminiResponse(prompt) {
        // For initial prompts, return JSON format
        if (prompt.includes('Format your response as JSON')) {
            return this.generateInitialScenario(prompt);
        }
        
        // For conversation continuations, return plain text
        if (prompt.includes('sales_objection')) {
            return this.getSalesObjectionResponse();
        } else if (prompt.includes('presentation')) {
            return this.getPresentationResponse();
        } else if (prompt.includes('leadership')) {
            return this.getLeadershipResponse();
        } else {
            return this.getGenericResponse();
        }
    }
    
    generateInitialScenario(prompt) {
        const timestamp = Date.now();
        const variation = timestamp % 5; // Create 5 different variations
        
        if (prompt.includes('sales_objection')) {
            const scenarios = [
                {
                    intro: "You are a procurement team member at a mid-sized tech company. Your team has been evaluating solutions for 3 months and is close to a decision.",
                    challenge: "Look, we've been burned before by vendors who promised the world. Your pricing is 40% higher than your closest competitor. Why shouldn't we just go with them?"
                },
                {
                    intro: "You are a startup founder who's interested but extremely budget-conscious. You need the solution but are bootstrapping.",
                    challenge: "I love what you're offering, but honestly, we're running on fumes here. Is there any way you can work with us on the pricing? Maybe a startup discount?"
                },
                {
                    intro: "You are a decision committee member at a Fortune 500 company. The company has the budget but is skeptical about switching vendors.",
                    challenge: "We've been with our current vendor for 5 years. Yes, they have issues, but switching seems risky. What guarantees can you give us that this transition will be smooth?"
                },
                {
                    intro: "You are a client in a competitive situation, playing vendors against each other. You are focused solely on price.",
                    challenge: "I'll be direct - we have three quotes on the table. Yours is the highest. If you can't match the lowest bid, we're going elsewhere. What's your best and final offer?"
                },
                {
                    intro: "You are a skeptical CFO who's been brought in last minute to evaluate the financial implications of a proposal.",
                    challenge: "I just looked at your proposal. The ROI projections seem overly optimistic. In my experience, these implementations always cost twice as much and take twice as long. Convince me otherwise."
                }
            ];
            return JSON.stringify(scenarios[variation]);
        } else if (prompt.includes('presentation')) {
            const scenarios = [
                {
                    intro: "You are the CFO of a mid-size tech company. Present the Q2 financial results to the board, highlighting key performance metrics, challenges, and your plan for Q3 improvements. Emphasize ROI and fiscal discipline.",
                    challenge: "Good morning. We've reviewed the pre-read materials and are looking forward to your presentation. Please begin when you're ready."
                },
                {
                    intro: "You're a keynote speaker at an AI and Future of Work conference. Deliver a 5-minute presentation on how generative AI is transforming project management workflows. Engage the audience with real examples and clear takeaways.",
                    challenge: "Welcome to our session. The audience is excited to hear your insights on this topic. We have industry leaders, practitioners, and newcomers in the audience today. You have the floor."
                },
                {
                    intro: "You're pitching a digital marketing campaign to a potential e-commerce client. Explain your strategy, expected results, and how your service stands out. Convince the client that your approach will boost their ROI.",
                    challenge: "Thanks for coming in to present today. We're evaluating several options, so we're keen to understand your approach and how you see things differently."
                },
                {
                    intro: "You're the founder of a sustainable packaging startup. Pitch your company to a group of angel investors, covering your market opportunity, traction, business model, and what you're asking for. Aim to generate interest and urgency.",
                    challenge: "Thank you for taking the time to meet with us today. We're excited to share our vision and perspective with you. We understand you see many presentations, so we'll focus on what we think is important."
                },
                {
                    intro: "You're a project manager providing a weekly update to your internal product team. Cover project progress, blockers, upcoming milestones, and any help needed. Keep it concise and collaborative.",
                    challenge: "Good morning team. We're looking forward to your update. Please walk us through where things stand and what you'd like to discuss."
                },
                {
                    intro: "You are unveiling your company's newest mobile app feature to a group of internal stakeholders and early beta testers. Explain what it is, who it's for, and how it solves user pain points. Build excitement and clarity.",
                    challenge: "We're all excited to hear about this new initiative. Please walk us through your approach and what you'd like us to focus on."
                }
            ];
            return JSON.stringify(scenarios[variation]);
        } else if (prompt.includes('leadership')) {
            const scenarios = [
                {
                    intro: "You are a high-performing team member who's been showing signs of burnout and decreased engagement lately.",
                    challenge: "I know you wanted to talk, but honestly, I'm not sure what there is to discuss. I've been doing my job, hitting my targets. If this is about last week's incident, I think it's being blown out of proportion."
                },
                {
                    intro: "Two of your key team members are in conflict, affecting the entire team's productivity. You're meeting with one of them.",
                    challenge: "I'm glad we're finally talking about this. Working with Alex has become impossible. They undermine me in meetings and take credit for my ideas. I'm considering transferring to another team."
                },
                {
                    intro: "You need to deliver difficult feedback to a long-time employee whose performance has been declining.",
                    challenge: "I've been with this company for 8 years and never had a performance issue. Now suddenly you're questioning my work? Maybe the problem isn't me - maybe it's the unrealistic expectations."
                },
                {
                    intro: "Your team is resistant to a major process change that's been mandated from above. You're addressing their concerns.",
                    challenge: "This new process is going to slow us down significantly. We've tried explaining this to upper management but they don't listen. Why should we support something that will hurt our productivity?"
                },
                {
                    intro: "A talented team member has been passed over for promotion and is considering leaving. They've asked to speak with you.",
                    challenge: "I need to be honest - I'm disappointed and frustrated. I've exceeded every goal, taken on extra responsibilities, and yet someone with less experience got promoted over me. What am I doing wrong?"
                }
            ];
            return JSON.stringify(scenarios[variation]);
        }
        
        // Generic fallback
        return JSON.stringify({
            intro: "You are in a professional communication scenario where you're listening to someone demonstrate their skills.",
            challenge: "I'd like to understand your perspective on this. Can you walk me through your thinking?"
        });
    }

    /**
     * Context-specific response generators
     */
    getSalesObjectionResponse() {
        const responses = [
            "I hear what you're saying about the value, but I'm still not convinced this is better than what we have now. Our current solution works fine - why should we change?",
            "That's interesting, but I need to see some concrete numbers. Do you have case studies from companies similar to ours?",
            "I appreciate the explanation, but I'm concerned about the implementation timeline. We can't afford any disruption to our operations.",
            "The features sound good, but I need to discuss this with my team before making any decisions. Can you follow up in a few weeks?",
            "Your solution seems comprehensive, but honestly, the learning curve looks steep. How much training would our staff need?"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getPresentationResponse() {
        const responses = [
            "That's an interesting point. Can you elaborate on that?",
            "I'd like to understand more about what you just presented. Can you walk us through that?",
            "That raises some questions. What are your thoughts on the next steps?",
            "I'm curious about your perspective here. How did you come to that conclusion?",
            "This is helpful information. What would you say are the main takeaways?"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getLeadershipResponse() {
        const responses = [
            "I understand what you're saying, but I feel like my contributions aren't being recognized. Other team members seem to get more visibility.",
            "I'm struggling with the workload lately. The new responsibilities are overwhelming, and I'm not sure I'm the right person for this role.",
            "There's been some tension with other departments. They don't seem to understand our processes, and it's affecting our productivity.",
            "I appreciate the feedback, but I disagree with your assessment. I think my performance has been strong, and I'd like to discuss this further.",
            "The team dynamics have been challenging lately. Some people aren't pulling their weight, and it's creating frustration."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getGenericResponse() {
        const responses = [
            "I understand your perspective, but I'm not sure I agree with that approach. Can you help me understand your reasoning?",
            "That's an interesting point. However, I think we need to consider some other factors before moving forward.",
            "I appreciate you bringing this up. It's definitely something we need to address, but I'm wondering about the best way to handle it.",
            "Your suggestion has merit, but I'm concerned about the potential implications. How do you think we should proceed?",
            "I see what you're getting at, but I think there might be some challenges we haven't discussed yet."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    /**
     * Determine if conversation should continue
     */
    shouldContinueConversation() {
        const turnCount = this.conversationHistory.filter(msg => msg.role === 'user').length;
        return turnCount < 6; // Limit to reasonable session length
    }

    /**
     * Get suggested follow-up for user guidance
     */
    getSuggestedFollowUp(analysisType) {
        const suggestions = {
            'sales_objection': [
                "Try acknowledging their concern first",
                "Ask clarifying questions to understand better",
                "Provide specific examples or case studies",
                "Suggest a trial or pilot program"
            ],
            'presentation': [
                "Address their concern directly",
                "Provide supporting data or evidence",
                "Acknowledge the validity of their question",
                "Offer to follow up with more details"
            ],
            'leadership': [
                "Listen actively and show empathy",
                "Ask for specific examples",
                "Focus on collaborative solutions",
                "Set clear expectations going forward"
            ]
        };

        const scenarioSuggestions = suggestions[analysisType] || suggestions['sales_objection'];
        return scenarioSuggestions[Math.floor(Math.random() * scenarioSuggestions.length)];
    }

    /**
     * Fallback responses for error cases
     */
    getFallbackScenario(analysisType) {
        return {
            scenario: this.getScenarioConfig(analysisType),
            initialMessage: "Let's begin this practice session. I'll present realistic challenges for you to respond to.",
            firstChallenge: "I'm interested in what you're proposing, but I have some concerns we should discuss."
        };
    }

    getFallbackResponse(analysisType) {
        return {
            message: "That's an interesting perspective. Let me think about what you've said and how we can move forward with this.",
            shouldContinue: this.shouldContinueConversation(),
            suggestedFollowUp: this.getSuggestedFollowUp(analysisType)
        };
    }

    /**
     * Get conversation analytics for post-session analysis
     */
    getSessionAnalytics() {
        const userMessages = this.conversationHistory.filter(msg => msg.role === 'user');
        const totalDuration = this.conversationHistory.length > 0 ? 
            this.conversationHistory[this.conversationHistory.length - 1].timestamp - this.conversationHistory[0].timestamp : 0;

        return {
            totalTurns: userMessages.length,
            duration: Math.round(totalDuration / 1000), // Convert to seconds
            averageResponseTime: totalDuration / userMessages.length / 1000,
            conversationFlow: this.conversationHistory,
            scenarioType: this.currentScenario?.title || 'Unknown',
            completionRate: userMessages.length >= 3 ? 'Complete' : 'Partial'
        };
    }

    /**
     * Analyze practice session using the communication analysis framework
     */
    async analyzePracticeSession(analysisType) {
        try {
            // Check if AnalysisFramework is available
            if (typeof window.AnalysisFramework === 'undefined') {
                console.warn('AnalysisFramework not loaded, using basic analytics');
                return this.getBasicSessionAnalysis();
            }

            const framework = new window.AnalysisFramework();
            
            // Combine all user messages into a single transcript
            const userMessages = this.conversationHistory.filter(msg => msg.role === 'user');
            const practiceTranscript = userMessages.map(msg => msg.message).join(' ');
            
            if (!practiceTranscript.trim()) {
                throw new Error('No user communication to analyze');
            }

            // Map analysis types to framework types
            const typeMapping = {
                'sales_objection': 'sales',
                'presentation': 'presentation', 
                'leadership': 'leadership',
                'client_call': 'client_consultation',
                'negotiation': 'negotiation'
            };

            const frameworkType = typeMapping[analysisType] || 'presentation';
            
            // Get analysis using the framework
            const analysisPrompt = framework.getAnalysisPrompt(
                practiceTranscript,
                frameworkType,
                `Practice session context: ${this.currentScenario?.title || 'Communication practice'}`
            );

            // For now, simulate the analysis since we don't have live API integration
            const analysisResults = this.simulatePracticeAnalysis(practiceTranscript, frameworkType);
            
            // Combine with session analytics
            const sessionAnalytics = this.getSessionAnalytics();
            
            return {
                success: true,
                results: {
                    transcript: practiceTranscript,
                    analysis: analysisResults,
                    communicationType: frameworkType,
                    sessionAnalytics: sessionAnalytics,
                    timestamp: new Date().toISOString(),
                    source: 'practice_session'
                }
            };

        } catch (error) {
            console.error('Practice session analysis error:', error);
            return {
                success: false,
                error: error.message,
                fallback: this.getBasicSessionAnalysis()
            };
        }
    }

    /**
     * Simulate practice analysis results
     */
    simulatePracticeAnalysis(transcript, communicationType) {
        // Generate realistic practice session scores
        const baseScore = 65 + Math.floor(Math.random() * 25); // 65-90 range for practice
        
        return {
            overallScore: baseScore,
            quantitativeScores: {
                'Clarity & Articulation': Math.max(60, baseScore + Math.floor(Math.random() * 10) - 5),
                'Confidence & Presence': Math.max(60, baseScore + Math.floor(Math.random() * 10) - 5),
                'Engagement & Connection': Math.max(60, baseScore + Math.floor(Math.random() * 10) - 5),
                'Structure & Organization': Math.max(60, baseScore + Math.floor(Math.random() * 10) - 5),
                'Persuasion & Impact': Math.max(60, baseScore + Math.floor(Math.random() * 10) - 5)
            },
            qualitativeFeedback: {
                strengths: this.getPracticeStrengths(communicationType),
                improvements: this.getPracticeImprovements(communicationType),
                recommendations: this.getPracticeRecommendations(communicationType)
            },
            communicationSpecific: {
                score: baseScore,
                notes: `Strong practice session performance in ${communicationType} communication.`
            },
            rawAnalysis: `Practice session analysis for ${communicationType} communication`
        };
    }

    /**
     * Get practice-specific feedback
     */
    getPracticeStrengths(type) {
        const strengths = {
            sales: ['Addressed objections directly', 'Maintained professional tone', 'Used specific examples effectively'],
            presentation: ['Clear delivery and structure', 'Engaged with questions well', 'Confident presentation style'],
            leadership: ['Showed empathy and understanding', 'Asked good clarifying questions', 'Maintained professional composure'],
            negotiation: ['Balanced assertiveness with collaboration', 'Focused on mutual benefits', 'Remained calm under pressure'],
            client_consultation: ['Demonstrated active listening', 'Asked insightful questions', 'Maintained client focus']
        };
        return strengths[type] || strengths.presentation;
    }

    getPracticeImprovements(type) {
        const improvements = {
            sales: ['Could probe deeper on customer needs', 'Consider addressing price concerns earlier', 'Strengthen closing techniques'],
            presentation: ['Add more audience interaction', 'Improve transition between topics', 'Strengthen opening impact'],
            leadership: ['Provide more specific feedback', 'Set clearer expectations', 'Offer more actionable solutions'],
            negotiation: ['Explore more creative alternatives', 'Better acknowledge other party interests', 'Improve urgency creation'],
            client_consultation: ['Ask more discovery questions', 'Provide clearer timelines', 'Better summarize next steps']
        };
        return improvements[type] || improvements.presentation;
    }

    getPracticeRecommendations(type) {
        const recommendations = {
            sales: ['Practice handling price objections with data', 'Develop compelling ROI stories', 'Work on assumptive closing'],
            presentation: ['Record yourself practicing for self-review', 'Prepare more interactive elements', 'Develop stronger opening hooks'],
            leadership: ['Practice giving specific behavioral feedback', 'Work on difficult conversation scripts', 'Develop clearer communication templates'],
            negotiation: ['Study win-win negotiation techniques', 'Practice reframing positions as interests', 'Develop better BATNA options'],
            client_consultation: ['Create structured discovery frameworks', 'Practice summarizing and confirming understanding', 'Develop clear next-step templates']
        };
        return recommendations[type] || recommendations.presentation;
    }

    /**
     * Fallback analysis for when framework isn't available
     */
    getBasicSessionAnalysis() {
        const analytics = this.getSessionAnalytics();
        return {
            overallScore: 75,
            message: 'Practice session completed successfully',
            analytics: analytics,
            basic: true
        };
    }
}

// Export for use in other scripts
window.AIConversationEngine = AIConversationEngine;