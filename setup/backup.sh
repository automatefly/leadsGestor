#!/bin/bash

# Exit on error
set -e

# Create backup directory if it doesn't exist
BACKUP_DIR="/var/backups/leads"
sudo mkdir -p $BACKUP_DIR

# Create timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Backup the application files
echo "Backing up application files..."
sudo tar -czf $BACKUP_DIR/leads_$TIMESTAMP.tar.gz /var/www/leads

# Keep only last 7 backups
echo "Cleaning old backups..."
cd $BACKUP_DIR
ls -t | tail -n +8 | xargs -r rm

echo "Backup complete!"