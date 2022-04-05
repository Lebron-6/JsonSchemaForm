<template>
  <input :value="value" type="number" @input="handleChange" />
</template>

<script lang="ts" setup="props">
import { FiledPropsDefine, Schema } from '../types'

export default {
  name: 'NumberFeild',
  props: FiledPropsDefine,
}

declare const props: {
  value: any
  onChange: (v: any) => void
  schema: Schema
}

export const handleChange = (e: any) => {
  const num = Number(e.target.value)
  // 把 string 类型 转为 number 类型
  if (Number.isNaN(num)) {
    props.onChange(undefined)
  } else {
    props.onChange(num)
  }
}
</script>
