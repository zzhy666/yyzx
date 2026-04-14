import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Loyat from '../views/loyat.vue'
const routes = [
    {
        path:'/',
        redirect:'/login'
    },
  {
    path:'/login',
    name:'login',
    component:Login
  },
{
    path:'/loyat',
    name:'loyat',
    component:Loyat
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
