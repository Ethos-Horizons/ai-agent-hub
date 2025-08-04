import { createClient } from '@supabase/supabase-js'
import { logger } from '../utils/logger'

let supabase: any = null

export const initializeDatabase = async (): Promise<void> => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required')
    }

    supabase = createClient(supabaseUrl, supabaseKey)

    // Test the connection
    const { data, error } = await supabase.from('agents').select('count').limit(1)
    
    if (error) {
      // If agents table doesn't exist, that's okay for now - we'll create it later
      logger.info('Database connection established (tables may not exist yet)')
    } else {
      logger.info('Database connection established successfully')
    }
  } catch (error) {
    logger.error('Failed to connect to database:', error)
    throw error
  }
}

export const getSupabase = () => {
  if (!supabase) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return supabase
}

export const closeDatabase = async (): Promise<void> => {
  // Supabase client doesn't need explicit closing
  logger.info('Database connection closed')
} 