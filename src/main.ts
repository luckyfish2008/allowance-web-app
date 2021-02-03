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
// 引入element UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 挂载axios 到Vue的原型prototype的$http
Vue.prototype.$http = axios
// 设置默认的请求的根路径
axios.defaults.baseURL = 'http://localhost:9000/'

// 统一处理请求
axios.interceptors.request.use(config => {
  console.log(config)
  // 请求头挂载信息
  config.headers.Authorization = window.sessionStorage.getItem('flag')
  // 在最后必须return config
  return config
})

// 统一拦截结果，把结果处理成res.data
/*
axios.interceptors.response.use((res) => {
  return res.data
})
*/

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
