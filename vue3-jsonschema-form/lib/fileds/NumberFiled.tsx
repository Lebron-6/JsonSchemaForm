import { defineComponent } from 'vue'
import { FiledPropsDefine, CommonWidgetNames } from '../types'
import { getWidget } from '../theme'

export default defineComponent({
  name: 'NumberFeild',
  props: FiledPropsDefine,
  setup(props) {
    const NumberWidgetRef = getWidget(CommonWidgetNames.NumberWidget)

    const handleChange = (v: string) => {
      const num = Number(v)

      if (Number.isNaN(num)) {
        props.onChange(undefined)
      } else {
        props.onChange(num)
      }
    }

    return () => {
      const { schema, rootSchema, ...rest } = props

      const NumberWidget = NumberWidgetRef.value

      return <NumberWidget {...rest} onChange={handleChange} />

      // return <input value={value as any} type="number" onInput={handleChange} />
    }
  },
})
