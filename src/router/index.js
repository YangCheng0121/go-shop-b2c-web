import Vue from 'vue'
import Router from 'vue-router'
import routes from '@/config/router.config'

// hack router push callback
// 看vue-router的版本更新日志
// V3.1.0版本里面新增功能：push和replace方法会返回一个promise, 你可能在控制台看到未捕获的异常
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router = new Router({
  base: process.env.BASE_URL,
  routes: routes
})

export default router
