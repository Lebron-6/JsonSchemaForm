import { PropType, defineComponent, DefineComponent } from 'vue'

export enum SchemaTypes {
  'NUMBER' = 'number',
  'INTEGER' = 'integer',
  'STRING' = 'string',
  'OBJECT' = 'object',
  'ARRAY' = 'array',
  'BOOLEAN' = 'boolean',
}

type SchemaRef = { $ref: string }

// type Schema = any
export interface Schema {
  type?: SchemaTypes | string
  // 此处的 | string 的作用在于  在给 type 值时既可以给 SchemaTypes.NUMBER 也可以 给 "number"  否则就在那给 SchemaTypes.NUMBER
  const?: any
  format?: string

  title?: string
  default?: any

  properties?: {
    [key: string]: Schema
  }
  items?: Schema | Schema[] | SchemaRef
  uniqueItems?: any
  dependencies?: {
    [key: string]: string[] | Schema | SchemaRef
  }
  oneOf?: Schema[]
  anyOf?: Schema[]
  allOf?: Schema[]
  // TODO: uiSchema
  // vjsf?: VueJsonSchemaConfig
  required?: string[]
  enum?: any[]
  enumNames?: any[]
  enumKeyValue?: any[]
  additionalProperties?: any
  additionalItems?: Schema

  minLength?: number
  maxLength?: number
  minimun?: number
  maximum?: number
  multipleOf?: number
  exclusiveMaximum?: number
  exclusiveMinimum?: number
}

export const FiledPropsDefine = {
  schema: {
    type: Object as PropType<Schema>,
    required: true,
  },
  value: {
    required: true,
  },
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true,
  },
  rootSchema: {
    type: Object as PropType<Schema>,
    required: true,
  },
} as const
/**
 * the Readonly constraint allows TS to treat the type of { required: true }
 * as constant instead of boolean.
 * 如果要把 props 的定义提出来，需要在后面使用 `as const` 申明它是 readonly 的
 *
 * reason:
 * PropsOptions 继承只读类型的ComponentPropsOptions，而ts中required:true是被认为在这个对象上是必须的，所以会被消除掉
 *
 * https://github.com/vuejs/vue-next/blob/master/packages/runtime-core/src/apiDefineComponent.ts
 */

export const TypeHelperComponent = defineComponent({
  props: FiledPropsDefine,
})

export type CommonFiledType = typeof TypeHelperComponent

export const CommonWidgetPropsDefine = {
  value: {},
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true,
  },
} as const

export const SelectionWidgetPropsDefine = {
  ...CommonWidgetPropsDefine,
  options: {
    type: Array as PropType<
      {
        key: string
        value: any
      }[]
    >,
    required: true,
  },
} as const

export type CommonWidgetDefine = DefineComponent<
  typeof CommonWidgetPropsDefine,
  {},
  {}
>

export type SelectionWidgetDefine = DefineComponent<
  typeof SelectionWidgetPropsDefine,
  {},
  {}
>

export enum SelectionWidgetNames {
  SelectionWidget = 'SelectionWidget',
}

export enum CommonWidgetNames {
  TextWidget = 'TextWidget',
  NumberWidget = 'NumberWidget',
}

export interface Theme {
  widgets: {
    [SelectionWidgetNames.SelectionWidget]: SelectionWidgetDefine
    [CommonWidgetNames.TextWidget]: CommonWidgetDefine
    [CommonWidgetNames.NumberWidget]: CommonWidgetDefine
  }
}
