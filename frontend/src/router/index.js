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
import reportView from '../views/ReportView';

const routes = [
  {
    path: '/',
    name: 'HomePageView',
    component: HomeView
  },
  {
    path: '/dashboardView',
    name: 'DashBoard',
    component: DashBoardView
  },
  {
    path: '/bookingView',
    name: 'Booking',
    component: BookingView,     
  },
  {
    path: '/confermaView',
    name: 'Conferma',
    component: ConfermaView,     
  },
  {
    path: '/signUpView',
    name: 'SignUp',
    component: SignUpView
  },
  {
    path: '/loginView',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/adminAccountView',
    name: 'AdminAccount',
    component: AdminAccountView
  },
  {
    path: '/profileView',
    name: 'Profile',
    component: ProfileView
  },
  {
    path: '/preffettuateView',
    name: 'PrEff',
    component: preView
  },
  {
    path: '/reportView',
    name: 'Report',
    component: reportView
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
