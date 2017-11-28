import Vue from 'vue'
import VueRouter from 'vue-router'

import { AboutComponent, ContactComponent, HomeComponent } from 'components'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/contact', component: ContactComponent, name: 'contact' },
    { path: '/about', component: AboutComponent, name: 'about' },
    { path: '/home', component: HomeComponent, name: 'home' },
    { path: '*', redirect: { name: 'home' } },
  ],
})


// Default page
router.replace('/home')

export default router
