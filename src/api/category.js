import axios from './config'

/**
 * 获取顶级分类
 * @returns {Promise<*>}
 */
export function findRootCategory() {
  const url = '/category'

  return axios({
    url: url,
    method: 'GET'
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

/**
 * 获取子分类
 * @returns {Promise<*>}
 */
export function findChildrenCategory(id) {
  const url = '/category/children'

  return axios({
    url: url,
    method: 'GET',
    params: {
      id: id
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
