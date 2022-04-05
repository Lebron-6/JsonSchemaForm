import { inject } from 'vue'
import { CommonFiledType } from './types'

export const SchemaFormContextKey = Symbol()

export function useVJSFContext() {
  const context: { SchemaItem: CommonFiledType } | undefined = inject(
    SchemaFormContextKey,
  )

  if (!context) throw Error('SchemaForm needed')

  return context
}
