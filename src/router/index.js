import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import GoodsList from './../views/GoodsList'
import Cart from './../views/Cart'
import Address from './../views/Address'

Vue.use(Router)

export default new Router({
  mode:'hash', // hash和history
  routes: [
    {
      path:'/',
      name:'login',
      component:Login
    },
    {
      path: '/goods',
      name: 'goods',
      component: GoodsList
    },
    {
      path:'/cart',
      name:'cart',
      component:Cart,
    },
    {
      path:'/address',
      name:'address',
      component:Address,
    }
    // {
    //   path: '/goods',
    //   name: 'GoodsList',
    //   component: GoodsList,
    //   children:[
    //     {
    //       path:'image',
    //       name:'image',
    //       component:Image
    //     },
    //     {
    //       path:'title',
    //       name:'title',
    //       component:Title
    //     },
    //   ]
    // },
    // {
    //   path: '/goodslist/:goodsId/user/:username',
    //   name: 'GoodsList',
    //   component: GoodsList
    // }, 
  ]
})
