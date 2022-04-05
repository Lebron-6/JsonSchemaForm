import { defineComponent, ref, Ref, reactive, watchEffect } from 'vue'
import { SchemaForm, ThemeProvider } from '../lib'
import { createUseStyles } from 'vue-jss'
import MonacoEditor from './components/MonacoEditor'
import demos from './demos'
import themeDefault from '../lib/theme-default'

// TODO: 在lib中export
type Schema = any
type UISchema = any

function toJson(data: any) {
  return JSON.stringify(data, null, 2)
  // @2 表示 返回值文本在每个级别缩进指定数目的空格，
}

/**
 * JSON.stringify(value[, replacer[, space]])
 *
 * value: 必需， 要转换的 JavaScript 值（通常为对象或数组）。
 *
 * replacer:可选。用于转换结果的函数或数组。
 * 如果 replacer 为函数，则 JSON.stringify 将调用该函数，并传入每个成员的键和值。使用返回值而不是原始值。
 * 如果此函数返回 undefined，则排除成员。根对象的键是一个空字符串：""。
 * 如果 replacer 是一个数组，则仅转换该数组中具有键值的成员。成员的转换顺序与键在数组中的顺序一样。
 *
 * space:可选，文本添加缩进、空格和换行符，
 * 如果 space 是一个数字，则返回值文本在每个级别缩进指定数目的空格，
 * 如果 space 大于 10，则文本缩进 10 个空格。space 也可以使用非数字，如：\t。
 *
 */

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '1200px',
    margin: '0 auto',
  },
  menu: {
    marginBottom: 20,
  },
  code: {
    width: 700,
    flexShrink: 0,
  },
  codePanel: {
    minHeight: 400,
    marginBottom: 20,
  },
  uiAndValue: {
    display: 'flex',
    justifyContent: 'space-between',
    '& > *': {
      width: '46%',
    },
  },
  content: {
    display: 'flex',
  },
  form: {
    padding: '0 20px',
    flexGrow: 1,
  },
  menuButton: {
    appearance: 'none',
    borderWidth: 0,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    display: 'inline-block',
    padding: 15,
    borderRadius: 5,
    '&:hover': {
      background: '#efefef',
    },
  },
  menuSelected: {
    background: '#337ab7',
    color: '#fff',
    '&:hover': {
      background: '#337ab7',
    },
  },
})

export default defineComponent({
  setup() {
    // setup是一个组件选项，在组件被创建之前，props 被解析之后执行。

    const selectedRef: Ref<number> = ref(0)

    const demo: {
      schema: Schema | null
      data: any
      uiSchema: UISchema | null
      // 对应 3 个编辑区域的内容
      schemaCode: string
      dataCode: string
      uiSchemaCode: string
    } = reactive({
      schema: null,
      data: {},
      uiSchema: {},
      schemaCode: '',
      dataCode: '',
      uiSchemaCode: '',
    })

    watchEffect(() => {
      const index = selectedRef.value
      // index 拿到的是 demos 的 [simple, demo]
      const d = demos[index]
      demo.schema = d.schema
      demo.data = d.default
      demo.uiSchema = d.uiSchema
      demo.schemaCode = toJson(d.schema)
      demo.dataCode = toJson(d.default)
      demo.uiSchemaCode = toJson(d.uiSchema)
    })

    const methodRef: Ref<any> = ref()

    const classesRef = useStyles()

    const handleChange = (v: any) => {
      demo.data = v
      demo.dataCode = toJson(v)
    }

    function handleCodeChange(
      // 工厂函数 当编辑器中的内容变化时 触发
      filed: 'schema' | 'data' | 'uiSchema',
      value: string,
    ) {
      try {
        const json = JSON.parse(value)
        demo[filed] = json(demo as any)[`${filed}Code`] = value
      } catch (err) {
        // some thing
      }
    }

    const handleSchemaChange = (v: string) => handleCodeChange('schema', v)
    const handleDataChange = (v: string) => handleCodeChange('data', v)
    const handleUISchemaChange = (v: string) => handleCodeChange('uiSchema', v)

    // 可以在setup选项里直接return ()=> h() 或者多个return ()=> [h(),h()]，不用再写render了

    /**
     * 如果返回了渲染函数，则不能再返回其他 property。如果需要将 property 暴露给外部访问，比如通过父组件的 ref，可以使用 expose：
     * expose({ xxx })
    */

    return () => {
      const classes = classesRef.value
      const selected = selectedRef.value

      return (
        // <StyleThemeProvider>
        // <VJSFThemeProvider theme={theme as any}>
        <div class={classes.container}>
          <div class={classes.menu}>
            <h1>Vue3 JsonSchema Form</h1>
            <div>
              {demos.map((demo, index) => (
                <button
                  class={{
                    [classes.menuButton]: true,
                    [classes.menuSelected]: index === selected,
                  }}
                  onClick={() => (selectedRef.value = index)}
                >
                  {demo.name}
                </button>
              ))}
            </div>
          </div>
          <div class={classes.content}>
            <div class={classes.code}>
              <MonacoEditor
                code={demo.schemaCode}
                class={classes.codePanel}
                onChange={handleSchemaChange}
                title="Schema"
              />
              <div class={classes.uiAndValue}>
                <MonacoEditor
                  code={demo.uiSchemaCode}
                  class={classes.codePanel}
                  onChange={handleUISchemaChange}
                  title="UISchema"
                />
                <MonacoEditor
                  code={demo.dataCode}
                  class={classes.codePanel}
                  onChange={handleDataChange}
                  title="Value"
                />
              </div>
            </div>
            <div class={classes.form}>
              <ThemeProvider theme={themeDefault}>
                <SchemaForm
                  schema={demo.schema}
                  onChange={handleChange}
                  value={demo.data}
                />
              </ThemeProvider>
              {/* <SchemaForm
                schema={demo.schema!}
                uiSchema={demo.uiSchema!}
                onChange={handleChange}
                contextRef={methodRef}
                value={demo.data}
              /> */}
            </div>
          </div>
        </div>
        // </VJSFThemeProvider>
        // </StyleThemeProvider>
      )
    }
  },
})
