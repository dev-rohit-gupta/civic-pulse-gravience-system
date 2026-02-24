# Security Best Practices

## Overview
This document outlines security measures implemented in the Civic Pulse Grievance System.

## Environment Variables

### Critical: Never commit these files
- `.env`
- `.env.local`
- `.env.production`
- Any file containing secrets

### Required Security Variables
```bash
# Use strong, randomly generated secrets
JWT_SECRET=<64+ character random string>
JWT_REFRESH_SECRET=<64+ character random string>
SESSION_SECRET=<64+ character random string>
MONGODB_PASSWORD=<strong password>
```

### Generate Secure Secrets
```bash
# Generate random secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Authentication & Authorization

### JWT Configuration
- Access tokens expire in 7 days (configurable)
- Refresh tokens expire in 30 days
- Use RS256 for production (asymmetric encryption)
- Rotate secrets periodically

### Password Security
- Bcrypt with 10+ rounds
- Minimum 8 characters
- Require complexity (uppercase, lowercase, numbers, special chars)
- Implement password reset with expiring tokens

## API Security

### Rate Limiting
```javascript
// Implemented limits
- General: 100 requests per 15 minutes per IP
- Auth: 5 login attempts per 15 minutes per IP
- API: 10 requests per second
```

### CORS Configuration
```javascript
// Production: Specific origins only
CORS_ORIGIN=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Security Headers
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (HSTS)
- Content-Security-Policy
- Referrer-Policy

## Database Security

### MongoDB Best Practices
- Enable authentication
- Use strong passwords
- Limit network exposure
- Enable encryption at rest
- Regular backups
- Principle of least privilege for users

### Connection Security
```bash
# Use authentication
MONGODB_URI=mongodb://username:password@host:27017/database?authSource=admin

# Enable SSL/TLS in production
MONGODB_URI=mongodb://host:27017/database?ssl=true
```

## File Upload Security

### Implemented Protection
- File type validation (whitelist)
- File size limits (10MB default)
- Virus scanning (recommended)
- Unique file names (prevent overwrites)
- Separate storage from application code

### Configuration
```bash
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf
```

## Infrastructure Security

### Docker Security
- Non-root user in containers
- Read-only file systems where possible
- Minimal base images (Alpine)
- Security scanning of images
- No secrets in Dockerfiles

### Network Security
- Internal network for services
- Expose only necessary ports
- Use reverse proxy (Nginx)
- Enable HTTPS/TLS
- Implement firewall rules

## Monitoring & Logging

### Security Logging
- Authentication attempts
- Authorization failures
- API rate limit hits
- Suspicious activities
- Error patterns

### Log Security
- No sensitive data in logs
- Secure log storage
- Log rotation
- Centralized logging (recommended)

### Health Monitoring
```bash
# Endpoints
GET /health        # Basic health check
GET /api/health    # Detailed API health
```

## Dependency Security

### Regular Audits
```bash
# Run security audit
npm audit

# Fix vulnerabilities
npm audit fix

# Check for updates
npm outdated
```

### Automated Scanning
- GitHub Dependabot (enabled)
- npm audit in CI/CD pipeline
- SNYK or similar tools (recommended)

## Incident Response

### If Security Breach Occurs:
1. Isolate affected systems
2. Revoke all JWT tokens (rotate secrets)
3. Reset all user passwords
4. Review logs for breach scope
5. Patch vulnerability
6. Notify affected users
7. Document incident

### Regular Security Tasks
- [ ] Weekly: Review security logs
- [ ] Monthly: Update dependencies
- [ ] Quarterly: Rotate secrets
- [ ] Quarterly: Security audit
- [ ] Annually: Penetration testing

## Compliance

### Data Protection
- GDPR compliance (if applicable)
- Data encryption in transit (HTTPS)
- Data encryption at rest
- Right to deletion
- Data export capabilities

### Access Control
- Role-based access control (RBAC)
- Audit trails
- Session management
- Multi-factor authentication (recommended)

## Production Deployment Checklist

### Before Deployment
- [ ] All secrets are unique and strong
- [ ] HTTPS/TLS is configured
- [ ] CORS is restricted to specific origins
- [ ] Rate limiting is enabled
- [ ] Security headers are set
- [ ] Database authentication is enabled
- [ ] File upload validation is active
- [ ] Logs are configured properly
- [ ] Backup strategy is in place
- [ ] Monitoring is set up

### After Deployment
- [ ] Test authentication flows
- [ ] Verify HTTPS is working
- [ ] Check security headers
- [ ] Test rate limiting
- [ ] Verify file upload restrictions
- [ ] Review initial logs
- [ ] Test backup/restore
- [ ] Document access credentials securely

## Security Contacts

**Report Security Issues:**
- Email: security@civic-pulse.com (create this)
- Do not open public GitHub issues for security vulnerabilities
- Use responsible disclosure

**Security Team:**
- Team Skoiv

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
