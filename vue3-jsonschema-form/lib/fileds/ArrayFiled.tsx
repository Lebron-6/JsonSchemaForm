import { defineComponent, PropType } from 'vue'
import { createUseStyles } from 'vue-jss'
import { FiledPropsDefine, Schema, SelectionWidgetNames } from '../types'
import { useVJSFContext } from '../context'
import { getWidget } from '../theme'

// import SelectionWidget from '../widgets/Selection'

const FuncProps = {
  type: Function as PropType<(index: number) => void>,
  required: true,
} as const

const useStyles = createUseStyles({
  container: {
    border: '1px solid #eee',
  },
  actions: {
    background: '#eee',
    padding: 10,
    textAlign: 'right',
  },
  action: {
    '& + &': {
      marginLeft: 10,
    },
  },
  content: {
    padding: 10,
  },
})

const ArrayItemWrapper = defineComponent({
  name: 'ArrayItemWrapper',
  props: {
    onAdd: FuncProps,
    onDelete: FuncProps,
    onUp: FuncProps,
    onDown: FuncProps,
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props, { slots }) {
    const classesRef = useStyles()

    const context = useVJSFContext()

    return () => {
      const classes = classesRef.value

      return (
        <div class={classes.container}>
          <div class={classes.actions}>
            <button
              class={classes.action}
              onClick={() => props.onAdd(props.index)}
            >
              新增
            </button>
            <button
              class={classes.action}
              onClick={() => props.onDelete(props.index)}
            >
              删除
            </button>
            <button
              class={classes.action}
              onClick={() => props.onUp(props.index)}
            >
              上移
            </button>
            <button
              class={classes.action}
              onClick={() => props.onDown(props.index)}
            >
              下移
            </button>
          </div>
          <div class={classes.content}>{slots.default && slots.default()}</div>
        </div>
      )
    }
  },
})

/**
 * arrayFiled 存在的 3 种类型
 *
 * {
 *   items: { type: string },
 * }
 *
 * {
 *   items: [
 *    { type: string },
 *    { type: number }
 *   ]
 * }
 *
 * {
 *   items: { type: string, enum: ['1', '2'] },
 * }
 */
export default defineComponent({
  name: 'ArrayFiled',
  props: FiledPropsDefine,
  setup(props) {
    const context = useVJSFContext()

    const handleArrayItemChange = (v: any, index: number) => {
      const arr = Array.isArray(props.value) ? props.value : []
      arr[index] = v
      props.onChange(arr)
    }

    const handleAdd = (index: number) => {
      const arr = Array.isArray(props.value) ? props.value : []
      arr.splice(index + 1, 0, undefined)
      props.onChange(arr)
    }

    const handleDelete = (index: number) => {
      const arr = Array.isArray(props.value) ? props.value : []
      arr.splice(index, 1)
      props.onChange(arr)
    }

    const handleUp = (index: number) => {
      if (index === 0) return
      const arr = Array.isArray(props.value) ? props.value : []
      const item = arr.splice(index, 1)
      // item 的类型是数组  需要取它的第一个值
      arr.splice(index - 1, 0, item[0])
      props.onChange(arr)
    }

    const handleDown = (index: number) => {
      const arr = Array.isArray(props.value) ? props.value : []
      if (index === arr.length - 1) return
      const item = arr.splice(index, 1)
      arr.splice(index + 1, 0, item[0])
      props.onChange(arr)
    }

    /**
     * array.splice(index,howmany,item1,.....,itemX)
     * 
     * index	必需。规定从何处添加/删除元素。该参数是开始插入和（或）删除的数组元素的下标，必须是数字。
     * 
     * howmany	可选。规定应该删除多少元素。必须是数字，但可以是 "0"。 如果未规定此参数，则删除从 index 开始到原数组结尾的所有元素。
     * 
     * item1, ..., itemX	可选。要添加到数组的新元素
     *
     * */

    const SelectionWidgetRef = getWidget(SelectionWidgetNames.SelectionWidget)

    return () => {
      const { schema, rootSchema, value } = props

      // const SelectionWidget = context.theme.widgets.SelectionWidget
      const SelectionWidget = SelectionWidgetRef.value

      const { SchemaItem } = context

      const isMultiType = Array.isArray(schema.items)
      const isSelect = schema.items && (schema.items as any).enum

      if (isMultiType) {
        const arr = Array.isArray(value) ? value : []
        // 渲染固定数组的节点
        return (schema.items as Schema[]).map((s: Schema, index: number) => (
          <SchemaItem
            schema={s}
            key={index}
            rootSchema={rootSchema}
            value={arr[index]}
            onChange={(v: any) => handleArrayItemChange(v, index)}
          />
        ))
      } else if (!isSelect) {
        const arr = Array.isArray(value) ? value : []

        // 渲染单一类型的数组 它没有限制数组的长度 需要进行增删操作
        return arr.map((v: any, index: number) => {
          return (
            <ArrayItemWrapper
              index={index}
              onAdd={handleAdd}
              onDelete={handleDelete}
              onDown={handleDown}
              onUp={handleUp}
            >
              <SchemaItem
                schema={schema.items as Schema}
                value={v}
                key={index}
                rootSchema={rootSchema}
                onChange={(v: any) => handleArrayItemChange(v, index)}
              />
            </ArrayItemWrapper>
          )
        })
      } else {
        const enumOptions = (schema as any).items.enum
        const options = enumOptions.map((e: any) => ({
          key: e,
          value: e,
        }))

        // 渲染 enum 类型
        return (
          <SelectionWidget
            onChange={props.onChange}
            value={props.value}
            options={options}
          />
        )
      }
    }
  },
})
