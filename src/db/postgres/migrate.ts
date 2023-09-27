import { migrate } from 'drizzle-orm/libsql/migrator'
import { db } from '.'

console.log('Running migration...')
await migrate(db, { migrationsFolder: './drizzle' })
console.log('Migrations is done')
