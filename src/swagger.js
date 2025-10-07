const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MealGenie API',
      version: '1.0.0',
      description: `
        A comprehensive meal planning and nutrition tracking API built with Node.js, Express, and MongoDB.
      `,
      contact: {
        name: 'MealGenie API Support'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server'
      },
      {
        url: 'http://localhost:3000',
        description: 'Alternative Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique user identifier',
              example: '507f1f77bcf86cd799439011'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com'
            },
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe'
            },
            age: {
              type: 'integer',
              minimum: 13,
              maximum: 120,
              description: 'User age in years',
              example: 25
            },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'other'],
              description: 'User gender',
              example: 'male'
            },
            height: {
              type: 'number',
              minimum: 50,
              maximum: 300,
              description: 'User height in centimeters',
              example: 175
            },
            weight: {
              type: 'number',
              minimum: 20,
              maximum: 500,
              description: 'User weight in kilograms',
              example: 70
            },
            goal: {
              type: 'string',
              enum: ['lose_weight', 'maintain_weight', 'gain_weight', 'build_muscle', 'improve_health'],
              description: 'User fitness goal',
              example: 'build_muscle'
            },
            preferences: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'User food preferences',
              example: ['vegetarian', 'high_protein']
            },
            allergies: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'User food allergies',
              example: ['nuts', 'dairy']
            },
            favoriteFoods: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'References to favorite food items',
              example: []
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the user account is active',
              example: true
            },
            lastLogin: {
              type: 'string',
              format: 'date-time',
              description: 'Last login timestamp',
              example: '2024-10-07T10:30:00.000Z'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp',
              example: '2024-10-07T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
              example: '2024-10-07T10:30:00.000Z'
            }
          }
        },
        UserRegistrationRequest: {
          type: 'object',
          required: ['email', 'password', 'name', 'age', 'gender', 'height', 'weight', 'goal'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Valid email address',
              example: 'john.doe@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Password (min 6 chars, must contain uppercase, lowercase, and number)',
              example: 'SecurePass123'
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'Full name',
              example: 'John Doe'
            },
            age: {
              type: 'integer',
              minimum: 13,
              maximum: 120,
              description: 'Age in years',
              example: 25
            },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'other'],
              description: 'Gender',
              example: 'male'
            },
            height: {
              type: 'number',
              minimum: 50,
              maximum: 300,
              description: 'Height in centimeters',
              example: 175
            },
            weight: {
              type: 'number',
              minimum: 20,
              maximum: 500,
              description: 'Weight in kilograms',
              example: 70
            },
            goal: {
              type: 'string',
              enum: ['lose_weight', 'maintain_weight', 'gain_weight', 'build_muscle', 'improve_health'],
              description: 'Fitness goal',
              example: 'build_muscle'
            },
            preferences: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Food preferences (optional)',
              example: ['vegetarian', 'high_protein']
            },
            allergies: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Food allergies (optional)',
              example: ['nuts', 'dairy']
            }
          }
        },
        UserLoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com'
            },
            password: {
              type: 'string',
              description: 'User password',
              example: 'SecurePass123'
            }
          }
        },
        UserProfileUpdateRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'Full name',
              example: 'John Updated'
            },
            age: {
              type: 'integer',
              minimum: 13,
              maximum: 120,
              description: 'Age in years',
              example: 26
            },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'other'],
              description: 'Gender',
              example: 'male'
            },
            height: {
              type: 'number',
              minimum: 50,
              maximum: 300,
              description: 'Height in centimeters',
              example: 175
            },
            weight: {
              type: 'number',
              minimum: 20,
              maximum: 500,
              description: 'Weight in kilograms',
              example: 72
            },
            goal: {
              type: 'string',
              enum: ['lose_weight', 'maintain_weight', 'gain_weight', 'build_muscle', 'improve_health'],
              description: 'Fitness goal',
              example: 'build_muscle'
            },
            preferences: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Food preferences',
              example: ['vegetarian', 'high_protein', 'organic']
            },
            allergies: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Food allergies',
              example: ['nuts', 'dairy']
            }
          }
        },
        PasswordChangeRequest: {
          type: 'object',
          required: ['currentPassword', 'newPassword'],
          properties: {
            currentPassword: {
              type: 'string',
              description: 'Current password',
              example: 'OldPass123'
            },
            newPassword: {
              type: 'string',
              minLength: 6,
              description: 'New password (min 6 chars, must contain uppercase, lowercase, and number)',
              example: 'NewSecurePass456'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Request success status',
              example: true
            },
            message: {
              type: 'string',
              description: 'Response message',
              example: 'Login successful'
            },
            token: {
              type: 'string',
              description: 'JWT authentication token',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Request success status',
              example: true
            },
            message: {
              type: 'string',
              description: 'Response message',
              example: 'Operation successful'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Validation error occurred'
            },
            error: {
              type: 'object',
              description: 'Error details',
              properties: {
                details: {
                  type: 'string',
                  example: 'Email is required'
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User registration, login, password change, and account deactivation'
      },
      {
        name: 'User Profile',
        description: 'User profile viewing, updating, and user lookup operations'
      }
    ]
  },
  apis: [
    './src/route/*.js', // Path to the API routes
    './src/controller/*.js', // Path to controllers (if they contain docs)
    './src/model/*.js' // Path to models (if they contain docs)
  ]
};

// Generate Swagger specification
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Swagger UI options
const swaggerUiOptions = {
  swaggerOptions: {
    persistAuthorization: true, // Keep authorization between page refreshes
    displayRequestDuration: true, // Show request duration
    docExpansion: 'none', // Don't expand operations by default
    filter: true, // Enable filtering
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true // Enable "Try it out" by default
  },
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #2E7D32; }
    .swagger-ui .scheme-container { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
  `,
  customSiteTitle: 'MealGenie API Documentation',
  customfavIcon: '/favicon.ico'
};

module.exports = {
  swaggerSpec,
  swaggerUi,
  swaggerUiOptions
};