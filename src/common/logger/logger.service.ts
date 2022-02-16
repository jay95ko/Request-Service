import { LoggerService, Injectable } from '@nestjs/common'
import { join } from 'path'

import * as winston from 'winston'
import 'winston-daily-rotate-file'

const { combine, timestamp, printf } = winston.format

const logFormat = printf(info => {
  return `[${info.level}] [${info.timestamp}]: ${info.message}`
})

@Injectable()
export class Logger implements LoggerService {
  private logger: winston.Logger

  constructor() {
    this.logger = winston.createLogger({
      level: 'debug',
      format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
      transports: [
        new winston.transports.Console({
          level: 'info',
        }),
        new winston.transports.DailyRotateFile({
          filename: join('./logs', 'log'),
          maxSize: '10m',
          maxFiles: '14d',
        }),
      ],
    })
  }

  log(message: string, ...optionalParams: any[]) {
    this.logger.info(message, optionalParams)
  }
  error(message: string, ...optionalParams: any[]) {
    this.logger.error(message, optionalParams)
  }
  warn(message: string, ...optionalParams: any[]) {
    this.logger.warn(message, optionalParams)
  }
  debug(message: string, ...optionalParams: any[]) {
    this.logger.debug(message, optionalParams)
  }
  verbose(message: string, ...optionalParams: any[]) {
    this.logger.verbose(message, optionalParams)
  }
}
