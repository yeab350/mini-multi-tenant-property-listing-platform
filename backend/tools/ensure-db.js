/* Ensures the configured Postgres database exists.

   Why this exists:
   - Some dev machines have Postgres running but no Docker/psql in PATH.
   - TypeORM cannot create databases, only tables.

   Usage:
     node tools/ensure-db.js

   Env:
     DB_HOST (default localhost)
     DB_PORT (default 5432)
     DB_USER (default postgres)
     DB_PASSWORD (required)
     DB_NAME (default mini_property)
*/

const { Client } = require('pg');

const fs = require('node:fs');
const path = require('node:path');

function loadDotEnvIfPresent() {
  const envPath = path.resolve(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function main() {
  loadDotEnvIfPresent();

  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT || '5432');
  const user = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASSWORD;
  const dbName = process.env.DB_NAME || 'mini_property';

  if (!password) {
    throw new Error('DB_PASSWORD is required (set it in backend/.env)');
  }

  const admin = new Client({ host, port, user, password, database: 'postgres' });
  await admin.connect();

  const exists = await admin.query('select 1 from pg_database where datname = $1', [dbName]);

  if (exists.rowCount === 0) {
    // Identifiers can't be parameterized; this is safe because dbName comes from local env.
    await admin.query(`create database "${dbName.replace(/"/g, '""')}"`);
    console.log(`Created database: ${dbName}`);
  } else {
    console.log(`Database already exists: ${dbName}`);
  }

  await admin.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
