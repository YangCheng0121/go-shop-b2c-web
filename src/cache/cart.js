import storage from 'store'

const CART_KEY = `__cart_key__`

/**
 * 保存 CartKey
 * @param cartKey
 */
export function saveCartKey(cartKey) {
  storage.set(CART_KEY, cartKey)
}

/**
 * 获取 CartKey
 * @param cartKey
 * @returns {*}
 */
export function getCartKey(cartKey) {
  return storage.get(CART_KEY)
}

/**
 * 删除 CartKey
 * @param cartKey
 * @returns {*}
 */
export function removeCartKey(cartKey) {
  return storage.remove(CART_KEY)
}
