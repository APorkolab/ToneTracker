#!/bin/bash

echo "🚀 Starting E2E test suite..."

# Build the application first
echo "🏗️  Building application..."
npm run build

# Kill any existing server on port 4173
echo "🧹 Cleaning up any existing servers..."
# Find and kill processes using port 4173
lsof -ti:4173 | xargs kill -9 2>/dev/null || true
pkill -f "vite preview" 2>/dev/null || true
sleep 3

# Start the preview server in background
echo "🌐 Starting preview server..."
npm run preview &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
timeout=30
counter=0
while ! curl -s http://localhost:4173/ > /dev/null; do
    sleep 1
    counter=$((counter + 1))
    if [ $counter -ge $timeout ]; then
        echo "❌ Server failed to start within $timeout seconds"
        kill $SERVER_PID 2>/dev/null
        exit 1
    fi
done

echo "✅ Server is running on http://localhost:4173"

# Install Playwright browsers if needed
if [ ! -d ~/.cache/ms-playwright ]; then
    echo "📦 Installing Playwright browsers..."
    npx playwright install
fi

# Run the E2E tests
echo "🧪 Running E2E tests..."
npx playwright test --reporter=list

# Store the test exit code
TEST_EXIT_CODE=$?

# Clean up: kill the server
echo "🧹 Cleaning up..."
kill $SERVER_PID 2>/dev/null

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ All E2E tests passed!"
else
    echo "❌ Some E2E tests failed"
fi

exit $TEST_EXIT_CODE
