import crypto from 'crypto'

import { User } from '../db/sqlite/schemas/user.schema.js'
import { snap } from '../lib/midtrans.js'

export const calculatePrice = (amount: number) => {
  const net = amount * 1000
  const adminFee = net * 0.2
  const gross = net + adminFee

  return { net, adminFee, gross }
}

export const createInvoice = async (amount: number, user: User) => {
  try {
    const price = calculatePrice(amount)

    const invoice = {
      transaction_details: {
        order_id: `${amount}_${user.id}_${crypto.randomUUID()}`,
        gross_amount: price.gross,
      },
      item_details: [
        {
          id: 'SALDO',
          name: 'Saldo KBBI Bot',
          quantity: amount,
          price: 1000,
        },
        {
          id: 'ADMIN_FEE',
          name: 'Biaya Admin',
          quantity: 1,
          price: price.adminFee,
        },
      ],
      customer_details: {
        first_name: user.firstName,
        last_name: user.lastName,
      },
    }

    const response = await snap.createTransaction(invoice)

    return response.redirect_url as string
  } catch (error) {
    console.error(error)
    throw error
  }
}

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
})

export const formatCurrency = (value: number) => formatter.format(value)
