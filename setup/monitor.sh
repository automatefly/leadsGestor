#!/bin/bash

# Check Nginx status
echo "Nginx Status:"
sudo systemctl status nginx | grep "Active:"

# Check SSL certificate expiry
echo -e "\nSSL Certificate Status:"
sudo certbot certificates

# Check disk usage
echo -e "\nDisk Usage:"
df -h /var/www/leads

# Check memory usage
echo -e "\nMemory Usage:"
free -h

# Check running processes
echo -e "\nTop Processes:"
ps aux --sort=-%mem | head -n 6