import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: integer('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull(),
  credits: integer('credits').default(3),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
