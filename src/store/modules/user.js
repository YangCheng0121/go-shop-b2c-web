import { getUser } from '@/cache/user'
import { getAuthorizedCode } from '@/api/wechat'
import { ERR_OK } from '@/api/config'
import storage from 'store'
import router from '@/router'
import Vue from 'vue'

const user = {
  state: {
    user: null
  },
  getters: {
    user: state => state.user
  },
  mutations: {
    SET_USER: (state, user) => {
      state.user = user
    }
  },
  actions: {
    /**
     * 获取用户
     * @param commit
     * @constructor
     */
    GetUser({ commit }) {
      const user = getUser()
      commit('SET_USER', user)
    },
    /**
     * 获取授权码
     * @param commit
     * @constructor
     */
    GetAuthorizedCode({ commit }) {
      const isProd = process.env.NODE_ENV === 'production'
      if (isProd) {
        getAuthorizedCode().then((res) => {
          if (res.err_code === ERR_OK) {
            window.location.href = res.data
          }
        })
      } else {
        router.push({ name: 'TestLogin' })
      }
    },
    /**
     * 退出登录
     * @constructor
     */
    Logout({ dispatch }) {
      storage.clearAll()
      Vue.$cookies.remove('web_login')
      dispatch('GetUser')
    }
  }
}

export default user
