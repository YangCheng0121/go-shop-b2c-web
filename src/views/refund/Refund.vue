<template>
  <page-layout>
    <template #header>
      <van-nav-bar
        title="退款/售后"
        left-arrow
        @click-left="back"
      />
    </template>
  </page-layout>
</template>

<script type="es6">
import { PageLayout } from '@/layouts'

export default {
  components: {
    PageLayout
  },
  name: 'Refund',
  methods: {
    back() {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">

</style>
