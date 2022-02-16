import { Module, Global } from '@nestjs/common'
import { SlackUtil } from './slack.util'

@Global()
@Module({
  providers: [SlackUtil],
  exports: [SlackUtil],
})
export class UtilModule {}
