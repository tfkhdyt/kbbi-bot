import Xendit from 'xendit-node'

import config from '../config/config'

export const xenditClient = new Xendit({
  secretKey: config.xenditSecret,
})
