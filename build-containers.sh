#!/bin/bash

# Enhanced Playground Docker Container Build Script
# This script builds all the Docker containers for the code execution playground

echo "🚀 Building Docker containers for Seek Enhanced Playground..."
echo "============================================================"

# Change to the backend directory
cd "$(dirname "$0")/backend"

if [ ! -d "docker" ]; then
    echo "❌ Docker directory not found. Please run this script from the project root."
    exit 1
fi

# Array of languages to build
languages=("python" "javascript" "typescript" "java" "cpp" "c" "go" "rust" "csharp" "php" "ruby" "kotlin")

# Counters
success_count=0
fail_count=0
failed_languages=()

echo "📦 Building containers for ${#languages[@]} languages..."
echo ""

# Build each container
for lang in "${languages[@]}"; do
    echo "🔨 Building $lang container..."
    
    # Check if Dockerfile exists
    if [ ! -f "docker/Dockerfile.$lang" ]; then
        echo "⚠️  Dockerfile.$lang not found, skipping..."
        ((fail_count++))
        failed_languages+=("$lang")
        continue
    fi
    
    # Build the container
    if docker build -f "docker/Dockerfile.$lang" -t "seek-$lang-runner" docker/ > /dev/null 2>&1; then
        echo "✅ $lang container built successfully"
        ((success_count++))
    else
        echo "❌ Failed to build $lang container"
        ((fail_count++))
        failed_languages+=("$lang")
    fi
    echo ""
done

# Summary
echo "============================================================"
echo "📊 Build Summary:"
echo "   ✅ Successfully built: $success_count containers"
echo "   ❌ Failed: $fail_count containers"

if [ ${#failed_languages[@]} -gt 0 ]; then
    echo "   Failed languages: ${failed_languages[*]}"
    echo ""
    echo "💡 Troubleshooting tips:"
    echo "   - Ensure Docker is running: docker --version"
    echo "   - Check Docker daemon: docker ps"
    echo "   - Try building individual containers manually:"
    for failed_lang in "${failed_languages[@]}"; do
        echo "     docker build -f docker/Dockerfile.$failed_lang -t seek-$failed_lang-runner docker/"
    done
fi

echo ""

if [ $success_count -gt 0 ]; then
    echo "🎉 Playground setup complete! You can now:"
    echo "   1. Start the backend: cd backend && npm run dev"
    echo "   2. Start the frontend: cd frontend && npm run dev"
    echo "   3. Access the playground at: http://localhost:3000/playground"
    echo ""
    echo "🔒 Security features enabled:"
    echo "   - Sandboxed Docker execution"
    echo "   - Resource limits (64MB RAM, 50% CPU)"
    echo "   - No network access for containers"
    echo "   - Non-root user execution"
fi

echo ""
echo "📚 For more information, see PLAYGROUND_SETUP.md"
echo "============================================================"