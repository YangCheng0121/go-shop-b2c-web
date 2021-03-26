import { getShopCartCarItems, getShopCartCount } from '@/api/shopcart'
import { ERR_OK } from '@/api/config'
import { getCartKey } from '@/cache'

const shopcart = {
  state: {
    cartItems: [],
    count: 0
  },
  getters: {
    shopcartCartItems: state => state.cartItems,
    shopcartCount: state => state.count
  },
  mutations: {
    SET_SHOPCART_COUNT: (state, count) => {
      state.count = count
    },
    SET_SHOPCART_CART_ITEMS: (state, cartItems) => {
      state.cartItems = cartItems
    }
  },
  actions: {
    /**
     * 获取购物车数量
     * @param commit
     * @returns {Promise<unknown>}
     * @constructor
     */
    GetShopCartCount({ commit }) {
      const cartKey = getCartKey()
      return new Promise(resolve => {
        getShopCartCount(cartKey).then((res) => {
          if (res.err_code === ERR_OK) {
            commit('SET_SHOPCART_COUNT', res.data)
            resolve()
          }
        })
      })
    },
    /**
     * 获取购物车项
     * @private
     */
    GetShopCartCarItems({ commit }) {
      const cartKey = getCartKey()
      return new Promise(resolve => {
        getShopCartCarItems(cartKey).then((res) => {
          if (res.err_code === ERR_OK) {
            const cartItems = res.data || []
            commit('SET_SHOPCART_CART_ITEMS', cartItems)
            resolve()
          }
        })
      })
    }
  }
}

export default shopcart
