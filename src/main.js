import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'

axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/';
Vue.prototype.$http=axios;

Vue.config.productionTip = false

axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token');
  return config;
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
