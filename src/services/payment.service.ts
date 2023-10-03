import { CreateInvoiceRequest, Invoice } from 'xendit-node/invoice/models'

import { User } from '../db/sqlite/schemas/user.schema.js'
import { xenditClient } from '../lib/xendit.js'

export const calculatePrice = (amount: number) => {
  const net = amount * 1000
  const adminFee = net * 0.2
  const gross = net + adminFee

  return { net, adminFee, gross }
}

export const createInvoice = async (amount: number, user: User) => {
  const price = calculatePrice(amount)

  const invoice: CreateInvoiceRequest = {
    externalId: `TOPUP_${user.id}_${crypto.randomUUID()}`,
    amount: price.gross,
    currency: 'IDR',
    customer: {
      givenNames: user.firstName,
      surname: user.lastName,
    },
    items: [
      {
        name: 'Saldo KBBI Bot',
        quantity: amount,
        price: 1000,
      },
    ],
    fees: [
      {
        type: 'Biaya Admin',
        value: price.adminFee,
      },
    ],
  }

  const response: Invoice = await xenditClient.createInvoice({
    data: invoice,
  })

  return response.invoiceUrl
}

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
})

export const formatCurrency = (value: number) => formatter.format(value)
