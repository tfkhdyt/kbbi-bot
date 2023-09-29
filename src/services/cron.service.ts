import { CronJob } from 'cron'

import { resetFreeCredits } from '../repositories/user.repository'

export function startCron() {
  const job = new CronJob(
    '0 0 * * *',
    resetFreeCredits,
    null,
    true,
    'Asia/Jakarta',
  )

  job.start()
}
