import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'

import config from '../../config/config.js'

const client = createClient({
  url: config.databaseUrl,
  authToken:
    config.nodeEnv === 'production' ? config.databaseAuthToken : undefined,
})
const db = drizzle(client)

try {
  await migrate(db, {
    migrationsFolder: 'drizzle',
  })
  console.log('Tables migrated!')
  process.exit(0)
} catch (error) {
  console.error('Error performing migration: ', error)
  process.exit(1)
}
