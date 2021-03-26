<template>
  <div class="tab-bar-wrapper">
    <div class="tab-bar-content">
      <slot name="content"></slot>
    </div>
    <van-tabbar active-color="#ee0a24" route class="tab-bar box-shadow">
      <van-tabbar-item name="Index" icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item name="Category" icon="apps-o" to="/category">分类</van-tabbar-item>
      <van-tabbar-item name="ShopCart" icon="cart-o" to="/shopcart">购物车</van-tabbar-item>
      <van-tabbar-item name="Mine" icon="contact" to="/mine">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script type="es6">
import { Tabbar, TabbarItem } from 'vant'

export default {
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  },
  name: 'TabBar'
}
</script>

<style scoped lang="less">
.tab-bar-wrapper {
  width: 100%;
  height: 100%;
}

.tab-bar-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  overflow: hidden;
}

</style>
