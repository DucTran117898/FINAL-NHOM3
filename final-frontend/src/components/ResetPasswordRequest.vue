<template>
  <div class="reset-wrapper">
    <div class="reset-container">
      <form @submit.prevent="handleRequestReset">
        <div class="form-group">
          <label for="loginId">Người dùng:</label>
          <div class="input-wrapper">
            <input
              type="text"
              id="loginId"
              v-model="form.loginId"
              @input="clearError"
              required
              placeholder="Nhập login id của bạn"
              :class="{ error: errorMessage }"
            />
            <span class="error-message" v-if="errorMessage">{{ errorMessage }}</span>
          </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="!loading">Gửi yêu cầu reset password</span>
          <span v-else>Đang gửi...</span>
        </button>

        <a href="#" class="back-link" @click.prevent="goToLogin">Quay lại Đăng nhập</a>
      </form>
    </div>
  </div>
</template>

<script>
import { authService } from '../services/api.js'

export default {
  name: 'ResetPasswordRequest',
  data() {
    return {
      form: {
        loginId: ''
      },
      errorMessage: '',
      loading: false
    }
  },
  mounted() {
    // Apply white background
    document.body.style.display = 'flex'
    document.body.style.justifyContent = 'center'
    document.body.style.alignItems = 'center'
    document.body.style.minHeight = '100vh'
    document.body.style.background = '#ffffff'
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
    clearError() {
      this.errorMessage = ''
    },
    async handleRequestReset() {
      this.errorMessage = ''
      
      if (!this.form.loginId.trim()) {
        this.errorMessage = 'Vui lòng nhập User ID'
        return
      }

      try {
        this.loading = true
        const res = await authService.requestReset(this.form.loginId.trim())

        if (res.success) {
          alert('✅ Đã gửi yêu cầu thành công!')
          this.$router.push('/login.html')
        } else {
          this.errorMessage = res.message || 'Có lỗi xảy ra'
        }
      } catch (error) {
        console.error(error)
        this.errorMessage = 'Lỗi kết nối: ' + (error.message || 'Vui lòng thử lại')
      } finally {
        this.loading = false
      }
    },
    goToLogin() {
      this.$router.push('/login.html')
    }
  }
}
</script>

<style scoped>
.reset-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #ffffff;
}

.reset-container {
  background-color: white;
  padding: 40px;
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

.submit-btn {
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
  margin-bottom: 15px;
}

.submit-btn:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.submit-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.back-link {
  display: block;
  text-align: center;
  color: #2563eb;
  text-decoration: none;
  font-size: 14px;
}

.back-link:hover {
  text-decoration: underline;
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

  .reset-container {
    padding: 30px 20px;
    margin: 20px;
  }
}
</style>
