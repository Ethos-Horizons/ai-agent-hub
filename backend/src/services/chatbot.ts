import { GoogleGenerativeAI } from '@google/generative-ai'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '../utils/logger'

//import dotenv
import dotenv from 'dotenv'

dotenv.config()


interface Conversation {
  id: string
  visitorId: string
  sessionId: string
  startTime: Date
  endTime?: Date
  status: 'active' | 'ended'
  messages: ChatMessage[]
  intent?: string
  leadQualified: boolean
}

interface ChatMessage {
  id: string
  conversationId: string
  messageType: 'user' | 'bot'
  content: string
  timestamp: Date
  metadata?: any
}

interface ChatbotResponse {
  message: string
  intent: string
  confidence: number
  suggestions: string[]
  shouldQualifyLead: boolean
}

interface VisitorInfo {
  name?: string
  email?: string
  company?: string
  phone?: string
  website?: string
}

interface QualificationData {
  businessType: string
  budget: string
  timeline: string
  primaryGoal: string
  currentChallenges: string[]
}

interface Lead {
  id: string
  conversationId: string
  visitorInfo: VisitorInfo
  qualificationData: QualificationData
  status: 'new' | 'contacted' | 'qualified' | 'converted'
  createdAt: Date
}

export class ChatbotService {
  private genAI: GoogleGenerativeAI
  private conversations: Map<string, Conversation> = new Map()
  private leads: Map<string, Lead> = new Map()

  constructor() {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GOOGLE_GEMINI_API_KEY environment variable is required')
    }
    this.genAI = new GoogleGenerativeAI(apiKey)
  }

  async startConversation(visitorId: string, initialMessage?: string): Promise<Conversation> {
    const conversationId = uuidv4()
    const sessionId = uuidv4()
    
    const welcomeMessage = this.getWelcomeMessage()
    
    const conversation: Conversation = {
      id: conversationId,
      visitorId,
      sessionId,
      startTime: new Date(),
      status: 'active',
      messages: [],
      leadQualified: false
    }

    // Add welcome message
    conversation.messages.push({
      id: uuidv4(),
      conversationId,
      messageType: 'bot',
      content: welcomeMessage,
      timestamp: new Date()
    })

    // Add initial user message if provided
    if (initialMessage) {
      conversation.messages.push({
        id: uuidv4(),
        conversationId,
        messageType: 'user',
        content: initialMessage,
        timestamp: new Date()
      })
    }

    this.conversations.set(conversationId, conversation)
    logger.info(`Started conversation ${conversationId} for visitor ${visitorId}`)

    return conversation
  }

  async processMessage(conversationId: string, message: string, visitorId: string): Promise<ChatbotResponse> {
    const conversation = this.conversations.get(conversationId)
    if (!conversation) {
      throw new Error('Conversation not found')
    }

    // Add user message to conversation
    conversation.messages.push({
      id: uuidv4(),
      conversationId,
      messageType: 'user',
      content: message,
      timestamp: new Date()
    })

    // Generate response using AI
    const response = await this.generateResponse(conversation, message)
    
    // Add bot response to conversation
    conversation.messages.push({
      id: uuidv4(),
      conversationId,
      messageType: 'bot',
      content: response.message,
      timestamp: new Date()
    })

    // Update conversation intent
    if (response.intent) {
      conversation.intent = response.intent
    }

    // Mark for lead qualification if needed
    if (response.shouldQualifyLead) {
      conversation.leadQualified = true
    }

    logger.info(`Processed message in conversation ${conversationId}: ${message.substring(0, 50)}...`)

    return response
  }

  private async generateResponse(conversation: Conversation, message: string): Promise<ChatbotResponse> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const context = this.buildContext(conversation)
      
      // Check if this is a scheduling-related query
      const isSchedulingQuery = this.isSchedulingQuery(message)
      let availableSlots = null
      
      if (isSchedulingQuery) {
        // Get available slots from appointment scheduler
        availableSlots = await this.getAvailableAppointmentSlots()
      }
      
      const prompt = this.buildPrompt(message, context, availableSlots || undefined)

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Parse AI response
      const parsedResponse = this.parseAIResponse(text)
      
      // Enhanced scheduling intent detection
      const schedulingIntent = this.detectSchedulingIntent(message, parsedResponse)
      if (schedulingIntent) {
        parsedResponse.intent = schedulingIntent.intent
        parsedResponse.confidence = schedulingIntent.confidence
        parsedResponse.suggestions = [
          'What day works best for you?',
          'What time of day do you prefer?',
          'Do you have any specific requirements for the consultation?'
        ]
        
        // Log scheduling intent for background agent
        logger.info('Scheduling intent detected', {
          conversationId: conversation.id,
          visitorId: conversation.visitorId,
          intent: schedulingIntent.intent,
          confidence: schedulingIntent.confidence,
          message: message
        })
      }
      
      return {
        message: parsedResponse.message,
        intent: parsedResponse.intent,
        confidence: parsedResponse.confidence,
        suggestions: parsedResponse.suggestions,
        shouldQualifyLead: parsedResponse.shouldQualifyLead
      }
    } catch (error) {
      logger.error('Error generating AI response:', error)
      
      // Fallback response
      return {
        message: "I apologize, but I'm having trouble processing your request right now. Could you please try rephrasing your question or contact us directly?",
        intent: 'error',
        confidence: 0,
        suggestions: ['Contact us directly', 'Try again later'],
        shouldQualifyLead: false
      }
    }
  }

  private buildContext(conversation: Conversation): string {
    const recentMessages = conversation.messages.slice(-6) // Last 6 messages for context
    return recentMessages.map(msg => 
      `${msg.messageType === 'user' ? 'Visitor' : 'Assistant'}: ${msg.content}`
    ).join('\n')
  }

  private buildPrompt(message: string, context: string, availableSlots?: string[]): string {
    let prompt = `You are an AI assistant for Ethos Digital, a digital marketing agency. Your role is to help website visitors learn about our services and qualify potential leads.

ETHOS DIGITAL INFORMATION:
- Services: SEO, PPC Advertising, Web Development, Content Marketing, Social Media Marketing, Analytics & Reporting
- Team: Christopher McElwain (Technical Lead & AI Specialist), Thomas Grimm (Content Creation & Media Specialist)
- Process: Discovery → Strategy → Implementation → Optimization → Scaling
- Values: Integrity, innovation, results-driven strategies, transparent communication

CONVERSATION CONTEXT:
${context}

VISITOR MESSAGE: ${message}

INSTRUCTIONS:
1. Respond in a friendly, professional tone that matches Ethos Digital's brand
2. Provide helpful information about our services when asked
3. Ask 1-2 gentle qualifying questions maximum - don't be pushy
4. If visitor wants to schedule, accommodate them immediately - don't insist on more details
5. Keep responses concise and helpful
6. Be accommodating and flexible - prioritize the visitor's comfort over gathering information
7. If visitor seems frustrated or wants to move to scheduling, respect that immediately
8. When discussing available times, use ONLY the provided available slots - do not make up times

RESPONSE FORMAT (JSON):
{
  "message": "Your response to the visitor",
  "intent": "service_inquiry|pricing|team_info|lead_qualification|appointment|general",
  "confidence": 0.95,
  "suggestions": ["suggestion1", "suggestion2"],
  "shouldQualifyLead": true/false
}

Respond with only the JSON object:`

    if (availableSlots && availableSlots.length > 0) {
      prompt += `\n\nAVAILABLE APPOINTMENT SLOTS (use these exact times only): ${availableSlots.join(', ')}`
    }

    return prompt
  }

  private parseAIResponse(response: string): any {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      
      // Fallback parsing
      return {
        message: response,
        intent: 'general',
        confidence: 0.8,
        suggestions: [],
        shouldQualifyLead: false
      }
    } catch (error) {
      logger.error('Error parsing AI response:', error)
      return {
        message: response,
        intent: 'general',
        confidence: 0.5,
        suggestions: [],
        shouldQualifyLead: false
      }
    }
  }

  private getWelcomeMessage(): string {
    return `Hi there! 👋 I'm your AI assistant from Ethos Digital. I'm here to help you learn about our digital marketing services and see how we can help grow your business.

We specialize in:
• SEO & Search Engine Optimization
• PPC Advertising & Google Ads
• Web Development & Design
• Content Marketing & Strategy
• Social Media Management
• Analytics & Performance Tracking

What brings you to our website today? Are you looking for help with any specific aspect of your digital marketing?`
  }

  private detectSchedulingIntent(message: string, response: ChatbotResponse): { intent: string; confidence: number } | null {
    const lowerMessage = message.toLowerCase()
    const lowerResponse = response.message.toLowerCase()
    
    // Scheduling keywords
    const schedulingKeywords = [
      'appointment', 'schedule', 'meeting', 'consultation', 'call', 'meet',
      'book', 'reserve', 'set up', 'arrange', 'coordinate', 'plan'
    ]
    
    // Time/date keywords
    const timeKeywords = [
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
      'morning', 'afternoon', 'evening', 'am', 'pm', 'o\'clock', 'hour',
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ]
    
    // Frustration/urgency indicators
    const urgencyKeywords = [
      'rather', 'just', 'simply', 'directly', 'instead', 'prefer',
      'don\'t know', 'not sure', 'confused', 'complicated'
    ]
    
    // Check for scheduling intent
    const hasSchedulingKeyword = schedulingKeywords.some(keyword => 
      lowerMessage.includes(keyword) || lowerResponse.includes(keyword)
    )
    
    const hasTimeKeyword = timeKeywords.some(keyword => 
      lowerMessage.includes(keyword) || lowerResponse.includes(keyword)
    )
    
    const hasUrgencyKeyword = urgencyKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    )
    
    // Check for specific scheduling patterns
    const schedulingPatterns = [
      /(?:when|what time|what day).*(?:available|work|good|convenient)/i,
      /(?:schedule|book|set up).*(?:appointment|meeting|consultation)/i,
      /(?:available|free).*(?:monday|tuesday|wednesday|thursday|friday)/i,
      /(?:prefer|like).*(?:morning|afternoon|evening)/i,
      /(?:rather|just|simply).*(?:schedule|meet|call|consult)/i
    ]
    
    const hasSchedulingPattern = schedulingPatterns.some(pattern => 
      pattern.test(message) || pattern.test(response.message)
    )
    
    if (hasSchedulingKeyword || hasTimeKeyword || hasSchedulingPattern || hasUrgencyKeyword) {
      let confidence = 0.6 // Base confidence
      
      if (hasSchedulingKeyword) confidence += 0.2
      if (hasTimeKeyword) confidence += 0.1
      if (hasSchedulingPattern) confidence += 0.1
      if (hasUrgencyKeyword) confidence += 0.2 // Boost confidence for urgency
      
      // Boost confidence if multiple indicators present
      if (hasSchedulingKeyword && hasTimeKeyword) confidence += 0.1
      if (hasSchedulingPattern) confidence += 0.1
      if (hasUrgencyKeyword && (hasSchedulingKeyword || hasSchedulingPattern)) confidence += 0.1
      
      confidence = Math.min(confidence, 0.95) // Cap at 95%
      
      return {
        intent: 'appointment_scheduling',
        confidence
      }
    }
    
    return null
  }

  private isSchedulingQuery(message: string): boolean {
    const schedulingKeywords = [
      'available', 'time', 'slot', 'when', 'schedule', 'appointment',
      'what time', 'what day', 'availability', 'open'
    ]
    
    return schedulingKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    )
  }

  private async getAvailableAppointmentSlots(): Promise<string[]> {
    // This would integrate with a real calendar system
    // For now, return simulated data that matches the frontend
    return [
      'Wednesday, August 7th at 10:00 AM',
      'Wednesday, August 7th at 2:00 PM', 
      'Thursday, August 8th at 11:00 AM',
      'Friday, August 9th at 3:00 PM'
    ]
  }

  async getConversation(id: string): Promise<Conversation | null> {
    return this.conversations.get(id) || null
  }

  async createLead(conversationId: string, visitorInfo: VisitorInfo, qualificationData: QualificationData): Promise<Lead> {
    const lead: Lead = {
      id: uuidv4(),
      conversationId,
      visitorInfo,
      qualificationData,
      status: 'new',
      createdAt: new Date()
    }

    this.leads.set(lead.id, lead)
    logger.info(`Created lead ${lead.id} from conversation ${conversationId}`)

    return lead
  }

  async getAnalytics(startDate?: string, endDate?: string): Promise<any> {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    const end = endDate ? new Date(endDate) : new Date()

    const conversations = Array.from(this.conversations.values()).filter(
      conv => conv.startTime >= start && conv.startTime <= end
    )

    const leads = Array.from(this.leads.values()).filter(
      lead => lead.createdAt >= start && lead.createdAt <= end
    )

    return {
      totalConversations: conversations.length,
      totalLeads: leads.length,
      averageConversationLength: this.calculateAverageConversationLength(conversations),
      leadConversionRate: this.calculateLeadConversionRate(conversations, leads),
      topIntents: this.getTopIntents(conversations),
      timeRange: { start, end }
    }
  }

  async getSuggestions(intent: string): Promise<string[]> {
    const suggestions: { [key: string]: string[] } = {
      service_inquiry: [
        "Tell me more about your SEO services",
        "What's included in your PPC packages?",
        "Can you help with website development?",
        "How do you approach content marketing?"
      ],
      pricing: [
        "What are your typical project costs?",
        "Do you offer monthly retainers?",
        "What's included in your packages?",
        "Can you provide a custom quote?"
      ],
      team_info: [
        "Tell me about your team's experience",
        "What industries do you specialize in?",
        "Can I see some case studies?",
        "How long have you been in business?"
      ],
      lead_qualification: [
        "What's your business size?",
        "What's your current marketing budget?",
        "What are your main goals?",
        "What challenges are you facing?"
      ],
      appointment: [
        "Schedule a free consultation",
        "Book a strategy call",
        "Request a proposal",
        "Get a custom quote"
      ]
    }

    return suggestions[intent] || [
      "How can I help you today?",
      "Tell me more about your business",
      "What services interest you most?"
    ]
  }

  private calculateAverageConversationLength(conversations: Conversation[]): number {
    if (conversations.length === 0) return 0
    
    const totalMessages = conversations.reduce((sum, conv) => sum + conv.messages.length, 0)
    return Math.round(totalMessages / conversations.length)
  }

  private calculateLeadConversionRate(conversations: Conversation[], leads: Lead[]): number {
    if (conversations.length === 0) return 0
    
    const qualifiedConversations = conversations.filter(conv => conv.leadQualified).length
    return Math.round((qualifiedConversations / conversations.length) * 100)
  }

  private getTopIntents(conversations: Conversation[]): { intent: string; count: number }[] {
    const intentCounts: { [key: string]: number } = {}
    
    conversations.forEach(conv => {
      if (conv.intent) {
        intentCounts[conv.intent] = (intentCounts[conv.intent] || 0) + 1
      }
    })

    return Object.entries(intentCounts)
      .map(([intent, count]) => ({ intent, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }
} 