#!/bin/bash

# Exit on error
set -e

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building application..."
npm run build

# Deploy to nginx directory
echo "Deploying to Nginx directory..."
sudo rm -rf /var/www/leads/*
sudo cp -r dist/* /var/www/leads/

# Set proper permissions
echo "Setting permissions..."
sudo chown -R www-data:www-data /var/www/leads
sudo chmod -R 755 /var/www/leads

echo "Deployment complete!"