# Server Configuration for File Uploads

## Issue: 413 Request Entity Too Large

When uploading large files (videos, audio), you may encounter `413 Request Entity Too Large` errors. This requires server-side configuration.

## Required Server Configuration

### 1. Nginx Configuration (if using nginx as reverse proxy)

Add or update the following in your nginx configuration file (usually `/etc/nginx/sites-available/your-site` or `/etc/nginx/nginx.conf`):

```nginx
server {
    # ... other config ...
    
    # Increase client body size limit to 200MB
    client_max_body_size 200M;
    
    # Increase buffer sizes
    client_body_buffer_size 200M;
    
    # Increase timeouts for large uploads
    client_body_timeout 300s;
    proxy_read_timeout 300s;
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;
    
    location / {
        proxy_pass http://localhost:3000; # or your Next.js port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

After updating, restart nginx:
```bash
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### 2. Next.js Configuration

The `next.config.ts` has been updated with:
```typescript
experimental: {
  serverActions: {
    bodySizeLimit: '200mb',
  },
}
```

### 3. PM2/Process Manager (if using)

If using PM2 or similar, ensure it's not limiting request sizes.

### 4. Node.js/Express (if applicable)

If you have a custom server, ensure body parser limits are increased.

## File Size Limits

- **Videos**: Up to 100MB
- **Audio**: Up to 50MB  
- **PDFs**: Up to 10MB (via `/api/upload`)

## Testing

After configuration, test by uploading a file. If you still get 413 errors, check:
1. Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
2. Next.js logs
3. Verify nginx config: `sudo nginx -t`

## Notes

- The MediaRecorder has been optimized to use lower bitrates to reduce file sizes
- Recorded files (webm) are now properly validated
- Error messages have been improved to help diagnose issues

