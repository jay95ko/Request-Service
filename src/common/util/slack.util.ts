import { Injectable } from '@nestjs/common'
import { Logger } from '../logger/logger.service'
import * as request from 'request'

@Injectable()
export class SlackUtil {
  private readonly logger: Logger = new Logger()

  private BOT_ID_CASHWALK =
    'xoxb-529475618740-2832450909154-yWoHkrrnaXf27cDuceME5VZr'
  private BOT_ID_LINKAREER =
    'xoxb-57631216162-2836776616003-bj4upvr69afU7hnyPMmKHLhw'
  private BOT_ID_GENIET =
    'xoxb-830039420371-2836753352162-E0sNnvuJKqm2GqCW7mFUEc3v'

  async getUserByEmail(workspace: string, email: string) {
    const botId = this.getBotIdByWorkspace(workspace)

    try {
      const options = {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${botId}`,
        },
        url: `https://slack.com/api/users.lookupByEmail?email=${email}`,
      }

      const result = await this.callSlackApiPromise('get', options, true)
      return result.user
    } catch (e) {
      console.log('slack getUserByEmail error')
      console.log(e)
    }
  }

  async sendDmByUserId(workspace: string, userId: string, message: string) {
    const botId = this.getBotIdByWorkspace(workspace)

    try {
      const options = {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${botId}`,
        },
        url: 'https://slack.com/api/chat.postMessage',
        body: JSON.stringify({ channel: userId, text: message }),
      }

      this.callSlackApiPromise('post', options, false)
    } catch (e) {
      console.log('slack sendDmByUserId error')
      console.log(e)
    }
  }

  getBotIdByWorkspace(workspace: string): string {
    let botId
    switch (workspace.trim().toLowerCase()) {
      case 'cashwalk':
        botId = this.BOT_ID_CASHWALK
        break
      case 'linkareer':
        botId = this.BOT_ID_LINKAREER
        break
      case 'geniet':
        botId = this.BOT_ID_GENIET
        break
      default:
        break
    }

    if (!botId) throw new Error('invalid workspace input')

    return botId
  }

  async callSlackApiPromise(
    method: string,
    options: object,
    isPromise: boolean,
  ): Promise<any> {
    let requestMethod
    switch (method.toLowerCase()) {
      case 'get':
        requestMethod = request.get
        break
      case 'post':
        requestMethod = request.post
        break
      default:
        requestMethod = request.get
        break
    }

    if (isPromise) {
      return new Promise(async (resolve, reject) => {
        requestMethod(options, (err, httpResponse, body) => {
          if (err) reject(err)

          try {
            const result = JSON.parse(body)
            console.log('success call slack api')
            resolve(result)
          } catch (e) {
            reject(e)
          }
        })
      })
    } else {
      requestMethod(options, (err, httpResponse, body) => {
        if (err) {
          console.log(err)
          return
        }

        console.log('success call slack api')
      })
    }
  }
}
