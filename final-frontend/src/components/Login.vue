<template>
  <div class="login-wrapper">
    <div class="login-container">
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="loginId">Người dùng:</label>
          <div class="input-wrapper">
            <input
              type="text"
              id="loginId"
              v-model="form.loginId"
              @input="clearError('loginId')"
              required
              placeholder="Nhập login id của bạn"
              :class="{ error: errors.loginId }"
            />
            <span class="error-message" v-if="errors.loginId">{{ errors.loginId }}</span>
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password:</label>
          <div class="input-wrapper">
            <input
              type="password"
              id="password"
              v-model="form.password"
              @input="clearError('password')"
              required
              placeholder="Nhập mật khẩu của bạn"
              :class="{ error: errors.password }"
            />
            <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
          </div>
        </div>

        <button type="button" class="forgot-password-btn" @click="goToResetPassword">
          Quên password
        </button>

        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="!loading">Đăng nhập</span>
          <span v-else>Đang đăng nhập...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { authService, apiClient } from '../services/api.js'
import { StorageUtils } from '../utils/helpers.js'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        loginId: '',
        password: ''
      },
      errors: {},
      loading: false
    }
  },
  mounted() {
    // Apply login page body styles - simple white background
    document.body.style.display = 'flex'
    document.body.style.justifyContent = 'center'
    document.body.style.alignItems = 'center'
    document.body.style.minHeight = '100vh'
    document.body.style.background = '#ffffff'
    
    // If already logged in, redirect to home
    const token = localStorage.getItem('authToken')
    if (token) {
      this.$router.push('/')
    }
  },
  beforeUnmount() {
    // Reset body styles
    document.body.style.display = ''
    document.body.style.justifyContent = ''
    document.body.style.alignItems = ''
    document.body.style.minHeight = ''
    document.body.style.background = ''
  },
  methods: {
    clearError(field) {
      if (this.errors[field]) {
        delete this.errors[field]
      }
    },
    validate() {
      this.errors = {}
      let hasError = false

      // Validate Login ID
      if (!this.form.loginId.trim()) {
        this.errors.loginId = 'Hãy nhập login id'
        hasError = true
      }

      // Validate Password
      if (!this.form.password) {
        this.errors.password = 'Hãy nhập password'
        hasError = true
      }

      return !hasError
    },
    displayServerErrors(serverErrors) {
      // Handle backend validation errors
      // Backend returns errors in login_id or password fields
      if (serverErrors.login_id) {
        this.errors.loginId = serverErrors.login_id
      }
      if (serverErrors.password) {
        this.errors.password = serverErrors.password
      }
    },
    async handleLogin() {
      // Clear previous errors
      this.errors = {}

      if (!this.validate()) {
        return
      }

      try {
        this.loading = true

        const response = await authService.login(this.form.loginId.trim(), this.form.password)

        if (response && response.success && response.token) {
          // Store token and user info
          apiClient.setToken(response.token)
          if (response.user) {
            StorageUtils.set('user', response.user)
          }

          // Redirect to home page
          setTimeout(() => {
            this.$router.push('/')
          }, 500)
        } else {
          // Handle server errors
          if (response && response.errors) {
            this.displayServerErrors(response.errors)
          } else {
            // Generic error - login id và password không đúng
            this.errors.loginId = 'login id và password không đúng'
          }
        }
      } catch (error) {
        console.error('Login error:', error)
        // If login id was provided, assume it exists but password is wrong
        if (this.form.loginId.trim()) {
          this.errors.loginId = 'login id và password không đúng'
        } else {
          this.errors.loginId = 'Hãy nhập login id'
        }
      } finally {
        this.loading = false
      }
    },
    goToResetPassword() {
      this.$router.push('/reset-password.html')
    }
  }
}
</script>

<style scoped>
.login-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #ffffff;
}

.login-container {
  background-color: white;
  padding: 40px;
  border: 3px solid #2563eb;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #1f2937;
  font-size: 14px;
  min-width: 100px;
  padding-top: 12px;
  flex-shrink: 0;
}

.input-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #2563eb;
}

.form-group input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

@media (max-width: 480px) {
  .form-group {
    flex-direction: column;
    gap: 8px;
  }

  .form-group label {
    min-width: auto;
    padding-top: 0;
  }
}

.forgot-password-btn {
  width: 100%;
  padding: 10px;
  background-color: transparent;
  color: #2563eb;
  border: 1px solid #2563eb;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 15px;
  transition: background-color 0.2s;
}

.forgot-password-btn:hover {
  background-color: #eff6ff;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-btn:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.login-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .login-container {
    padding: 30px 20px;
    margin: 20px;
  }
}
</style>

