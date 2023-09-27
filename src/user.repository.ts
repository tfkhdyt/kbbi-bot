import { eq, lt, sql } from 'drizzle-orm'
import { db } from './db/postgres'
import { NewUser, users } from './db/postgres/schemas/user.schema'

export const findUserByID = (id: number) =>
  db.select().from(users).where(eq(users.id, id))

export const addUser = (user: NewUser) => db.insert(users).values(user)

export const decreaseCredits = (userId: number) =>
  db
    .update(users)
    .set({ credits: sql`${users.credits} - 1` })
    .where(eq(users.id, userId))

export const resetFreeCredits = () =>
  db.update(users).set({ credits: 3 }).where(lt(users.credits, 3))
