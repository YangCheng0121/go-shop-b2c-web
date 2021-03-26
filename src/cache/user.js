import storage from 'store'

const USER_KEY = '__user__'

/**
 * 保存 User
 * @param user
 */
export function saveUser(user) {
  storage.set(USER_KEY, user)
}

/**
 * 获取 User
 * @param user
 * @returns {*}
 */
export function getUser(user) {
  return storage.get(USER_KEY)
}

/**
 * 删除 User
 * @param user
 * @returns {*}
 */
export function removeUser(user) {
  return storage.remove(USER_KEY)
}
