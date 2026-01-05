#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running in development or production mode
MODE=${NODE_ENV:-development}

echo -e "${BLUE}Starting Hatra Suci Application in ${MODE} mode...${NC}"

# Check if MongoDB is running (skip Docker for native MongoDB)
if command -v mongosh &> /dev/null || command -v mongo &> /dev/null; then
    echo -e "${GREEN}MongoDB is available${NC}"
else
    echo -e "${YELLOW}Warning: MongoDB CLI not found. Ensure MongoDB is running.${NC}"
fi

# Start backend with appropriate mode
echo -e "${GREEN}Starting Backend Server...${NC}"
cd backend

if [ "$MODE" = "production" ]; then
    echo -e "${BLUE}Running in PRODUCTION mode with clustering (multi-core)${NC}"
    npm run start &
    BACKEND_PID=$!
else
    echo -e "${BLUE}Running in DEVELOPMENT mode (single process with auto-reload)${NC}"
    npm run dev &
    BACKEND_PID=$!
fi

# Wait for backend to start
sleep 5

# Start frontend
echo -e "${GREEN}Starting Frontend Server...${NC}"
cd ..
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
