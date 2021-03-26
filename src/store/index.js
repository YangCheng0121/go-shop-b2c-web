import Vue from 'vue'
import Vuex from 'vuex'

import product from './modules/product'
import order from './modules/order'
import shopcart from './modules/shopcart'
import address from './modules/address'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    product,
    order,
    shopcart,
    address,
    user
  },
  state: {},
  mutations: {},
  actions: {}
})
