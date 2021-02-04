import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

/*
// 有时候路由有问题，会跳不走，解决这个bug
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch(err => err)
}
*/

// 挂载路由导航首位
router.beforeEach((to, from, next) => {
  // to 将要访问
  // from 从哪里访问
  // next 接着干什么  next(url)代表重定向到url上  next() 代表继续访问to的路径
  if (to.path === '/login') {
    return next()
  }
  // 读取登录用户
  const userFlag = window.sessionStorage.getItem('user')
  if (!userFlag) {
    // 无登录用户，跳转到登录页面
    return next('/login')
  } else {
    // 符合要求，放行
    next()
  }
})
export default router
