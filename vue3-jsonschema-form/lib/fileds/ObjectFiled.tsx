import { defineComponent, DefineComponent } from 'vue'
import { FiledPropsDefine } from '../types'
import { isObject } from '../utils'
import { useVJSFContext } from '../context'

// const schema = {
//   type: 'object',
//   properties: {
//     name: {
//       type: 'string',
//     },
//     age: {
//       type: 'number',
//     },
//   },
// }

type A = DefineComponent<typeof FiledPropsDefine, {}, {}>

export default defineComponent({
  name: 'ObjectFiled',
  props: FiledPropsDefine,
  setup(props) {
    const context = useVJSFContext()

    const handleObjectFiledChange = (key: string, v: any) => {
      const value: any = isObject(props.value) ? props.value : {}

      if (v === undefined) {
        delete value[key]
      } else {
        value[key] = v
      }

      props.onChange(value)
    }

    return () => {
      const { schema, rootSchema, value } = props

      const { SchemaItem } = context

      const properties = schema.properties || {}

      const currentValue: any = isObject(value) ? value : {}

      return Object.keys(properties).map((k: string, index: number) => (
        <SchemaItem
          schema={properties[k]}
          rootSchema={rootSchema}
          value={currentValue[k]}
          key={index}
          onChange={(v: any) => handleObjectFiledChange(k, v)}
        />
      ))
    }
  },
})
