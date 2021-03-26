<template>
  <page-layout :before-content="beforeContent" v-if="detail.order">
    <template #header>
      <van-nav-bar
        title="订单详情"
        left-arrow
        @click-left="back"
      />
    </template>
    <template #content>
      <!--Order Status-->
      <div class="order-status">
        <van-image
          width="18"
          height="18"
          class="order-status__icon"
          :src="require('./images/fail.png')"
        />
        <div class="order-status__label">
          <div class="order-status__label_txt">{{ detail.order.status_name }}</div>
          <div class="order-status__label_tip">{{ detail.order.tip }}</div>
        </div>
      </div>
      <!--Address-->
      <div class="address-wrapper">
        <div class="location-wrapper">
          <van-icon name="location" color="#CCCCCC" size="20"/>
        </div>
        <div class="address">
          <div class="address__user">{{ detail.order.consignee }} {{ detail.order.phone }}</div>
          <div class="address__adr">
            {{ detail.order.area_name }}
            <span>{{ detail.order.address }}</span>
          </div>
        </div>
      </div>
      <!--Product List-->
      <div class="product-list">
        <div class="product-list__title van-hairline--bottom">
          <span class="product-list__title_name">BeeShop</span>
          <span class="product-list__title_total">共计 {{ getTotalQuantity(detail.order_items) }} 件商品</span>
        </div>
        <div class="product-list__content">
          <van-card
            v-for="item in detail.order_items"
            :key="item.id"
            :num="item.quantity"
            :price="item.price.toFixed(2)"
            :title="item.name"
            :thumb="item.thumbnail"
            class="product-list__content_product"
          >
            <template #footer>
              <van-button size="mini" plain round v-if="isShowAfterSale">申请售后</van-button>
            </template>
          </van-card>
        </div>
      </div>
      <div class="order-info-wrapper">
        <!--Order Info-->
        <div class="order-info van-hairline--bottom">
          <div class="order-info__item">
            <span class="order-info__item_title">订单编号：</span>
            <span class="order-info__item_label">{{ detail.order.sn }}</span>
            <van-button size="mini" round>复制</van-button>
          </div>
          <div class="order-info__item">
            <span class="order-info__item_title">下单时间：</span>
            <span class="order-info__item_label">{{ detail.order.creation_date | Moment }}</span>
          </div>
          <div class="order-info__item">
            <span class="order-info__item_title">支付方式：</span>
            <span class="order-info__item_label">{{ detail.order.payment_method_name }}</span>
          </div>
          <div class="order-info__item">
            <span class="order-info__item_title">配送方式：</span>
            <span class="order-info__item_label">{{ detail.order.shipping_method_name }}</span>
          </div>
        </div>
        <!--Order Total-->
        <div class="order-total">
          <div class="order-total__item">
            <span class="order-total__item_title">商品总额</span>
            <span class="order-total__item_price">{{ getTotalAmount(detail.order_items) | Amount }}</span>
          </div>
          <div class="order-total__item">
            <span class="order-total__item_title">优惠</span>
            <span class="order-total__item_price">-{{ getDiscountAmount(detail.order) | Amount }}</span>
          </div>
          <div class="order-total__item">
            <span class="order-total__item_title">运费</span>
            <span class="order-total__item_price">+{{ detail.order.fee | Amount }}</span>
          </div>
          <div class="order-total__total">
            应付金额：
            <span class="order-total__item_price">{{ detail.order.amount | Amount }}</span>
          </div>
        </div>
      </div>
      <!--ProductList-->
      <product-list :data="guessProductPageList.list"/>
    </template>
    <template #footer>
      <!--Order Detail Footer-->
      <div class="order-detail__footer" v-if="isShowButtons">
        <van-button
          plain
          round
          class="order-detail__footer_button"
          v-for="(button,index) in detail.order.buttons"
          :class="{'red': button.color}"
          :key="index"
          @click="button.callback(detail.order.sn, () => back())">
          {{ button.title }}
        </van-button>
      </div>
    </template>
  </page-layout>
</template>
<script type="es6">
import { PageLayout } from '@/layouts'
import { ProductList } from '@/components'
import { mapGetters } from 'vuex'
import orderMixin from '@/mixins/order'

export default {
  components: {
    PageLayout,
    ProductList
  },
  name: 'OrderDetail',
  mixins: [orderMixin],
  computed: {
    /**
     * 是否显示售后按钮
     */
    isShowAfterSale() {
      return this.status[this.detail.order.status] === 'completed'
    },
    beforeContent() {
      return this.detail.order.buttons.length ? 50 : 0
    },
    /**
     * 是否显示按钮组
     */
    isShowButtons() {
      return this.detail.order.buttons.length
    },
    ...mapGetters([
      'guessProductPageList'
    ])
  },
  data() {
    return {
      list: [1, 2, 3, 4, 5, 6],
      detail: {},
      status: {
        0: 'pendingPayment',
        1: 'pendingReview',
        3: 'shipped',
        5: 'completed'
      }
    }
  },
  mounted() {
    this._getOrderDetail()
    this.$store.dispatch('GetGuessProductList', {
      pageNumber: 1,
      pageSize: 10
    })
  },
  methods: {
    back() {
      this.$router.back()
    },
    /**
     * 获取订单详情
     * @private
     */
    _getOrderDetail() {
      const sn = this.$route.params.sn
      this.$store.dispatch('GetOrderDetail', sn).then((data) => {
        this.setTip(data.order)
        this.generateButtonsByOrderStatus(data.order)
        this.detail = data
      })
    },
    /**
     * 设置提示语
     */
    setTip(order) {
      switch (this.status[order.status]) {
        case 'pendingPayment':
          order.tip = '亲，请尽快支付哦'
          break
        case 'pendingReview':
          order.tip = '订单已提交后台，火速处理中'
          break
        case 'shipped':
          order.tip = '订单已发货，请等待物流配送'
          break
        case 'completed':
          order.tip = '订单已签收，感谢您的使用'
          break
      }
    }
  }
}
</script>
<style scoped lang="less">
@import "../../utils/css/index";

// Order Status
.order-status {
  position: relative;
  padding: 12px 10px;
  align-items: center;
  font-size: 12px;
  line-height: 18px;
  background-image: linear-gradient(90deg, #f66d70, #e93b3d);
  color: #fff;

  &__icon {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translate(0, -50%);
  }

  &__label {
    display: inline-block;
    padding-left: 25px;

    &_txt {
      line-height: 24px;
      font-size: 16px;
      font-weight: 400;
    }

    &_tip {
      font-size: 12px;
    }
  }
}

// Address
.address-wrapper {
  display: flex;
  align-items: center;
  padding: 11px 10px 12px;
  background: #fff;

  .location-wrapper {
    flex: 0 0 40px;
    text-align: center;
  }

  .address {
    flex: 1;

    &__user {
      line-height: 21px;
      font-size: 14px;
      color: #333;
    }

    &__adr {
      font-size: 12px;
      line-height: 18px;
      color: #999;
    }
  }
}

// Product List
.product-list {
  margin-top: 10px;
  border-radius: 10px;
  background: #fff;

  &__title {
    padding: 11px 10px;
    line-height: 24px;
    font-size: 16px;
    color: #333;

    &_total {
      float: right;
      font-size: 12px;
      font-weight: 400;
      color: #999;
    }
  }

  &__content {
    &_product {
      background: #fff;
    }
  }
}

.order-info-wrapper {
  margin-top: 10px;
  border-radius: 10px;
  background: #fff;

  // Order Info
  .order-info {
    padding: 12px 10px;

    &__item {
      padding-top: 3px;
      font-size: 14px;
      line-height: 21px;

      &_title {
        min-width: 70px;
        color: #999;
      }

      &_label {
        margin-right: 3px;
        width: 100%;
        color: #151515;
      }
    }
  }

  // Order Total
  .order-total {
    padding: 12px 10px;
    overflow: hidden;

    &__item {
      line-height: 21px;
      font-size: 14px;
      color: #333;
      font-weight: 400;

      &_price {
        float: right;
        color: @theme;
      }
    }

    &__total {
      float: right;
      margin-top: 8px;
      font-size: 16px;
      line-height: 24px;
      color: #333;
      font-weight: 700;

      &_price {
        float: right;
        color: @theme;
      }
    }
  }
}

// Order Detail Footer
.order-detail__footer {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: @m-zIndex;
  width: 100%;
  height: 50px;
  padding-right: 10px;
  background: #fff;
  box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, .07);
  text-align: right;

  &_button {
    padding: 0 10px;
    text-align: center;
    min-width: 56px;
    height: 28px;
    line-height: 28px;
    border-radius: 15px;
    margin: 10px 0 10px 10px;
    font-size: 14px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, .05);

    &.red {
      border-color: @theme;
      color: @theme;
      box-shadow: 0 3px 6px 0 rgba(242, 39, 12, .1);
    }
  }
}
</style>
