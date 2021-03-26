<template>
  <div class="empty-wrapper">
    <van-empty class="empty" :description="description"/>
  </div>
</template>

<script type="es6">
export default {
  name: 'Empty',
  props: {
    description: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="less">
.empty-wrapper {
  .empty {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    z-index: 100;
  }
}
</style>
