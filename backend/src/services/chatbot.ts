import { GoogleGenerativeAI } from '@google/generative-ai'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '../utils/logger'

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
      const prompt = this.buildPrompt(message, context)

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Parse AI response
      const parsedResponse = this.parseAIResponse(text)
      
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

  private buildPrompt(message: string, context: string): string {
    return `You are an AI assistant for Ethos Digital, a digital marketing agency. Your role is to help website visitors learn about our services and qualify potential leads.

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
3. Ask qualifying questions to understand visitor needs
4. Suggest next steps like scheduling a consultation
5. Keep responses concise but informative

RESPONSE FORMAT (JSON):
{
  "message": "Your response to the visitor",
  "intent": "service_inquiry|pricing|team_info|lead_qualification|appointment|general",
  "confidence": 0.95,
  "suggestions": ["suggestion1", "suggestion2"],
  "shouldQualifyLead": true/false
}

Respond with only the JSON object:`
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