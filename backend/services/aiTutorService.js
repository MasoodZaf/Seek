const OpenAI = require('openai');
const logger = require('../config/logger');

class AITutorService {
  constructor() {
    // Only initialize OpenAI if API key is provided
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    } else {
      console.warn('OpenAI API key not provided. AI Tutor features will be limited.');
      this.openai = null;
    }

    this.conversationContexts = new Map();
    this.maxContextLength = 10;

    this.systemPrompts = {
      general: `You are an expert programming tutor for the Seek Learning Platform. Your role is to:
      - Help students learn programming concepts step by step
      - Provide clear, beginner-friendly explanations
      - Give constructive feedback on code
      - Suggest improvements and best practices
      - Encourage students and maintain a positive learning environment
      - Adapt your teaching style to the student's level
      - Always be patient and supportive
      
      Keep responses concise but comprehensive. Use examples when helpful.`,

      codeReview: `You are an AI code reviewer for the Seek Learning Platform. Your role is to:
      - Analyze code for bugs, logic errors, and potential issues
      - Suggest improvements for readability and performance
      - Explain why changes are needed in educational terms
      - Highlight good practices the student used
      - Provide specific, actionable feedback
      - Focus on teaching moments rather than just corrections`,

      debugging: `You are a debugging assistant for the Seek Learning Platform. Your role is to:
      - Help identify the root cause of errors
      - Guide students through debugging steps
      - Explain error messages in simple terms
      - Suggest debugging techniques and tools
      - Teach problem-solving approaches
      - Build debugging confidence in students`,

      hints: `You are a hint provider for coding exercises on Seek Learning Platform. Your role is to:
      - Provide subtle hints without giving away complete solutions
      - Guide students toward the right approach
      - Break complex problems into smaller steps
      - Encourage critical thinking
      - Adapt hint difficulty to student's progress
      - Maintain the learning challenge while providing support`
    };
  }

  async getChatResponse(userId, message, context = {}) {
    try {
      if (!this.openai) {
        return {
          success: false,
          error: 'AI Tutor service not available. Please configure OpenAI API key.',
          response: 'I apologize, but the AI tutoring service is not currently available. Please contact your administrator to set up the OpenAI integration.'
        };
      }

      const conversationKey = `${userId}_${context.sessionId || 'general'}`;
      const conversation = this.getConversationContext(conversationKey);

      const systemPrompt = this.systemPrompts[context.type || 'general'];
      const userContext = this.buildUserContext(context);

      const messages = [
        { role: 'system', content: `${systemPrompt}\n\n${userContext}` },
        ...conversation,
        { role: 'user', content: message }
      ];

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const response = completion.choices[0].message.content;

      // Update conversation context
      this.updateConversationContext(conversationKey, message, response);

      logger.info(`AI tutor response generated for user ${userId}`, {
        contextType: context.type,
        messageLength: message.length,
        responseLength: response.length
      });

      return {
        success: true,
        response,
        context: {
          type: context.type || 'general',
          sessionId: context.sessionId,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error('AI tutor service error:', {
        error: error.message,
        userId,
        contextType: context.type
      });

      return {
        success: false,
        error: error.message,
        response: this.getFallbackResponse(context.type)
      };
    }
  }

  async reviewCode(userId, code, language, exerciseContext = {}) {
    try {
      const context = {
        type: 'codeReview',
        language,
        exerciseId: exerciseContext.exerciseId,
        difficulty: exerciseContext.difficulty
      };

      const reviewPrompt = `Please review this ${language} code:

\`\`\`${language}
${code}
\`\`\`

${exerciseContext.problem ? `\nProblem: ${exerciseContext.problem}` : ''}
${exerciseContext.requirements ? `\nRequirements: ${exerciseContext.requirements.join(', ')}` : ''}

Provide a structured review covering:
1. **Correctness**: Does the code solve the problem correctly?
2. **Best Practices**: Are coding standards followed?
3. **Performance**: Any efficiency improvements?
4. **Readability**: Is the code clear and well-structured?
5. **Learning Points**: Key concepts demonstrated or missed

Format your response with clear sections and be encouraging while being constructive.`;

      const result = await this.getChatResponse(userId, reviewPrompt, context);

      if (result.success) {
        // Extract and score different aspects
        const score = this.calculateCodeScore(code, language, result.response);

        return {
          ...result,
          score,
          suggestions: this.extractSuggestions(result.response),
          strengths: this.extractStrengths(result.response)
        };
      }

      return result;
    } catch (error) {
      logger.error('Code review error:', { error: error.message, userId });

      return {
        success: false,
        error: error.message,
        response: 'I apologize, but I cannot review your code right now. Please try again later.',
        score: {
          overall: 0, correctness: 0, style: 0, performance: 0
        }
      };
    }
  }

  async getHint(userId, exerciseId, currentCode, attemptCount, difficulty = 'beginner') {
    try {
      const context = {
        type: 'hints',
        exerciseId,
        difficulty,
        attemptCount
      };

      const hintLevel = this.determineHintLevel(attemptCount, difficulty);

      const hintPrompt = `The student is working on exercise ${exerciseId} and has made ${attemptCount} attempts.
      
Current code attempt:
\`\`\`
${currentCode}
\`\`\`

Provide a ${hintLevel} hint that:
- Doesn't give away the complete solution
- Guides them toward the right approach
- Is appropriate for their current level (${difficulty})
- Encourages them to keep trying

Hint level: ${hintLevel}`;

      const result = await this.getChatResponse(userId, hintPrompt, context);

      return {
        ...result,
        hintLevel,
        attemptCount,
        nextHintAvailable: attemptCount < 5
      };
    } catch (error) {
      logger.error('Hint generation error:', { error: error.message, userId, exerciseId });

      return {
        success: false,
        error: error.message,
        response: "Try breaking down the problem into smaller steps. What's the first thing you need to do?"
      };
    }
  }

  async debugCode(userId, code, language, errorMessage, stackTrace = '') {
    try {
      const context = {
        type: 'debugging',
        language
      };

      const debugPrompt = `Help debug this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Error message: ${errorMessage}
${stackTrace ? `\nStack trace: ${stackTrace}` : ''}

Please:
1. Identify the likely cause of the error
2. Explain what the error message means in simple terms
3. Suggest specific fixes
4. Provide debugging tips for similar issues in the future
5. Show the corrected code if possible

Be educational and help the student learn from this debugging experience.`;

      const result = await this.getChatResponse(userId, debugPrompt, context);

      return {
        ...result,
        errorType: this.classifyError(errorMessage),
        fixes: this.extractFixes(result.response)
      };
    } catch (error) {
      logger.error('Debug assistance error:', { error: error.message, userId });

      return {
        success: false,
        error: error.message,
        response: 'Try reading the error message carefully. It usually points to the line where the problem occurs.'
      };
    }
  }

  async generatePersonalizedExercise(userId, userProfile) {
    try {
      const context = {
        type: 'general',
        userId
      };

      const exercisePrompt = `Create a personalized coding exercise for this student:

Student Profile:
- Level: ${userProfile.level || 'beginner'}
- Preferred Language: ${userProfile.language || 'javascript'}
- Completed Topics: ${userProfile.completedTopics?.join(', ') || 'none'}
- Strengths: ${userProfile.strengths?.join(', ') || 'unknown'}
- Areas for Improvement: ${userProfile.weaknesses?.join(', ') || 'unknown'}
- Learning Style: ${userProfile.learningStyle || 'practical'}

Generate:
1. A coding problem appropriate for their level
2. Clear problem statement and requirements
3. Example input/output
4. Starter code template
5. Test cases
6. Learning objectives

Make it engaging and aligned with their interests and skill level.`;

      const result = await this.getChatResponse(userId, exercisePrompt, context);

      return {
        ...result,
        exercise: this.parseExerciseResponse(result.response),
        personalized: true,
        targetSkills: userProfile.targetSkills || []
      };
    } catch (error) {
      logger.error('Personalized exercise generation error:', { error: error.message, userId });

      return {
        success: false,
        error: error.message,
        response: 'Unable to generate a personalized exercise right now. Try our existing exercise library.'
      };
    }
  }

  getConversationContext(conversationKey) {
    const context = this.conversationContexts.get(conversationKey) || [];
    return context.slice(-this.maxContextLength);
  }

  updateConversationContext(conversationKey, userMessage, aiResponse) {
    const context = this.conversationContexts.get(conversationKey) || [];

    context.push(
      { role: 'user', content: userMessage },
      { role: 'assistant', content: aiResponse }
    );

    if (context.length > this.maxContextLength * 2) {
      context.splice(0, context.length - this.maxContextLength * 2);
    }

    this.conversationContexts.set(conversationKey, context);

    setTimeout(() => {
      this.conversationContexts.delete(conversationKey);
    }, 30 * 60 * 1000);
  }

  buildUserContext(context) {
    const parts = [];

    if (context.language) {
      parts.push(`Programming Language: ${context.language}`);
    }

    if (context.difficulty) {
      parts.push(`Difficulty Level: ${context.difficulty}`);
    }

    if (context.exerciseId) {
      parts.push(`Exercise ID: ${context.exerciseId}`);
    }

    if (context.attemptCount) {
      parts.push(`Attempt Number: ${context.attemptCount}`);
    }

    return parts.length > 0 ? `Context: ${parts.join(' | ')}` : '';
  }

  determineHintLevel(attemptCount, difficulty) {
    if (attemptCount <= 1) return 'subtle';
    if (attemptCount <= 3) return 'moderate';
    return 'direct';
  }

  calculateCodeScore(code, language, reviewResponse) {
    const score = {
      overall: 75,
      correctness: 80,
      style: 70,
      performance: 75
    };

    const response = reviewResponse.toLowerCase();

    if (response.includes('correct') && response.includes('works well')) {
      score.correctness += 15;
    }

    if (response.includes('best practices') || response.includes('good structure')) {
      score.style += 15;
    }

    if (response.includes('efficient') || response.includes('optimiz')) {
      score.performance += 15;
    }

    if (response.includes('error') || response.includes('bug') || response.includes('incorrect')) {
      score.correctness -= 20;
      score.overall -= 15;
    }

    score.overall = Math.round((score.correctness + score.style + score.performance) / 3);

    Object.keys(score).forEach((key) => {
      score[key] = Math.max(0, Math.min(100, score[key]));
    });

    return score;
  }

  extractSuggestions(reviewResponse) {
    const suggestions = [];
    const lines = reviewResponse.split('\n');

    for (const line of lines) {
      if (line.includes('suggest') || line.includes('recommend') || line.includes('consider')) {
        suggestions.push(line.trim());
      }
    }

    return suggestions.slice(0, 3);
  }

  extractStrengths(reviewResponse) {
    const strengths = [];
    const lines = reviewResponse.split('\n');

    for (const line of lines) {
      if (line.includes('good') || line.includes('well') || line.includes('correct')
          || line.includes('nice') || line.includes('excellent')) {
        strengths.push(line.trim());
      }
    }

    return strengths.slice(0, 3);
  }

  extractFixes(debugResponse) {
    const fixes = [];
    const lines = debugResponse.split('\n');

    for (const line of lines) {
      if (line.includes('fix') || line.includes('change') || line.includes('replace')
          || line.includes('add') || line.includes('remove')) {
        fixes.push(line.trim());
      }
    }

    return fixes.slice(0, 5);
  }

  classifyError(errorMessage) {
    const errorTypes = {
      SyntaxError: 'syntax',
      ReferenceError: 'reference',
      TypeError: 'type',
      RangeError: 'range',
      'compilation error': 'compilation',
      'runtime error': 'runtime',
      'logic error': 'logic'
    };

    for (const [pattern, type] of Object.entries(errorTypes)) {
      if (errorMessage.toLowerCase().includes(pattern.toLowerCase())) {
        return type;
      }
    }

    return 'unknown';
  }

  parseExerciseResponse(response) {
    return {
      title: 'Personalized Exercise',
      problem: `${response.substring(0, 500)}...`,
      starterCode: '// Your code here',
      testCases: [],
      solution: ''
    };
  }

  getFallbackResponse(contextType) {
    const fallbacks = {
      general: "I'm here to help you learn programming! What would you like to work on today?",
      codeReview: "I'd be happy to review your code, but I'm having technical difficulties right now. Please try again in a moment.",
      debugging: 'When debugging, start by reading the error message carefully. It usually tells you what went wrong and where.',
      hints: "Try breaking the problem into smaller steps. What's the first thing you need to accomplish?"
    };

    return fallbacks[contextType] || fallbacks.general;
  }

  clearConversationContext(userId, sessionId) {
    const conversationKey = `${userId}_${sessionId || 'general'}`;
    this.conversationContexts.delete(conversationKey);
  }

  getActiveConversations() {
    return this.conversationContexts.size;
  }
}

module.exports = new AITutorService();
