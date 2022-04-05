import { mount, shallowMount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

import { SchemaForm, NumberFiled } from '../../lib'

describe('JsonSchemaFrom', () => {
  it('should render correct number filed', async () => {
    let value = ''
    const wrapper = mount(SchemaForm, {
      props: {
        schema: {
          type: 'number',
        },
        value: value,
        onChange: (v) => {
          value = v
        },
      },
    })

    const numberFiled = wrapper.findComponent(NumberFiled)
    expect(numberFiled.exists()).toBeTruthy()
    // await numberFiled.props('onChange')('123')
    const input = numberFiled.find('input')
    input.element.value = '123'
    input.trigger('input')
    expect(value).toBe(123)
  })
})
