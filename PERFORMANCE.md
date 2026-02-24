# Production Performance Optimization Guide

## Overview
This guide covers performance optimization strategies for the Civic Pulse application.

## Frontend Optimization

### Build Optimization
✅ **Implemented:**
- Code splitting (React, Bootstrap vendors)
- Tree shaking
- Minification with Terser
- Asset optimization
- CSS code splitting
- Gzip compression

### Vite Configuration
```javascript
// Configured in vite.config.js
- Manual chunks for vendors
- Asset inline limit: 4KB
- Compressed size reporting
- Cache busting with hashes
```

### Performance Targets
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1

### Monitoring
```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --upload.target=temporary-public-storage

# Bundle analyzer
npm run build -- --analyze
```

## Backend Optimization

### Node.js Performance
- Use cluster mode (PM2 or native)
- Enable HTTP/2
- Connection pooling
- Caching strategies

### Database Optimization
```javascript
// MongoDB best practices
- Create indexes for frequent queries
- Use projection to limit fields
- Implement pagination
- Use aggregation pipelines efficiently
- Enable connection pooling
```

### Example Indexes
```javascript
// User collection
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ createdAt: -1 })

// Grievances collection
db.grievances.createIndex({ userId: 1, status: 1 })
db.grievances.createIndex({ createdAt: -1 })
db.grievances.createIndex({ location: "2dsphere" })
```

### Caching Strategy

#### Redis (Recommended)
```javascript
// Cache frequently accessed data
- User sessions: 24h TTL
- API responses: 5-60min TTL
- Database queries: 10-30min TTL
```

#### In-Memory Cache
```javascript
// For small datasets
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
```

## API Optimization

### Request Optimization
- Implement API versioning
- Use compression middleware
- Implement ETags
- Use HTTP caching headers
- Paginate large datasets

### Response Optimization
```javascript
// Compression
app.use(compression({
  level: 6,
  threshold: 1024,
}));

// ETags
app.set('etag', 'strong');

// Cache headers
res.set('Cache-Control', 'public, max-age=300');
```

### GraphQL (Optional Future Enhancement)
Consider GraphQL for:
- Flexible queries
- Reduced over-fetching
- Better mobile performance

## Asset Delivery

### CDN Configuration
```nginx
# Serve static assets from CDN
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Image Optimization
- Use WebP format with fallbacks
- Implement lazy loading
- Serve responsive images
- Use image CDN (Cloudinary, imgix)

```html
<!-- Example responsive image -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.jpg" type="image/jpeg">
  <img src="image.jpg" alt="..." loading="lazy">
</picture>
```

## Container Optimization

### Docker Image Size
✅ **Implemented:**
- Multi-stage builds
- Alpine base images
- Minimal dependencies
- Layer optimization

### Best Practices
```dockerfile
# Separate dependency and build stages
# Use .dockerignore
# Combine RUN commands
# Clean up in same layer
```

## Monitoring & Profiling

### Application Monitoring
```bash
# PM2 monitoring
pm2 monit
pm2 status
pm2 logs --lines 100

# Docker monitoring
docker stats
docker-compose top
```

### Node.js Profiling
```javascript
// CPU profiling
node --prof app.js
node --prof-process isolate-0x*.log > processed.txt

// Memory profiling
node --inspect app.js
# Use Chrome DevTools
```

### Database Monitoring
```javascript
// Enable MongoDB profiling
db.setProfilingLevel(1, { slowms: 100 })

// View slow queries
db.system.profile.find().limit(10).sort({ ts: -1 })
```

## Load Testing

### Tools
- Apache Bench (ab)
- wrk
- Artillery
- k6

### Example Load Test
```bash
# Apache Bench
ab -n 10000 -c 100 http://localhost:3000/api/health

# Artillery
artillery quick --count 100 --num 50 http://localhost:3000/

# k6
k6 run --vus 100 --duration 30s loadtest.js
```

### Load Test Script (k6)
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '30s',
};

export default function () {
  const res = http.get('http://localhost:3000/api/health');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

## Scaling Strategies

### Horizontal Scaling
```bash
# PM2
pm2 scale app +3

# Docker
docker-compose up -d --scale server=5

# Kubernetes
kubectl scale deployment civic-pulse-server --replicas=5
```

### Vertical Scaling
```javascript
// Increase resources
PM2: max_memory_restart: '2G'
Docker: memory: "1024Mi", cpu: "1000m"
```

### Auto-scaling (Kubernetes)
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: civic-pulse-server-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: civic-pulse-server
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Performance Checklist

### Frontend
- [ ] Code splitting enabled
- [ ] Assets optimized and compressed
- [ ] Lazy loading implemented
- [ ] Service worker for caching
- [ ] CDN for static assets
- [ ] Image optimization
- [ ] Font optimization
- [ ] Critical CSS inlined

### Backend
- [ ] Database indexes created
- [ ] Caching strategy implemented
- [ ] Connection pooling enabled
- [ ] Compression enabled
- [ ] Rate limiting active
- [ ] Cluster mode for Node.js
- [ ] Query optimization
- [ ] Efficient algorithms

### Infrastructure
- [ ] Load balancer configured
- [ ] Auto-scaling setup
- [ ] CDN configured
- [ ] Database replication
- [ ] Monitoring active
- [ ] Alerting configured

## Benchmarks

### Expected Performance
```
Frontend (Lighthouse):
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

Backend:
- API Response Time: < 200ms (avg)
- Throughput: > 1000 req/s
- Error Rate: < 0.1%
- Availability: > 99.9%

Database:
- Query Time: < 50ms (avg)
- Connection Pool: 10-100
- Index Hit Ratio: > 95%
```

## Continuous Optimization

### Regular Tasks
- **Weekly:** Review performance metrics
- **Monthly:** Update and optimize dependencies
- **Quarterly:** Conduct load testing
- **Quarterly:** Review and optimize queries
- **Annually:** Major performance audit

## Tools & Resources

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [GTmetrix](https://gtmetrix.com/)
- [New Relic](https://newrelic.com/)
- [DataDog](https://www.datadoghq.com/)
- [Grafana](https://grafana.com/)
