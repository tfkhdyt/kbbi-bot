import { createClient } from '@libsql/client/.'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'

import config from '../../config/config'

console.log('Running migration...')

const client = createClient({
  url: config.databaseUrl,
  authToken: config.databaseAuthToken,
})
const db = drizzle(client)
await migrate(db, { migrationsFolder: './drizzle' })

console.log('Migrations is done')
