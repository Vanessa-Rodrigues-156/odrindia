# Production Deployment Guide for ODR India

This guide outlines the steps to deploy the ODR India platform to production with secure settings and optimal performance.

## Prerequisites

- Node.js v18+ or Bun 1.0+
- PostgreSQL database
- Domain name with SSL certificate
- Web server (Nginx recommended)

## Environment Setup

1. Copy the example environment file:

```bash
cp env.production.example .env.production
```

2. Edit `.env.production` and set the following:

```
# Database connection string - use your actual production database
DATABASE_URL="postgresql://username:password@hostname:5432/odrindia"

# Environment
NODE_ENV="production"

# Next.js
NEXT_PUBLIC_APP_URL="https://your-domain.com" # Replace with actual domain

# Jitsi configuration
NEXT_PUBLIC_JITSI_SERVER="meet.jit.si" # Or your self-hosted Jitsi domain
NEXT_PUBLIC_JITSI_ROOM_PREFIX="odrindia-"

# Session security - generate strong random values
SESSION_SECRET="generate-a-strong-random-string-here"
SESSION_DURATION_HOURS=24

# API security
API_RATE_LIMIT="100"
API_RATE_LIMIT_WINDOW_MS="900000"
```

## Build Process

1. Install dependencies:

```bash
# Using npm
npm ci --production

# Or using Bun
bun install --production
```

2. Generate Prisma client:

```bash
npx prisma generate
```

3. Build the application:

```bash
npm run build
```

## Database Migration

Deploy all pending migrations to the production database:

```bash
npx prisma migrate deploy
```

## Running in Production

### Option 1: Standalone Server

Start the standalone server:

```bash
NODE_ENV=production npm start
```

This will start the Next.js server on port 3000. You'll need a process manager like PM2 to keep it running:

```bash
npm install -g pm2
pm2 start npm --name "odrindia" -- start
```

### Option 2: Docker Deployment

1. Build the Docker image:

```bash
docker build -t odrindia:production .
```

2. Run the container:

```bash
docker run -d -p 3000:3000 --name odrindia \
  --env-file .env.production \
  odrindia:production
```

## Nginx Configuration

Create an Nginx configuration for SSL termination and proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /path/to/chain.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Proxy to Next.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Special handling for Jitsi Meet WebSocket connections
    location /xmpp-websocket {
        proxy_pass https://meet.jit.si/xmpp-websocket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Jitsi Meet Configuration

### Using External Jitsi Meet (meet.jit.si)

The default configuration uses the public Jitsi Meet server (meet.jit.si). For production usage with sensitive meetings, consider:

1. Self-hosting Jitsi Meet on your own server
2. Using a paid Jitsi Meet service with SLA
3. Implementing additional security measures like meeting passwords

## Monitoring and Maintenance

1. Set up monitoring for the application:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

2. Implement regular database backups:

```bash
# Example PostgreSQL backup script
pg_dump -U username -d odrindia > backup_$(date +%Y-%m-%d).sql
```

## Security Considerations

1. Always keep dependencies updated:

```bash
npm audit
npm update
```

2. Regularly rotate session secrets
3. Implement rate limiting for API routes
4. Set up fail2ban to protect against brute force attacks
5. Consider Web Application Firewall (WAF) protection

## Support and Troubleshooting

For issues related to:

- **Database**: Check PostgreSQL logs at `/var/log/postgresql/postgresql-*.log`
- **Application**: Check PM2 logs with `pm2 logs odrindia`
- **Web Server**: Check Nginx logs at `/var/log/nginx/error.log`
- **Jitsi Meet**: If self-hosting, check Jitsi logs in the respective containers/services

## Deployment Checklist

Before going live, verify:

- [ ] Database migrations are applied
- [ ] Environment variables are correctly set
- [ ] SSL certificates are valid and not expiring soon
- [ ] Authentication system is working properly
- [ ] Jitsi integration works as expected
- [ ] All API routes return proper responses
- [ ] Error pages are configured correctly
- [ ] Monitoring is set up
- [ ] Backup procedures are in place
