<template>
  <page-layout :before-content="50" v-if="checkoutOrder">
    <template #header>
      <van-nav-bar
        title="确认订单"
        left-arrow
        @click-left="back"
      />
    </template>
    <template #content>
      <!--Receive Address-->
      <div class="receive-address" @click="toAddressListPage">
        <template v-if="checkoutOrderReceiver">
          <div class="receive-address__name">
            {{ checkoutOrderReceiver.consignee }} {{ checkoutOrderReceiver.phone }}
          </div>
          <div class="receive-address__address">
            <van-tag type="danger" v-if="checkoutOrderReceiver.is_default">默认</van-tag>
            {{ checkoutOrderReceiver.area_name }} {{ checkoutOrderReceiver.address }}
          </div>
        </template>
        <div class="receive-address__empty" v-else>
          添加地址
        </div>
        <div class="receive-address__right-icon">
          <van-icon name="arrow" color="#666" size="15"/>
        </div>
      </div>
      <!--Product List-->
      <div class="product-list">
        <div class="product-list__header">
          <van-icon name="shop-o" color="#E5E5E5" size="18"/>
          <span>BeeShop</span>
        </div>
        <ul class="product-list__list">
          <li class="list-item" v-for="cartItem in checkoutOrder.cart_items" :key="cartItem.id">
            <van-card
              class="list-item__product"
              :num="cartItem.quantity"
              :price="cartItem.sku.price.toFixed(2)"
              :desc="cartItem.product.caption"
              :title="cartItem.product.name"
              :thumb="cartItem.product.image.medium"
            >
              <template #tags>
                <div>
                  <van-tag
                    class="tag"
                    type="danger"
                    v-for="promotion in cartItem.product.promotions"
                    :key="promotion.id">
                    {{ promotion.name }}
                  </van-tag>
                </div>
              </template>
            </van-card>
          </li>
        </ul>
        <!-- 优惠券单元格 -->
        <van-coupon-cell
          :border="false"
          :coupons="coupons"
          :chosen-coupon="chosenCoupon"
          @click="showList = true"
        />
        <van-cell title="支付方式" :value="paymentMethod.name" is-link @click="showPaymentMethodActionSheet = true"/>
        <van-cell
          title="配送"
          label="工作日、双休日与节假日均可送货"
          :value="shippingMethod.name"
          is-link
          :border="false"
          @click="showShippingMethodActionSheet= true"/>
        <van-field v-model="memo" label="留言" placeholder="选填，给商家留言" input-align="right" :border="false"/>
      </div>
      <!--Order Total-->
      <div class="order-total">
        <van-cell title="商品总额" :border="false">
          <template #default>
            <span>{{ checkoutOrder.amount | Amount }}</span>
          </template>
        </van-cell>
        <van-cell title="运费" :border="false">
          <template #default>
            <span class="price">{{ checkoutOrder.fee | Amount }}</span>
          </template>
        </van-cell>
        <van-cell title="" :border="false">
          <template #default>
            <span>总计:</span>
            <span
              class="price">
              {{ getTotal(checkoutOrder) | Amount }}
            </span>
          </template>
        </van-cell>
      </div>
      <!-- 优惠券列表 -->
      <van-popup
        v-model="showList"
        round
        position="bottom"
        style="height: 90%; padding-top: 4px;"
        get-container="body"
      >
        <van-coupon-list
          :show-exchange-bar="false"
          :coupons="coupons"
          :chosen-coupon="chosenCoupon"
          :disabled-coupons="disabledCoupons"
          @change="onChange"
        />
      </van-popup>
      <van-action-sheet
        v-model="showPaymentMethodActionSheet"
        :actions="paymentMethodActions"
        get-container="body"
        @select="onPaymentMethodSelect"/>
      <van-action-sheet
        v-model="showShippingMethodActionSheet"
        :actions="shippingMethodActions"
        get-container="body"
        @select="onShippingMethodSelect"/>
    </template>
    <template #footer>
      <van-submit-bar
        :price="getTotal(checkoutOrder)*100"
        button-text="提交订单"
        @submit="onSubmit"
        class="van-hairline--top box-shadow"/>
    </template>
  </page-layout>
</template>

<script type="es6">
import { PageLayout } from '@/layouts'
import { addOrder, getShippingMethodList, getOrderCoupon, getPaymentMethodList } from '@/api/order'
import { mapGetters } from 'vuex'
import { ERR_OK } from '@/api/config'
import moment from 'moment'

export default {
  components: {
    PageLayout
  },
  name: 'ConfirmOrder',
  computed: {
    ...mapGetters([
      'checkoutOrder',
      'checkoutOrderReceiver'
    ])
  },
  watch: {
    checkoutOrder(newOrder) {
      if (!newOrder) {
        this.$router.push({ name: 'ShopCart' })
      }
    }
  },
  data() {
    return {
      memo: '',
      chosenCoupon: -1,
      coupons: [],
      disabledCoupons: [],
      showList: false,
      showPaymentMethodActionSheet: false,
      paymentMethodActions: [],
      paymentMethod: {},
      showShippingMethodActionSheet: false,
      shippingMethodActions: [],
      shippingMethod: {}
    }
  },
  mounted() {
    this._getOrderCoupon()
    this._getPaymentMethodList()
    this._getShippingMethodList()
  },
  methods: {
    back() {
      this.$router.back()
    },
    onChange(index) {
      this.showList = false
      this.chosenCoupon = index
    },
    /**
     * 跳转收货地址
     */
    toAddressListPage() {
      this.$router.push({
        name: 'AddressList',
        query: { from: 'confirm-order' }
      })
    },
    /**
     * 提交订单
     */
    onSubmit() {
      this._addOrder()
    },
    /**
     * 总计
     * @param order
     * @returns {number}
     */
    getTotal(order) {
      return order.amount - order.coupon_discount - order.promotion_discount
    },
    /**
     * 获取订单优惠券
     * @private
     */
    _getOrderCoupon() {
      const cartKey = this.checkoutOrder.cart_key
      const cartItems = this.checkoutOrder.cart_items.map((item) => {
        return item.id
      }).join(',')
      getOrderCoupon(cartKey, cartItems).then((res) => {
        if (res.err_code === ERR_OK) {
          const data = res.data
          if (data.available) {
            data.available.forEach((item) => {
              const coupon = item.coupon
              this.coupons.push({
                code: item.code,
                available: 1,
                condition: coupon.condition,
                value: coupon.value * 100,
                name: coupon.name,
                startAt: moment(coupon.begin_date).unix(),
                endAt: moment(coupon.end_date).unix(),
                valueDesc: coupon.value.toFixed(2),
                unitDesc: '元'
              })
            })
          }
          if (data.un_available) {
            data.un_available.forEach((item) => {
              const coupon = item.coupon
              this.disabledCoupons.push({
                code: item.code,
                reason: '优惠券过期或者不满足条件',
                available: 1,
                condition: coupon.condition,
                value: coupon.value * 100,
                name: coupon.name,
                startAt: moment(coupon.begin_date).unix(),
                endAt: moment(coupon.end_date).unix(),
                valueDesc: coupon.value.toFixed(2),
                unitDesc: '元'
              })
            })
          }
        }
      })
    },
    /**
     * 选择支付方法
     */
    onPaymentMethodSelect(action) {
      this.paymentMethod = action
      this.showPaymentMethodActionSheet = false
    },
    /**
     * 获取支付方法
     */
    _getPaymentMethodList() {
      getPaymentMethodList({}).then((res) => {
        if (res.err_code === ERR_OK) {
          this.paymentMethodActions = res.data
          this.paymentMethod = res.data[0]
        }
      })
    },
    /**
     * 选择配送方法
     */
    onShippingMethodSelect(action) {
      this.shippingMethod = action
      this.showShippingMethodActionSheet = false
    },
    /**
     * 获取配送方法
     */
    _getShippingMethodList() {
      getShippingMethodList({}).then((res) => {
        if (res.err_code === ERR_OK) {
          this.shippingMethodActions = res.data
          this.shippingMethod = res.data[0]
        }
      })
    },
    /**
     * 创建订单
     * @private
     */
    _addOrder() {
      const cartItems = this.checkoutOrder.cart_items.map((item) => {
        return item.id
      }).join(',')
      let code = ''
      if (this.coupons.length && this.chosenCoupon > -1) {
        code = this.coupons[this.chosenCoupon].code
      }
      const cartKey = this.checkoutOrder.cart_key
      const receiverId = this.checkoutOrderReceiver.id
      const paymentMethodId = this.paymentMethod.id
      const shippingMethodId = this.shippingMethod.id
      addOrder({
        cartItems,
        code,
        cartKey,
        receiverId,
        paymentMethodId,
        shippingMethodId
      }).then((res) => {
        if (res.err_code === ERR_OK) {
          const data = res.data
          this.$store.dispatch('GetShopCartCarItems')
          this.$store.dispatch('GetShopCartCount')
          this.$store.dispatch('GetOrderCount')
          this.$store.dispatch('GetOrderList', { pageNumber: 1, pageSize: 10 })
          this.$router.push({
            name: 'Payment',
            params: { sn: data.sn }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "../../utils/css/index";

//Receive Address
.receive-address {
  position: relative;
  padding: 12px 10px;
  background: #fff;

  &::before {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 2px;
    background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
    background-size: 80px;
    content: '';
  }

  &__name {
    line-height: 24px;
    font-size: 16px;
    font-weight: 700;
  }

  &__address {
    line-height: 21px;
    font-size: 14px;
    color: #666;
  }

  &__empty {
    height: 30px;
    line-height: 30px;
    text-align: center;
  }

  &__right-icon {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(0, -50%);
  }
}

// Product List
.product-list {
  margin-top: 10px;
  border-radius: 10px;
  background: #fff;

  &__header {
    display: flex;
    align-items: center;
    padding: 12px 10px;
    font-size: 14px;

    span {
      margin-left: 3px;
      font-weight: 700;
    }
  }

  &__list {
    .list-item {
      &__product {
        background: #fff;

        /deep/ .tag {
          margin-right: 4px;

        }
      }
    }
  }
}

//Order Total
.order-total {
  margin-top: 10px;
  border-radius: 10px;

  span {
    color: #333;
  }

  .price {
    color: @theme;
  }
}
</style>
