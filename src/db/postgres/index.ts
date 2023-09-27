import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import config from '../../config/config'


export const migrationClient = postgres(config.postgresURL, { max: 1 })
const queryClient = postgres(config.postgresURL)

export const db = drizzle(queryClient)
export type DB = typeof db
