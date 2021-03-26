<template>
  <page-layout>
    <template #header>
      <van-nav-bar
        title="收银台"
        left-arrow
        @click-left="back"
      />
    </template>
    <template #content>
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell clickable label="仅安装微信6.0.2 及以上版本客户端使用">
            <!-- 使用 title 插槽来自定义标题 -->
            <template #title>
              <div class="payment-title">
                <van-image :src="require('./images/wx_pay.png')" width="24" height="24"/>
                <span class="payment-title__title">微信支付</span>
              </div>
            </template>
            <template #right-icon>
              <van-radio name="wx" :checked-color="checkedColor"/>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </template>
    <template #footer>
      <div class="payment-footer" v-if="order" @click="_payment">
        <van-button type="danger" block round>微信支付{{ order.amount | Amount }}</van-button>
      </div>
    </template>
  </page-layout>
</template>

<script type="es6">
import { PageLayout } from '@/layouts'
import { Toast } from 'vant'
import { payment } from '@/api/payment'
import { ERR_OK } from '@/api/config'

export default {
  components: {
    PageLayout
  },
  name: 'Payment',
  data() {
    return {
      checkedColor: '#ee0a24',
      radio: 'wx',
      order: null
    }
  },
  mounted() {
    this._getOrderDetail()
  },
  methods: {
    back() {
      this.$router.push({ name: 'Order', query: { status: 'all' } })
    },
    /**
     * 获取订单详情
     */
    _getOrderDetail() {
      const sn = this.$route.params.sn
      this.$store.dispatch('GetOrderDetail', sn).then((data) => {
        this.order = data.order
      })
    },
    /**
     * 支付
     */
    _payment() {
      const sn = this.$route.params.sn
      const _this = this
      payment(sn).then((res) => {
        if (res.err_code === ERR_OK) {
          const data = res.data
          if (typeof WeixinJSBridge === 'undefined') {
            if (document.addEventListener) {
              document.addEventListener('WeixinJSBridgeReady', _this.onBridgeReady(data), false)
            } else if (document.attachEvent) {
              document.attachEvent('WeixinJSBridgeReady', _this.onBridgeReady(data))
              document.attachEvent('onWeixinJSBridgeReady', _this.onBridgeReady(data))
            }
          } else {
            _this.onBridgeReady(data)
          }
        }
      })
    },
    /**
     * 微信支付API成功回调
     * @param json
     */
    onBridgeReady(json) {
      /* eslint-disable */
      let _this = this
      WeixinJSBridge.invoke('getBrandWCPayRequest', {
          'appId': json.appId,                 //公众号名称，由商户传入
          'timeStamp': json.timestamp,         //时间戳，自1970年以来的秒数
          'nonceStr': json.nonceStr,           //随机串
          'package': json.package,
          'signType': json.signType,           //微信签名方式：
          'paySign': json.paySign              //微信签名
        }, function (res) {
          // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回 ok，但并不保证它绝对可靠。
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            Toast('支付成功!')
            _this.$router.push({ name: 'Mine' })
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            Toast('支付取消!')
          } else {
            Toast(res)
          }
        }
      )
      /* eslint-disable */
    },
  }
}
</script>

<style scoped lang="less">
.payment-title {
  display: flex;
  align-items: center;
  font-size: 14px;

  &__title {
    margin-left: 5px;
  }
}

.payment-footer {
  position: fixed;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  padding: 10px;
  box-sizing: border-box;
  background: #fff;
}
</style>
