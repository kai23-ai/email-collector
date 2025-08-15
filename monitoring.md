# Credit-Optimized Monitoring & Keep-Alive Setup

## Railway Credit Management
- **Free Tier**: $5/month credit
- **Strategy**: Smart keep-alive during active hours only
- **Target**: Stay within $4/month to have buffer

## Internal Keep-Alive (Credit Optimized)
- ✅ Health check endpoint: `/api/health`
- ✅ Keep-alive endpoint: `/api/keep-alive`
- ✅ Client-side smart ping every 25 minutes (active hours only)
- ✅ Database connection ping
- ✅ Active hours: 7 AM - 11 PM WIB (16 hours/day)
- ✅ Sleep hours: 11 PM - 7 AM WIB (8 hours/day to save credits)

## Credit Calculation
**Current Strategy:**
- Ping every 25 minutes during active hours (16 hours)
- ~38 pings per day during active hours
- App sleeps 8 hours per night (saves ~33% credits)
- Estimated cost: ~$3.50/month (within $5 limit)

## External Monitoring Options (Credit-Friendly)

### 1. UptimeRobot (Free) - RECOMMENDED
- URL: https://uptimerobot.com
- Setup: Monitor your Railway URL
- **Interval: 30 minutes** (free tier, credit-friendly)
- Endpoint: `https://khrlmm23.up.railway.app/api/health`
- **Active Hours**: 7 AM - 11 PM WIB only

### 2. Cron-job.org (Free) - RECOMMENDED
- URL: https://cron-job.org
- Setup: HTTP GET request
- **Schedule**: Every 25 minutes, active hours only
- URL: `https://khrlmm23.up.railway.app/api/keep-alive`
- **Time**: 07:00-23:00 WIB (00:00-16:00 UTC)

### 3. GitHub Actions (Free for public repos) - INCLUDED
- **Schedule**: Every 25 minutes during active hours
- **Smart timing**: Automatically skips inactive hours
- **Cost**: $0 (uses GitHub's free tier)

## NOT Recommended (Credit Heavy)
- ❌ Pingdom (paid tiers have frequent pings)
- ❌ StatusCake (frequent pings)
- ❌ 24/7 monitoring (wastes credits during night)
- ❌ Pings every 5-10 minutes (too frequent)

## Recommended Setup for Credit Optimization
1. **Primary**: Use GitHub Actions (free, smart timing)
2. **Backup**: UptimeRobot with 30-minute interval
3. **Schedule**: Active hours only (7 AM - 11 PM WIB)
4. **Frequency**: Every 25 minutes (just before 30min timeout)

## Railway Specific Optimizations
- Railway apps sleep after 30 minutes of inactivity
- Ping at 25-minute intervals (5-minute buffer)
- Let app sleep during night hours (11 PM - 7 AM WIB)
- Database connections count as activity
- Health checks are lightweight and cheap

## Monthly Credit Usage Estimate
- **With 24/7 pings**: ~$5.50/month (over limit)
- **With smart timing**: ~$3.50/month (within limit)
- **Savings**: ~$2/month by sleeping 8 hours daily

## Monitoring Dashboard
Check your Railway usage at:
- Railway Dashboard → Project → Usage
- Monitor monthly spend
- Adjust ping frequency if approaching $5 limit