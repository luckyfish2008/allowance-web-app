import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入全局样式
import './assets/css/global.css'
// 引入iconfont
import './assets/font/iconfont.css'
// 导入axios
import axios from 'axios'
// 引入系统定义参数
import settings from './assets/config/settings'
// 引入element UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 挂载系统参数信息到Vue原型的$settings
Vue.prototype.$settings = settings

// 挂载axios 到Vue的原型prototype的$http
Vue.prototype.$http = axios
// 设置默认的请求的根路径   http://localhost:9000/
axios.defaults.baseURL = settings.REMOTE_URL

// 统一处理请求
axios.interceptors.request.use(config => {
  console.log(config)
  // 请求头挂载信息 将服务器端返回的uuid gh放入请求头
  config.headers[settings.LOGIN_UUID_KEY] = localStorage.getItem(
    settings.LOGIN_UUID_KEY
  )
  config.headers[settings.LOGIN_GH_KEY] = localStorage.getItem(
    settings.LOGIN_GH_KEY
  )
  // 在最后必须return config
  return config
})

// 统一拦截结果，原来想把结果处理成res.data 返回出去，这样别的地方调用就不用 const {data:res} 了，后来没这么改。暂时还是讲res返回出去
axios.interceptors.response.use(function (res) {
  if (res.data.code === 10000) {
    // 登录过期
    ElementUI.Message.error('登录过期，请重新登录!')
    router.push('/login')
  }
  if (res.data.code === 10001) {
    // 统一异常提示
    ElementUI.Message.error(res.data.msg)
  }
  return res
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
