const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('🔍 Testing database connection...');
  console.log('Config:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ? '***' : '(empty)',
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });

  try {
    // Test basic connection first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    console.log('✅ MySQL connection successful!');

    // Test if database exists
    const [databases] = await connection.query('SHOW DATABASES');
    console.log('📋 Available databases:');
    databases.forEach(db => console.log(`  - ${Object.values(db)[0]}`));

    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'email_collector'}`);
    console.log(`✅ Database '${process.env.DB_NAME || 'email_collector'}' ready`);

    // Use database
    await connection.query(`USE ${process.env.DB_NAME || 'email_collector'}`);

    // Create table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS emails (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table "emails" ready');

    // Test insert
    try {
      await connection.query('INSERT INTO emails (email) VALUES (?)', ['test@example.com']);
      console.log('✅ Test insert successful');
      
      // Clean up test data
      await connection.query('DELETE FROM emails WHERE email = ?', ['test@example.com']);
      console.log('✅ Test cleanup successful');
    } catch (insertError) {
      if (insertError.code === 'ER_DUP_ENTRY') {
        console.log('✅ Duplicate test passed (email already exists)');
      } else {
        throw insertError;
      }
    }

    await connection.end();
    console.log('🎉 All tests passed! Database is ready.');

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n🔧 Solution: Make sure MySQL is running in Laragon');
      console.error('1. Open Laragon');
      console.error('2. Click "Start All" or start MySQL service');
      console.error('3. Wait until MySQL status is green');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n🔧 Solution: Check MySQL credentials');
      console.error('1. Try empty password for root user');
      console.error('2. Or check Laragon MySQL settings');
    }
  }
}

testConnection();