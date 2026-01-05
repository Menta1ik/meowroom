import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

// Parse the project ref from the URL
const supabaseUrl = 'https://gejurwazpghthhecxvow.supabase.co';
const projectRef = 'gejurwazpghthhecxvow';
const password = 'sb_secret_Z_hTNOMwfZPxEeurCbQ6Og_WqDDCQfu';

// Connection string
// Try direct connection first
const connectionString = `postgres://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`;

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false } // Supabase requires SSL
});

async function runMigration() {
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully!');

    const sqlPath = path.join(process.cwd(), 'supabase/migrations/20250102_booking_system_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Running migration...');
    await client.query(sql);
    console.log('Migration completed successfully!');

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

runMigration();
