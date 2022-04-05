import { defineComponent, PropType, provide } from 'vue'
import { Schema } from './types'
import { SchemaFormContextKey } from './context'
import SchemaItem from './SchemaItem'

// 此组件负责的功能就是通过 JSONSchema 转化成相应的表单
export default defineComponent({
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true,
    },
    // 解析这个 schema 然后根据它的类型或者定义去渲染对应的表单项
    value: {
      required: true,
    },
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: true,
    },
    // theme: {
    //   type: Object as PropType<Theme>,
    //   required: true,
    // },
  },
  name: 'SchemaForm',
  setup(props, { slots, emit, attrs }) {
    const handleChange = (v: any) => {
      props.onChange(v)
    }

    const context: any = {
      SchemaItem,
      // theme: props.theme,
    }
    /**
     * 类型：
     *   provide：Object | () => Object
     *   inject：Array<string> | { [key: string]: string | Symbol | Object }
     *
     * 详细：
     *   这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在其上下游关系成立的时间里始终生效。
     *   如果你熟悉 React，这与 React 的上下文特性很相似。
     *
     * https://cn.vuejs.org/v2/api/#provide-inject
     */

    provide(SchemaFormContextKey, context)

    return () => {
      const { schema, value, onChange } = props
      // onChange 不推荐使用直接传进来的 onChange   因为有可能需要在中间再做一层处理

      return (
        <SchemaItem
          schema={schema}
          rootSchema={schema}
          value={value}
          onChange={handleChange}
        />
      )
    }
  },
})
