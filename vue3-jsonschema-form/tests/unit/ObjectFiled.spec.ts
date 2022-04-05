import { mount, shallowMount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

import  { SchemaForm,NumberFiled, StringFiled } from '../../lib'

describe('ObjectFiled', () => {
  let schema: any
  beforeEach(() => {
    schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        age: {
          type: 'number',
        },
      },
    }
  })

  it('should render properties to correct fileds', async () => {
    const wrapper = mount(SchemaForm, {
      props: {
        schema,
        value: {},
        onChange: () => {},
      },
    })

    const strFiled = wrapper.findComponent(StringFiled)
    const numFiled = wrapper.findComponent(NumberFiled)

    expect(strFiled.exists()).toBeTruthy()
    expect(numFiled.exists()).toBeTruthy()
  })

  it('should change value when sub fileds trigger onChange', async () => {
    let value: any = {}
    const wrapper = mount(SchemaForm, {
      props: {
        schema,
        value: value,
        onChange: (v) => {
          value = v
        },
      },
    })

    const strFiled = wrapper.findComponent(StringFiled)
    const numFiled = wrapper.findComponent(NumberFiled)

    await strFiled.props('onChange')('1')
    expect(value.name).toEqual('1')
    await numFiled.props('onChange')(1)
    expect(value.age).toEqual(1)
    // expect(numFiled.exists()).toBeTruthy()
  })

  it('should render properties to correct fileds', async () => {
    let value: any = {
      name: '123',
    }
    const wrapper = mount(SchemaForm, {
      props: {
        schema,
        value: value,
        onChange: (v) => {
          value = v
        },
      },
    })

    const strFiled = wrapper.findComponent(StringFiled)
    // const numFiled = wrapper.findComponent(NumberFiled)
    await strFiled.props('onChange')(undefined)

    expect(value.name).toBeUndefined()
    // expect(numFiled.exists()).toBeTruthy()
  })
})
