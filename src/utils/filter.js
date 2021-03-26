import Vue from 'vue'
import moment from 'moment'

Vue.filter('Price', function (price, separator, index) {
  return price.toString().split(separator)[index] || 0
})

Vue.filter('Moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('Amount', function (amount) {
  return '￥' + parseFloat(amount).toFixed(2)
})
