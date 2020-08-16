import Vue from "vue";
import "./plugins/bootstrap-vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueSimpleAlert from "vue-simple-alert";

Vue.use(VueSimpleAlert);
axios.defaults.baseURL =
  "https://8080-e35650fe-0b04-4895-a868-c8961e59ac7a.ws-us02.gitpod.io/drink-water";
console.log(axios.defaults.baseURL);
axios.interceptors.request.use((config) => {
  if (store.state.token) {
    config.headers.Authorization = store.state.token;
  }
  return config;
});
axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    console.log(axios.defaults.baseURL);
    if (error.response.status === 403) {
      alert("Não autorizado!");
    } else if (error.response.status === 401) {
      store.commit("logout");
      router.push("/");
    }
    throw error;
  }
);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount("#app");
