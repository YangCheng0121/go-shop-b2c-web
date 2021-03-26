<template>
  <div class="divider-wrapper" :style="{width: width + '%'}">
    <van-divider>{{ text }}</van-divider>
  </div>
</template>

<script type="es6">
import { Divider } from 'vant'

export default {
  components: {
    [Divider.name]: Divider
  },
  name: 'Divider',
  props: {
    text: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 100
    }
  }
}
</script>

<style scoped lang="less">
.divider-wrapper {
  display: block;
}
</style>
