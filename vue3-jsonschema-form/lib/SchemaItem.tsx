import { computed, defineComponent } from 'vue'
import { SchemaTypes, FiledPropsDefine } from './types'
import { StringFiled, NumberFiled, ObjectFiled, ArrayFiled } from '.'
import { retrieveSchema } from './utils'

export default defineComponent({
  name: 'SchemaItem',
  props: FiledPropsDefine,
  setup(props) {
    const retrievedSchemaRef = computed(() => {
      // computed return 的是一个 ref 对象    当 schema, rootSchema, value 其中一个或多个变化时 computed 会重新计算
      const { schema, rootSchema, value } = props
      return retrieveSchema(schema, rootSchema, value)
    })

    return () => {
      // 每次节点被重新渲染时 return () => {} 里面的内容都会重新执行一次
      const { schema, rootSchema, value } = props

      const retrievedSchema = retrievedSchemaRef.value

      // TODO: 如果type没有指定，我们需要猜测这个type

      let Component: any

      switch (schema.type) {
        case SchemaTypes.STRING: {
          Component = StringFiled
          break
        }
        case SchemaTypes.NUMBER: {
          Component = NumberFiled
          break
        }
        case SchemaTypes.OBJECT: {
          Component = ObjectFiled
          break
        }
        case SchemaTypes.ARRAY: {
          Component = ArrayFiled
          break
        }
        default: {
          console.warn(`${schema.type} is not supported`)
        }
      }

      return <Component {...props} schema={retrievedSchema} />
    }
  },
})
