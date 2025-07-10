// Gemini AI Engine for Dynamic Conversation Generation
class GeminiAIEngine {
  constructor() {
    this.baseUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    this.conversationContext = [];
    this.scenarioContext = null;

    // Initialize API key - will be checked dynamically in isConfigured()
    this.apiKey = null;

    console.log("GeminiAIEngine initialized with model: gemini-2.0-flash");
  }

  isConfigured() {
    // Always get the latest API key from window
    if (
      window.GEMINI_API_KEY &&
      window.GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY_HERE"
    ) {
      if (this.apiKey !== window.GEMINI_API_KEY) {
        this.apiKey = window.GEMINI_API_KEY;
        console.log(
          "GeminiAIEngine: API key updated from window.GEMINI_API_KEY"
        );
      }
      return true;
    }

    // Also check API_CONFIG if available
    if (window.API_CONFIG && window.API_CONFIG.gemini) {
      if (this.apiKey !== window.API_CONFIG.gemini) {
        this.apiKey = window.API_CONFIG.gemini;
        console.log("GeminiAIEngine: API key updated from API_CONFIG.gemini");
      }
      return true;
    }

    console.warn("GeminiAIEngine: No valid API key found");
    return false;
  }

  setScenarioContext(scenario, title, description, sectionType = null) {
    this.scenarioContext = {
      scenario,
      title,
      description,
      sectionType, // 'personal' or 'professional'
      industry: this.inferIndustry(description),
      customerProfile: this.generateCustomerProfile(scenario),
    };
    this.conversationContext = [];
  }

  inferIndustry(description) {
    const industryKeywords = {
      software: ["software", "saas", "platform", "app", "digital", "tech"],
      healthcare: ["medical", "health", "patient", "clinical", "hospital"],
      finance: ["financial", "banking", "investment", "insurance", "fintech"],
      manufacturing: ["manufacturing", "production", "factory", "industrial"],
      retail: ["retail", "store", "customer", "shopping", "commerce"],
      education: ["education", "school", "learning", "student", "training"],
      consulting: ["consulting", "advisory", "strategy", "business"],
    };

    const desc = description.toLowerCase();
    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      if (keywords.some((keyword) => desc.includes(keyword))) {
        return industry;
      }
    }
    return "technology"; // default
  }

  inferCommunicationType(scenario, title, sectionType = null) {
    // If sectionType is explicitly provided, use it (this is the most reliable way)
    if (sectionType === "personal") {
      return "personal";
    }
    if (sectionType === "professional") {
      // Let it fall through to professional detection below
    }

    // Check for personal communication scenarios (only if not explicitly professional)
    if (sectionType !== "professional") {
      const personalKeywords = [
        "casual",
        "social",
        "deep",
        "storytelling",
        "conflict-resolution",
        "dating",
        "personal",
        "grief",
        "family",
        "friendship",
        "romantic",
        "hobby",
        "interest",
        "funny",
        "entertaining",
        "vulnerability",
        "heart-to-heart",
        "childhood",
        "memory",
      ];
      const personalScenarios = [
        "career-achievement",
        "hobby-interests",
        "neighborhood-chat",
        "awkward-recovery",
        "family-support",
        "vulnerability-opening",
        "life-transitions",
        "grief-loss",
        "dreams-aspirations",
        "travel-adventure",
        "childhood-family",
        "overcoming-challenges",
        "funny-entertaining",
        "meeting-new-people",
        "workplace-smalltalk",
        "neighbors-community",
        "shared-interests",
        "party-events",
        "values-discussion",
        "life-challenges",
        "relationships-love",
        "purpose-meaning",
        "fears-vulnerabilities",
        "personal-narrative",
        "adventure-story",
        "funny-story",
        "inspirational-story",
        "childhood-memory",
        "lesson-learned",
        "first-dates",
        "relationship-building",
        "flirting-playfulness",
        "intimacy-conversations",
        "relationship-defining",
        "family-disputes",
        "romantic-conflicts",
        "friendship-boundaries",
        "living-arrangements",
        "difficult-conversations",
        "personal-boundaries",
      ];

      if (
        personalScenarios.includes(scenario) ||
        personalKeywords.some(
          (keyword) =>
            scenario.includes(keyword) || title.toLowerCase().includes(keyword)
        )
      ) {
        return "personal";
      }
    }

    // Check for sales-related scenarios
    const salesKeywords = [
      "cold-call",
      "discovery",
      "demo",
      "pitch",
      "closing",
      "objection",
      "sales",
    ];
    if (
      salesKeywords.some(
        (keyword) =>
          scenario.includes(keyword) || title.toLowerCase().includes(keyword)
      )
    ) {
      return "sales";
    }

    // Check for presentation scenarios
    const presentationKeywords = [
      "presentation",
      "boardroom",
      "conference",
      "pitch",
      "investor",
      "product-launch",
      "board",
    ];
    if (
      presentationKeywords.some(
        (keyword) =>
          scenario.includes(keyword) || title.toLowerCase().includes(keyword)
      )
    ) {
      return "presentation";
    }

    // Check for leadership scenarios
    const leadershipKeywords = [
      "team",
      "meeting",
      "leadership",
      "management",
      "crisis",
      "change",
    ];
    if (
      leadershipKeywords.some(
        (keyword) =>
          scenario.includes(keyword) || title.toLowerCase().includes(keyword)
      )
    ) {
      return "leadership";
    }

    // Check for negotiation scenarios
    const negotiationKeywords = [
      "negotiation",
      "contract",
      "partnership",
      "deal",
      "agreement",
      "terms",
    ];
    if (
      negotiationKeywords.some(
        (keyword) =>
          scenario.includes(keyword) || title.toLowerCase().includes(keyword)
      )
    ) {
      return "negotiation";
    }

    // Default to sales if unclear
    return "sales";
  }

  generateCustomerProfile(scenario) {
    // Sales scenarios
    const salesProfiles = {
      "cold-call": {
        role: "Busy department manager",
        company: "Mid-size company",
        painPoint: "Current situation",
        budget: "Resource conscious",
        personality: "Skeptical but professional",
      },
      "discovery-call": {
        role: "Decision maker",
        company: "Growing business",
        painPoint: "Operational challenges",
        budget: "Has resources allocated",
        personality: "Analytical and thorough",
      },
      "product-demo": {
        role: "Technical decision maker",
        company: "Established enterprise",
        painPoint: "System concerns",
        budget: "Significant resources",
        personality: "Detail-oriented and cautious",
      },
      "price-objection": {
        role: "Budget-conscious buyer",
        company: "Cost-sensitive organization",
        painPoint: "Value justification",
        budget: "Limited resources",
        personality: "Value-focused and pragmatic",
      },
      "competitor-objection": {
        role: "Comparing options",
        company: "Due diligence focused",
        painPoint: "Making the right choice",
        budget: "Flexible resources",
        personality: "Methodical and research-driven",
      },
      "closing-call": {
        role: "Ready to move forward",
        company: "Solution-ready organization",
        painPoint: "Final concerns",
        budget: "Approved resources",
        personality: "Careful but motivated",
      },
    };

    // Presentation scenarios - simplified to avoid predetermined topics
    const presentationProfiles = {
      boardroom: {
        role: "Board member",
        company: "Executive level",
        painPoint: "Understanding the presentation",
        budget: "N/A",
        personality: "Professional and attentive",
      },
      conference: {
        role: "Conference attendee",
        company: "Industry audience",
        painPoint: "Learning from the presentation",
        budget: "N/A",
        personality: "Engaged and curious",
      },
      "client-pitch": {
        role: "Client representative",
        company: "Potential client",
        painPoint: "Understanding the proposal",
        budget: "N/A",
        personality: "Evaluative and thoughtful",
      },
      investor: {
        role: "Investor",
        company: "Investment context",
        painPoint: "Understanding the opportunity",
        budget: "N/A",
        personality: "Analytical and inquisitive",
      },
      "product-launch": {
        role: "Stakeholder",
        company: "Team context",
        painPoint: "Understanding the update",
        budget: "N/A",
        personality: "Supportive and interested",
      },
    };

    // Leadership scenarios
    const leadershipProfiles = {
      "team-meeting": {
        role: "Team member",
        company: "Direct report",
        painPoint: "Workload and priorities",
        budget: "Time and resources",
        personality: "Engaged but concerned",
      },
      "change-announcement": {
        role: "Affected employee",
        company: "Organizational change",
        painPoint: "Job security and adaptation",
        budget: "Personal impact",
        personality: "Anxious but professional",
      },
      "crisis-management": {
        role: "Concerned team member",
        company: "Crisis response team",
        painPoint: "Stability and next steps",
        budget: "Damage control",
        personality: "Worried but solution-focused",
      },
      "conflict-resolution": {
        role: "Involved party",
        company: "Team dynamics",
        painPoint: "Workplace relationships",
        budget: "Emotional investment",
        personality: "Defensive but seeking resolution",
      },
    };

    // Negotiation scenarios
    const negotiationProfiles = {
      contract: {
        role: "Contract negotiator",
        company: "Business partner",
        painPoint: "Favorable terms",
        budget: "Cost optimization",
        personality: "Strategic and firm",
      },
      partnership: {
        role: "Partnership manager",
        company: "Potential partner",
        painPoint: "Mutual benefits",
        budget: "Value exchange",
        personality: "Collaborative but cautious",
      },
      salary: {
        role: "Employee",
        company: "Current employer",
        painPoint: "Fair compensation",
        budget: "Personal value",
        personality: "Assertive but respectful",
      },
    };

    // Try to find the appropriate profile
    if (salesProfiles[scenario]) return salesProfiles[scenario];
    if (presentationProfiles[scenario]) return presentationProfiles[scenario];
    if (leadershipProfiles[scenario]) return leadershipProfiles[scenario];
    if (negotiationProfiles[scenario]) return negotiationProfiles[scenario];

    // Default fallback
    return salesProfiles["cold-call"];
  }

  async generateInitialPrompt() {
    if (!this.isConfigured()) {
      throw new Error("Gemini API key not configured");
    }

    const { scenario, title, description } = this.scenarioContext;
    const profile = this.scenarioContext.customerProfile;

    // Determine the communication type based on scenario context
    const communicationType = this.inferCommunicationType(
      scenario,
      title,
      this.scenarioContext.sectionType
    );

    let prompt = "";

    if (communicationType === "personal") {
      // Personal communication prompts removed - fallback to static messages
      return this.getFallbackPrompt(scenario);
    } else if (communicationType === "sales") {
      prompt = `You are roleplaying as a ${profile.role} at a ${
        profile.company
      } in a ${title.toLowerCase()} scenario. 

Context: ${description}

Customer Profile:
- Role: ${profile.role}
- Company Type: ${profile.company}
- Main Concern: ${profile.painPoint}
- Background: ${profile.personality}
- Personality: ${profile.personality}

Generate a realistic, specific opening objection or concern that this customer would have. The response should:
1. Sound natural and conversational
2. Include specific details relevant to their role and industry
3. Reflect their personality and current situation
4. Be challenging but realistic for a sales professional to handle
5. Be 1-2 sentences maximum

Respond only with the customer's dialogue - no quotation marks or explanations.`;
    } else if (communicationType === "presentation") {
      // Special handling for client-pitch scenarios
      if (scenario === "client-pitch") {
        const pitchScenarios = [
          "You are presenting a new product feature to a customer who has been using your platform for 6 months. They're interested in upgrading their plan.",
          "You are demonstrating your SaaS solution to a prospect who currently uses spreadsheets. They're skeptical about switching to a new system.",
          "You are presenting a custom integration proposal to an enterprise client. They need to connect your solution with their existing tech stack.",
          "You are pitching your consulting services to a company that just experienced rapid growth. They need help scaling their operations.",
          "You are presenting a new pricing model to an existing client. They're currently on a legacy plan that's being phased out.",
        ];

        prompt = `Generate ONE of these exact client pitch scenarios:
${pitchScenarios.join("\n")}

Choose one randomly and return it exactly as written, followed by "Please begin when you're ready."

Do not modify the scenarios or add any other text.`;
      } else {
        // Determine presentation type and audience
        let presentationType = "business presentation";
        let audienceType = "professional audience";
        
        if (scenario === "boardroom") {
          presentationType = "boardroom presentation";
          audienceType = "board members and executives";
        } else if (scenario === "conference") {
          presentationType = "conference keynote";
          audienceType = "industry professionals and conference attendees";
        } else if (scenario === "client-pitch") {
          presentationType = "client pitch";
          audienceType = "potential clients and decision makers";
        } else if (scenario === "team-update") {
          presentationType = "team update presentation";
          audienceType = "team members and colleagues";
        } else if (scenario === "investor") {
          presentationType = "investor pitch";
          audienceType = "investors and venture capitalists";
        } else if (scenario === "product-launch") {
          presentationType = "product launch presentation";
          audienceType = "stakeholders and team members";
        }
        
        // Define presentation topic variations based on scenario
        let topicVariations = [];
        
        if (scenario === "boardroom") {
          topicVariations = [
            "quarterly performance, strategic initiatives, and key challenges ahead",
            "financial results, operational updates, and strategic roadmap",
            "market performance, competitive positioning, and growth opportunities",
            "budget review, risk assessment, and strategic priorities",
            "annual performance, market expansion plans, and investment priorities"
          ];
        } else if (scenario === "conference") {
          topicVariations = [
            "industry trends, innovative solutions, and future opportunities",
            "market disruptions, emerging technologies, and strategic insights",
            "digital transformation, best practices, and industry outlook",
            "innovation strategies, case studies, and market predictions",
            "technology advances, customer insights, and growth strategies"
          ];
        } else if (scenario === "client-pitch") {
          topicVariations = [
            "our solution capabilities, implementation approach, and expected outcomes",
            "product features, integration options, and ROI projections",
            "service offerings, deployment timeline, and success metrics",
            "platform capabilities, customization options, and business impact",
            "solution architecture, migration strategy, and value proposition"
          ];
        } else if (scenario === "team-update") {
          topicVariations = [
            "project progress, team achievements, and upcoming milestones",
            "sprint results, technical challenges, and next phase planning",
            "quarterly objectives, team performance, and resource needs",
            "deliverable status, lessons learned, and action items",
            "product development updates, team wins, and roadmap adjustments"
          ];
        } else if (scenario === "investor") {
          topicVariations = [
            "business model, market opportunity, and growth strategy",
            "revenue projections, competitive advantages, and expansion plans",
            "market traction, unit economics, and funding requirements",
            "customer acquisition, product roadmap, and financial projections",
            "business metrics, market validation, and scaling strategy"
          ];
        } else if (scenario === "product-launch") {
          topicVariations = [
            "product features, market positioning, and launch timeline",
            "key innovations, target audience, and go-to-market strategy",
            "product capabilities, competitive differentiation, and rollout plan",
            "feature highlights, customer benefits, and availability details",
            "product vision, market fit, and launch phases"
          ];
        }
        
        // Use a random variation to ensure variety
        const presentationTopics = topicVariations[Math.floor(Math.random() * topicVariations.length)] || topicVariations[0];
        
        prompt = `You are a Presentation Mediator facilitating a ${presentationType} to ${audienceType}. 

The specific topics for this presentation are: ${presentationTopics}

Generate a professional mediator introduction following this EXACT structure:

"Good [morning/afternoon/evening], everyone. I'm here to facilitate today's ${presentationType} where we'll be discussing ${presentationTopics}. Please begin when you're ready."

IMPORTANT RULES:
1. You MUST follow the structure above exactly
2. Only vary the time of day (morning/afternoon/evening) - choose randomly
3. Use the EXACT topics provided: "${presentationTopics}"
4. Use "I'm here to facilitate" not other variations
5. Use "where we'll be discussing" not other phrasings
6. Always end with "Please begin when you're ready."
7. Keep it to exactly 2 sentences in this format

CRITICAL: Use the topics EXACTLY as provided above. Do not modify or paraphrase them.

${
  scenario === "conference"
    ? "CONFERENCE SPECIFIC: Use 'Good morning' or 'Good afternoon' and maintain the same structure."
    : ""
}

Random seed for time variation: ${Date.now()}

Respond only with your mediator introduction - no quotation marks or explanations.`;
      }
    } else if (communicationType === "leadership") {
      // Special handling for change-announcement to give leaders practice opportunities
      if (scenario === "change-announcement") {
        const changeScenarios = [
          "Your company is implementing a new software system that will change how your team processes client requests. The transition starts in 3 weeks and will require 2 days of training. You need to announce this change to your team of 8 people during your weekly team meeting. Some team members have expressed resistance to technology changes in the past. Make your announcement now, covering the what, why, when, and how this affects them.",
          "Due to budget constraints, your department will be restructuring. Two positions will be eliminated through voluntary buyouts, and remaining team members will take on expanded responsibilities with a 5% salary increase. You need to announce this to your team of 12 people. Some have been with the company for over 10 years. Make your announcement now, being clear about the changes while maintaining team morale.",
          "Your company is merging with another firm. This means new leadership, different processes, and potential role changes for your team. The merger completes in 6 months. You need to announce this major change to your team of 15 people during an all-hands meeting. People are already hearing rumors and are anxious. Make your announcement now, addressing the uncertainty while keeping the team focused.",
          "Your team will be transitioning to a hybrid work model - 3 days in office, 2 days remote. This starts next month and applies to all team members. Some people love remote work, others prefer being in the office. You need to announce this change during your team meeting. Make your announcement now, covering the new policy and addressing different preferences.",
          "Your department is being moved to a new location across town. The move happens in 2 months. This affects commute times, parking, and some team members may need to adjust their schedules. You need to announce this change to your team of 10 people. Make your announcement now, covering the logistics and addressing concerns.",
        ];

        prompt = `You are setting up a change announcement practice scenario for a leader. 

Generate ONE of these exact scenarios:
${changeScenarios.join("\n\n")}

Choose one randomly and return it exactly as written. This gives the leader a specific change to announce and practice with.

Do not modify the scenarios or add any other text. The leader will make their announcement, then you'll respond as team members would.`;
      } else {
        prompt = `You are roleplaying as a ${
          profile.role
        } in a ${title.toLowerCase()} scenario.

Context: ${description}

Team Member Profile:
- Role: ${profile.role}
- Team Dynamic: ${profile.company}
- Main Concern: ${profile.painPoint}
- Attitude: ${profile.personality}

Generate a realistic concern, pushback, or question that this team member would raise. The response should:
1. Reflect typical team dynamics and workplace concerns
2. Show their perspective on leadership decisions
3. Be appropriate for a professional team environment
4. Present a realistic leadership challenge
5. Be 1-2 sentences maximum

Respond only with the team member's concern or question - no quotation marks or explanations.`;
      }
    } else if (communicationType === "negotiation") {
      prompt = `You are roleplaying as a ${
        profile.role
      } in a ${title.toLowerCase()} scenario.

Context: ${description}

Negotiation Partner Profile:
- Role: ${profile.role}
- Organization: ${profile.company}
- Key Interest: ${profile.painPoint}
- Negotiation Style: ${profile.personality}

Generate a realistic negotiation position, concern, or counteroffer that this person would present. The response should:
1. Reflect their negotiation interests and constraints
2. Show their professional negotiation approach
3. Present a realistic challenge to work through
4. Be appropriate for business negotiations
5. Be 1-2 sentences maximum

Respond only with the negotiation partner's position or concern - no quotation marks or explanations.`;
    }

    // Default fallback
    if (!prompt) {
      prompt = `Generate a professional response appropriate for a ${title} scenario: ${description}`;
    }

    try {
      const response = await this.callGeminiAPI(prompt);
      this.conversationContext.push({
        type: "ai_generated",
        content: response,
        timestamp: Date.now(),
      });
      return response;
    } catch (error) {
      console.error("Failed to generate initial prompt:", error);
      // Fallback to static prompt
      return this.getFallbackPrompt(scenario);
    }
  }

  async generateFollowUpPrompt(userResponse, conversationHistory) {
    const { scenario, title } = this.scenarioContext;
    const communicationType = this.inferCommunicationType(
      scenario,
      title,
      this.scenarioContext.sectionType
    );

    if (!this.isConfigured()) {
      return this.getFallbackFollowUp(communicationType);
    }

    const profile = this.scenarioContext.customerProfile;

    // Build conversation context
    const conversationSummary = conversationHistory
      .filter((msg) => msg.type === "ai" || msg.type === "user")
      .map((msg) => `${msg.type}: ${msg.message}`)
      .join("\n");

    let prompt = "";

    if (communicationType === "personal") {
      // Personal communication follow-up prompts removed - fallback to static messages
      return this.getFallbackFollowUp(communicationType);
    } else if (communicationType === "sales") {
      prompt = `Continue the roleplay as a ${
        profile.role
      } in this ${title.toLowerCase()} scenario.

Previous conversation:
${conversationSummary}

Customer Profile: ${profile.personality}, ${profile.painPoint}

The salesperson just responded. Generate your next realistic response as the customer that:
1. Acknowledges their response appropriately
2. Presents a new objection, concern, or follow-up question relevant to your role
3. Escalates the conversation naturally with follow-up questions and concerns
4. Maintains your personality (${profile.personality})
5. Is 1-2 sentences maximum

Respond only with the customer's dialogue - no quotation marks or explanations.`;
    } else if (communicationType === "presentation") {
      // Determine presentation type and audience for follow-up
      let presentationType = "business presentation";
      let audienceType = "professional audience";
      
      if (scenario === "boardroom") {
        presentationType = "boardroom presentation";
        audienceType = "board members and executives";
      } else if (scenario === "conference") {
        presentationType = "conference keynote";
        audienceType = "industry professionals and conference attendees";
      } else if (scenario === "client-pitch") {
        presentationType = "client pitch";
        audienceType = "potential clients and decision makers";
      } else if (scenario === "team-update") {
        presentationType = "team update presentation";
        audienceType = "team members and colleagues";
      } else if (scenario === "investor") {
        presentationType = "investor pitch";
        audienceType = "investors and venture capitalists";
      } else if (scenario === "product-launch") {
        presentationType = "product launch presentation";
        audienceType = "stakeholders and team members";
      }
      
      prompt = `You are a Presentation Mediator facilitating a ${presentationType} to ${audienceType}. 

Previous interaction:
${conversationSummary}

The presenter just spoke. As the mediator, generate your next response that:

1. Acknowledges what the presenter just said
2. Poses a follow-up question or prompts them to elaborate on a specific point
3. Represents questions the ${audienceType} might have
4. Keeps the presentation flowing smoothly
5. Is 1-2 sentences maximum

IMPORTANT:
- Speak as the mediator/facilitator, NOT as an audience member
- Base your questions on what was actually discussed
- Keep it professional and constructive
- Help the presenter showcase their knowledge

Respond only with your mediator's question or prompt - no quotation marks or explanations.`;
    } else if (communicationType === "leadership") {
      // Special handling for change-announcement follow-ups
      if (scenario === "change-announcement") {
        const turnNumber = conversationHistory.filter(
          (msg) => msg.type === "user"
        ).length;

        if (turnNumber === 1) {
          // First response after leader's announcement - act as team member with initial reaction
          prompt = `The leader just made their change announcement. You are now a team member who heard this announcement. 

Their announcement was:
${conversationHistory[conversationHistory.length - 1]?.message || ""}

Respond as a team member would - with a realistic concern, question, or reaction that someone would have after hearing this change announcement. Focus on:
1. A natural human reaction to organizational change
2. A specific concern or question about how this affects the team
3. Professional but authentic team member perspective
4. 1-2 sentences maximum

Respond only with what a team member would say - no quotation marks or explanations.`;
        } else {
          // Subsequent responses - continue as team member
          prompt = `Continue as a team member in this change announcement discussion.

Previous discussion:
${conversationSummary}

The leader just responded to your concern. Generate your next realistic response that:
1. Shows you heard their leadership response
2. Raises a follow-up concern or asks for clarification about the change
3. Reflects how team members typically react to organizational changes
4. Maintains professional but authentic team communication
5. Is 1-2 sentences maximum

Respond only with the team member's response - no quotation marks or explanations.`;
        }
      } else {
        prompt = `Continue as a ${
          profile.role
        } in this ${title.toLowerCase()} scenario.

Previous discussion:
${conversationSummary}

Team Member Profile: ${profile.personality}, concerned about ${
          profile.painPoint
        }

The leader just addressed your concern. Generate your next realistic response that:
1. Shows you heard their leadership response
2. Raises a follow-up concern or asks for clarification
3. Reflects typical team member perspectives and workplace dynamics
4. Maintains professional but authentic team communication
5. Is 1-2 sentences maximum

Respond only with the team member's response - no quotation marks or explanations.`;
      }
    } else if (communicationType === "negotiation") {
      prompt = `Continue as a ${
        profile.role
      } in this ${title.toLowerCase()} scenario.

Previous negotiation:
${conversationSummary}

Negotiation Partner Profile: ${profile.personality}, focused on ${
        profile.painPoint
      }

The other party just made a response/offer. Generate your next realistic negotiation response that:
1. Acknowledges their position appropriately
2. Presents a counter-position, condition, or new concern
3. Reflects realistic business negotiation tactics
4. Maintains your negotiation style (${profile.personality})
5. Is 1-2 sentences maximum

Respond only with the negotiation partner's response - no quotation marks or explanations.`;
    }

    if (!prompt) {
      prompt = `Generate an appropriate follow-up response for a ${title} scenario.`;
    }

    try {
      const response = await this.callGeminiAPI(prompt);
      this.conversationContext.push({
        type: "ai_generated",
        content: response,
        timestamp: Date.now(),
      });
      return response;
    } catch (error) {
      console.error("Failed to generate follow-up prompt:", error);
      return this.getFallbackFollowUp(communicationType);
    }
  }

  async callGeminiAPI(prompt) {
    if (!this.apiKey) {
      throw new Error("API key not available for Gemini call");
    }

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
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
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 200,
            topP: 0.9,
            topK: 64,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API error response:", errorText);
        throw new Error(
          `Gemini API error: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Gemini API response:", data);

      if (
        !data.candidates ||
        !data.candidates[0] ||
        !data.candidates[0].content
      ) {
        console.error("Invalid Gemini API response structure:", data);
        throw new Error("Invalid Gemini API response format");
      }

      const text = data.candidates[0].content.parts[0].text.trim();
      if (!text) {
        throw new Error("Empty response from Gemini API");
      }

      return text;
    } catch (error) {
      console.error("Gemini API call failed:", error);
      throw error;
    }
  }

  getFallbackPrompt(scenario) {
    // Personal communication fallbacks
    const personalFallbacks = {
      "career-achievement":
        "Dude, that's awesome! Tell me about something you're really proud of - I love hearing about stuff like that!",
      "hobby-interests":
        "No way, I'm totally into that too! How'd you get started? I've been wanting to find more people who are into this stuff.",
      "neighborhood-chat":
        "Hey! I'm your neighbor from down the street - I've been meaning to come say hi. How's it going?",
      "awkward-recovery":
        "Oh man, that came out way wrong... can we pretend I didn't just say that? I swear I'm not usually this awkward!",
      "family-support":
        "I'm really glad you felt comfortable telling me this. That sounds really tough - I'm here for you.",
      "vulnerability-opening":
        "Thanks for trusting me with that. I can tell this is really important to you - I'm totally here to listen.",
      "life-transitions":
        "Wow, that's a huge decision! I've been there before. What's been on your mind about it?",
      "grief-loss":
        "I'm so sorry. I know there's nothing I can really say, but I'm here for whatever you need.",
      "dreams-aspirations":
        "That's such a cool dream! What would it look like if you actually did it? I love hearing about stuff people are passionate about.",
      "travel-adventure":
        "Oh my god, that sounds amazing! I'm so jealous - I've always wanted to do something like that. Tell me everything!",
      "childhood-family":
        "Aw, that's such a sweet memory! I love childhood stories - they always make me smile. What was your favorite part about being a kid?",
      "overcoming-challenges":
        "You're so strong for getting through that. I really look up to how you handled it. How'd you find the strength to keep going?",
      "funny-entertaining":
        "Haha, oh no! I need to hear this - it sounds like it's gonna be hilarious. What happened?",

      // Deep conversation scenarios
      "values-discussion":
        "Wow, that's such a deep question. I've been thinking about that stuff a lot lately too. What's been making you question things?",
      "life-challenges":
        "I can see this is really weighing on you. That sounds incredibly hard to deal with. How long have you been carrying this?",
      "relationships-love":
        "Oh, relationships are so complicated, aren't they? I've been through some stuff too. What's been on your heart about this?",
      "purpose-meaning":
        "Man, those are the questions that keep me up at night sometimes. Do you ever feel like you're just going through the motions?",
      "fears-vulnerabilities":
        "Thank you for trusting me with this. I know how scary it can be to open up. I've been there too - what's been eating at you?",

      // Storytelling scenarios
      "personal-narrative":
        "Oh wow, I love hearing people's real stories! Everyone has such fascinating journeys. What's the most pivotal moment that shaped who you are?",
      "adventure-story":
        "No way, you have to tell me about this! I'm living vicariously through other people's adventures right now. What was the craziest part?",
      "funny-story":
        "Oh my god, please tell me this story! I need a good laugh today. What happened that was so ridiculous?",
      "inspirational-story":
        "I really need to hear something uplifting right now. You always seem to find the silver lining in things. What kept you going?",
      "childhood-memory":
        "Aw, I love childhood stories! They're always so pure and sweet. What's your favorite memory from when you were little?",
      "lesson-learned":
        "I feel like I could learn from your experience. You seem to have such good perspective on things. What did that teach you?",

      // Dating conversation scenarios
      "first-dates":
        "I'm so nervous! This is either going to be amazing or completely awkward. How are you feeling about this?",
      "relationship-building":
        "I've been thinking about us a lot lately. I really like where this is going. How are you feeling about everything?",
      "flirting-playfulness":
        "You have excellent taste in books, I have to say. Are you always this charming when you're browsing the classics?",
      "intimacy-conversations":
        "I feel so comfortable with you, more than I have with anyone in a long time. What scares you most about getting close to someone?",
      "relationship-defining":
        "I've been wondering about this for a while now. I really care about you, but I'm not sure where your head is at with us.",

      // Conflict resolution scenarios
      "family-disputes":
        "Look, I've been feeling really left out lately and it's been bugging me. Can we talk about what's been happening with family stuff?",
      "romantic-conflicts":
        "I've been thinking about last night, and I'm still feeling hurt about how things went down. Can we talk about it?",
      "friendship-boundaries":
        "Hey, I need to talk to you about something that's been bothering me. I value our friendship, but I need to be honest about something.",
      "living-arrangements":
        "Okay, I don't want to be the nagging roommate, but we really need to figure out this whole kitchen situation. It's becoming a problem.",
      "difficult-conversations":
        "I've been putting this off, but I really need to tell you something. It's been weighing on me and I think you deserve to know.",
      "personal-boundaries":
        "I need to be honest with you about something. I care about you, but there's something that's been making me uncomfortable and I need to address it.",
    };

    // Professional communication fallbacks
    const professionalFallbacks = {
      "cold-call":
        "I appreciate you calling, but we're really not looking to make any changes to our current setup right now. We've had bad experiences with sales calls in the past.",
      "discovery-call":
        "I'm honestly not sure we have a big enough problem to justify bringing in an outside solution. Our current process works okay for most things.",
      "product-demo":
        "This looks pretty complicated. I'm worried about how long it would take our team to learn this, and whether it would actually integrate with our existing systems.",
      "price-objection":
        "I've been looking at other options and they seem to offer something similar. How do you differentiate your approach?",
      "competitor-objection":
        "We've been talking to other providers and they seem to have been in this space for a while. Their approach looks interesting too.",
      "closing-call":
        "This all sounds good, but I think we need to sleep on it. There are a few people I need to run this by before we can move forward.",
      "client-pitch":
        "Good afternoon, everyone. I'm here to facilitate today's client pitch where we'll be discussing our solution capabilities, implementation approach, and expected outcomes. Please begin when you're ready.",
      boardroom:
        "Good morning, everyone. I'm here to facilitate today's boardroom presentation where we'll be discussing quarterly performance, strategic initiatives, and key challenges ahead. Please begin when you're ready.",
      conference:
        "Good morning, everyone. I'm here to facilitate today's conference keynote where we'll be discussing industry trends, innovative solutions, and future opportunities. Please begin when you're ready.",
      "team-update":
        "Good morning, everyone. I'm here to facilitate today's team update presentation where we'll be discussing project progress, team achievements, and upcoming milestones. Please begin when you're ready.",
      investor:
        "Good afternoon, everyone. I'm here to facilitate today's investor pitch where we'll be discussing business model, market opportunity, and growth strategy. Please begin when you're ready.",
      "product-launch":
        "Good morning, everyone. I'm here to facilitate today's product launch presentation where we'll be discussing product features, market positioning, and launch timeline. Please begin when you're ready.",
    };

    // Determine communication type to use appropriate fallbacks
    const commType = this.inferCommunicationType(
      scenario,
      this.scenarioContext?.title || "",
      this.scenarioContext?.sectionType
    );

    if (commType === "personal") {
      return (
        personalFallbacks[scenario] || personalFallbacks["career-achievement"]
      );
    }

    return (
      professionalFallbacks[scenario] || professionalFallbacks["cold-call"]
    );
  }

  getFallbackFollowUp(communicationType = null) {
    const personalFollowUps = [
      "That's so cool! Tell me more about that.",
      "I love hearing about stuff like that! What was the best part?",
      "Oh wow, that sounds awesome! How'd that make you feel?",
      "That's such a great story! I can totally picture it.",
      "I'm so glad you told me that! What happened next?",
      "That reminds me of something that happened to me! But tell me more about yours first.",
    ];

    const professionalFollowUps = [
      "I understand what you're saying, but I'm still not convinced this is the right time for us.",
      "That's a fair point, but how do we know this will actually work for our specific situation?",
      "I hear you, but I'd need to see some concrete information before I could justify this to my team.",
      "Okay, but what happens if this doesn't work out? What kind of support do you provide?",
      "I appreciate the information, but I think I need to compare this with a few other options first.",
    ];

    const presentationFollowUps = [
      "Thank you for that overview. The audience would like to know more about how this works in practice. Can you elaborate?",
      "That's helpful context. A question from the audience - what specific metrics are you using to measure success?",
      "Excellent point. The audience is curious - how does this compare to what competitors are offering?",
      "Interesting approach. Can you share what's been the biggest challenge in implementing this?",
      "Great explanation. The audience would appreciate a real example of how this has worked for similar organizations.",
      "Thank you for that insight. A practical question - what would the timeline look like for implementation?",
      "That's compelling. The audience wants to understand the scalability - how does this work as organizations grow?",
      "Very informative. Can you tell us more about the support and training that would be involved?",
    ];

    if (communicationType === "personal") {
      return personalFollowUps[
        Math.floor(Math.random() * personalFollowUps.length)
      ];
    } else if (communicationType === "presentation") {
      return presentationFollowUps[
        Math.floor(Math.random() * presentationFollowUps.length)
      ];
    }

    return professionalFollowUps[
      Math.floor(Math.random() * professionalFollowUps.length)
    ];
  }

  // Analyze practice session conversation
  async analyzePracticeSession(conversationHistory, scenarioType) {
    if (!this.isConfigured()) {
      return this.getFallbackAnalysis(scenarioType);
    }

    const conversationText = conversationHistory
      .filter((msg) => msg.type === "ai" || msg.type === "user")
      .map(
        (msg) =>
          `${msg.type === "ai" ? "Customer" : "Salesperson"}: ${msg.message}`
      )
      .join("\n");

    const prompt = `Analyze this ${scenarioType} practice conversation and provide detailed feedback:

${conversationText}

Scenario Context: ${
      this.scenarioContext?.title || "Professional Communication"
    } - ${this.scenarioContext?.description || ""}

Please provide a comprehensive analysis covering:

1. **Communication Effectiveness** (Score: /10)
   - Clarity and articulation
   - Active listening demonstrated
   - Appropriate tone and professionalism

2. **Objection Handling** (Score: /10)
   - How well objections were addressed
   - Use of empathy and understanding
   - Providing relevant solutions

3. **Persuasion Techniques** (Score: /10)
   - Building rapport and trust
   - Presenting compelling arguments
   - Asking effective questions

4. **Areas for Improvement**
   - Specific suggestions for better responses
   - Missed opportunities in the conversation
   - Alternative approaches to try

5. **Strengths Demonstrated**
   - What worked well in the conversation
   - Effective techniques used
   - Natural communication moments

6. **Overall Score**: /30

Format your response as detailed analysis with specific examples from the conversation.`;

    try {
      const analysis = await this.callGeminiAPI(prompt);
      return {
        success: true,
        analysis: analysis,
        conversationHistory: conversationHistory,
        scenarioInfo: this.scenarioContext,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("Gemini analysis failed:", error);
      return this.getFallbackAnalysis(scenarioType);
    }
  }

  getFallbackAnalysis(scenarioType) {
    return {
      success: true,
      analysis: `## Practice Session Analysis

**Communication Effectiveness**: 7/10
Your communication showed good professional tone and structure. Continue practicing active listening and asking follow-up questions.

**${
        scenarioType === "sales"
          ? "Objection Handling"
          : scenarioType === "leadership"
          ? "Team Engagement"
          : "Negotiation Skills"
      }**: 6/10
You addressed key concerns but could strengthen your responses with more specific examples and empathy.

**Persuasion Techniques**: 7/10
Good use of logical arguments. Consider incorporating more storytelling and emotional connection.

**Areas for Improvement**:
- Practice handling objections with the "Feel, Felt, Found" technique
- Ask more discovery questions to understand underlying concerns
- Use specific examples and case studies to support your points

**Strengths Demonstrated**:
- Maintained professional demeanor throughout
- Stayed focused on the conversation objectives
- Showed good product/service knowledge

**Overall Score**: 20/30

Keep practicing! Focus on asking more questions and really listening to understand the customer's perspective.`,
      conversationHistory: [],
      scenarioInfo: {
        title: "Practice Session",
        description: "Communication practice",
      },
      timestamp: Date.now(),
    };
  }

  async generateScenario(scenarioType, title) {
    if (!this.isConfigured()) {
      return this.getFallbackScenario(scenarioType);
    }

    let prompt = "";

    if (scenarioType === "meeting-new-people") {
      prompt = `Generate a realistic casual conversation scenario for meeting new people. Create a specific situation where someone needs to approach and start a conversation with a stranger. Include:
- A specific location (networking event, coffee shop, gym, etc.)
- Context about the other person (what they're doing, their demeanor)
- A natural conversation opener opportunity
Keep it to 2-3 sentences maximum. Make it feel authentic and relatable.`;
    } else if (scenarioType === "workplace-smalltalk") {
      prompt = `Generate a realistic workplace small talk scenario. Create a specific situation where casual conversation happens at work. Include:
- A specific workplace location (break room, elevator, hallway, etc.)
- Time of day or context (Monday morning, after a meeting, lunch break)
- Something observable about the colleague or situation
Keep it to 2-3 sentences maximum. Make it feel natural and professional.`;
    } else if (scenarioType === "neighbors-community") {
      prompt = `Generate a realistic neighbor/community interaction scenario. Create a specific situation for neighborly conversation. Include:
- A specific location (mailbox, front yard, building lobby, etc.)
- An activity or situation happening
- A natural reason to interact
Keep it to 2-3 sentences maximum. Make it feel warm and community-oriented.`;
    } else if (scenarioType === "shared-interests") {
      prompt = `Generate a scenario where people discover shared interests. Create a situation where common ground emerges naturally. Include:
- The setting where this discovery happens
- The shared interest or hobby
- How the connection is revealed
Keep it to 2-3 sentences maximum. Make it feel exciting and engaging.`;
    } else if (scenarioType === "awkward-recovery") {
      prompt = `Generate an awkward social situation that needs graceful recovery. Create a minor social mishap. Include:
- The specific awkward moment (spill, mistaken identity, verbal slip, etc.)
- Where it happens
- The immediate aftermath
Keep it to 2-3 sentences maximum. Make it relatable but not devastating.`;
    } else if (scenarioType === "party-events") {
      prompt = `Generate a party or social event conversation scenario. Create a situation at a social gathering. Include:
- Type of event (birthday, wedding, house party, etc.)
- Your connection to the event
- Someone else in a similar situation
Keep it to 2-3 sentences maximum. Make it feel festive but potentially challenging.`;
    }

    // Deep conversation scenarios
    else if (scenarioType === "values-discussion") {
      prompt = `Generate a deep conversation scenario about personal values and beliefs. Create a meaningful moment where values come up naturally. Include:
- The setting (coffee shop, long drive, quiet evening, etc.)
- What prompted the deeper discussion
- The other person's openness level
Keep it to 2-3 sentences maximum. Make it thoughtful and authentic.`;
    } else if (scenarioType === "dreams-aspirations") {
      prompt = `Generate a conversation scenario about dreams and future aspirations. Create a moment of sharing hopes and ambitions. Include:
- Where this conversation happens
- What sparked talking about dreams
- The mood (hopeful, vulnerable, excited)
Keep it to 2-3 sentences maximum. Make it inspiring yet real.`;
    } else if (scenarioType === "life-challenges") {
      prompt = `Generate a scenario about discussing life challenges and difficulties. Create a supportive conversation moment. Include:
- The setting and context
- The type of challenge being faced
- The level of trust between people
Keep it to 2-3 sentences maximum. Make it genuine and empathetic.`;
    } else if (scenarioType === "relationships-love") {
      prompt = `Generate a conversation about relationships and love. Create a moment for discussing romantic feelings or relationship dynamics. Include:
- The relationship context (friends discussing love, couple talking, etc.)
- What prompted this heart-to-heart
- The emotional tone
Keep it to 2-3 sentences maximum. Make it heartfelt and authentic.`;
    } else if (scenarioType === "purpose-meaning") {
      prompt = `Generate a philosophical conversation about life purpose and meaning. Create a reflective moment. Include:
- Where this deep talk happens
- What triggered the existential discussion
- The openness to explore big questions
Keep it to 2-3 sentences maximum. Make it profound yet approachable.`;
    } else if (scenarioType === "fears-vulnerabilities") {
      prompt = `Generate a scenario about sharing fears and vulnerabilities. Create a safe space for opening up. Include:
- The trusted setting
- What makes this moment feel safe
- The courage needed to share
Keep it to 2-3 sentences maximum. Make it tender and supportive.`;
    }

    // Storytelling scenarios
    else if (scenarioType === "personal-narrative") {
      prompt = `Generate a storytelling scenario for sharing a personal life story. Create a moment where someone wants to hear your story. Include:
- What prompted the story request
- The listening environment
- The type of personal story to share
Keep it to 2-3 sentences maximum. Make it engaging and personal.`;
    } else if (scenarioType === "adventure-story") {
      prompt = `Generate a scenario for telling an adventure or travel story. Create an excited storytelling moment. Include:
- Who's asking to hear the adventure
- The setting for story sharing
- What adventure they're curious about
Keep it to 2-3 sentences maximum. Make it exciting and vivid.`;
    } else if (scenarioType === "funny-story") {
      prompt = `Generate a scenario for sharing a funny or embarrassing story. Create a lighthearted moment. Include:
- What triggered the need for humor
- The audience's mood
- The type of funny story needed
Keep it to 2-3 sentences maximum. Make it playful and entertaining.`;
    } else if (scenarioType === "inspirational-story") {
      prompt = `Generate a scenario for telling an inspirational or motivational story. Create a moment where encouragement is needed. Include:
- Who needs inspiration and why
- The setting for this uplifting moment
- The emotional context
Keep it to 2-3 sentences maximum. Make it powerful and encouraging.`;
    } else if (scenarioType === "childhood-memory") {
      prompt = `Generate a scenario for sharing childhood memories. Create a nostalgic storytelling moment. Include:
- What triggered the memory sharing
- The listening dynamic
- The type of childhood experience
Keep it to 2-3 sentences maximum. Make it warm and nostalgic.`;
    } else if (scenarioType === "lesson-learned") {
      prompt = `Generate a scenario for sharing a life lesson or wisdom. Create a teachable moment. Include:
- Who could benefit from your experience
- What prompted this wisdom sharing
- The receptiveness level
Keep it to 2-3 sentences maximum. Make it wise and helpful.`;
    }

    // Dating conversation scenarios
    else if (scenarioType === "first-dates") {
      prompt = `Generate a first date conversation scenario. Create the initial moments of a date. Include:
- The date location and activity
- The nervous energy or excitement
- An interesting conversation starter
Keep it to 2-3 sentences maximum. Make it charming and realistic.`;
    } else if (scenarioType === "relationship-building") {
      prompt = `Generate a relationship-building conversation between people dating. Create a bonding moment. Include:
- Where you are in the relationship timeline
- What deeper topic comes up
- The desire to connect more
Keep it to 2-3 sentences maximum. Make it sweet and meaningful.`;
    } else if (scenarioType === "flirting-playfulness") {
      prompt = `Generate a flirty, playful conversation scenario. Create a light romantic moment. Include:
- The setting for playful banter
- The flirting dynamic
- What sparked the playfulness
Keep it to 2-3 sentences maximum. Make it fun and flirtatious.`;
    } else if (scenarioType === "intimacy-conversations") {
      prompt = `Generate an intimate conversation scenario between romantic partners. Create a vulnerable sharing moment. Include:
- The private, comfortable setting
- What emotional topic arises
- The trust level between partners
Keep it to 2-3 sentences maximum. Make it tender and trusting.`;
    } else if (scenarioType === "relationship-defining") {
      prompt = `Generate a relationship-defining conversation scenario. Create a "what are we?" moment. Include:
- How long you've been dating
- What prompted this talk
- Both people's emotional state
Keep it to 2-3 sentences maximum. Make it honest and pivotal.`;
    }

    // Conflict resolution scenarios
    else if (scenarioType === "family-disputes") {
      prompt = `Generate a family conflict scenario that needs resolution. Create a tense but workable situation. Include:
- The family members involved
- The core disagreement
- The setting for this discussion
Keep it to 2-3 sentences maximum. Make it realistic but resolvable.`;
    } else if (scenarioType === "romantic-conflicts") {
      prompt = `Generate a romantic relationship conflict scenario. Create a couple's disagreement moment. Include:
- What the conflict is about
- How long it's been brewing
- Both partners' emotional states
Keep it to 2-3 sentences maximum. Make it authentic but not devastating.`;
    } else if (scenarioType === "friendship-boundaries") {
      prompt = `Generate a friendship boundary-setting scenario. Create a moment for honest friend talk. Include:
- What boundary needs discussing
- The friendship history
- The difficulty of bringing it up
Keep it to 2-3 sentences maximum. Make it caring but firm.`;
    } else if (scenarioType === "living-arrangements") {
      prompt = `Generate a living arrangement conflict scenario. Create a roommate or family living issue. Include:
- The specific living situation problem
- Who's involved
- The need for compromise
Keep it to 2-3 sentences maximum. Make it practical but tense.`;
    } else if (scenarioType === "difficult-conversations") {
      prompt = `Generate a difficult conversation scenario that needs careful handling. Create a challenging discussion moment. Include:
- The sensitive topic at hand
- The relationship dynamic
- Why this talk is necessary
Keep it to 2-3 sentences maximum. Make it serious but approachable.`;
    } else if (scenarioType === "personal-boundaries") {
      prompt = `Generate a personal boundary-setting scenario. Create a moment for self-advocacy. Include:
- What boundary is being crossed
- The relationship context
- The courage needed to speak up
Keep it to 2-3 sentences maximum. Make it empowering but respectful.`;
    }

    // Add similar prompts for other scenario types...

    if (!prompt) {
      return this.getFallbackScenario(scenarioType);
    }

    try {
      const response = await this.callGeminiAPI(prompt);
      return response;
    } catch (error) {
      console.error("Failed to generate scenario:", error);
      return this.getFallbackScenario(scenarioType);
    }
  }

  getFallbackScenario(scenarioType) {
    const fallbacks = {
      "meeting-new-people":
        "You're at a local tech meetup and notice someone standing alone by the refreshment table, scrolling through their phone and occasionally glancing around the room.",
      "workplace-smalltalk":
        "It's Tuesday morning and you're waiting for the elevator when your colleague from accounting joins you, sighing heavily while checking their watch.",
      "neighbors-community":
        "You're bringing in groceries when you see your new neighbor struggling to carry multiple packages while trying to unlock their door.",
      "shared-interests":
        "At a friend's barbecue, you overhear someone passionately explaining the exact same obscure hobby you've been into for years.",
      "awkward-recovery":
        "You're at a cafe and accidentally knock over someone's coffee while reaching for your order, spilling it on their laptop bag.",
      "party-events":
        "You're at your cousin's engagement party where you only know the hosts, and spot someone else looking equally lost by the photo display.",

      // Deep conversation scenarios
      "values-discussion":
        "You're having coffee with a close friend when they mention they're questioning some of their fundamental beliefs about life and want your perspective.",
      "dreams-aspirations":
        "During a late-night conversation with your best friend, they ask what you'd do if you knew you couldn't fail, and genuinely want to hear your biggest dreams.",
      "life-challenges":
        "Your friend calls you after a particularly hard day, voice shaking, saying they really need someone to talk to about what they're going through.",
      "relationships-love":
        "You and a friend are taking a long walk when they ask for your honest thoughts about their relationship, clearly needing guidance.",
      "purpose-meaning":
        "Sitting under the stars with someone close, they turn to you and ask if you ever wonder what the point of it all is.",
      "fears-vulnerabilities":
        "In a quiet moment together, your friend admits they've been struggling with something they've never told anyone before.",

      // Storytelling scenarios
      "personal-narrative":
        "At a dinner party, someone asks you to share the story of how you became who you are today - the real story, not the polished version.",
      "adventure-story":
        "Your coworkers gather around at lunch, begging you to tell them about that crazy trip you mentioned taking last year.",
      "funny-story":
        "The conversation has gotten a bit tense at a gathering, and someone turns to you saying 'You always have the best stories - tell us something funny!'",
      "inspirational-story":
        "A younger colleague confides they're thinking of giving up on their dreams, and asks if you've ever overcome something that seemed impossible.",
      "childhood-memory":
        "While looking through old photos with family, your cousin asks you to share your favorite memory from when you were kids together.",
      "lesson-learned":
        "A friend facing a tough decision asks if you've ever been through something similar and what you learned from it.",

      // Dating conversation scenarios
      "first-dates":
        "You're meeting your date at a cozy coffee shop, both of you a bit nervous, and after the initial hellos, there's that moment of 'what do we talk about now?'",
      "relationship-building":
        "Three months into dating, you're cooking dinner together when your partner mentions they've been thinking about where this is heading.",
      "flirting-playfulness":
        "You're at a bookstore with someone you're attracted to, browsing the same section, when they make a witty comment about your book choice.",
      "intimacy-conversations":
        "Lying in bed on a Sunday morning, your partner traces patterns on your arm and asks what you're really afraid of in relationships.",
      "relationship-defining":
        "After six months of dating, you're walking through the park when your partner stops and says they need to know what you both are to each other.",

      // Conflict resolution scenarios
      "family-disputes":
        "Your sibling confronts you about feeling left out of family decisions, tension clear in their voice as they demand to talk about it now.",
      "romantic-conflicts":
        "Your partner brings up how you handled something at dinner with friends last night, clearly hurt but trying to discuss it calmly.",
      "friendship-boundaries":
        "Your close friend sits you down, saying they need to talk about how some of your recent behavior has been affecting them.",
      "living-arrangements":
        "Your roommate knocks on your door, frustrated about the dishes in the sink for the third time this week, ready to have 'the talk.'",
      "difficult-conversations":
        "You need to tell someone close to you something that might change your relationship, and you've finally worked up the courage to do it.",
      "personal-boundaries":
        "A friend has been repeatedly doing something that makes you uncomfortable, and you've decided it's time to speak up about your boundaries.",
    };

    return (
      fallbacks[scenarioType] ||
      "You find yourself in a social situation where conversation would be beneficial."
    );
  }

  async generateConversationPrompt(
    scenarioType,
    scenarioTitle,
    generatedScenario
  ) {
    if (!this.isConfigured()) {
      return this.getFallbackConversationPrompt(scenarioType);
    }

    let prompt = "";

    if (scenarioType === "purpose-meaning") {
      prompt = `Based on this scenario: "${generatedScenario}"

Generate a thoughtful, engaging conversation starter that would help someone explore their life's purpose and meaning. The prompt should:
- Be spoken as if you're the other person in the scenario
- Ask a deep, meaningful question about purpose or meaning
- Feel natural and appropriate for the situation
- Encourage vulnerability and introspection
- Be 1-2 sentences maximum

Respond only with the spoken prompt - no quotation marks or explanations.`;
    } else if (scenarioType === "values-discussion") {
      prompt = `Based on this scenario: "${generatedScenario}"

Generate a thoughtful conversation starter about personal values and beliefs. The prompt should:
- Be spoken as if you're the other person in the scenario  
- Ask about what really matters to them deep down
- Feel natural and safe for sharing values
- Encourage authentic self-reflection
- Be 1-2 sentences maximum

Respond only with the spoken prompt - no quotation marks or explanations.`;
    } else if (scenarioType === "dreams-aspirations") {
      prompt = `Based on this scenario: "${generatedScenario}"

Generate an inspiring conversation starter about dreams and aspirations. The prompt should:
- Be spoken as if you're the other person in the scenario
- Ask about their deepest dreams or what they're passionate about
- Feel encouraging and safe for sharing big dreams
- Inspire them to think about possibilities
- Be 1-2 sentences maximum

Respond only with the spoken prompt - no quotation marks or explanations.`;
    } else if (scenarioType === "life-challenges") {
      prompt = `Based on this scenario: "${generatedScenario}"

Generate a compassionate conversation starter about life challenges. The prompt should:
- Be spoken as if you're the other person in the scenario
- Ask about difficulties they're facing with empathy
- Feel supportive and non-judgmental
- Encourage sharing about struggles or growth
- Be 1-2 sentences maximum

Respond only with the spoken prompt - no quotation marks or explanations.`;
    } else if (scenarioType === "relationships-love") {
      prompt = `Based on this scenario: "${generatedScenario}"

Generate a heartfelt conversation starter about love and relationships. The prompt should:
- Be spoken as if you're the other person in the scenario
- Ask about what love or connection means to them
- Feel intimate but appropriate for the relationship level
- Encourage sharing about relationship experiences or desires
- Be 1-2 sentences maximum

Respond only with the spoken prompt - no quotation marks or explanations.`;
    } else if (scenarioType === "fears-vulnerabilities") {
      prompt = `Based on this scenario: "${generatedScenario}"

Generate a gentle conversation starter about fears and vulnerabilities. The prompt should:
- Be spoken as if you're the other person in the scenario
- Ask about fears or worries in a safe, caring way
- Feel emotionally safe and supportive
- Encourage vulnerability without pressure
- Be 1-2 sentences maximum

Respond only with the spoken prompt - no quotation marks or explanations.`;
    }

    // Add prompts for other scenario types...
    if (
      scenarioType.includes("casual") ||
      scenarioType === "meeting-new-people"
    ) {
      prompt = `Based on this scenario: "${generatedScenario}"

Generate a friendly conversation starter. The prompt should:
- Be spoken as if you're the other person in the scenario
- Be casual and approachable
- Create an opening for natural conversation
- Feel authentic to the situation
- Be 1-2 sentences maximum

Respond only with the spoken prompt - no quotation marks or explanations.`;
    }

    if (!prompt) {
      return this.getFallbackConversationPrompt(scenarioType);
    }

    try {
      const response = await this.callGeminiAPI(prompt);
      return response;
    } catch (error) {
      console.error("Failed to generate conversation prompt:", error);
      return this.getFallbackConversationPrompt(scenarioType);
    }
  }

  getFallbackConversationPrompt(scenarioType) {
    const fallbacks = {
      "purpose-meaning":
        "I've been thinking a lot about what really gives my life meaning lately. What about you - what do you feel like you're here to do?",
      "values-discussion":
        "That decision you made really got me thinking about what matters most to me. What values do you think guide your biggest choices?",
      "dreams-aspirations":
        "I love hearing about what lights people up inside. What's something you've always dreamed of doing?",
      "life-challenges":
        "I can see you've been going through a tough time. How are you really doing with everything?",
      "relationships-love":
        "I've been reflecting on what makes relationships truly meaningful. What does love mean to you?",
      "fears-vulnerabilities":
        "You seem like you might have something on your mind. Is there anything you've been worried about lately?",
      "meeting-new-people":
        "Hi there! I'm [name]. How are you enjoying the event so far?",
      "workplace-smalltalk":
        "Monday morning coffee runs - they're essential, right? How was your weekend?",
      "neighbors-community":
        "Hey neighbor! Looks like you could use a hand there.",
      "shared-interests":
        "Did I just hear you talking about [shared interest]? I'm really into that too!",
      "awkward-recovery": "Oh no, I'm so sorry about that! Are you okay?",
      "party-events":
        "Hi! I don't think we've met - I'm [name]. How do you know [host]?",
    };

    return fallbacks[scenarioType] || "Hi there! How's your day going?";
  }
}

// Make it available globally
window.GeminiAIEngine = GeminiAIEngine;
