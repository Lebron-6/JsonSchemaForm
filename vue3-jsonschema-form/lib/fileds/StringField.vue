<template>
  <input type="text" :value="value" @input="handleChange" />
</template>

<script lang="ts" setup="props">
import { FiledPropsDefine, Schema } from '../types'

export default {
  props: FiledPropsDefine,
}

declare const props: {
  value: any
  schema: Schema
  onChange: (v: string) => void
}

export const handleChange = (e: any) => {
  props.onChange(e.target.value)
}
</script>
