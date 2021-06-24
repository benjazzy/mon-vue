import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

// import axios from "axios";
// const base = axios.create({
//   baseURL: "http://192.168.1.51:8080/",
// });
//
//
// base.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
//
// Vue.prototype.$http = base;
//
// Vue.prototype.$http.interceptors.request.use(
//     config => {
//       let accessToken = localStorage.getItem('token');
//       if (accessToken) {
//         config.headers = Object.assign({
//           Authorization: `Bearer ${accessToken}`
//         }, config.headers);
//       }
//       return config;
//     },
//     error => {
//       return Promise.reject(error);
//     }
// )

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')