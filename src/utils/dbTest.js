import pool from '../config/database.js';

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW()');
    console.log('Current timestamp:', result.rows[0].now);
    
    client.release();
  } catch (err) {
    console.error('Database connection failed:', err);
  } finally {
    await pool.end();
  }
}

testConnection(); 