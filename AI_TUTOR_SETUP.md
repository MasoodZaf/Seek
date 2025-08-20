# AI Tutor Setup Guide

## Overview
The AI Tutor system provides ChatGPT-style conversational assistance, intelligent code review, debugging help, and personalized hints for learners on the Seek platform.

## Features Implemented

### ✅ 1. ChatGPT-Style Conversational AI
- **Real-time chat interface** with context-aware responses
- **Multiple conversation types**: General help, Code Review, Debugging, Hints  
- **Conversation memory** maintains context across messages
- **Floating AI button** available on all coding pages
- **Integrated buttons** in code editors for quick access

### ✅ 2. Intelligent Code Review  
- **Automated code analysis** with scoring system
- **Personalized feedback** based on user level and language
- **Structured reviews** covering correctness, best practices, performance, readability
- **Actionable suggestions** with explanations
- **Strengths highlighting** to encourage learners

### ✅ 3. Smart Debugging Assistant
- **Error analysis** with plain-English explanations
- **Root cause identification** and step-by-step fixes
- **Debugging technique recommendations**
- **Educational approach** focusing on learning from mistakes

### ✅ 4. Adaptive Hint System
- **Progressive hint levels** (subtle → moderate → direct)
- **Attempt-based adaptation** providing more help as needed
- **Context-aware hints** tailored to specific exercises
- **Learning-focused approach** maintaining challenge while providing support

## Setup Instructions

### 1. Install Dependencies
Already installed: `openai` package

### 2. Environment Configuration
Add to your `.env` file:
```bash
# AI Tutoring
OPENAI_API_KEY=your-openai-api-key-here
```

### 3. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and add to your `.env` file

### 4. Start the Application
```bash
# Backend
cd backend
npm run dev

# Frontend  
cd frontend
npm start
```

## API Endpoints

### Chat with AI Tutor
```
POST /api/v1/ai-tutor/chat
Content-Type: application/json

{
  "message": "How do I implement a binary search?",
  "context": {
    "type": "general",
    "language": "javascript",
    "sessionId": "chat_123"
  }
}
```

### Code Review
```
POST /api/v1/ai-tutor/review
Content-Type: application/json

{
  "code": "function fibonacci(n) { return n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2); }",
  "language": "javascript",
  "exerciseContext": {
    "exerciseId": "fibonacci-basic",
    "difficulty": "beginner"
  }
}
```

### Get Hints
```
POST /api/v1/ai-tutor/hint
Content-Type: application/json

{
  "exerciseId": "binary-search",
  "code": "// partial code attempt",
  "attemptCount": 3,
  "difficulty": "intermediate"
}
```

### Debug Code
```
POST /api/v1/ai-tutor/debug
Content-Type: application/json

{
  "code": "console.log(undefinedVariable);",
  "language": "javascript",
  "errorMessage": "ReferenceError: undefinedVariable is not defined",
  "stackTrace": "at main.js:1:13"
}
```

## Frontend Integration

### AI Tutor Button Component
```jsx
import AITutorButton from '../components/ai/AITutorButton';

// Floating button (appears bottom-right)
<AITutorButton variant="floating" />

// Inline button  
<AITutorButton variant="inline">Ask AI Tutor</AITutorButton>

// With context and code
<AITutorButton
  variant="ghost"
  context={{
    type: 'codeReview',
    language: 'javascript'
  }}
  code={currentCode}
  language="javascript"
>
  Review My Code
</AITutorButton>
```

### Chat Interface
The `AITutorChat` component provides a full-featured chat interface with:
- **Message history** with timestamps
- **Context switching** (General, Code Review, Debug, Hints)
- **Code score display** for reviews
- **Conversation clearing**
- **Markdown-like formatting** support

## Usage Examples

### In Code Playground
- **Floating AI button** always available for general questions
- **Review Code button** in editor toolbar for instant feedback
- **Debug Help button** appears when errors occur

### In Dashboard  
- **Ask AI Tutor button** in Quick Actions for general programming help
- **Context-aware suggestions** based on user progress and level

### Integration Points
- **Tutorial pages**: Get hints and explanations
- **Practice exercises**: Progressive hint system
- **Code editor**: Real-time assistance and review
- **Error handling**: Intelligent debugging support

## Technical Architecture

### Backend Services
- **AITutorService**: Core OpenAI integration with conversation management
- **AITutorController**: API endpoints with validation and user tracking
- **Conversation Context**: Maintains chat history with automatic cleanup

### Frontend Components  
- **AITutorButton**: Reusable button component with multiple variants
- **AITutorChat**: Full chat interface with context switching
- **Integration**: Seamless integration into existing pages

### Security & Rate Limiting
- **User authentication** required for all AI features
- **Input validation** prevents malicious code execution
- **Rate limiting** prevents API abuse
- **Error handling** with graceful fallbacks

## Cost Optimization

### Current Settings
- **Model**: GPT-4o-mini (cost-effective)
- **Max tokens**: 1000 per response
- **Context limit**: 10 messages (20 total with AI responses)
- **Auto cleanup**: Conversations expire after 30 minutes

### Cost Management
- Monitor usage through OpenAI dashboard  
- Implement user-based rate limiting if needed
- Consider caching common responses
- Adjust max tokens based on usage patterns

## Next Steps

### Immediate Enhancements
1. **Personalized exercise generation** based on user profile
2. **Adaptive learning paths** using AI recommendations  
3. **Mobile optimization** for touch interfaces
4. **Offline hint caching** for common scenarios

### Advanced Features
1. **Voice interaction** for accessibility
2. **Code execution integration** with AI analysis
3. **Peer learning recommendations** 
4. **Instructor dashboard** with AI insights

## Troubleshooting

### Common Issues
1. **"OpenAI API key not configured"**
   - Solution: Add `OPENAI_API_KEY` to your `.env` file

2. **"Authentication failed"**
   - Solution: Ensure user is logged in before accessing AI features

3. **"Rate limit exceeded"**  
   - Solution: Implement request throttling or upgrade OpenAI plan

4. **Chat not opening**
   - Solution: Check console for JavaScript errors, verify component imports

### Debug Mode
Enable debug logging by setting:
```bash
LOG_LEVEL=debug
```

This comprehensive AI tutoring system transforms Seek into a competitive platform with intelligent, personalized learning assistance that adapts to each user's needs and skill level.