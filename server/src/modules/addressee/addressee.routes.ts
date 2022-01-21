import express from 'express'
import { AddresseeController } from './addressee.controller'

export const routeAddressees = ({
  controller,
}: {
  controller: AddresseeController
}): express.Router => {
  const router = express.Router()
  /**
   * Lists all addressees
   * @route   GET /api/posts
   * @returns 200 with posts
   * @returns 500 when database error occurs
   * @access  Public
   */
  router.get('/', controller.listAddressees)
  return router
}
