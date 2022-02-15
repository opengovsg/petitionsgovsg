import { StatusCodes } from 'http-status-codes'
import { ErrorDto } from '~shared/types/api'
import { createLogger } from '../../bootstrap/logging'
import { ControllerHandler } from '../../types/response-handler'
import { AddresseeDto, AddresseeService } from './addressee.service'

const logger = createLogger(module)

export class AddresseeController {
  private addresseeService: Public<AddresseeService>

  constructor({
    addresseeService,
  }: {
    addresseeService: Public<AddresseeService>
  }) {
    this.addresseeService = addresseeService
  }

  /**
   * Lists all post
   * @query sort Sort by popularity or recent
   * @query size Number of posts to return
   * @query page If size is given, specify which page to return
   * @return 200 with posts and totalItem for pagination
   * @return 500 when database error occurs
   */
  listAddressees: ControllerHandler<
    undefined,
    AddresseeDto[] | ErrorDto,
    undefined,
    undefined
  > = async (req, res) => {
    try {
      const data = await this.addresseeService.listAddressees()
      return res.status(StatusCodes.OK).json(data)
    } catch (error) {
      logger.error({
        message: 'Error while listing addresees',
        meta: {
          function: 'listAddressees',
        },
        error,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Server Error' })
    }
  }
}
