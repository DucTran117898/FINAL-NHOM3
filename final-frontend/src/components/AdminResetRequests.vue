<template>
  <div class="admin-reset-wrapper">
    <div class="admin-reset-container">
      <a href="#" class="home-link" @click.prevent="goToHome">← Về trang chủ</a>
      <h2>Danh sách yêu cầu Reset Password</h2>

      <table>
        <thead>
          <tr>
            <th style="width: 50px;">NO</th>
            <th>Tên người dùng</th>
            <th>Mật khẩu mới</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="4">Đang tải dữ liệu...</td>
          </tr>
          <tr v-else-if="resetRequests.length === 0">
            <td colspan="4" style="color:#777">Không có yêu cầu nào.</td>
          </tr>
          <tr v-else v-for="(user, index) in resetRequests" :key="user.id">
            <td>{{ index + 1 }}</td>
            <td><strong>{{ user.login_id }}</strong></td>
            <td>
              <input 
                type="text" 
                :id="`pass_${user.id}`"
                v-model="passwords[user.id]"
                placeholder="Mật khẩu mới..."
              />
            </td>
            <td>
              <button @click="approve(user.id)">Duyệt & Reset</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { authService } from '../services/api.js'

export default {
  name: 'AdminResetRequests',
  data() {
    return {
      resetRequests: [],
      passwords: {},
      loading: true,
      previousDataString: '',
      checkInterval: null
    }
  },
  async mounted() {
    // Apply white background
    document.body.style.background = '#ffffff'
    await this.loadData()
    // Auto-update every 2 seconds
    this.checkInterval = setInterval(this.loadData, 2000)
  },
  beforeUnmount() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
    }
    // Reset body styles
    document.body.style.background = ''
  },
  methods: {
    async loadData() {
      try {
        const res = await authService.getPendingResets()
        
        if (res.success) {
          const data = res.data || []
          
          // Smart logic: Only update if data has changed
          const currentDataString = JSON.stringify(data)
          if (currentDataString === this.previousDataString) {
            return // Don't update if data is the same (preserves input values)
          }
          
          this.previousDataString = currentDataString
          
          // Preserve existing password inputs before updating
          const existingPasswords = Object.assign({}, this.passwords)
          this.resetRequests = data
          
          // Restore password inputs for existing items
          const newPasswords = {}
          data.forEach(user => {
            if (existingPasswords[user.id]) {
              newPasswords[user.id] = existingPasswords[user.id]
            } else {
              newPasswords[user.id] = ''
            }
          })
          this.passwords = newPasswords
          
          this.loading = false
        }
      } catch (error) {
        console.error('Lỗi auto-update:', error)
        // Silently fail to avoid interrupting admin
      }
    },
    async approve(id) {
      const newPass = (this.passwords[id] || '').trim()

      if (!newPass || newPass.length < 6) {
        alert('Mật khẩu mới phải từ 6 ký tự trở lên!')
        const input = document.getElementById(`pass_${id}`)
        if (input) input.focus()
        return
      }

      if (!confirm('Bạn chắc chắn muốn đổi mật khẩu cho user này?')) return

      try {
        const res = await authService.approveReset(id, newPass)
        if (res.success) {
          alert('✅ Thành công!')
          // Reset comparison string to ensure table updates immediately
          this.previousDataString = ''
          // Clear password for this user
          this.passwords[id] = ''
          await this.loadData()
        } else {
          alert('❌ Lỗi: ' + res.message)
        }
      } catch (error) {
        alert('Lỗi kết nối')
      }
    },
    goToHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.admin-reset-wrapper {
  padding: 40px;
  background: #ffffff;
  min-height: 100vh;
}

.admin-reset-container {
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 900px;
  margin: 0 auto;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

h2 {
  color: #333;
  margin-bottom: 20px;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.home-link {
  display: inline-block;
  margin-bottom: 20px;
  color: #667eea;
  text-decoration: none;
  font-weight: bold;
}

.home-link:hover {
  text-decoration: underline;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th {
  background: #667eea;
  color: white;
  padding: 12px;
  text-align: center;
}

td {
  border-bottom: 1px solid #eee;
  padding: 12px;
  text-align: center;
  vertical-align: middle;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
}

button {
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #218838;
}
</style>

