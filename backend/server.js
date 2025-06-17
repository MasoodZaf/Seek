const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Seek Learning Platform API 🎯',
    status: 'running',
    features: ['AI Tutoring', 'Error Correction', 'Progress Tracking']
  });
});

app.get('/api/tutorials', (req, res) => {
  res.json({
    tutorials: [
      { 
        id: 1, 
        title: 'JavaScript Basics', 
        lessons: 10, 
        completed: 3,
        description: 'Learn the fundamentals of JavaScript programming'
      },
      { 
        id: 2, 
        title: 'HTML & CSS', 
        lessons: 8, 
        completed: 0,
        description: 'Master the building blocks of the web'
      },
      { 
        id: 3, 
        title: 'Python Intro', 
        lessons: 12, 
        completed: 0,
        description: 'Start your journey with Python programming'
      },
      {
        id: 4,
        title: 'React Fundamentals',
        lessons: 15,
        completed: 0,
        description: 'Build modern web applications with React'
      }
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});