import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  username: text('username', { length: 50 }),
  firstName: text('first_name', { length: 255 }),
  lastName: text('last_name', { length: 255 }),
  credits: integer('credits').default(3),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
