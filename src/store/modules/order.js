import { checkoutOrder, getOrder, getOrderCount, getOrderList } from '@/api/order'
import { ERR_OK } from '@/api/config'

const order = {
  state: {
    count: 0,
    pageList: {},
    checkoutOrder: null,
    availableCouponList: [],
    receiver: {},
    isUpdate: false
  },
  getters: {
    orderCount: state => state.count,
    orderPageList: state => state.pageList,
    // 预订单
    checkoutOrder: state => state.checkoutOrder,
    // 预订单收货地址
    checkoutOrderReceiver: state => state.receiver
  },
  mutations: {
    SET_ORDER_COUNT: (state, count) => {
      state.count = count
    },
    SET_ORDER_PAGE_LIST: (state, pageList) => {
      if (pageList.page_number > 1) {
        state.pageList.is_first = pageList.is_first
        state.pageList.is_last = pageList.is_last
        state.pageList.page_number = pageList.page_number
        state.pageList.page_size = pageList.page_size
        state.pageList.list = state.pageList.list.concat(pageList.list)
      } else {
        state.pageList = pageList
      }
    },
    SET_CHECK_OUT_ORDER: (state, order) => {
      state.checkoutOrder = order
    },
    SET_RECEIVER: (state, receiver) => {
      state.receiver = receiver
    }
  },
  actions: {
    /**
     * 检出预订单
     * @param commit
     * @param cartItems
     * @param code
     * @param cartKey
     * @constructor
     */
    CheckoutOrder({ commit }, {
      cartItems,
      code,
      cartKey
    }) {
      return new Promise(resolve => {
        checkoutOrder({
          cartItems,
          code,
          cartKey
        }).then((res) => {
          if (res.err_code === ERR_OK) {
            const data = res.data
            commit('SET_CHECK_OUT_ORDER', data)
            resolve(data)
          }
        })
      })
    },
    /**
     * 设置预订单地址
     * @param commit
     * @param receiver
     * @constructor
     */
    SetCheckoutOrderReceiver({ commit }, receiver) {
      return new Promise(resolve => {
        commit('SET_RECEIVER', receiver)
        resolve()
      })
    },
    /**
     * 获取订单详情
     * @param commit
     * @param sn
     * @returns {Promise<unknown>}
     * @constructor
     */
    GetOrderDetail({ commit }, sn) {
      return new Promise(resolve => {
        getOrder(sn).then((res) => {
          if (res.err_code === ERR_OK) {
            resolve(res.data)
          }
        })
      })
    },
    /**
     * 获取订单发货数
     * @private
     */
    GetOrderCount({ commit }) {
      return new Promise(resolve => {
        getOrderCount().then((res) => {
          if (res.err_code === ERR_OK) {
            commit('SET_ORDER_COUNT', res.data)
            resolve()
          }
        })
      })
    },
    /**
     * 获取订单列表
     * @param commit
     * @param pageNumber
     * @param pageSize
     * @param query
     * @param order
     * @param sortby
     * @private
     */
    GetOrderList({ commit }, { pageNumber, pageSize, query, order, sortby }) {
      return new Promise(resolve => {
        getOrderList({
          query,
          order,
          sortby,
          pageNumber,
          pageSize
        }).then((res) => {
          if (res.err_code === ERR_OK) {
            commit('SET_ORDER_PAGE_LIST', res.data)
            resolve()
          }
        })
      })
    }
  }
}

export default order
