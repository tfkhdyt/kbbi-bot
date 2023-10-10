import { eq, lt, sql } from 'drizzle-orm'

import { db } from '../db/sqlite/index.js'
import { NewUser, users } from '../db/sqlite/schemas/user.schema.js'

export const findUserByID = async (id: number) =>
  await db.select().from(users).where(eq(users.id, id))

export const addUser = async (user: NewUser) =>
  await db.insert(users).values(user).returning()

export const updateUser = async (id: number, user: NewUser) =>
  await db.update(users).set(user).where(eq(users.id, id)).returning()

export const increaseCredits = async (userId: number, amount: number) =>
  await db
    .update(users)
    .set({ credits: sql`${users.credits} + ${amount}` })
    .where(eq(users.id, userId))

export const decreaseCredits = async (userId: number) =>
  await db
    .update(users)
    .set({
      credits: sql`${users.credits} - 1`,
      lastUsed: sql`CURRENT_TIMESTAMP`,
    })
    .where(eq(users.id, userId))

export const resetFreeCredits = async () =>
  await db.update(users).set({ credits: 3 }).where(lt(users.credits, 3))
