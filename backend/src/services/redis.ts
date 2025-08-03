import { createClient } from 'redis'
import { logger } from '../utils/logger'

class RedisService {
  private client: ReturnType<typeof createClient> | null = null

  async initialize(): Promise<void> {
    try {
      this.client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      })

      this.client.on('error', (err) => {
        logger.error('Redis Client Error:', err)
      })

      this.client.on('connect', () => {
        logger.info('Redis Client Connected')
      })

      await this.client.connect()
    } catch (error) {
      logger.error('Failed to initialize Redis:', error)
      throw error
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.client) {
      throw new Error('Redis client not initialized')
    }
    return await this.client.get(key)
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.client) {
      throw new Error('Redis client not initialized')
    }
    if (ttl) {
      await this.client.setEx(key, ttl, value)
    } else {
      await this.client.set(key, value)
    }
  }

  async del(key: string): Promise<void> {
    if (!this.client) {
      throw new Error('Redis client not initialized')
    }
    await this.client.del(key)
  }

  async exists(key: string): Promise<boolean> {
    if (!this.client) {
      throw new Error('Redis client not initialized')
    }
    const result = await this.client.exists(key)
    return result === 1
  }

  async expire(key: string, seconds: number): Promise<void> {
    if (!this.client) {
      throw new Error('Redis client not initialized')
    }
    await this.client.expire(key, seconds)
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.quit()
    }
  }
}

export const redisService = new RedisService()

export const initializeRedis = async (): Promise<void> => {
  await redisService.initialize()
} 