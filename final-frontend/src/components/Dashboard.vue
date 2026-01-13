<template>
  <div class="dashboard-full-page">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="login-info-vertical">
        <div class="login-info-item">
          <span class="login-info-label">Tên login:</span>
          <span class="login-info-value">{{ user?.login_id || '-' }}</span>
        </div>
        <div class="login-info-item">
          <span class="login-info-label">Thời gian login:</span>
          <span class="login-info-value">{{ formattedLoginTime }}</span>
        </div>
        <div class="login-info-item">
          <span class="login-info-label">Vai trò:</span>
          <span class="login-info-value">{{ user?.role || '-' }}</span>
        </div>
      </div>
      <div class="header-right">
        <div class="user-menu">
          <span class="user-avatar" :title="userDisplayName">{{ userInitials }}</span>
          <button class="reset-requests-btn" @click="goToResetRequests">Reset Requests</button>
          <button class="logout-btn" @click="handleLogout">Đăng Xuất</button>
        </div>
      </div>
    </header>

    <!-- Alert Container -->
    <div id="alertContainer" style="position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;">
    </div>

    <!-- Dashboard Grid - Full Width -->
    <div class="dashboard-grid-full" id="dashboardGrid">
      <!-- Phòng học Column -->
      <div class="dashboard-column">
        <h3 class="dashboard-column-title">Phòng học</h3>
        <div class="dashboard-column-buttons">
          <button class="dashboard-btn dashboard-btn-search" @click="navigateTo('#')">Tìm kiếm</button>
          <button class="dashboard-btn dashboard-btn-add" @click="navigateTo('#')">Thêm mới</button>
        </div>
      </div>

      <!-- Giáo viên Column -->
      <div class="dashboard-column">
        <h3 class="dashboard-column-title">Giáo viên</h3>
        <div class="dashboard-column-buttons">
          <button class="dashboard-btn dashboard-btn-search" @click="navigateToTeachers">Tìm kiếm</button>
          <button class="dashboard-btn dashboard-btn-add" @click="navigateToAddTeacher">Thêm mới</button>
        </div>
      </div>

      <!-- Môn học Column -->
      <div class="dashboard-column">
        <h3 class="dashboard-column-title">Môn học</h3>
        <div class="dashboard-column-buttons">
          <button class="dashboard-btn dashboard-btn-search" @click="navigateToSubjects">Tìm kiếm</button>
          <button class="dashboard-btn dashboard-btn-add" @click="navigateToAddSubject">Thêm mới</button>
        </div>
      </div>

      <!-- Sinh viên Column -->
      <div class="dashboard-column">
        <h3 class="dashboard-column-title">Sinh viên</h3>
        <div class="dashboard-column-buttons">
          <button class="dashboard-btn dashboard-btn-search" @click="navigateToStudents">Tìm kiếm</button>
          <button class="dashboard-btn dashboard-btn-add" @click="navigateToAddStudent">Thêm mới</button>
        </div>
      </div>

      <!-- Điểm Column -->
      <div class="dashboard-column">
        <h3 class="dashboard-column-title">Điểm</h3>
        <div class="dashboard-column-buttons">
          <button class="dashboard-btn dashboard-btn-search" @click="navigateToScores">Tìm kiếm</button>
          <button class="dashboard-btn dashboard-btn-add" @click="navigateToAddScore">Thêm mới</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authService, apiClient } from '../services/api.js'
import { StorageUtils } from '../utils/helpers.js'

export default {
  name: 'Dashboard',
  data() {
    return {
      user: null,
      pendingResetsCount: 0,
      checkInterval: null
    }
  },
  computed: {
    userDisplayName() {
      return this.user?.login_id || this.user?.name || 'User'
    },
    userInitials() {
      const displayName = this.userDisplayName
      return displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    },
    formattedLoginTime() {
      if (!this.user?.login_time) return '-'
      try {
        const date = new Date(this.user.login_time)
        if (isNaN(date.getTime())) {
          return this.user.login_time
        }
        return this.formatDateToYmdHi(date)
      } catch (error) {
        return this.user.login_time
      }
    }
  },
  async mounted() {
    await this.checkAuthentication()
    await this.checkPendingResets()
    // Check for pending resets every 5 seconds
    this.checkInterval = setInterval(this.checkPendingResets, 5000)
  },
  beforeUnmount() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
    }
  },
  methods: {
    navigateToSubjects() {
      this.$router.push('/subjects')
    },
    navigateToAddSubject() {
      this.$router.push('/subjects/edit')
    },
    formatDateToYmdHi(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}`
    },
    navigateTo(url) {
      if (url === '#') return
      window.location.href = url
    },
    navigateToStudents() {
      this.$router.push('/students')
    },
    navigateToAddStudent() {
      this.$router.push('/students/edit')
    },
    navigateToTeachers() {
      this.$router.push('/teachers')
    },
    navigateToAddTeacher() {
      this.$router.push('/teachers/edit')
    },
    navigateToScores() {
      this.$router.push('/scores')
    },
    navigateToAddScore() {
      this.$router.push('/scores/edit')
    },
    goToResetRequests() {
      this.$router.push('/admin-reset.html')
    },
    async checkAuthentication() {
      const token = apiClient.getToken()
      if (!token) {
        this.$router.push('/login.html')
        return
      }

      try {
        // Try to get user from localStorage first
        let user = StorageUtils.get('user')
        if (user) {
          this.user = user
        }

        // Then try to get from API
        const apiUser = await authService.getCurrentUser()
        if (apiUser && apiUser.user) {
          StorageUtils.set('user', apiUser.user)
          this.user = apiUser.user
        }
      } catch (error) {
        console.error('Failed to get current user:', error)
        // Show default user display
        this.user = StorageUtils.get('user')
      }
    },
    async checkPendingResets() {
      try {
        const res = await authService.getPendingResets()
        if (res.success && res.data && res.data.length > 0) {
          this.pendingResetsCount = res.data.length
        } else {
          this.pendingResetsCount = 0
        }
      } catch (error) {
        // Silently fail
      }
    },
    async handleLogout() {
      try {
        await authService.logout()
        apiClient.setToken(null)
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        this.$router.push('/login.html')
      } catch (error) {
        console.error('Logout error:', error)
        apiClient.setToken(null)
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        this.$router.push('/login.html')
      }
    }
  }
}
</script>

<style scoped>
.reset-requests-btn {
  padding: 8px 15px;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: var(--transition);
  font-size: 14px;
}

.reset-requests-btn:hover {
  background-color: var(--primary-dark);
}
</style>

