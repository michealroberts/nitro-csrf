/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/nitro-csrf
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { defineRequestMiddleware } from 'h3'

import { useCSRF } from './useCsrf'

import { type H3CsrfOptions } from './types'

/*****************************************************************************************************************/

export const onRequestCSRFMiddleware = (options: H3CsrfOptions) =>
  defineRequestMiddleware(async event => useCSRF(event, options))

/*****************************************************************************************************************/

// Expose the onRequestCsrfMiddleware as csrf alias for ease of use:
export const csrf = onRequestCSRFMiddleware

/*****************************************************************************************************************/
