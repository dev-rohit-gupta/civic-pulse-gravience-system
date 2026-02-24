# Production Deployment Guide

## Prerequisites

- Node.js 22.16.0 or higher
- MongoDB 8.0 or higher
- Docker & Docker Compose (optional)
- PM2 (for production process management)

## Environment Setup

1. **Copy environment files:**
   ```bash
   cp .env.example .env
   cp apps/client/.env.example apps/client/.env
   ```

2. **Configure environment variables:**
   - Update `.env` with your production values
   - Set strong secrets for JWT_SECRET and other sensitive data
   - Configure database connection strings
   - Set up AWS credentials if using S3
   - Add Google AI API key

## Local Production Build

### Using Node.js

```bash
# Install dependencies
npm ci

# Build all packages
npm run build:prod

# Start server with PM2
pm2 start ecosystem.config.js --env production

# Or start manually
cd apps/server
npm run start:prod
```

### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Deployment Options

### Option 1: Traditional VPS Deployment

1. **Install dependencies on server:**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 22.16.0
   npm install -g pm2
   ```

2. **Clone and setup:**
   ```bash
   git clone <your-repo>
   cd civic-pulse-gravience-system
   npm ci
   npm run build:prod
   ```

3. **Configure PM2:**
   ```bash
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

4. **Setup Nginx reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           root /path/to/apps/client/dist;
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Option 2: Docker Deployment

```bash
# Build images
docker-compose -f docker-compose.yml build

# Start services
docker-compose up -d

# Scale server instances
docker-compose up -d --scale server=3
```

### Option 3: Container Orchestration (Kubernetes)

See `k8s/` directory for Kubernetes manifests (to be created if needed).

## Production Checklist

### Security
- [ ] All environment variables are set with strong secrets
- [ ] CORS is configured with specific origins
- [ ] Rate limiting is enabled
- [ ] HTTPS/TLS is configured
- [ ] Security headers are set
- [ ] JWT tokens are using strong secrets
- [ ] Database has authentication enabled
- [ ] No sensitive data in logs

### Performance
- [ ] Static assets are served with proper caching
- [ ] Gzip compression is enabled
- [ ] CDN is configured (if applicable)
- [ ] Database indexes are created
- [ ] Connection pooling is configured
- [ ] Memory limits are set

### Monitoring
- [ ] Application logs are collected
- [ ] Error tracking is set up (Sentry, etc.)
- [ ] Performance monitoring is configured
- [ ] Health checks are working
- [ ] Uptime monitoring is set up

### Backup
- [ ] Database backups are automated
- [ ] Backup restoration is tested
- [ ] File uploads are backed up
- [ ] Configuration is version controlled

## Monitoring

### View PM2 Status
```bash
pm2 status
pm2 logs civic-pulse-server
pm2 monit
```

### Docker Health Checks
```bash
docker-compose ps
docker-compose logs -f server
```

### Application Health
```bash
# Server health
curl http://localhost:3000/health

# Client health
curl http://localhost:80/health
```

## Scaling

### Horizontal Scaling (Multiple Instances)

**With PM2:**
```bash
pm2 scale civic-pulse-server +2
```

**With Docker:**
```bash
docker-compose up -d --scale server=5
```

### Vertical Scaling
Update memory limits in `ecosystem.config.js` or `docker-compose.yml`

## Rollback Strategy

```bash
# PM2
pm2 stop civic-pulse-server
git checkout <previous-commit>
npm ci
npm run build:prod
pm2 restart civic-pulse-server

# Docker
docker-compose down
git checkout <previous-commit>
docker-compose up -d --build
```

## Troubleshooting

### Server won't start
- Check logs: `pm2 logs` or `docker-compose logs server`
- Verify environment variables
- Check database connectivity
- Ensure port 3000 is available

### Build failures
- Clear build cache: `npm run clean`
- Remove node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

### Performance issues
- Check memory usage: `pm2 monit`
- Review database query performance
- Enable production optimizations
- Scale horizontally if needed

## Maintenance

### Update Dependencies
```bash
npm audit
npm audit fix
npm update
```

### Database Maintenance
```bash
# Backup
mongodump --uri="mongodb://localhost:27017/civic-pulse"

# Restore
mongorestore --uri="mongodb://localhost:27017/civic-pulse" dump/
```

### Log Rotation
PM2 handles log rotation automatically. For manual setup:
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

## Support

For issues and questions:
- GitHub Issues: [Your repo issues URL]
- Documentation: See `docs/` directory
- Team Contact: team skoiv
