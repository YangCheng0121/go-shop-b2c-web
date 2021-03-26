import { getProductList } from '@/api/product'
import { ERR_OK } from '@/api/config'

const product = {
  state: {
    guessProductPageList: [],
    hotProductList: []
  },
  getters: {
    // 猜你喜欢商品
    guessProductPageList: state => state.guessProductPageList,
    // 热销商品
    hotProductList: state => state.hotProductList
  },
  mutations: {
    SET_GUESS_PRODUCT_LIST: (state, productList) => {
      state.guessProductPageList = productList
    },
    SET_HOT_PRODUCT_LIST: (state, productList) => {
      state.hotProductList = productList
    }
  },
  actions: {
    /**
     * 获取猜你喜欢商品
     * @constructor
     */
    GetGuessProductList({ commit }, {
      pageNumber,
      pageSize
    }) {
      const query = {}
      const sortby = 'MonthSales'
      const order = 'desc'
      getProductList({
        query,
        sortby,
        order,
        pageNumber,
        pageSize
      }).then((res) => {
        if (res.err_code === ERR_OK) {
          // TODO 暂时
          res.data.list.forEach((item) => {
            if (!item.skus) {
              item.skus = []
              item.skus.push({
                price: 10.21
              })
            }
          })
          commit('SET_GUESS_PRODUCT_LIST', res.data)
        }
      })
    },
    /**
     * 获取热销商品
     * @constructor
     */
    GetHotProductList({ commit }, {
      pageNumber,
      pageSize
    }) {
      const query = {}
      const sortby = 'Sales'
      const order = 'desc'
      getProductList({
        query,
        sortby,
        order,
        pageNumber,
        pageSize
      }).then((res) => {
        if (res.err_code === ERR_OK) {
          // TODO 暂时
          res.data.list.forEach((item) => {
            if (!item.skus) {
              item.skus = []
              item.skus.push({
                price: 10.21
              })
            }
          })
          commit('SET_HOT_PRODUCT_LIST', res.data)
        }
      })
    }
  }
}

export default product
