import { FastifyReply, FastifyRequest } from 'fastify'

import config from '../config/config.js'
import { bot } from '../lib/telegraf.js'
import { increaseCredits } from '../repositories/user.repository.js'
import { PaymentBody } from '../types/paymentBody.js'

export const callbackHandler = async (
  req: FastifyRequest<{ Body: PaymentBody }>,
  reply: FastifyReply,
) => {
  try {
    const { body } = req
    if (body.transaction_status !== 'settlement') {
      return reply.status(200).send('Status should be settlement')
    }

    const [amount, userId] = body.order_id.split('_')
    const paymentChannel = body.payment_type

    await increaseCredits(Number(userId), Number(amount))
    await Promise.allSettled([
      bot.telegram.sendMessage(
        userId,
        `Topup sejumlah ${amount} saldo melalui "${paymentChannel.toUpperCase()}" telah berhasil! Terima kasih telah menggunakan layanan kami`,
      ),
      bot.telegram.sendMessage(
        config.adminId,
        `Topup sejumlah ${amount} saldo melalui "${paymentChannel.toUpperCase()}" telah berhasil!`,
      ),
    ])

    reply.status(200).send('Transaction success!')
  } catch (error) {
    console.error(error)
  }
}
