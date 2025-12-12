# Fixing 413 Error on Production Server

## Current Issue
Nginx is blocking uploads larger than ~1MB. The error shows:
```
client intended to send too large body: 4620057 bytes
server: annhurst-ts.com
```

This means `client_max_body_size` is not properly configured for the `annhurst-ts.com` server block. The default nginx limit is 1MB, which is why your 4.6MB file is being rejected.

## Step-by-Step Fix

### 1. Find Your Nginx Configuration File

SSH into your server and find the config file for `annhurst-ts.com`:

```bash
# Find the config file
sudo find /etc/nginx -name "*.conf" -exec grep -l "annhurst-ts.com" {} \;

# Or check common locations
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/
ls -la /etc/nginx/conf.d/
```

### 2. Edit the Correct Configuration File

Once you find the file (likely `/etc/nginx/sites-available/annhurst-ts.com` or similar), edit it:

```bash
sudo nano /etc/nginx/sites-available/annhurst-ts.com
# or
sudo nano /etc/nginx/conf.d/annhurst-ts.com.conf
```

### 3. Add/Update client_max_body_size

Find the `server` block for `annhurst-ts.com` (not `mail.annhurst-ts.com`). It should look like:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name annhurst-ts.com www.annhurst-ts.com;
    
    # ADD THESE LINES HERE (inside the server block):
    client_max_body_size 200M;
    client_body_buffer_size 200M;
    client_body_timeout 300s;
    
    # ... rest of config ...
}
```

**IMPORTANT**: Make sure you're editing the `annhurst-ts.com` server block, NOT the `mail.annhurst-ts.com` block.

### 4. Also Check Global Nginx Config (if needed)

If the setting doesn't work, check the main nginx config:

```bash
sudo nano /etc/nginx/nginx.conf
```

Add in the `http` block (not inside a server block):

```nginx
http {
    # ... other settings ...
    
    client_max_body_size 200M;
    client_body_buffer_size 200M;
    
    # ... rest of config ...
}
```

### 5. Test and Reload Nginx

```bash
# Test the configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
# or
sudo systemctl restart nginx
```

### 6. Verify the Setting

Check if the setting is active:

```bash
# Check nginx config
sudo nginx -T | grep client_max_body_size
```

You should see `client_max_body_size 200M;` in the output.

### 7. Check for Multiple Config Files

Sometimes there are multiple config files. Make sure the one you edited is the one being used:

```bash
# Check which config files are included
sudo nginx -T | grep -A 5 "server_name annhurst-ts.com"
```

## Quick Diagnostic Commands

Run these commands on your server to find and fix the issue:

```bash
# 1. Check current nginx config for annhurst-ts.com
sudo nginx -T 2>/dev/null | grep -A 15 "server_name annhurst-ts.com" | head -20

# 2. Find which config file contains annhurst-ts.com
sudo grep -r "server_name.*annhurst-ts.com" /etc/nginx/ --include="*.conf"

# 3. Check if client_max_body_size is set
sudo nginx -T 2>/dev/null | grep -B 5 -A 10 "server_name annhurst-ts.com" | grep client_max_body_size
```

## Quick Fix Commands

Once you find the config file, use one of these methods:

### Method 1: Manual Edit (Recommended)
```bash
# Edit the config file (replace with your actual file path)
sudo nano /etc/nginx/sites-available/annhurst-ts.com
# or
sudo nano /etc/nginx/conf.d/annhurst-ts.com.conf

# Add these lines INSIDE the server block for annhurst-ts.com:
#     client_max_body_size 200M;
#     client_body_buffer_size 200M;
#     client_body_timeout 300s;

# Save and test
sudo nginx -t && sudo systemctl reload nginx
```

### Method 2: Automated Fix (if config structure is standard)
```bash
# This adds the setting after the server_name line
# Replace the path with your actual config file path
CONFIG_FILE="/etc/nginx/sites-available/annhurst-ts.com"  # Change this!

# Check if file exists
if [ -f "$CONFIG_FILE" ]; then
    # Add setting if not already present
    if ! grep -q "client_max_body_size" "$CONFIG_FILE"; then
        sudo sed -i '/server_name.*annhurst-ts.com/a\    client_max_body_size 200M;\n    client_body_buffer_size 200M;' "$CONFIG_FILE"
        sudo nginx -t && sudo systemctl reload nginx
    else
        echo "Setting already exists. Check if it's in the correct server block."
    fi
else
    echo "Config file not found. Please find it first using the diagnostic commands above."
fi
```

## Troubleshooting

If it still doesn't work:

1. **Check if config is symlinked correctly:**
   ```bash
   ls -la /etc/nginx/sites-enabled/ | grep annhurst
   ```

2. **Check nginx error logs in real-time:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Verify which server block is handling the request:**
   - The error shows `server: annhurst-ts.com` - make sure that exact server block has the setting

4. **Check for location blocks that might override:**
   ```bash
   sudo nginx -T | grep -A 20 "server_name annhurst-ts.com"
   ```

## After Fix

Once configured, test by uploading a file. The 413 error should be resolved.

