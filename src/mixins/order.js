import { cancelOrder, refundOrder, updateOrder } from '@/api/order'
import { ERR_OK } from '@/api/config'
import { Dialog, Toast } from 'vant'

const orderMixin = {
  data() {
    return {
      orderStatus: {
        pendingPayment: 0, // 等待付款
        pendingReview: 1, // 等待审核
        pendingShipment: 2, // 等待发货
        shipped: 3, // 已发货
        completed: 5, // 已完成
        canceled: 7, // 已取消
        unfinished: 10 // 未完成
      }
    }
  },
  methods: {
    /**
     * 根据订单状态生成 Button 数组
     */
    generateButtonsByOrderStatus(order) {
      const orderStatus = this.orderStatus

      const buttons = []
      switch (order.status) {
        case orderStatus.pendingPayment:
          buttons.push({
            title: '取消订单',
            color: '',
            callback: (sn, fn) => {
              this.cancelOrder(sn, fn)
            }
          })
          buttons.push({
            title: '去付款',
            color: 'red',
            callback: (sn) => {
              this.toPaymentPage(sn)
            }
          })
          break
        case orderStatus.pendingReview:
          buttons.push({
            title: '取消订单',
            color: '',
            callback: (sn, fn) => {
              this.refundOrder({
                title: '取消订单',
                sn,
                memo: '',
                fn
              })
            }
          })
          break
        case orderStatus.pendingShipment:
          buttons.push({
            title: '申请退款',
            color: '',
            callback: (sn, fn) => {
              this.refundOrder({
                title: '申请退款',
                sn,
                memo: '',
                fn
              })
            }
          })
          break
        case orderStatus.shipped:
          buttons.push({
            title: '确认收货',
            color: 'red',
            callback: (sn, fn) => {
              this.confirmOrder(sn, fn)
            }
          })
          break
        case orderStatus.completed:
          buttons.push({
            title: '申请退款',
            color: '',
            callback: (sn, fn) => {
              this.refundOrder({
                title: '申请退款',
                sn,
                memo: '',
                fn
              })
            }
          })
          buttons.push({
            title: '去评价',
            color: ''
          })
          buttons.push({
            title: '再次购买',
            color: 'red'
          })
          break
        case orderStatus.canceled:
          buttons.push({
            title: '重新购买',
            color: 'red'
          })
          break
      }
      order.buttons = buttons
    },
    /**
     * 共计商品
     */
    getTotalQuantity(orderItems) {
      let total = 0
      if (orderItems) {
        orderItems.forEach((item) => {
          total = total + item.quantity
        })
      }
      return total
    },
    /**
     * 优惠金额
     */
    getDiscountAmount(order) {
      return order.promotion_discount + order.coupon_discount
    },
    /**
     * 总金额
     */
    getTotalAmount(orderItems) {
      let total = 0
      if (orderItems) {
        orderItems.forEach((item) => {
          total = total + item.price * item.quantity
        })
      }
      return total
    },
    /**
     * 更新订单
     * @param sn
     * @param type
     * @param title
     * @param fn
     * @private
     */
    _updateOrder(sn, type, title, fn) {
      Dialog.confirm({
        title: '提示',
        message: `确认${title}？`
      })
        .then(() => {
          // on confirm
          updateOrder({
            sn,
            type
          }).then((res) => {
            if (res.err_code === ERR_OK) {
              fn()
              this.$store.dispatch('GetOrderCount')
              Toast(`${title}成功`)
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    /**
     * 去支付
     * @param sn
     */
    toPaymentPage(sn) {
      this.$router.push({
        name: 'Payment',
        params: { sn: sn }
      })
    },
    /**
     * 取消订单
     * @param sn
     * @param fn
     * @private
     */
    cancelOrder(sn, fn) {
      Dialog.confirm({
        title: '提示',
        message: '确认取消订单？'
      })
        .then(() => {
          // on confirm
          cancelOrder(sn).then((res) => {
            if (res.err_code === ERR_OK) {
              fn()
              this.$store.dispatch('GetOrderCount')
              Toast('取消订单成功!')
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    /**
     * 确认收货
     * @param sn
     * @param fn
     * @private
     */
    confirmOrder(sn, fn) {
      const type = 'confirm'
      const title = '确认收货'
      this._updateOrder(sn, type, title, fn)
    },
    /**
     * 申请退款
     * @param title
     * @param sn
     * @param memo
     * @param fn
     * @private
     */
    refundOrder({
      title,
      sn,
      memo,
      fn
    }) {
      if (!this.isCanRefund(sn)) {
        return
      }
      Dialog.confirm({
        title: '提示',
        message: `确认${title}？`
      })
        .then(() => {
          // on confirm
          refundOrder({
            sn,
            memo
          }).then((res) => {
            if (res.err_code === ERR_OK) {
              fn()
              this.$store.dispatch('GetOrderCount')
              Toast(`${title}成功`)
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    /**
     * 是否能申请退款
     * 必须是 等待审核、等待发货才能申请退款
     * @param sn
     */
    isCanRefund(sn) {
      let order
      if (this.orderList) {
        order = this.orderList.list.find((value) => {
          return value.order.sn === sn
        })
      } else {
        order = this.detail
      }
      const status = order.order.status
      if (status === this.orderStatus.pendingReview ||
        status === this.orderStatus.pendingShipment ||
        status === this.orderStatus.completed) {
        return true
      }
      return false
    },
    /**
     * 删除订单
     * @param sn
     * @param fn
     * @private
     */
    deleteOrder(sn, fn) {
      const type = 'delete'
      const title = '删除订单'
      this._updateOrder(sn, type, title, fn)
    }
  }
}

export default orderMixin
