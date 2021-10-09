import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Login',
        component: () =>
            import ('@/views/Login.vue'),
        meta: {
            title: ''
        }
    },
    {
        path: '/login',
        redirect: '/'
    },
    {
        path: '/home',
        name: 'Home',
        component: () =>
            import ('@/views/Home.vue'),
        meta: {
            title: ''
        }
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router