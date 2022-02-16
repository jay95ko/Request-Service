import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { Logger } from '../logger/logger.service'

@Injectable()
export class SchedulerService {
  private readonly logger: Logger = new Logger()

  @Cron('30 0 0 * * *')
  schedulePerDay() {
    this.logger.log('schedule per day start')
  }
}
