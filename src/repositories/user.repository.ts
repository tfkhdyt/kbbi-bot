import { eq, lt, sql } from 'drizzle-orm'

import { db } from '../db/postgres'
import { NewUser, users } from '../db/postgres/schemas/user.schema'

export const findUserByID = async (id: number) =>
  await db.select().from(users).where(eq(users.id, id))

export const addUser = async (user: NewUser) =>
  await db.insert(users).values(user)

export const decreaseCredits = async (userId: number) =>
  await db
    .update(users)
    .set({ credits: sql`${users.credits} - 1` })
    .where(eq(users.id, userId))

export const resetFreeCredits = async () =>
  await db.update(users).set({ credits: 3 }).where(lt(users.credits, 3))