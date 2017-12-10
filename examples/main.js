import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes'
Vue.use(VueRouter);
const router = new VueRouter({
    routes
})
var app = new Vue({
    router: router
}).$mount("#view");