import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

import config from '../../config/config'

const client = createClient({
  url: config.databaseUrl,
  authToken: config.databaseAuthToken,
})
export const db = drizzle(client)
export type DB = typeof db
