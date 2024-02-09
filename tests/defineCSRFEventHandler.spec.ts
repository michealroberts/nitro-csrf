/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/nitro-cors
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

/* eslint-disable @typescript-eslint/no-unused-vars */

/*****************************************************************************************************************/

import { describe, expect, expectTypeOf, it, suite } from 'vitest'

import { type EventHandler, type EventHandlerRequest } from 'h3'

import { defineCSRFEventHandler } from '../src'

/*****************************************************************************************************************/

suite('nitro-csrf eventHandler', () => {
  describe('defineCSRFEventHandler', () => {
    it('should be defined', () => {
      expect(defineCSRFEventHandler).toBeDefined()
    })

    it('should return the correct event handler types when specified', async () => {
      const handler = defineCSRFEventHandler(
        async _event => {
          return {
            csrf: true
          }
        },
        {
          secret: '$i9grtx*fgbog(bwgpk6cz9&&g4bv-bi3*s8_2#t0ond-)^sv='
        }
      )

      expectTypeOf(handler).toEqualTypeOf<
        EventHandler<EventHandlerRequest, Promise<{ csrf: boolean }>>
      >()
    })

    it('should return the correct event handler types when specified', () => {
      const handler = defineCSRFEventHandler(
        _event => {
          return {
            cors: true
          }
        },
        {
          secret: '$i9grtx*fgbog(bwgpk6cz9&&g4bv-bi3*s8_2#t0ond-)^sv='
        }
      )

      expectTypeOf(handler).toEqualTypeOf<EventHandler<EventHandlerRequest, { cors: boolean }>>()
    })
  })
})

/*****************************************************************************************************************/
