import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { Logger } from '../logger/logger.service'

import * as fs from 'fs'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (!fs.existsSync('./logs')) fs.mkdirSync('./logs')

    const _url = req.method + ' ' + req.originalUrl.split('?')[0]
    const _query = JSON.stringify(req.query)
    const _body = JSON.stringify(req.body)

    this.logger.debug(`${_url} query: ${_query} body: ${_body}`)

    console.log = (message: any, params?: any) => {
      this.logger.log(message, params)
    }

    next()
  }
}
