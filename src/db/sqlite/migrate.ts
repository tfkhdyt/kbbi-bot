import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'

import {
  DATABASE_AUTH_TOKEN,
  DATABASE_URL,
  NODE_ENV,
} from '../../config/config.js'

const client = createClient({
  url: DATABASE_URL,
  authToken: NODE_ENV === 'production' ? DATABASE_AUTH_TOKEN : undefined,
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
