import { EnvironmentDto } from '~shared/types/api'
import { ControllerHandler } from '@/types/response-handler'

export class EnvController {
  private bannerMessage: string
  private googleAnalyticsId: string

  constructor({
    bannerMessage,
    googleAnalyticsId,
  }: {
    bannerMessage: string
    googleAnalyticsId: string
  }) {
    this.bannerMessage = bannerMessage
    this.googleAnalyticsId = googleAnalyticsId
  }
  getEnvironmentVars: ControllerHandler<never, EnvironmentDto> = (
    _req,
    res,
  ) => {
    return res.json({
      bannerMessage: this.bannerMessage,
      googleAnalyticsId: this.googleAnalyticsId,
    })
  }
}
