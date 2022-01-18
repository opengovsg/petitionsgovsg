import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Signature, Post } from '~shared/types/base'
import { Message } from '../types/message-type'
import { ControllerHandler } from '../types/response-handler'
import { ModelDef } from '../types/sequelize'

type SignatureWithRelations = Signature & {
  userId: number
  post: Post
}
export type OwnershipCheck = ControllerHandler<
  { id: string },
  Message,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>
export const checkOwnershipUsing = ({
  Signature,
  Post,
}: {
  Signature: ModelDef<Signature>
  Post: ModelDef<Post>
}): OwnershipCheck => {
  const checkOwnership: OwnershipCheck = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    //TODO

    // const results = (await Signature.findOne({
    //   where: { id: req.params.id },
    //   attributes: ['userId'],
    //   include: [
    //     {
    //       model: Post,
    //     },
    //   ],
    // })) as unknown as SignatureWithRelations
    // if (!results) {
    //   return res
    //     .status(StatusCodes.BAD_REQUEST)
    //     .json({ message: 'No answer found with this ID' })
    // }
    // if (!req.user) {
    //   return res
    //     .status(StatusCodes.UNAUTHORIZED)
    //     .json({ message: 'User not signed in' })
    // }

    // const user = await User.findByPk(req.user.id)

    // if (!user) {
    //   return res.status(StatusCodes.FORBIDDEN).json({
    //     message: `User ${req.user.id} does not exist`,
    //   })
    // }

    next()
  }
  return checkOwnership
}
