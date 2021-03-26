import axios, { HEADERS } from './config'

/**
 * 添加购物车项
 * @param cartKey
 * @param skuId
 * @param quantity
 * @returns {Promise<*>}
 */
export function addShopCartItem({ cartKey, skuId, quantity }) {
  const url = '/shopcart/add'

  return axios({
    url: url,
    method: 'POST',
    headers: Object.assign({}, HEADERS.POST),
    data: {
      cartKey: cartKey,
      skuId: skuId,
      quantity: quantity
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 删除购物车
 * @param ids
 * @returns {*}
 */
export function deleteShopCartItem(ids) {
  const url = '/shopcart/delete'

  return axios({
    url: url,
    method: 'DELETE',
    params: {
      ids: ids
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 更新购物车项
 * @param cartKey
 * @param sku
 * @param quantity
 * @returns {Promise<*>}
 */
export function updateShopCartItem({ cartKey, sku, quantity }) {
  const url = '/shopcart/update'

  return axios({
    url: url,
    method: 'POST',
    headers: Object.assign({}, HEADERS.POST),
    data: {
      cartKey: cartKey,
      sku: sku,
      quantity: quantity
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 获取购物车项
 * @param cartKey
 * @returns {*}
 */
export function getShopCartCarItems(cartKey) {
  const url = '/shopcart'

  return axios({
    url: url,
    method: 'GET',
    params: {
      cartKey: cartKey
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 获取购物车数量
 * @param cartKey
 * @returns {*}
 */
export function getShopCartCount(cartKey) {
  const url = '/shopcart/count'

  return axios({
    url: url,
    method: 'GET',
    params: {
      cartKey: cartKey
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
