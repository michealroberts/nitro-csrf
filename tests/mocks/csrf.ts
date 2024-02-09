/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/nitro-csrf
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { eventHandler, setHeaders } from 'h3'

import { type Handler } from '../shared/handler'

import { defineCSRFEventHandler } from '../../src'

/*****************************************************************************************************************/

export const csrfHandlers: Handler[] = [
  {
    method: '*',
    url: '/csrf/protected',
    handler: defineCSRFEventHandler(
      eventHandler(async event => {
        setHeaders(event, {
          'x-csrf-protected': 'true'
        })

        return {
          csrf: true
        }
      }),
      {
        secret: '$i9grtx*fgbog(bwgpk6cz9&&g4bv-bi3*s8_2#t0ond-)^sv='
      }
    )
  }
]
