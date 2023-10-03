import { Invoice } from 'xendit-node'

import config from '../config/config.js'

export const xenditClient = new Invoice({
  secretKey: config.xenditSecret,
})
