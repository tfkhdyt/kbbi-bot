import type { Config } from 'drizzle-kit'

import {
  DATABASE_AUTH_TOKEN,
  DATABASE_URL,
  NODE_ENV,
} from './src/config/config'

export default {
  schema: './src/db/sqlite/schemas/*',
  out: './drizzle',
  driver: 'turso',
  dbCredentials: {
    url: DATABASE_URL,
    authToken: NODE_ENV === 'production' ? DATABASE_AUTH_TOKEN : undefined,
  },
} satisfies Config
