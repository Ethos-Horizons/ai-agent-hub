import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { logger } from '../utils/logger'
import { getSupabase } from '../database/connection'

const router = Router()

// Get all agents
router.get('/', async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase()
    const { data: agents, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Database error fetching agents:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch agents from database'
      })
    }

    return res.json({
      success: true,
      agents: agents || []
    })
  } catch (error) {
    logger.error('Error fetching agents:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch agents'
    })
  }
})

// Get agent by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    // Mock data - replace with actual database query
    const agent = {
      id,
      name: 'Website Chatbot',
      type: 'Customer Service',
      description: 'AI chatbot for website visitor assistance',
      status: 'active',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      config: {
        model: 'gemini-1.5-flash',
        temperature: 0.7,
        maxTokens: 1000
      },
      performance: {
        totalTasks: 156,
        completedTasks: 147,
        successRate: 94.2,
        averageResponseTime: 2.3
      }
    }

    return res.json({
      success: true,
      agent
    })
  } catch (error) {
    logger.error('Error fetching agent:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch agent'
    })
  }
})

// Create new agent
router.post('/', [
  body('name').isString().trim().isLength({ min: 1, max: 100 }).withMessage('Name is required'),
  body('type').isString().trim().isLength({ min: 1 }).withMessage('Type is required'),
  body('description').isString().trim().isLength({ min: 1, max: 500 }).withMessage('Description is required')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { name, type, description, config } = req.body

    const supabase = getSupabase()
    const { data: agent, error } = await supabase
      .from('agents')
      .insert({
        name,
        type,
        description,
        status: 'inactive',
        version: '1.0.0',
        config: config || {},
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      logger.error('Database error creating agent:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to create agent in database'
      })
    }

    logger.info(`Created new agent: ${name}`)

    return res.status(201).json({
      success: true,
      agent
    })
  } catch (error) {
    logger.error('Error creating agent:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to create agent'
    })
  }
})

// Update agent
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    const supabase = getSupabase()
    const { data: agent, error } = await supabase
      .from('agents')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      logger.error('Database error updating agent:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to update agent in database'
      })
    }

    logger.info(`Updated agent: ${id}`)

    return res.json({
      success: true,
      agent
    })
  } catch (error) {
    logger.error('Error updating agent:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to update agent'
    })
  }
})

// Delete agent
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const supabase = getSupabase()
    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', id)

    if (error) {
      logger.error('Database error deleting agent:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to delete agent from database'
      })
    }

    logger.info(`Deleted agent: ${id}`)

    return res.json({
      success: true,
      message: 'Agent deleted successfully'
    })
  } catch (error) {
    logger.error('Error deleting agent:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to delete agent'
    })
  }
})

// Train agent
router.post('/:id/train', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { trainingData } = req.body

    // Mock training process - replace with actual training logic
    logger.info(`Started training for agent: ${id}`)

    return res.json({
      success: true,
      message: 'Training started successfully',
      trainingId: Date.now().toString()
    })
  } catch (error) {
    logger.error('Error training agent:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to train agent'
    })
  }
})

// Deploy agent
router.post('/:id/deploy', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Mock deployment process - replace with actual deployment logic
    logger.info(`Deployed agent: ${id}`)

    return res.json({
      success: true,
      message: 'Agent deployed successfully'
    })
  } catch (error) {
    logger.error('Error deploying agent:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to deploy agent'
    })
  }
})

export default router 