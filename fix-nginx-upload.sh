#!/bin/bash

# Script to fix nginx 413 error for annhurst-ts.com

echo "=== Finding nginx config for annhurst-ts.com ==="

# Find config files
CONFIG_FILES=$(sudo find /etc/nginx -name "*.conf" -exec grep -l "annhurst-ts.com" {} \; 2>/dev/null)

if [ -z "$CONFIG_FILES" ]; then
    echo "No config files found. Checking common locations..."
    ls -la /etc/nginx/sites-available/ 2>/dev/null
    ls -la /etc/nginx/sites-enabled/ 2>/dev/null
    ls -la /etc/nginx/conf.d/ 2>/dev/null
    exit 1
fi

echo "Found config files:"
echo "$CONFIG_FILES"
echo ""

# Check current setting
echo "=== Checking current client_max_body_size setting ==="
sudo nginx -T 2>/dev/null | grep -A 10 "server_name annhurst-ts.com" | grep client_max_body_size || echo "No client_max_body_size found for annhurst-ts.com"

echo ""
echo "=== To fix, edit the config file and add inside the server block for annhurst-ts.com: ==="
echo ""
echo "    client_max_body_size 200M;"
echo "    client_body_buffer_size 200M;"
echo ""
echo "Then run: sudo nginx -t && sudo systemctl reload nginx"

