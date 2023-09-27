import { migrate } from 'drizzle-orm/libsql/migrator'

import { message } from 'telegraf/filters'

import Bot from './Bot.js'
import config from './config/config.js'
import { db } from './db/postgres/index.js'
import { addUser, findUserByID } from './user.repository.js'

console.log('Running migration...')
await migrate(db, { migrationsFolder: 'drizzle' })
console.log('Migrations is done')

const app = new Bot(config.botToken)
const bot = app.bot

bot.use(async (ctx, next) => {
  try {
    const userId = ctx.from?.id
    const username = ctx.from?.username
    if (!userId || !username)
      throw new Error('User ID atau Username anda tidak valid')

    const user = await findUserByID(userId)
    if (user.length === 0) {
      await addUser({ id: userId, username })
    }

    ctx.user = user[0]

    await next()
  } catch (error) {
    console.error(error)
    ctx.reply(`Terjadi error yang tak terduga!, ${error}`)
  }
})

bot.start((ctx) => app.sendStartMessage(ctx))

bot.help((ctx) => app.sendHelpMessage(ctx))

bot.command('saldo', async (ctx) => {
  try {
    const user = ctx.user

    ctx.reply(`Jumlah saldo mu adalah: ${user.credits}`)
  } catch (error) {
    console.error(error)
    ctx.reply(`Terjadi error yang tak terduga!, ${error}`)
  }
})

bot.on(message('text'), async (ctx) => {
  try {
    if (ctx.user.credits === 0) {
      return ctx.reply(
        'Maaf, saldo anda tidak cukup, silakan isi ulang atau tunggu besok hari',
      )
    }

    const keyword = ctx.message.text
    await app.main(ctx, keyword)
  } catch (error) {
    console.error(error)
  }
})

bot.on('callback_query', (ctx) => app.reportBug(ctx))

if (config.nodeEnv === 'development') {
  console.log('Bot is running in development')
  bot.launch()
} else {
  console.log('Bot is running in production')
  bot.launch({
    webhook: {
      domain: config.botDomain,
      port: config.port,
    },
  })
}
