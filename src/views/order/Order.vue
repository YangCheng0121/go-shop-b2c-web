<template>
  <page-layout
    :before-content="54"
    :pull-up-load="pullUpLoad"
    :pull-down-refresh="true"
    @pullingUp="handlePullingUp"
    @pullingDown="handlePullingDown"
    :data="this.orderList.list">
    <template #header>
      <van-nav-bar
        title="我的订单"
        left-arrow
        @click-left="back"
      />
    </template>
    <template #before-content>
      <van-search
        v-model="keyword"
        placeholder="订单号"
        shape="round"
        :show-action="showAction"
        @focus="handleFocus"
        @search="handleSearch">
        <template #action>
          <span @click="handleSearch">搜索</span>
          <van-overlay :show="overlayVisible" @click="hideOverlay" class-name="search-overlay" z-index="200"/>
        </template>
      </van-search>
    </template>
    <template #content>
      <van-tabs
        v-model="active"
        @change="handleTabChange">
        <van-tab
          v-for="(tab,index) in tabs"
          :key="index"
          :title="tab.title"
          :name="tab.name">
          <ul class="order-list" v-if="orderList.list">
            <li
              class="list-item"
              v-for="item in orderList.list"
              :key="item.order.id">
              <div class="list-item__header">
                <h4>BeeShop</h4>
                <div class="order-status">{{ item.order.status_name }}</div>
                <div
                  class="delete"
                  v-if="isCanDelete(item.order)"
                  @click="deleteOrder(item.order.sn, () =>_getOrderList())">
                  <van-icon name="delete" color="#CCCCCC"/>
                </div>
              </div>
              <div class="list-item__content" @click="toOrderDetailPage(item.order.sn)">
                <van-card
                  class="list-item__content_product"
                  v-for="orderItem in item.order_items"
                  :key="orderItem.id"
                  :num="orderItem.quantity"
                  :price="orderItem.price.toFixed(2)"
                  :title="orderItem.name"
                  :thumb="orderItem.thumbnail"
                />
                <div class="order-total">
                  <div class="order-total__count">共 {{ getTotalQuantity(item.order_items) }} 件商品</div>
                  <div class="order-total__payment">
                    实付金额：
                    <span class="order-total__payment_price">
                      {{ getTotalAmount(item.order_items) | Amount }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="list-item__footer van-hairline--top">
                <van-button
                  plain
                  round
                  size="small"
                  class="list-item__footer_button"
                  v-for="(button,idx) in item.order.buttons"
                  :class="{'red': button.color}"
                  :key="idx"
                  @click="button.callback(item.order.sn, () => _getOrderList())">
                  {{ button.title }}
                </van-button>
              </div>
            </li>
          </ul>
          <van-empty description="当前没有该类型订单" v-else/>
        </van-tab>
      </van-tabs>
    </template>
  </page-layout>
</template>

<script type="es6">
import { PageLayout } from '@/layouts'
import { orderMixin } from '@/mixins'
import { mapGetters } from 'vuex'

export default {
  components: {
    PageLayout
  },
  name: 'Order',
  mixins: [orderMixin],
  computed: {
    orderList() {
      if (this.orderPageList.list) {
        this.orderPageList.list.forEach((item) => {
          this.generateButtonsByOrderStatus(item.order)
        })
      }
      return this.orderPageList
    },
    pullUpLoad() {
      return !this.orderList.is_last
    },
    ...mapGetters([
      'orderPageList'
    ])
  },
  data() {
    return {
      keyword: '',
      showAction: false,
      overlayVisible: false,
      active: 'all',
      tabs: [
        {
          title: '全部',
          name: 'all',
          value: ''
        },
        {
          title: '等待付款',
          name: 'pendingPayment',
          value: '0'
        },
        {
          title: '等待收货',
          name: 'shipped',
          value: '3'
        },
        {
          title: '已完成',
          name: 'completed',
          value: '5'
        },
        {
          title: '退款中',
          name: 'refunding',
          value: '11'
        }
      ],
      query: {}
    }
  },
  mounted() {
    this.setActive()
    this.handleTabChange()
  },
  methods: {
    back() {
      this.$router.push({ name: 'Mine' })
    },
    setActive() {
      this.active = this.$route.query.status
    },
    handleFocus() {
      this.showAction = true
      this.overlayVisible = true
    },
    handleBlur() {
      this.showAction = false
      this.overlayVisible = false
    },
    /**
     * 搜索处理
     */
    handleSearch() {
      this.query = {
        Sn: this.keyword
      }
      this._getOrderList()
      this.handleBlur()
    },
    hideOverlay() {
      this.handleBlur()
    },
    /**
     * tab 改变时
     */
    handleTabChange() {
      const tab = this.tabs.find((value) => {
        return value.name === this.active
      })
      this.query = {
        Status: tab.value
      }
      this._getOrderList()
    },
    /**
     * 跳转订单详情
     */
    toOrderDetailPage(sn) {
      this.$router.push({
        name: 'OrderDetail',
        params: { sn: sn }
      })
    },
    /**
     * 处理上拉加载
     */
    handlePullingUp() {
      if (!this.orderList.is_last) {
        const pageNumber = this.orderList.page_number + 1
        const pageSize = this.orderList.page_size
        this._getOrderList(pageNumber, pageSize)
      }
    },
    /**
     * 处理下拉加载
     */
    handlePullingDown() {
      const pageNumber = 1
      const pageSize = 10
      this._getOrderList(pageNumber, pageSize)
    },
    /**
     * 获取订单列表
     * @param pageNumber
     * @param pageSize
     * @param order
     * @param sortby
     * @private
     */
    _getOrderList(pageNumber, pageSize, order = 'desc', sortby = 'LastUpdatedDate') {
      const query = this.query
      this.$store.dispatch('GetOrderList', {
        pageNumber,
        pageSize,
        query,
        order,
        sortby
      })
    },
    /**
     * 是否能删除
     */
    isCanDelete(order) {
      let show = false
      switch (order.status) {
        case this.orderStatus.canceled:
          show = true
          break
        case this.orderStatus.completed:
          show = true
          break
      }
      return show
    }
  }
}
</script>

<style scoped lang="less">
@import "../../utils/css/index";

.search-overlay {
  top: 100px;
  background: rgba(0, 0, 0, 0.3);
}

.order-list-wrapper {
  position: absolute;
  top: 54px;
  left: 0;
  right: 0;
  bottom: 0;
}

.order-list {
  .list-item {
    margin-top: 15px;
    padding: 10px;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .05);

    &__header {
      display: flex;
      position: relative;
      align-items: center;
      line-height: 24px;

      h4 {
        font-size: 16px;
        flex: 1;
      }

      .order-status {
        font-size: 14px;
        color: #999;
      }

      .delete {
        display: inline-block;
        vertical-align: middle;
        width: 35px;
        height: 21px;
        text-align: right;
        position: relative;

        &::before {
          content: "";
          position: absolute;
          width: 1px;
          height: 15px;
          background-color: #e3e3e3;
          top: 4px;
          left: 10px;
        }
      }
    }

    &__content {
      &_product {
        padding: 0;
        background: #fff;
      }

      .order-total {
        padding: 6px 0;
        position: relative;
        display: flex;

        &__count {
          font-size: 12px;
          color: #999;
          text-align: right;
          line-height: 21px;
          flex: 1;
        }

        &__payment {
          margin-left: 10px;
          font-size: 14px;
          color: #999;
          line-height: 21px;

          &_price {
            color: #151515;
          }
        }
      }
    }

    &__footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-top: 10px;

      &_button {
        margin-left: 5px;
        width: 83px;
        height: 30px;
        box-shadow: 0 3px 6px 0 rgba(0, 0, 0, .05);

        &.red {
          border-color: @theme;
          color: @theme;
          box-shadow: 0 3px 6px 0 rgba(242, 39, 12, .1);
        }
      }
    }
  }
}
</style>
