<template>
  <tab-bar>
    <template #content>
      <van-image class="user-poster" :src="require('./images/header_bg.png')">
        <van-button
          v-if="!user"
          class="user-poster__button"
          size="small"
          @click="_getAuthorizedCode">
          登录
        </van-button>
        <p v-else class="user-poster__username">{{ user.name }}</p>
      </van-image>
      <van-row class="user-links">
        <van-col span="6">
          <router-link tag="div" to="/order?status=pendingPayment">
            <van-icon name="pending-payment" :badge="orderCount.pending_payment || null"/>
            <span>待付款</span>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link tag="div" to="/order?status=shipped">
            <van-icon name="tosend" :badge="orderCount.shipped || null"/>
            <span>等待收货</span>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link tag="div" to="/order?status=completed">
            <van-icon name="sign"/>
            <span>已完成</span>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link tag="div" to="/order?status=refunding">
            <van-icon name="refund-o"/>
            <span>退款中</span>
          </router-link>
        </van-col>
      </van-row>
      <van-cell-group class="user-group">
        <van-cell icon="records" title="全部订单" is-link to="/order?status=all"/>
      </van-cell-group>

      <van-cell-group>
        <van-cell icon="location-o" title="我的地址" is-link to="/address-list"/>
        <van-cell icon="gold-coin-o" title="我的优惠券" is-link to="/coupon"/>
        <van-cell icon="setting-o" title="设置" is-link to="/setting"/>
      </van-cell-group>
    </template>
  </tab-bar>
</template>

<script type="es6">
import { TabBar } from '@/components'
import { mapGetters } from 'vuex'

export default {
  components: {
    TabBar
  },
  name: 'Mine',
  computed: {
    ...mapGetters([
      'user',
      'orderCount'
    ])
  },
  mounted() {
    this.$store.dispatch('GetUser')
    this.$store.dispatch('GetOrderCount')
  },
  methods: {
    /**
     * 获取授权码
     */
    _getAuthorizedCode() {
      this.$store.dispatch('GetAuthorizedCode')
    }
  }
}
</script>

<style lang="less">
.user {
  &-poster {
    width: 100%;
    height: 53vw;
    display: block;

    &__button {
      position: absolute;
      left: 50%;
      bottom: 5px;
      transform: translate(-50%, 0);
      width: 80px;
    }

    &__username {
      position: absolute;
      left: 50%;
      bottom: 15px;
      transform: translate(-50%, 0);
      width: 100px;
      text-align: center;
    }
  }

  &-group {
    margin-bottom: 15px;
  }

  &-links {
    padding: 15px 0;
    font-size: 12px;
    text-align: center;
    background-color: #fff;

    .van-icon {
      display: block;
      margin: 0 auto;
      font-size: 24px;
      width: 35px;
    }
  }
}
</style>
