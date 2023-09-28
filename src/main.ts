import { message } from 'telegraf/filters'

import fastify from 'fastify'
import Bot from './Bot.js'
import config from './config/config.js'
import { startCron } from './cron.js'
import { saldoHandler } from './handlers/saldo.handler.js'
import { PaymentBody } from './interfaces/paymentBody.js'
import { checkUserMiddleware } from './middlewares/user.middleware.js'
import { createInvoice } from './payments/xendit/createInvoice.js'
import { increaseCredits } from './repositories/user.repository.js'

startCron()

const app = new Bot(config.botToken)
const bot = app.bot
const server = fastify()

server.get('/', () => 'Hello')
server.post<{ Body: PaymentBody }>('/receive_callback', async (req, reply) => {
  try {
    const { body } = req
    if (body.status !== 'PAID') {
      return reply.status(200).send()
    }

    console.log(body)

    const userId = Number(body.external_id.split('_')[1])
    const amount = body.items[0].quantity
    const paymentChannel = body.payment_channel

    await increaseCredits(userId, amount)
    await bot.telegram.sendMessage(
      userId,
      `Topup sejumlah ${amount} saldo melalui ${paymentChannel} telah berhasil! Terima kasih telah menggunakan layanan kami`,
    )

    reply.status(200).send()
  } catch (error) {
    console.error(error)
  }
})

bot.start((ctx) => app.sendStartMessage(ctx))
bot.help((ctx) => app.sendHelpMessage(ctx))

bot.use(checkUserMiddleware)
bot.command('saldo', saldoHandler)
bot.command('topup', async (ctx) => {
  try {
    const messages = ctx.message.text.split(' ')
    if (messages.length !== 2) {
      throw new Error('Input tidak valid')
    }
    const amount = Number(messages[1])

    const invoiceUrl = await createInvoice(amount, ctx.user)

    await ctx.reply(
      `Silakan lanjutkan pembayaran melalui URL berikut ini: ${invoiceUrl}`,
    )
  } catch (error) {
    console.error(error)
    if (error instanceof Error) await ctx.reply(error.message)
  }
})
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

if (config.nodeEnv === 'production') {
  console.log('Bot is running in production')
  const webhook = await bot.createWebhook({ domain: config.botDomain })
  // @ts-ignore
  server.post(`/telegraf/${bot.secretPathComponent()}`, webhook)
  await server.listen({ port: config.port })
  await bot.launch({
    webhook: {
      domain: config.botDomain,
      port: config.port,
    },
  })
} else {
  console.log('Bot is running in development')
  await server.listen({ port: Number(config.port) })
  await bot.launch()
}
