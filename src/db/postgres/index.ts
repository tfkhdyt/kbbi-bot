import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'

import config from '../../config/config'

const client = createClient({
  url: config.databaseUrl,
  authToken: config.databaseAuthToken,
})
export const db = drizzle(client)
export type DB = typeof db

export async function startMigration() {
  console.log('Running migration...')
  await migrate(db, { migrationsFolder: './drizzle' })
  console.log('Migrations is done')
}

