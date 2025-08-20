const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Seek Learning Platform API',
      version: '1.0.0',
      description: 'A comprehensive API for the Seek coding learning platform with AI tutoring capabilities',
      contact: {
        name: 'Seek Development Team',
        email: 'api@seek.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://api.seek.com/api/v1'
          : `http://localhost:${process.env.PORT || 5001}/api/v1`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            username: { type: 'string', example: 'johndoe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            role: { type: 'string', enum: ['student', 'instructor', 'admin'], example: 'student' },
            preferences: {
              type: 'object',
              properties: {
                language: { type: 'string', enum: ['javascript', 'python', 'java', 'typescript'] },
                theme: { type: 'string', enum: ['light', 'dark'] },
                notifications: {
                  type: 'object',
                  properties: {
                    email: { type: 'boolean' },
                    push: { type: 'boolean' }
                  }
                }
              }
            },
            progress: {
              type: 'object',
              properties: {
                totalExercises: { type: 'number' },
                completedExercises: { type: 'number' },
                currentStreak: { type: 'number' },
                totalPoints: { type: 'number' },
                level: { type: 'number' }
              }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Tutorial: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439012' },
            title: { type: 'string', example: 'JavaScript Fundamentals' },
            description: { type: 'string', example: 'Learn the basics of JavaScript programming' },
            language: { type: 'string', enum: ['javascript', 'python', 'java', 'typescript'] },
            category: { type: 'string', enum: ['fundamentals', 'web-development', 'data-structures', 'algorithms', 'frameworks'] },
            difficulty: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
            tags: { type: 'array', items: { type: 'string' } },
            lessons: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  content: { type: 'string' },
                  codeTemplate: { type: 'string' },
                  expectedOutput: { type: 'string' },
                  hints: { type: 'array', items: { type: 'string' } },
                  difficulty: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
                  estimatedTime: { type: 'number' },
                  order: { type: 'number' }
                }
              }
            },
            author: { $ref: '#/components/schemas/User' },
            stats: {
              type: 'object',
              properties: {
                enrollments: { type: 'number' },
                completions: { type: 'number' },
                averageRating: { type: 'number' },
                totalRatings: { type: 'number' }
              }
            },
            isPublished: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CodeExecution: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439013' },
            sessionId: { type: 'string', example: 'uuid-session-id' },
            language: { type: 'string', enum: ['javascript', 'python', 'java', 'typescript'] },
            code: { type: 'string', example: 'console.log("Hello, World!");' },
            input: { type: 'string', example: '' },
            output: {
              type: 'object',
              properties: {
                stdout: { type: 'string' },
                stderr: { type: 'string' },
                exitCode: { type: 'number' },
                executionTime: { type: 'number' },
                memoryUsage: { type: 'number' }
              }
            },
            status: { type: 'string', enum: ['pending', 'running', 'completed', 'error', 'timeout'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        UserProgress: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string', example: '507f1f77bcf86cd799439011' },
            tutorial: { $ref: '#/components/schemas/Tutorial' },
            status: { type: 'string', enum: ['not_started', 'in_progress', 'completed', 'paused'] },
            overallProgress: { type: 'number', minimum: 0, maximum: 100 },
            currentLesson: { type: 'number' },
            totalTimeSpent: { type: 'number' },
            averageScore: { type: 'number' },
            certificate: {
              type: 'object',
              properties: {
                issued: { type: 'boolean' },
                issuedAt: { type: 'string', format: 'date-time' },
                certificateId: { type: 'string' }
              }
            },
            rating: {
              type: 'object',
              properties: {
                score: { type: 'number', minimum: 1, maximum: 5 },
                review: { type: 'string' },
                ratedAt: { type: 'string', format: 'date-time' }
              }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 100 },
            page: { type: 'number', example: 1 },
            pages: { type: 'number', example: 10 },
            limit: { type: 'number', example: 10 }
          }
        }
      }
    },
    security: [
      { bearerAuth: [] },
      { cookieAuth: [] }
    ]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './models/*.js'
  ]
};

const specs = swaggerJsdoc(options);

const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 20px 0 }
    .swagger-ui .info .title { color: #2c5aa0 }
  `,
  customSiteTitle: 'Seek API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
  }
};

module.exports = {
  specs,
  swaggerUi,
  swaggerOptions
};
