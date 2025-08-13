# Deployment Guide - Email Collector

## Local Development

### 1. Prerequisites
- Node.js 18+
- MySQL Server 8.0+
- Git

### 2. Setup Steps

```bash
# Clone repository
git clone <your-repo-url>
cd email-collector

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local with your MySQL credentials

# Setup database (optional - app will auto-create)
npm run setup-db

# Start development server
npm run dev
```

## Production Deployment

### Option 1: Traditional Server (VPS/Dedicated)

#### 1. Server Requirements
- Ubuntu 20.04+ / CentOS 8+
- Node.js 18+
- MySQL 8.0+
- Nginx (recommended)
- PM2 (process manager)

#### 2. Installation Steps

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Install PM2
sudo npm install -g pm2

# Clone and setup application
git clone <your-repo-url>
cd email-collector
npm install
npm run build

# Setup environment
cp .env.local.example .env.production.local
# Edit with production values

# Setup database
npm run setup-db

# Start with PM2
pm2 start npm --name "email-collector" -- start
pm2 save
pm2 startup
```

#### 3. Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: Docker Deployment

#### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### 2. Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=mysql
      - DB_USER=root
      - DB_PASSWORD=your_password
      - DB_NAME=email_collector
      - DB_PORT=3306
    depends_on:
      - mysql

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=your_password
      - MYSQL_DATABASE=email_collector
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

volumes:
  mysql_data:
```

#### 3. Deploy with Docker

```bash
# Build and run
docker-compose up -d

# Check logs
docker-compose logs -f app
```

### Option 3: Cloud Platforms

#### Vercel (Recommended for Next.js)

1. **Setup Database**: Use PlanetScale, Railway, or AWS RDS
2. **Deploy**: Connect GitHub repo to Vercel
3. **Environment Variables**: Add in Vercel dashboard
4. **Custom Domain**: Configure in Vercel settings

#### Railway

1. **Create Project**: Import from GitHub
2. **Add MySQL**: Add MySQL service
3. **Environment Variables**: Configure in Railway dashboard
4. **Deploy**: Automatic deployment on push

#### AWS (EC2 + RDS)

1. **RDS Setup**: Create MySQL RDS instance
2. **EC2 Setup**: Launch EC2 instance
3. **Application**: Follow traditional server steps
4. **Load Balancer**: Setup ALB for high availability

## Environment Variables

### Development (.env.local)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=email_collector
DB_PORT=3306
```

### Production (.env.production.local)
```env
DB_HOST=your-production-host
DB_USER=your-production-user
DB_PASSWORD=your-secure-password
DB_NAME=email_collector
DB_PORT=3306
NODE_ENV=production
```

## Database Backup

### Manual Backup
```bash
mysqldump -u root -p email_collector > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Automated Backup Script
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u root -p$DB_PASSWORD email_collector > /backups/email_collector_$DATE.sql
find /backups -name "email_collector_*.sql" -mtime +7 -delete
```

## Monitoring

### Health Check Endpoint
Add to your application:
```javascript
// pages/api/health.js
export default function handler(req, res) {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
}
```

### PM2 Monitoring
```bash
pm2 monit
pm2 logs email-collector
pm2 restart email-collector
```

## Security Considerations

1. **Database Security**
   - Use strong passwords
   - Limit database user permissions
   - Enable SSL connections

2. **Application Security**
   - Keep dependencies updated
   - Use HTTPS in production
   - Implement rate limiting

3. **Server Security**
   - Regular security updates
   - Firewall configuration
   - SSH key authentication

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL service status
   - Verify credentials in .env
   - Check firewall settings

2. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies

3. **Performance Issues**
   - Enable database indexing
   - Implement caching
   - Optimize queries

### Logs Location
- Application logs: PM2 logs or Docker logs
- MySQL logs: `/var/log/mysql/error.log`
- Nginx logs: `/var/log/nginx/`