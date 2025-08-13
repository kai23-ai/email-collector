const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '3306'),
  };

  const dbName = process.env.DB_NAME || 'email_collector';

  try {
    console.log('🔄 Connecting to MySQL server...');
    const connection = await mysql.createConnection(config);

    console.log('✅ Connected to MySQL server');
    console.log('🔄 Creating database...');
    
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✅ Database '${dbName}' created or already exists`);

    await connection.query(`USE ${dbName}`);
    console.log(`✅ Using database '${dbName}'`);

    console.log('🔄 Creating emails table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS emails (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_created_at (created_at)
      )
    `);
    console.log('✅ Table "emails" created or already exists');

    // Check table structure
    const [rows] = await connection.query('DESCRIBE emails');
    console.log('\n📋 Table structure:');
    console.table(rows);

    // Check existing data
    const [emailRows] = await connection.query('SELECT COUNT(*) as count FROM emails');
    console.log(`\n📊 Current emails in database: ${emailRows[0].count}`);

    await connection.end();
    console.log('\n🎉 Database setup completed successfully!');
    console.log('🚀 You can now run: npm run dev');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Make sure MySQL server is running');
    console.error('2. Check your .env.local file credentials');
    console.error('3. Ensure the MySQL user has CREATE database permissions');
    process.exit(1);
  }
}

setupDatabase();