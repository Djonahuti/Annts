# Commands to Fix Nginx Config

## Your Config File
- `/etc/nginx/sites-available/nextjs.conf`
- Also symlinked at `/etc/nginx/sites-enabled/nextjs.conf`

## Step 1: View Current Config

```bash
sudo cat /etc/nginx/sites-available/nextjs.conf
```

Or view just the annhurst-ts.com server block:

```bash
sudo grep -A 30 "server_name.*annhurst-ts.com" /etc/nginx/sites-available/nextjs.conf
```

## Step 2: Edit the Config File

```bash
sudo nano /etc/nginx/sites-available/nextjs.conf
```

## Step 3: Find and Update the Server Block

Look for the `server` block that contains:
```nginx
server_name annhurst-ts.com
```

Add these lines **inside** that server block (right after `server_name` or at the beginning of the server block):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name annhurst-ts.com www.annhurst-ts.com;
    
    # ADD THESE LINES HERE:
    client_max_body_size 200M;
    client_body_buffer_size 200M;
    client_body_timeout 300s;
    
    # ... rest of your existing config ...
}
```

**Important**: Make sure these lines are inside the `server { }` block for `annhurst-ts.com`, not outside it.

## Step 4: Save and Test

In nano:
- Press `Ctrl + O` to save
- Press `Enter` to confirm
- Press `Ctrl + X` to exit

Then test and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Step 5: Verify

```bash
sudo nginx -T | grep -A 15 "server_name.*annhurst-ts.com" | grep -E "(client_max_body_size|server_name)"
```

You should see `client_max_body_size 200M;` in the output.

## Alternative: Quick One-Liner Fix

If you want to add it automatically (be careful - backup first):

```bash
# Backup first
sudo cp /etc/nginx/sites-available/nextjs.conf /etc/nginx/sites-available/nextjs.conf.backup

# Add the setting after server_name line for annhurst-ts.com
sudo sed -i '/server_name.*annhurst-ts.com/a\    client_max_body_size 200M;\n    client_body_buffer_size 200M;\n    client_body_timeout 300s;' /etc/nginx/sites-available/nextjs.conf

# Test and reload
sudo nginx -t && sudo systemctl reload nginx
```

## If You Have SSL/HTTPS

If you also have an HTTPS server block (with `listen 443`), add the same settings there too:

```bash
sudo grep -A 30 "listen.*443" /etc/nginx/sites-available/nextjs.conf
```

Add the same `client_max_body_size` settings to that server block as well.

