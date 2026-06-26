import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Client } from 'pg';

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error('Usage: tsx scripts/run-sql.ts <path-to-sql>');

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');

  const sql = readFileSync(resolve(process.cwd(), file), 'utf8');

  // localhost — без SSL; внешние хосты (Railway) — с SSL
  const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
  const client = new Client({
    connectionString: url,
    ssl: isLocal ? false : { rejectUnauthorized: false },
  });

  await client.connect();
  console.log(`Connected. Executing ${file} ...`);
  try {
    await client.query('BEGIN');
    await client.query(sql); // node-pg выполняет мультистейтмент одним вызовом
    await client.query('COMMIT');
    console.log('✅ Done (committed).');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('❌ Failed — rolled back. Nothing changed.');
    throw e;
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
