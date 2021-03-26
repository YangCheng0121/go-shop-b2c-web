import { IMAGE_PREFIX } from '@/config/axios.config'

/**
 * 设置图片前缀
 * @param data
 * @returns {*}
 */
export function setImagePrefix(data) {
  return data.map((item) => {
    item.large = IMAGE_PREFIX + item.large
    item.medium = IMAGE_PREFIX + item.medium
    item.source = IMAGE_PREFIX + item.source
    item.thumbUrl = IMAGE_PREFIX + item.thumbUrl
    item.url = IMAGE_PREFIX + item.url

    return item
  })
}

/**
 * 价格转化
 * @param price
 * @returns {string[]}
 */
export function pricePair(price) {
  return price.toFixed(2).split('.')
}

/**
 * 获取对象的Key:Value字符串，过滤掉undefined
 * @param obj
 * @returns {string}
 */
export function getObjectKeyValueToString(obj) {
  if (!obj) {
    return
  }

  const keys = Object.keys(obj)
  const keyValue = keys.map((key) => {
    if (obj[key]) {
      return `${key}:${obj[key]}`
    }
  })
  return keyValue.filter(value => !(!value || value === '')).join(',') || null
}

/**
 * 获取商品属性
 * @param product
 * @returns {[]}
 */
export function getProductAttributes(product) {
  const prefixKey = 'attribute_value_'
  const attributes = []

  let i = 0
  while (i < 20) {
    if (product[prefixKey + i]) {
      attributes.push(product[prefixKey + i])
    }
    i++
  }

  return attributes
}

/**
 *
 * @desc   url参数转对象
 * @param  {String} url  default: window.location.href
 * @return {Object}
 */
export function parseQueryString(url) {
  url = !url ? window.location.href : url
  if (url.indexOf('?') === -1) {
    return {}
  }
  let search = url[0] === '?' ? url.substr(1) : url.substring(url.lastIndexOf('?') + 1)
  if (search === '') {
    return {}
  }
  search = search.split('&')
  const query = {}
  for (let i = 0; i < search.length; i++) {
    const pair = search[i].split('=')
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
  }
  return query
}
