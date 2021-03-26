import axios, { HEADERS } from './config'
import { getObjectKeyValueToString } from '@/utils/util'

/**
 * 添加订单
 * @param cartItems
 * @param code
 * @param cartKey
 * @param receiverId
 * @param paymentMethodId
 * @param shippingMethodId
 * @returns {Promise<*>}
 */
export function addOrder({
  cartItems,
  code,
  cartKey,
  receiverId,
  paymentMethodId,
  shippingMethodId
}) {
  const url = '/order/add'

  return axios({
    url: url,
    method: 'POST',
    headers: Object.assign({}, HEADERS.POST),
    data: {
      cart_items: cartItems,
      code: code,
      cartKey: cartKey,
      receiver_id: receiverId,
      payment_method_id: paymentMethodId,
      shipping_method_id: shippingMethodId
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 更新订单
 * @param sn
 * @param type
 * @returns {Promise<*>}
 */
export function updateOrder({
  sn,
  type
}) {
  const url = '/order/update'

  return axios({
    url: url,
    method: 'PUT',
    headers: Object.assign({}, HEADERS.PUT),
    data: {
      sn: sn,
      type: type
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 取消订单
 * @param sn
 * @returns {*}
 */
export function cancelOrder(sn) {
  const url = '/order/cancel'

  return axios({
    url: url,
    method: 'POST',
    headers: Object.assign({}, HEADERS.POST),
    data: {
      sn: sn
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 申请退款
 * @param sn
 * @param memo
 * @returns {*}
 */
export function refundOrder({
  sn,
  memo
}) {
  const url = '/order/refund'
  return axios({
    url: url,
    method: 'POST',
    headers: Object.assign({}, HEADERS.POST),
    data: {
      sn: sn,
      memo: memo
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 检出预订单
 * @param cartItems
 * @param code
 * @param cartKey
 * @returns {Promise<*>}
 */
export function checkoutOrder({
  cartItems,
  code,
  cartKey
}) {
  const url = '/order/checkout'

  return axios({
    url: url,
    method: 'POST',
    headers: Object.assign({}, HEADERS.POST),
    data: {
      cart_items: cartItems,
      code: code,
      cartKey: cartKey
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 获取订单详情
 * @param sn
 * @returns {Promise<*>}
 */
export function getOrder(sn) {
  const url = `/order/${sn}`

  return axios({
    url: url,
    method: 'GET'
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 获取订单发货数
 * @returns {Promise<*>}
 */
export function getOrderCount() {
  const url = '/order/count'

  return axios({
    url: url,
    method: 'GET'
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 获取订单优惠券
 * @param cartKey
 * @param cartItems
 * @returns {Promise<*>}
 */
export function getOrderCoupon(cartKey, cartItems) {
  const url = '/order/coupon'

  return axios({
    url: url,
    method: 'GET',
    params: {
      cart_key: cartKey,
      cart_items: cartItems
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 获取支付方法
 * @param query
 * @param sortby
 * @param order
 * @returns {*}
 */
export function getPaymentMethodList({
  query,
  sortby,
  order
}) {
  const url = '/order/payment_method'

  return axios({
    url: url,
    method: 'GET',
    params: {
      query: getObjectKeyValueToString(query),
      sortby: sortby,
      order: order
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 获取发货方法
 * @param query
 * @param sortby
 * @param order
 * @returns {*}
 */
export function getShippingMethodList({
  query,
  sortby,
  order
}) {
  const url = '/order/shipping_method'

  return axios({
    url: url,
    method: 'GET',
    params: {
      query: getObjectKeyValueToString(query),
      sortby: sortby,
      order: order
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 获取订单列表
 * @param query
 * @param sortby
 * @param order
 * @param pageNumber
 * @param pageSize
 * @returns {Promise<*>}
 */
export function getOrderList({
  query,
  sortby,
  order,
  pageNumber,
  pageSize
}) {
  const url = '/order'

  return axios({
    url: url,
    method: 'GET',
    params: {
      query: getObjectKeyValueToString(query),
      sortby: sortby,
      order: order,
      pageNumber: pageNumber,
      pageSize: pageSize
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
