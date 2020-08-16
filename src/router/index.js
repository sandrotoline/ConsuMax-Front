import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/drink-water',
    name: 'Drink Water',
    component: () => import('../views/DrinkWater.vue')
  },
  {
    path: '/usuario',
    name: 'Profile',
    component: () => import('../views/Profile.vue')
  }
]
const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
})
export default router
