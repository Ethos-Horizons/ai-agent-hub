import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'

// Import routes
import agentRoutes from './routes/agents'
import chatbotRoutes from './routes/chatbot'
import analyticsRoutes from './routes/analytics'
import taskRoutes from './routes/tasks'

// Import middleware
import { errorHandler } from './middleware/errorHandler'
import { rateLimiter } from './middleware/rateLimiter'

// Import services
import { initializeDatabase } from './database/connection'
import { initializeRedis } from './services/redis'
import { logger } from './utils/logger'

// Load environment variables
dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(compression())
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('combined'))
app.use(rateLimiter)

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'AI Agent Dashboard API'
  })
})

// API Routes
app.use('/api/agents', agentRoutes)
app.use('/api/chatbot', chatbotRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/tasks', taskRoutes)

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`)

  socket.on('join-agent-room', (agentId: string) => {
    socket.join(`agent-${agentId}`)
    logger.info(`Client ${socket.id} joined agent room: ${agentId}`)
  })

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`)
  })
})

// Make io available to routes
app.set('io', io)

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  })
})

// Initialize services and start server
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase()
    logger.info('Database connected successfully')

    // Initialize Redis
    await initializeRedis()
    logger.info('Redis connected successfully')

    // Start server
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  server.close(() => {
    logger.info('Process terminated')
  })
})

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully')
  server.close(() => {
    logger.info('Process terminated')
  })
})

startServer() 