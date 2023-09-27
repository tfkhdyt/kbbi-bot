import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'
import config from '../../config/config'

const client = createClient({
  url: config.databaseUrl,
  authToken: config.databaseAuthToken,
})
const db = drizzle(client)

async function main() {
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
}

main()
