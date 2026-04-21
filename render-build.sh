#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing Node modules..."
npm install

echo "Building Vite React Frontend..."
npm run build

echo "Installing Python dependencies..."
cd backend
pip install -r requirements.txt

echo "Build Complete!"
