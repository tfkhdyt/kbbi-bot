import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const POSTGRES_URL = process.env.POSTGRES_URL as string

export const migrationClient = postgres(POSTGRES_URL, { max: 1 })
const queryClient = postgres(POSTGRES_URL)

export const db = drizzle(queryClient)
export type DB = typeof db
