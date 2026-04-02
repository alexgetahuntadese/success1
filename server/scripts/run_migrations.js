import 'dotenv/config'
import { Pool } from 'pg'
import fs from 'fs/promises'
import path from 'path'

const { DATABASE_URL, NODE_ENV } = process.env

if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL in environment')
  process.exit(1)
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

async function run() {
  const migrationsDir = path.resolve(process.cwd(), 'sql', 'migrations')
  let files
  try {
    files = (await fs.readdir(migrationsDir)).filter((f) => f.endsWith('.sql')).sort()
  } catch (err) {
    console.error('Could not read migrations directory:', err.message)
    process.exit(1)
  }

  if (files.length === 0) {
    console.log('No migration files found.')
    process.exit(0)
  }

  const client = await pool.connect()
  try {
    for (const file of files) {
      const filePath = path.join(migrationsDir, file)
      const sql = await fs.readFile(filePath, 'utf8')
      if (!sql.trim()) continue
      console.log(`Applying migration: ${file}`)
      try {
        await client.query(sql)
      } catch (err) {
        console.error(`Error running ${file}:`, err.message)
        throw err
      }
    }

    console.log('All migrations applied successfully.')
  } finally {
    client.release()
    await pool.end()
  }
}

run().catch((err) => {
  console.error('Migration runner failed:', err)
  process.exit(1)
})
