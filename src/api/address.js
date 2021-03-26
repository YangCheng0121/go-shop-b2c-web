import axios, { HEADERS } from './config'
import { getObjectKeyValueToString } from '@/utils/util'

/**
 * 添加地址
 * @param address
 * @returns {Promise<*>}
 */
export function addAddress(address) {
  const url = '/address/add'

  return axios({
    url: url,
    method: 'POST',
    headers: Object.assign({}, HEADERS.POST),
    data: {
      address: address
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 删除地址
 * @param ids
 * @returns {Promise<*>}
 */
export function deleteAddress(ids) {
  const url = '/address/delete'

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
 * 更新地址
 * @param address
 * @returns {Promise<*>}
 */
export function updateAddress(address) {
  const url = '/address/update'

  return axios({
    url: url,
    method: 'POST',
    headers: Object.assign({}, HEADERS.POST),
    data: {
      address: address
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 获取地址
 * @returns {Promise<*>}
 * @param id
 */
export function getAddress(id) {
  const url = `/address/${id}`

  return axios({
    url: url,
    method: 'GET'
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 获取地址列表
 * @param query
 * @param sortby
 * @param order
 * @param pageNumber
 * @param pageSize
 * @returns {Promise<*>}
 */
export function getAddressList({ query, sortby, order, pageNumber, pageSize }) {
  const url = '/address'

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
