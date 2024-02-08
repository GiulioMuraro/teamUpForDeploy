import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignUpView from '../views/SignUpView.vue'
import LoginView from '../views/LoginView.vue'
import AdminAccountView from '../views/AdminAccountView.vue'
import ProfileView from '../views/ProfileView.vue'
import BookingView from '../views/BookingView.vue'
import NotFoundView from '../views/NotFoundView'
import ConfermaView from '../views/ConfermaView'
import DashBoardView from '../views/DashBoardView'
import preView from '../views/preView'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomeView
  },
  {
    path: '/dashboard',
    name: 'DashBoard',
    component: DashBoardView
  },
  {
    path: '/prenotazione',
    name: 'Prenotazione',
    component: BookingView,     
  },
  {
    path: '/conferma',
    name: 'Conferma',
    component: ConfermaView,     
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/AdminAccountView',
    name: 'AdminAccount',
    component: AdminAccountView
  },
  {
    path: '/ProfileView',
    name: 'Profile',
    component: ProfileView
  },
  {
    path: '/preffettuate',
    name: 'PrEff',
    component: preView
  },
  // TO BE LAST
  { 
    path: "/:catchAll(.*)",
    name: 'NotFound',
    component: NotFoundView,
    meta: {
      requiresAuth: false
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
