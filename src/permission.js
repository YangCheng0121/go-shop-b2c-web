import Vue from 'vue'
import router from './router'
import NProgress from 'nprogress' // progress bar
import { getUser } from '@/cache/user'

const whiteList = ['Index', 'Category', 'ShopCart', 'Mine', 'ProductDetail', 'Search', 'Login', 'TestLogin'] // no redirect
const loginRoutePath = '/login'
const defaultRoutePath = '/' // 首页

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  /* has cookie */
  if (Vue.$cookies.get('web_login') && getUser()) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      next()
    }
  } else {
    // 在免登录白名单，直接进入
    if (whiteList.includes(to.name)) {
      next()
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
