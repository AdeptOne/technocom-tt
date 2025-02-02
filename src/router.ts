import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'
import LoginView from './views/LoginView.vue'
import App from './App.vue'
import { useSession } from './store/session'
import TrackView from './views/TrackView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: App,
    name: 'home',
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/track',
    name: 'track',
    component: TrackView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const session = useSession()

  if (!session.token && to.name !== 'login') {
    return { name: 'login' }
  }
})

export default router
