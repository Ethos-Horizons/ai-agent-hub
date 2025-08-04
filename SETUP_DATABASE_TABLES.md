# Quick Database Setup

## Step 1: Go to Supabase Dashboard
1. Go to your Supabase project: https://supabase.com/dashboard/project/[YOUR-PROJECT-ID]
2. Click on **SQL Editor** in the left sidebar

## Step 2: Run This SQL
Copy and paste this into the SQL Editor and click "Run":

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'inactive',
  version VARCHAR(20) DEFAULT '1.0.0',
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id VARCHAR(100) NOT NULL,
  session_id UUID NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'active',
  intent VARCHAR(100),
  lead_qualified BOOLEAN DEFAULT FALSE
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  message_type VARCHAR(10) NOT NULL CHECK (message_type IN ('user', 'bot')),
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id),
  visitor_info JSONB NOT NULL,
  qualification_data JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a default chatbot agent
INSERT INTO agents (name, type, description, status) 
VALUES ('Website Chatbot', 'Customer Service', 'AI chatbot for website visitor assistance', 'active');
```

## Step 3: Verify
After running the SQL, you should see:
- ✅ 4 tables created
- ✅ 1 agent inserted
- ✅ No errors

## What This Does
- **Stores conversations permanently**
- **Tracks lead qualification**
- **Saves all messages**
- **Enables analytics**

Once you run this, restart your application and all conversations will be saved to the database! 