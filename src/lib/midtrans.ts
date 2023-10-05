import { MidtransClient } from 'midtrans-node-client'

import {
  MIDTRANS_CLIENT_KEY,
  MIDTRANS_SERVER_KEY,
  NODE_ENV,
} from '../config/config.js'

export const snap = new MidtransClient.Snap({
  isProduction: NODE_ENV === 'production',
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY,
})
