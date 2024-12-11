#!/bin/bash

# Exit on error
set -e

# Update system
echo "Updating system..."
sudo apt update && sudo apt upgrade -y

# Install required packages
echo "Installing required packages..."
sudo apt install -y nginx certbot python3-certbot-nginx ufw nodejs npm

# Create project directory
echo "Creating project directory..."
sudo mkdir -p /var/www/leads
sudo chown -R $USER:$USER /var/www/leads

# Setup Nginx
echo "Setting up Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/leads
sudo ln -s /etc/nginx/sites-available/leads /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Configure firewall
echo "Configuring firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

# Test Nginx configuration
echo "Testing Nginx configuration..."
sudo nginx -t

# Restart Nginx
echo "Restarting Nginx..."
sudo systemctl restart nginx

# Setup SSL certificate
echo "Setting up SSL certificate..."
sudo certbot --nginx -d leads.wwon.com.br --non-interactive --agree-tos --email your-email@example.com

# Setup automatic SSL renewal
echo "Setting up automatic SSL renewal..."
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo "Installation complete!"