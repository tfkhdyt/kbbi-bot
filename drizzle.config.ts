import type { Config } from 'drizzle-kit'
import config from './src/config/config'

export default {
  schema: './src/db/postgres/schemas/*',
  out: './drizzle',
  driver: 'turso',
  dbCredentials: {
    url: config.databaseUrl,
    authToken:
      config.nodeEnv === 'production' ? config.databaseAuthToken : undefined,
  },
} satisfies Config
