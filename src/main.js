import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import locale from 'element-ui/lib/locale/lang/zh-CN'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
// import '@/permission' // permission control

// 导入封装的axios
import {get, post, postQs, put, del} from "./utils/api";

Vue.prototype.$get = get
Vue.prototype.$post = post
// post参数会自动序列化
Vue.prototype.$postQs = postQs
Vue.prototype.$put = put
Vue.prototype.$del = del


// 引入全局方法
import {dateUtil,arrUtil,strUtil} from './utils/utils'
Vue.prototype.$dateUtil = dateUtil
Vue.prototype.$arrUtil = arrUtil
Vue.prototype.$strUtil = strUtil

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

router.beforeEach((to, from, next) => {
  let user = store.state.user;
  // console.log("来到了beforeEach");
  // console.log(user);

  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    // console.log("来到了判断是否为空");
    if (user !== null) { // 通过vuex state获取当前的token是否存在
      // console.log("user不为空");
      next();
    } else {
      // console.log('该页面需要登陆');
      next('/login');
    }
  } else {
    // console.log("没有req,直接跳");
    next();
  }

})

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
