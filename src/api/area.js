import axios from './config'

/**
 * 获取区域列表
 * @returns {*}
 */
export function getAreaList() {
  const url = '/area'

  return axios({
    url: url,
    method: 'GET'
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
