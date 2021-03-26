import axios from './config'
import { getObjectKeyValueToString } from '@/utils/util'

/**
 * 搜索
 * @param query
 * @param sortby
 * @param keyword
 * @param order
 * @param pageNumber
 * @param pageSize
 * @returns {Promise<*>}
 */
export function search({ query, sortby, keyword, order, pageNumber, pageSize }) {
  const url = '/search'

  return axios({
    url: url,
    method: 'GET',
    params: {
      query: getObjectKeyValueToString(query),
      sortby: sortby,
      keyword: keyword,
      order: order,
      pageNumber: pageNumber,
      pageSize: pageSize
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 获取热门搜素
 * @returns {Promise<*>}
 */
export function getHotSearch() {
  const url = '/search/hot'

  return axios({
    url: url,
    method: 'GET'
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
