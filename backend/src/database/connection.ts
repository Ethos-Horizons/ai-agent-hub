import { Pool } from 'pg'
import { logger } from '../utils/logger'

let pool: Pool | null = null

export const initializeDatabase = async (): Promise<void> => {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })

    // Test the connection
    const client = await pool.connect()
    await client.query('SELECT NOW()')
    client.release()

    logger.info('Database connection established successfully')
  } catch (error) {
    logger.error('Failed to connect to database:', error)
    throw error
  }
}

export const getPool = (): Pool => {
  if (!pool) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return pool
}

export const closeDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.end()
    logger.info('Database connection closed')
  }
} 