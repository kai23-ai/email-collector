#!/usr/bin/env node

/**
 * Test script untuk Railway endpoints
 * Usage: node test-endpoints.js
 */

const https = require('https');

const RAILWAY_URL = 'https://email-collector-production.up.railway.app';

function testEndpoint(path, description) {
  return new Promise((resolve) => {
    const url = `${RAILWAY_URL}${path}`;
    console.log(`\n🔍 Testing ${description}...`);
    console.log(`URL: ${url}`);
    
    const startTime = Date.now();
    
    https.get(url, (res) => {
      const duration = Date.now() - startTime;
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Status: ${res.statusCode}`);
        console.log(`⏱️  Response time: ${duration}ms`);
        
        try {
          const jsonData = JSON.parse(data);
          console.log(`📄 Response:`, JSON.stringify(jsonData, null, 2));
        } catch (e) {
          console.log(`📄 Response: ${data.substring(0, 200)}${data.length > 200 ? '...' : ''}`);
        }
        
        resolve({
          success: res.statusCode === 200,
          statusCode: res.statusCode,
          duration,
          data
        });
      });
    }).on('error', (err) => {
      const duration = Date.now() - startTime;
      console.log(`❌ Error: ${err.message}`);
      console.log(`⏱️  Duration: ${duration}ms`);
      
      resolve({
        success: false,
        error: err.message,
        duration
      });
    });
  });
}

async function runTests() {
  console.log('🚀 Testing Railway Email Collector Endpoints');
  console.log('=' .repeat(50));
  
  const tests = [
    { path: '/api/health', description: 'Health Check' },
    { path: '/api/keep-alive', description: 'Keep-Alive' },
    { path: '/', description: 'Main App (should redirect to login)' }
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testEndpoint(test.path, test.description);
    results.push({ ...test, ...result });
    
    // Wait 1 second between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 Test Summary');
  console.log('=' .repeat(50));
  
  let allPassed = true;
  results.forEach((result, index) => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${index + 1}. ${result.description}: ${status} (${result.duration}ms)`);
    if (!result.success) {
      allPassed = false;
      console.log(`   Error: ${result.error || `HTTP ${result.statusCode}`}`);
    }
  });
  
  console.log('\n🎯 Recommendations:');
  if (allPassed) {
    console.log('✅ All endpoints working! You can safely setup external monitoring.');
    console.log('📋 Next steps:');
    console.log('   1. Setup UptimeRobot with 30-minute interval');
    console.log('   2. Setup Cron-job.org with 25-minute interval (active hours only)');
    console.log('   3. Monitor Railway credit usage');
  } else {
    console.log('❌ Some endpoints failed. Check Railway deployment status.');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Check Railway logs');
    console.log('   2. Verify database connection');
    console.log('   3. Ensure latest code is deployed');
  }
  
  console.log(`\n🌐 Railway URL: ${RAILWAY_URL}`);
  console.log('📖 See monitoring-setup.md for detailed setup instructions');
}

// Run tests
runTests().catch(console.error);