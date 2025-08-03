import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { ChatbotService } from '../services/chatbot'
import { logger } from '../utils/logger'

const router = Router()
const chatbotService = new ChatbotService()

// Start a new conversation
router.post('/conversation/start', async (req: Request, res: Response) => {
  try {
    const { visitorId, initialMessage } = req.body

    const conversation = await chatbotService.startConversation(visitorId, initialMessage)
    
    const welcomeMessage = conversation.messages.find(m => m.messageType === 'bot')?.content || 'Welcome! How can I help you today?'
    
    return res.json({
      success: true,
      conversationId: conversation.id,
      message: welcomeMessage
    })
  } catch (error) {
    logger.error('Error starting conversation:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to start conversation'
    })
  }
})

// Send a message to the chatbot
router.post('/message', [
  body('conversationId').isUUID().withMessage('Valid conversation ID required'),
  body('message').isString().trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
  body('visitorId').isString().withMessage('Visitor ID required')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { conversationId, message, visitorId } = req.body

    const response = await chatbotService.processMessage(conversationId, message, visitorId)
    
    return res.json({
      success: true,
      response: response.message,
      intent: response.intent,
      confidence: response.confidence,
      suggestions: response.suggestions
    })
  } catch (error) {
    logger.error('Error processing message:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to process message'
    })
  }
})

// Get conversation history
router.get('/conversation/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const conversation = await chatbotService.getConversation(id)
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      })
    }

    return res.json({
      success: true,
      conversation
    })
  } catch (error) {
    logger.error('Error fetching conversation:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch conversation'
    })
  }
})

// Create a lead from conversation
router.post('/lead', [
  body('conversationId').isUUID().withMessage('Valid conversation ID required'),
  body('visitorInfo').isObject().withMessage('Visitor information required'),
  body('qualificationData').isObject().withMessage('Qualification data required')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { conversationId, visitorInfo, qualificationData } = req.body

    const lead = await chatbotService.createLead(conversationId, visitorInfo, qualificationData)
    
    return res.json({
      success: true,
      leadId: lead.id,
      message: 'Lead created successfully'
    })
  } catch (error) {
    logger.error('Error creating lead:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to create lead'
    })
  }
})

// Get chatbot analytics
router.get('/analytics', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query
    
    const analytics = await chatbotService.getAnalytics(
      startDate as string,
      endDate as string
    )
    
    return res.json({
      success: true,
      analytics
    })
  } catch (error) {
    logger.error('Error fetching analytics:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    })
  }
})

// Get chatbot suggestions based on intent
router.get('/suggestions/:intent', async (req: Request, res: Response) => {
  try {
    const { intent } = req.params
    const suggestions = await chatbotService.getSuggestions(intent)
    
    return res.json({
      success: true,
      suggestions
    })
  } catch (error) {
    logger.error('Error fetching suggestions:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch suggestions'
    })
  }
})

export default router 