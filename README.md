# Seek Learning Platform 🎯

An AI-powered learning platform designed to help beginners master coding through interactive tutorials, personalized feedback, and real-time assistance.

## Features 🚀

- **AI Tutoring**: Get personalized help from our AI tutor
- **Interactive Learning**: Practice coding with hands-on exercises
- **Progress Tracking**: Monitor your learning journey
- **Rich Content**: Access comprehensive learning materials

## Tech Stack 💻

### Frontend
- React.js
- Modern CSS with Flexbox/Grid
- Responsive Design
- Client-side State Management

### Backend
- Node.js
- Express.js
- RESTful API
- CORS enabled

## Getting Started 🌟

### Prerequisites
- Node.js (v18 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MasoodZaf/Seek.git
cd Seek
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Create environment files:
```bash
# In the root directory
cp .env.example .env
```

4. Start the development servers:
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm start
```

The frontend will be available at http://localhost:3001
The backend API will be available at http://localhost:5001

## API Endpoints 📡

- `GET /`: Welcome message and API status
- `GET /api/tutorials`: List of available tutorials

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Thanks to all contributors who help improve this platform
- Special thanks to the open-source community for their amazing tools and libraries

---

Made with ❤️ by [Masoodzaf](https://github.com/MasoodZaf)
