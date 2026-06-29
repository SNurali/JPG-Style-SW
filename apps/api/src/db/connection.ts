import { Pool, PoolClient } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://smartwash:smartwash@localhost:5433/smartwash',
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database pool error:', err);
});

/**
 * Execute a query against the database.
 */
export async function query<T = any>(text: string, params?: any[]): Promise<{ rows: T[]; rowCount: number | null }> {
  const result = await pool.query(text, params);
  return {
    rows: result.rows as T[],
    rowCount: result.rowCount
  };
}

/**
 * Get a client from the pool for transactions.
 */
export function getClient(): Promise<PoolClient> {
  return pool.connect();
}

/**
 * Run a function within a database transaction.
 */
export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Initialize database: test connection and run schema if needed.
 */
export async function initializeDatabase(): Promise<void> {
  try {
    const result = await pool.query('SELECT NOW() as now');
    console.log('✅ Database connected at', result.rows[0].now);

    // Check if tables exist
    const tableCheck = await pool.query(
      "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products'"
    );
    if (tableCheck.rows[0].count === '0') {
      console.log('📦 Running schema migration...');
      const fs = await import('fs');
      const path = await import('path');
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf-8');
      await pool.query(schema);
      console.log('✅ Schema applied successfully');
    }

    await runMigrations();
  } catch (err) {
    console.error('❌ Database initialization failed:', err);
    throw err;
  }
}

/**
 * Idempotent migrations applied on every startup (safe to re-run).
 * Customer auth: password/google login columns on the existing customers table.
 */
export async function runMigrations(): Promise<void> {
  await pool.query(`
    ALTER TABLE customers ADD COLUMN IF NOT EXISTS password_hash VARCHAR(500);
    ALTER TABLE customers ADD COLUMN IF NOT EXISTS google_id     VARCHAR(255);
    ALTER TABLE customers ADD COLUMN IF NOT EXISTS name           VARCHAR(200);
    ALTER TABLE customers ALTER COLUMN phone DROP NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_email_unique
      ON customers (lower(email)) WHERE email IS NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_google_unique
      ON customers (google_id) WHERE google_id IS NOT NULL;
  `);
  console.log('✅ Migrations applied (customer auth columns)');
}

/**
 * Gracefully close the database pool.
 */
export async function closeDatabase(): Promise<void> {
  await pool.end();
  console.log('🔌 Database pool closed');
}

export default pool;
