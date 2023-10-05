import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'

import { DATABASE_AUTH_TOKEN, DATABASE_URL } from '../../config/config.js'

const client = createClient({
  url: DATABASE_URL,
  authToken: DATABASE_AUTH_TOKEN,
})
export const db = drizzle(client)
export type DB = typeof db

export async function startMigration() {
  console.log('Running migration...')
  await migrate(db, { migrationsFolder: './drizzle' })
  console.log('Migrations is done')
}
