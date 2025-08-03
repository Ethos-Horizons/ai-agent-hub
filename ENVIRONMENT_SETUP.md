# Environment Variables Setup Guide

## File Structure

You need **TWO** environment files:

1. **`backend/.env`** - Backend environment variables
2. **`frontend/.env.local`** - Frontend environment variables (optional, mostly for API URLs)

## Backend Environment File (`backend/.env`)

Create this file in the `backend` folder:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (Supabase)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres
SUPABASE_URL=https://[YOUR-PROJECT-ID].supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# Redis Configuration
REDIS_URL=redis://localhost:6379
# Or for Redis Cloud: redis://username:password@host:port

# AI API Keys
GOOGLE_GEMINI_API_KEY=[YOUR-GEMINI-API-KEY]
OPENAI_API_KEY=[YOUR-OPENAI-API-KEY]
ANTHROPIC_API_KEY=[YOUR-ANTHROPIC-API-KEY]

# JWT Configuration
JWT_SECRET=[YOUR-JWT-SECRET-KEY]
JWT_EXPIRES_IN=24h

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CHATBOT_RATE_LIMIT_MAX_REQUESTS=30

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads/

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=[YOUR-EMAIL]
SMTP_PASS=[YOUR-EMAIL-PASSWORD]

# Monitoring
ENABLE_METRICS=true
METRICS_PORT=9090
```

## Frontend Environment File (`frontend/.env.local`)

Create this file in the `frontend` folder:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_REAL_TIME=true
```

## How to Get the Values

### Supabase Values:
1. Go to your Supabase project dashboard
2. Settings → API
3. Copy the values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Database URL Format:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
```

### Redis URL Options:
- **Local**: `redis://localhost:6379`
- **Redis Cloud**: `redis://username:password@host:port`

### JWT Secret:
Generate a random string (32+ characters):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Security Notes

1. **Never commit `.env` files to git**
2. **Use different keys for development/production**
3. **Rotate keys regularly**
4. **Use strong passwords**

## Testing Your Setup

After creating the `.env` file, restart your development server:

```bash
npm run dev
```

The application should now start without the API key error! 