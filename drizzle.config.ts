import type { Config } from 'drizzle-kit'

export default {
  schema: './src/db/postgres/schemas/*',
  out: './drizzle',
} satisfies Config
