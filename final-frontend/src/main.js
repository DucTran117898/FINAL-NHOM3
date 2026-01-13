import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'
import StudentsList from './components/StudentsList.vue'
import StudentEdit from './components/StudentEdit.vue'
import StudentEditSuccess from './components/StudentEditSuccess.vue'
import ScoresList from './components/ScoresList.vue'
import ScoreEdit from './components/ScoreEdit.vue'
import ScoreEditSuccess from './components/ScoreEditSuccess.vue'
import TeachersList from './components/TeachersList.vue'
import TeacherEdit from './components/TeacherEdit.vue'
import TeacherEditSuccess from './components/TeacherEditSuccess.vue'
import SubjectsList from './components/SubjectsList.vue'
import SubjectEdit from './components/SubjectEdit.vue'
import SubjectEditSuccess from './components/SubjectEditSuccess.vue'
import ResetPasswordRequest from './components/ResetPasswordRequest.vue'
import AdminResetRequests from './components/AdminResetRequests.vue'
import './assets/css/style.css'

const routes = [
  {
    path: '/login.html',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/index.html',
    name: 'DashboardAlt',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/students',
    name: 'StudentsList',
    component: StudentsList,
    meta: { requiresAuth: true }
  },
  {
    path: '/students/edit',
    name: 'StudentEdit',
    component: StudentEdit,
    meta: { requiresAuth: true }
  },
  {
    path: '/students/edit-success',
    name: 'StudentEditSuccess',
    component: StudentEditSuccess,
    meta: { requiresAuth: true }
  },
  {
    path: '/scores',
    name: 'ScoresList',
    component: ScoresList,
    meta: { requiresAuth: true }
  },
  {
    path: '/scores/edit',
    name: 'ScoreEdit',
    component: ScoreEdit,
    meta: { requiresAuth: true }
  },
  {
    path: '/scores/edit-success',
    name: 'ScoreEditSuccess',
    component: ScoreEditSuccess,
    meta: { requiresAuth: true }
  },
  {
    path: '/teachers',
    name: 'TeachersList',
    component: TeachersList,
    meta: { requiresAuth: true }
  },
  {
    path: '/subjects',
    name: 'SubjectsList',
    component: SubjectsList,
    meta: { requiresAuth: true }
  },
  {
    path: '/teachers/edit',
    name: 'TeacherEdit',
    component: TeacherEdit,
    meta: { requiresAuth: true }
  },
  {
    path: '/teachers/edit-success',
    name: 'TeacherEditSuccess',
    component: TeacherEditSuccess,
    meta: { requiresAuth: true }
  },
  {
    path: '/subjects/edit',
    name: 'SubjectEdit',
    component: SubjectEdit,
    meta: { requiresAuth: true }
  },
  {
    path: '/subjects/edit-success',
    name: 'SubjectEditSuccess',
    component: SubjectEditSuccess,
    meta: { requiresAuth: true }
  },
  {
    path: '/reset-password.html',
    name: 'ResetPasswordRequest',
    component: ResetPasswordRequest
  },
  {
    path: '/admin-reset.html',
    name: 'AdminResetRequests',
    component: AdminResetRequests,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'active'
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken')

  if (to.meta.requiresAuth && !token) {
    next('/login.html')
  } else if (to.path === '/login.html' && token) {
    next('/')
  } else {
    next()
  }
})

const app = createApp(App)
app.use(router)
app.mount('#app')

