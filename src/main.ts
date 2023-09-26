import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { message } from 'telegraf/filters'

import App from './app.js'
import config from './config/config.js'
import { db, migrationClient } from './db/postgres/index.js'
import { users } from './db/postgres/schemas/user.schema.js'

await migrate(drizzle(migrationClient), { migrationsFolder: 'drizzle' })

// class instantiation
const app = new App(config.botToken)
const bot = app.bot

// middleware
bot.use(async (ctx, next) => {
  try {
    const userId = ctx.from?.id
    const username = ctx.from?.username
    if (!userId || !username) return

    const user = await db.select().from(users).where(eq(users.id, userId))
    if (user.length === 0) {
      await db.insert(users).values({ id: userId, username })
    }

    ctx.user = user[0]

    await next()
  } catch (error) {
    console.error(error)
  }
})

// event handler
bot.start((ctx) => app.sendStartMessage(ctx))

bot.help((ctx) => app.sendHelpMessage(ctx))

bot.command('saldo', async (ctx) => {
  const userId = ctx.from.id
  if (!userId) return

  const user = ctx.user

  ctx.reply(`Jumlah saldo mu adalah: ${user.credits}`)
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

// launcher
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
  // bot.startWebhook(`/bot${botToken}`, null, port)
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
