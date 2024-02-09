/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/nitro-cors
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import {
  type EventHandler,
  type EventHandlerRequest,
  type EventHandlerResponse,
  defineEventHandler
} from 'h3'

import { type H3CsrfOptions } from './types'

import { useCSRF } from './useCsrf'

/*****************************************************************************************************************/

export const defineCSRFEventHandler = <
  TRequest extends EventHandlerRequest,
  TResponse extends EventHandlerResponse
>(
  handler: EventHandler<TRequest, TResponse>,
  options: H3CsrfOptions
): EventHandler<EventHandlerRequest, TResponse> => {
  return defineEventHandler(event => {
    useCSRF(event, options)

    // Return the event handler:
    return handler(event)
  })
}

/*****************************************************************************************************************/
