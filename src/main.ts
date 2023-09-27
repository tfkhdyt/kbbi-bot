import { message } from 'telegraf/filters'

import Bot from './Bot.js'
import config from './config/config.js'
import { startCron } from './cron.js'
import { saldoHandler } from './handlers/saldoHandler.js'
import { checkUserMiddleware } from './middlewares/user.middleware.js'

startCron()

const app = new Bot(config.botToken)
const bot = app.bot

bot.use(checkUserMiddleware)
bot.start((ctx) => app.sendStartMessage(ctx))
bot.help((ctx) => app.sendHelpMessage(ctx))
bot.command('saldo', saldoHandler)

bot.on(message('text'), async (ctx) => {
  try {
    if (ctx.user.credits === 0) {
      return ctx.reply(
        'Maaf, saldo anda tidak mencukupi, silakan isi ulang atau tunggu esok hari. Saldo gratis harian akan di-reset setiap jam 00:00',
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
