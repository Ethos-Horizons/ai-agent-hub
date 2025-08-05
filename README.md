# AI Hub - Ethos Digital

A comprehensive AI agent management system that serves as the "brain" of automated services for Ethos Digital. This platform manages, deploys, and monitors AI agents that can be called upon to perform various business tasks, from content creation to analytics analysis.

## 🚀 Features

### Core Functionality
- **Agent Management:** Create, train, deploy, and monitor AI agents
- **Task Automation:** Handle routine business tasks automatically
- **Integration Hub:** Connect agents to external services and APIs
- **Performance Monitoring:** Track agent effectiveness and optimize performance
- **Scalability:** Support multiple agents working simultaneously

### Agent Types
- **Content Creation Agents:** Blog writing, social media management, email marketing
- **Analytics & Research Agents:** Domain research, competitor analysis, data analysis
- **Customer Service Agents:** Chatbot management, lead qualification, appointment scheduling
- **Business Operations Agents:** Invoice generation, report creation, task scheduling

### Chatbot Agent (Phase 1)
- **Website Integration:** Intelligent chatbot for Ethos Digital website
- **Lead Qualification:** Automated lead qualification and information gathering
- **Service Information:** Detailed information about all 6 service categories
- **Process Explanation:** 5-step process explanation (Discovery → Strategy → Implementation → Optimization → Scaling)
- **Team Introduction:** Information about Christopher and Thomas's expertise

## 🏗️ Architecture

### Technology Stack
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL (Supabase)
- **AI/ML:** Google Gemini Flash API (primary), Anthropic Claude (specialized tasks)
- **Queue System:** Redis for task queuing and processing
- **Real-time:** WebSocket for live agent status updates
- **File Storage:** Supabase Storage for training data and outputs

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Redis server
- Google Gemini API key

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-agent-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Configuration**
   ```bash
   # Backend
   cd backend
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb ai_agent_dashboard
   
   # Run migrations (when available)
   npm run migrate
   ```

5. **Start Development Servers**
   ```bash
   # From root directory
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/ai_agent_dashboard

# Redis Configuration
REDIS_URL=redis://localhost:6379

# AI API Keys
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_CLAUDE_API_KEY=your_claude_api_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h
```

### Required API Keys

1. **Google Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add to `GOOGLE_GEMINI_API_KEY` in `.env`

2. **Database Setup**
   - Set up PostgreSQL database
   - Update `DATABASE_URL` in `.env`

3. **Redis Setup**
   - Install and start Redis server
   - Update `REDIS_URL` in `.env`

## 🎯 Usage

### Starting the Application

1. **Development Mode**
   ```bash
   npm run dev
   ```

2. **Production Build**
   ```bash
   npm run build
   npm start
   ```

### Testing the Chatbot

1. Navigate to the Chatbot page in the dashboard
2. Click "New Conversation" to start testing
3. The chatbot will respond with information about Ethos Digital services
4. Test various intents like:
   - Service inquiries
   - Pricing questions
   - Team information
   - Lead qualification

### Agent Management

1. **View Agents:** Dashboard shows all active agents and their status
2. **Create Agent:** Use the "Create Agent" button to add new agents
3. **Monitor Performance:** Analytics page shows agent performance metrics
4. **Configure Settings:** Settings page allows API key and system configuration

## 📊 API Endpoints

### Chatbot Endpoints
- `POST /api/chatbot/conversation/start` - Start new conversation
- `POST /api/chatbot/message` - Send message to chatbot
- `GET /api/chatbot/conversation/:id` - Get conversation history
- `POST /api/chatbot/lead` - Create lead from conversation
- `GET /api/chatbot/analytics` - Get chatbot analytics

### Agent Endpoints
- `GET /api/agents` - Get all agents
- `POST /api/agents` - Create new agent
- `GET /api/agents/:id` - Get agent details
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

### Analytics Endpoints
- `GET /api/analytics` - Get overall analytics
- `GET /api/analytics/agents/:id` - Get agent-specific analytics
- `GET /api/analytics/costs` - Get cost analytics
- `GET /api/analytics/performance` - Get performance metrics

## 🚀 Development Phases

### Phase 1: Foundation & Chatbot Agent ✅
- [x] Basic agent management system
- [x] Chatbot agent implementation with Gemini Flash API
- [x] Database schema implementation
- [x] Basic UI for agent overview
- [x] Website chatbot integration

### Phase 2: Core Agents (Next)
- [ ] Implement content creation agents
- [ ] Basic analytics and research agents
- [ ] Task queue and scheduling system
- [ ] Performance monitoring dashboard

### Phase 3: Advanced Features
- [ ] Agent training and fine-tuning
- [ ] Workflow automation
- [ ] Advanced analytics and reporting
- [ ] Client integration with Admin Portal

## 🎨 UI/UX Features

- **Responsive Design:** Works on desktop, tablet, and mobile
- **Dark/Light Mode:** Built-in theme support
- **Real-time Updates:** WebSocket integration for live data
- **Interactive Charts:** Performance visualization
- **Modern Interface:** Clean, professional design matching Ethos Digital brand

## 🔒 Security Features

- **Rate Limiting:** API request throttling
- **Input Validation:** Comprehensive request validation
- **Error Handling:** Graceful error management
- **Logging:** Detailed activity logging
- **CORS Configuration:** Secure cross-origin requests

## 📈 Performance Metrics

- **Agent Accuracy:** >95% task completion rate
- **Processing Speed:** <30 seconds for most tasks
- **Cost Efficiency:** <$0.10 per task on average
- **System Uptime:** >99.9% availability
- **Chatbot Engagement:** >70% conversation completion rate

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software developed for Ethos Digital.

## 👥 Team

- **Christopher McElwain:** Technical Lead & AI Specialist
- **Thomas Grimm:** Content Creation & Media Specialist

## 📞 Support

For support and questions, contact the Ethos Digital team.

---

**Built with ❤️ for Ethos Digital** 