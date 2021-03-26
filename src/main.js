import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookies from 'vue-cookies'
import FastClick from 'fastclick'

import 'normalize.css'
import 'nprogress/nprogress.css'
import './utils/filter'
import './permission'

/**
 * 按需引入组件
 */
import './core/cube-ui'
import './core/vant'

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueCookies)

FastClick.attach(document.body)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
