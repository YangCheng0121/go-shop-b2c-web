import storage from 'store'

const SEARCH_KEY = '__search__'

/**
 * 保存 Search
 * @param Search
 */
export function saveSearch(Search) {
  storage.set(SEARCH_KEY, Search)
}

/**
 * 获取 Search
 * @param Search
 * @returns {*}
 */
export function getSearch(Search) {
  return storage.get(SEARCH_KEY)
}

/**
 * 删除 Search
 * @param Search
 * @returns {*}
 */
export function removeSearch(Search) {
  return storage.remove(SEARCH_KEY)
}
