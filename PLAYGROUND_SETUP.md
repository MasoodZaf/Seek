# Enhanced Playground Setup Guide

## Overview
This guide will help you set up the enhanced code playground with comprehensive language support and advanced features.

## Features Implemented

### 🎨 Monaco Editor Integration
- Professional code editor with syntax highlighting
- IntelliSense and autocompletion
- Error diagnostics and linting
- Find/Replace functionality
- Multiple themes support
- Customizable font sizes
- Bracket matching and folding

### 🚀 Multi-Language Support (15+ Languages)
**Fully Executable Languages:**
- JavaScript/Node.js
- TypeScript
- Python 3.11
- Java 17
- C/C++
- Go
- Rust
- C# (.NET 8)
- PHP 8.2
- Ruby 3.2
- Kotlin

**Syntax Highlighting Only:**
- Swift (view-only)
- Scala
- R
- Julia
- Perl
- Dart
- Elixir
- Haskell
- Lua

### 📊 Advanced Execution Features
- Docker-based sandboxed execution
- Real-time execution stats (time, memory)
- Console output capture
- Error handling and stack traces
- Execution timeout protection
- Resource limits (CPU, memory)

### 💾 Enhanced User Experience
- Code saving and loading
- Template system with examples
- Code sharing via URLs
- Export functionality
- Mobile-responsive design
- Execution history tracking
- Performance analytics

## Setup Instructions

### 1. Prerequisites
- Docker installed and running
- Node.js 18+ for frontend
- Node.js 18+ for backend

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Install Docker (if not already installed)
# On macOS: brew install docker
# On Ubuntu: sudo apt-get install docker.io
# On Windows: Install Docker Desktop

# Ensure Docker is running
docker --version
```

### 3. Build Docker Images

The playground uses Docker containers for secure code execution. Build all language containers:

```bash
# Build Python container
docker build -f docker/Dockerfile.python -t seek-python-runner docker/

# Build JavaScript/Node.js container
docker build -f docker/Dockerfile.javascript -t seek-javascript-runner docker/

# Build TypeScript container
docker build -f docker/Dockerfile.typescript -t seek-typescript-runner docker/

# Build Java container
docker build -f docker/Dockerfile.java -t seek-java-runner docker/

# Build C++ container
docker build -f docker/Dockerfile.cpp -t seek-cpp-runner docker/

# Build C container
docker build -f docker/Dockerfile.c -t seek-c-runner docker/

# Build Go container
docker build -f docker/Dockerfile.go -t seek-go-runner docker/

# Build Rust container
docker build -f docker/Dockerfile.rust -t seek-rust-runner docker/

# Build C# container
docker build -f docker/Dockerfile.csharp -t seek-csharp-runner docker/

# Build PHP container
docker build -f docker/Dockerfile.php -t seek-php-runner docker/

# Build Ruby container
docker build -f docker/Dockerfile.ruby -t seek-ruby-runner docker/

# Build Kotlin container
docker build -f docker/Dockerfile.kotlin -t seek-kotlin-runner docker/
```

### 4. Automated Build Script

For convenience, you can create a build script:

```bash
#!/bin/bash
# Save as build-containers.sh

echo "Building Docker containers for Seek Playground..."

languages=("python" "javascript" "typescript" "java" "cpp" "c" "go" "rust" "csharp" "php" "ruby" "kotlin")

for lang in "${languages[@]}"; do
    echo "Building $lang container..."
    docker build -f docker/Dockerfile.$lang -t seek-$lang-runner docker/
    if [ $? -eq 0 ]; then
        echo "✅ $lang container built successfully"
    else
        echo "❌ Failed to build $lang container"
    fi
done

echo "Docker container build complete!"
```

Make it executable and run:
```bash
chmod +x build-containers.sh
./build-containers.sh
```

### 5. Start the Backend Server

```bash
# Start the backend server
npm run dev
```

The backend will automatically initialize the Docker execution service.

### 6. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies (if not already done)
npm install

# Start the frontend development server
npm run dev
```

### 7. Access the Enhanced Playground

Open your browser and navigate to:
- Frontend: `http://localhost:3000`
- Playground: `http://localhost:3000/playground`

## Configuration

### Environment Variables (Backend)

Create a `.env` file in the backend directory:

```env
# Code execution timeout (milliseconds)
CODE_EXECUTION_TIMEOUT=10000

# Database configuration
DB_TYPE=sqlite
DB_PATH=./database.sqlite

# Server configuration
PORT=5001
NODE_ENV=development

# Security settings
JWT_SECRET=your-secret-key-here
```

### Monaco Editor Themes

Available themes:
- `vs` - Light theme
- `vs-dark` - Dark theme  
- `hc-black` - High contrast dark
- `hc-light` - High contrast light

## Usage Examples

### JavaScript Example
```javascript
// Hello World with modern features
const greet = (name) => `Hello, ${name}!`;
console.log(greet('Developer'));

// Async/await example
async function fetchData() {
    return new Promise(resolve => 
        setTimeout(() => resolve('Data loaded!'), 1000)
    );
}

fetchData().then(console.log);
```

### Python Example
```python
# Data structures and comprehensions
numbers = [1, 2, 3, 4, 5]
squares = [n**2 for n in numbers]
print(f"Squares: {squares}")

# Class example
class Calculator:
    @staticmethod
    def add(a, b):
        return a + b

print(f"2 + 3 = {Calculator.add(2, 3)}")
```

### Go Example
```go
package main

import (
    "fmt"
    "time"
)

func main() {
    fmt.Println("Hello from Go!")
    
    // Goroutine example
    go func() {
        fmt.Println("Async operation complete")
    }()
    
    time.Sleep(100 * time.Millisecond)
}
```

## Security Features

### Docker Sandboxing
- Isolated execution environment
- No network access
- Resource limits (CPU: 50%, Memory: 64MB)
- Read-only root filesystem
- Non-root user execution
- Minimal system capabilities

### Code Validation
- Syntax checking before execution
- Input sanitization
- Execution timeouts
- Resource monitoring

## Mobile Responsiveness

The playground automatically adapts to different screen sizes:

### Desktop (1024px+)
- Side-by-side editor and output
- Full feature set available
- Multiple panels visible

### Tablet (768px - 1023px)  
- Responsive grid layout
- Collapsible panels
- Touch-friendly controls

### Mobile (< 768px)
- Tab-based interface (Editor/Output)
- Optimized font sizes
- Touch gestures support
- Simplified toolbar

## Performance Monitoring

### Execution Metrics
- Execution time tracking
- Memory usage monitoring
- Success/failure rates
- Language usage statistics

### User Analytics
- Code execution history
- Favorite languages
- Performance trends
- Usage patterns

## Troubleshooting

### Docker Issues
```bash
# Check Docker status
docker --version
docker ps

# Clean up containers
docker system prune

# Rebuild specific container
docker build -f docker/Dockerfile.python -t seek-python-runner docker/
```

### Common Errors

**Error: "Docker image not available"**
- Solution: Build the Docker containers using the setup script

**Error: "Execution timeout"**  
- Solution: Increase CODE_EXECUTION_TIMEOUT in .env file

**Error: "Monaco Editor not loading"**
- Solution: Clear browser cache and restart frontend server

### Performance Optimization

1. **Disable unused languages**: Comment out unused containers in dockerExecutionService.js
2. **Increase resources**: Modify memory/CPU limits in Docker configurations
3. **Enable caching**: Implement Redis for execution result caching

## Development

### Adding New Languages

1. Create `Dockerfile.{language}` in `backend/docker/`
2. Create `execute.{ext}` execution script
3. Update `dockerExecutionService.js` with new language mapping
4. Update `languageConfig.js` in frontend
5. Test execution and add templates

### Custom Themes

Add custom Monaco themes in `languageConfig.js`:

```javascript
export const CUSTOM_THEMES = {
  'my-theme': {
    name: 'My Custom Theme',
    base: 'vs-dark',
    // Theme definition
  }
};
```

## Production Deployment

### Backend
- Use PM2 for process management
- Configure reverse proxy (nginx)
- Set up SSL certificates
- Enable logging and monitoring

### Frontend  
- Build production bundle: `npm run build`
- Serve with nginx or CDN
- Enable gzip compression
- Configure caching headers

### Docker
- Use multi-stage builds for smaller images
- Implement health checks
- Set up container orchestration (Docker Compose/Kubernetes)

## Support

For issues and feature requests:
- Check the troubleshooting section
- Review Docker container logs
- Check browser console for frontend errors
- Verify API endpoints are responding

## License

This enhanced playground is part of the Seek learning platform and follows the same licensing terms.