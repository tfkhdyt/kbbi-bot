import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  username: text('username', { length: 50 }).notNull(),
  credits: integer('credits').default(3),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
