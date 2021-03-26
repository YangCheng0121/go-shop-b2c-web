import axios from './config'
import { getObjectKeyValueToString } from '@/utils/util'

/**
 * 获取商品
 * @param sn
 * @returns {*}
 */
export function getProduct(sn) {
  const url = `/product/${sn}`

  return axios({
    url: url,
    method: 'GET'
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 获取猜你喜欢商品
 * @param query
 * @param sortby
 * @param order
 * @param pageNumber
 * @param pageSize
 * @returns {Promise<*>}
 */
export function getProductList({ query, sortby, order, pageNumber, pageSize }) {
  const url = '/product'

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

/**
 * 获取商品评论
 * @param query
 * @param sortby
 * @param order
 * @param pageNumber
 * @param pageSize
 * @returns {Promise<*>}
 */
export function getProductReviewList({ query, sortby, order, pageNumber, pageSize }) {
  const url = '/product/review'

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

/**
 * 获取商品后台选中规格
 * @param id
 * @returns {Promise<*>}
 */
export function getProductSpecificationList(id) {
  const url = `/product/specification/${id}`

  return axios({
    url: url,
    method: 'GET'
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
