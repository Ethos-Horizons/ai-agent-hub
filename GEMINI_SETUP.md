# Google Gemini API Setup Guide

## Step 1: Google AI Studio Access

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Accept the terms of service

## Step 2: Get API Key

1. In Google AI Studio, click on **"Get API key"** in the top right
2. Click **"Create API key"**
3. Give it a name like "AI Agent Dashboard"
4. Copy the API key (it starts with `AIza...`)
5. **Important**: Keep this secret and never commit it to version control

## Step 3: Enable Billing (Required)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select or create a project
3. Go to **Billing** → **Link a billing account**
4. Set up billing (required for API usage)
5. **Good news**: Gemini has a generous free tier:
   - 15 requests per minute
   - 1M characters per month free
   - Then $0.00025 per 1K characters

## Step 4: Test Your API Key

You can test it in Google AI Studio or use this curl command:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Hello, how are you?"
      }]
    }]
  }' \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
```

## Step 5: Usage Limits

- **Rate Limit**: 15 requests per minute
- **Model**: `gemini-1.5-flash` (fastest and most cost-effective)
- **Max Tokens**: 1M input, 1M output
- **Cost**: $0.00025 per 1K characters after free tier

## Step 6: Alternative Models

If you need different capabilities:
- **gemini-1.5-pro**: More capable, slightly slower
- **gemini-1.5-flash**: Fastest, good for chat
- **gemini-1.0-pro**: Legacy model 