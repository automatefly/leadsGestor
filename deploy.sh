#!/bin/bash

# Build the application
npm run build

# Create archive
tar -czf dist.tar.gz dist/

# Copy to server (replace with your server details)
scp dist.tar.gz root@leads.wwon.com.br:/var/www/leads/

# SSH into server and deploy
ssh root@leads.wwon.com.br << 'ENDSSH'
cd /var/www/leads
tar -xzf dist.tar.gz
rm dist.tar.gz
ENDSSH