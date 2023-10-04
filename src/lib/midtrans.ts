import { MidtransClient } from 'midtrans-node-client'

import config from '../config/config.js'

export const snap = new MidtransClient.Snap({
  isProduction: config.nodeEnv === 'production',
  serverKey: config.midtransServerKey,
  clientKey: config.midtransClientKey,
})
