import axios from './config'

/**
 * 获取首页数据
 * @returns {Promise<*>}
 */
export function getIndexData() {
  const url = '/index'

  return axios({
    url: url,
    method: 'GET'
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 获取轮播图
 * @returns {Promise<*>}
 */
export function getBanner() {
  const url = '/index/banner'

  return axios({
    url: url,
    method: 'GET'
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
