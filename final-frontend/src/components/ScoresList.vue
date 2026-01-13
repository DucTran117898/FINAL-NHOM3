<template>
  <div class="score-page-wrapper">
    <div id="alertContainer" style="position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;">
    </div>

    <div class="score-content">
      <!-- Search Form -->
      <div class="search-form">
        <div class="search-field">
          <label>Sinh viên</label>
          <input 
            type="text" 
            v-model="searchForm.student_name"
            @keypress.enter="searchScores"
            placeholder="Nhập tên sinh viên..."
            class="search-input">
        </div>
        <div class="search-field">
          <label>Môn học</label>
          <input 
            type="text" 
            v-model="searchForm.subject_name"
            @keypress.enter="searchScores"
            placeholder="Nhập tên môn học..."
            class="search-input">
        </div>
        <div class="search-field">
          <label>Giáo viên</label>
          <input 
            type="text" 
            v-model="searchForm.teacher_name"
            @keypress.enter="searchScores"
            placeholder="Nhập tên giáo viên..."
            class="search-input">
        </div>
        <div class="search-field">
          <button class="btn-search" @click="searchScores">Tìm kiếm</button>
        </div>
      </div>

      <!-- Result Count -->
      <div class="result-count">
        Số bản ghi tìm thấy: <strong>{{ resultCount }}</strong>
      </div>

      <!-- Table -->
      <div class="table-wrapper">
        <table id="scoresTable">
          <thead>
            <tr>
              <th>No</th>
              <th>Sinh viên</th>
              <th>Môn học</th>
              <th>Giáo viên</th>
              <th>Điểm</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="tableBody">
            <tr v-if="loading">
              <td colspan="6" style="text-align: center; padding: 40px;">
                <div class="spinner"></div> Đang tải dữ liệu...
              </td>
            </tr>
            <tr v-else-if="scores.length === 0">
              <td colspan="6" style="text-align: center; padding: 40px;">Không có dữ liệu</td>
            </tr>
            <tr v-else v-for="(score, index) in scores" :key="score.id">
              <td>{{ index + 1 }}</td>
              <td>{{ score.student_name || 'N/A' }}</td>
              <td>{{ score.subject_name || 'N/A' }}</td>
              <td>{{ score.teacher_name || 'N/A' }}</td>
              <td>{{ score.score }}</td>
              <td>
                <button class="btn-delete" @click="deleteScore(score.id)">Xóa</button>
                <button class="btn-edit" @click="editScore(score.id)">Sửa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { scoreService, apiClient, authService } from '../services/api.js'
import { StorageUtils, AlertUtils } from '../utils/helpers.js'

export default {
  name: 'ScoresList',
  data() {
    return {
      scores: [],
      loading: false,
      searchForm: {
        student_name: '',
        subject_name: '',
        teacher_name: ''
      },
      resultCount: 0,
      user: null
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
    }
  },
  async mounted() {
    await this.checkAuthentication()
    await this.loadScores()
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      try {
        const date = new Date(dateString)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
      } catch (error) {
        return dateString
      }
    },
    async checkAuthentication() {
      const token = apiClient.getToken()
      if (!token) {
        this.$router.push('/login.html')
        return
      }

      try {
        let user = StorageUtils.get('user')
        if (user) {
          this.user = user
        }

        const apiUser = await authService.getCurrentUser()
        if (apiUser && apiUser.user) {
          StorageUtils.set('user', apiUser.user)
          this.user = apiUser.user
        }
      } catch (error) {
        console.error('Failed to get current user:', error)
        this.user = StorageUtils.get('user')
      }
    },
    async loadScores() {
      try {
        this.loading = true
        const response = await scoreService.getAll()

        if (response && response.success) {
          this.scores = response.data || []
          this.resultCount = this.scores.length
        } else {
          this.scores = []
          this.resultCount = 0
        }
      } catch (error) {
        console.error('Failed to load scores:', error)
        AlertUtils.error('Không thể tải danh sách điểm số. Vui lòng thử lại.')
        this.scores = []
        this.resultCount = 0
      } finally {
        this.loading = false
      }
    },
    async searchScores() {
      try {
        this.loading = true
        const response = await scoreService.search(
          this.searchForm.student_name.trim(),
          this.searchForm.subject_name.trim(),
          this.searchForm.teacher_name.trim()
        )

        if (response && response.success) {
          this.scores = response.data || []
          this.resultCount = this.scores.length
        } else {
          this.scores = []
          this.resultCount = 0
        }
      } catch (error) {
        console.error('Search error:', error)
        AlertUtils.error('Tìm kiếm thất bại. Vui lòng thử lại.')
        // On error, reload all scores
        await this.loadScores()
      } finally {
        this.loading = false
      }
    },
    editScore(id) {
      this.$router.push(`/scores/edit?id=${id}`)
    },
    goToAdd() {
      this.$router.push('/scores/edit')
    },
    async deleteScore(id) {
      // Find the score to get student name
      const score = this.scores.find(s => s.id == id)
      const studentName = score?.student_name || 'sinh viên này'
      const confirmed = confirm(`Bạn chắc chắn muốn xóa điểm của sinh viên ${studentName}?`)
      if (!confirmed) return

      try {
        await scoreService.delete(id)
        AlertUtils.success('Xóa điểm số thành công!')
        // Refresh current view (search or all)
        if (this.searchForm.student_name || this.searchForm.subject_name || this.searchForm.teacher_name) {
          await this.searchScores()
        } else {
          await this.loadScores()
        }
      } catch (error) {
        console.error('Failed to delete score:', error)
        AlertUtils.error('Không thể xóa điểm số. Vui lòng thử lại.')
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
.score-page-wrapper {
   width: 100vw;
  min-height: 100vh;
  background: white;
  padding: 0;
  margin: 0;
  position: relative;
  overflow-x: hidden;
}

.score-content {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 30px;
  background: white;
  border-radius: 0;
  box-shadow: none;
  box-sizing: border-box;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
  max-width: 800px;
}

.search-field {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
}

.search-field label {
  display: inline-block;
  margin-bottom: 0;
  font-weight: 600;
  color: #333;
  font-size: 14px;
  min-width: 100px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s;
  display: block;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-search {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  height: 42px;
  flex: 1;
  margin-left: 115px;
}

.btn-search:hover {
  background: #5568d3;
}

.result-count {
  margin-bottom: 20px;
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.result-count strong {
  color: #667eea;
  font-size: 18px;
}

.table-wrapper {
  overflow-x: auto;
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

thead {
  background: #667eea;
}

th {
  padding: 15px;
  text-align: left;
  color: white;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
}

td {
  padding: 15px;
  border-bottom: 1px solid #eee;
  color: #333;
}

tbody tr:hover {
  background: #f8f9fa;
}

.btn-edit {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-left: 8px;
  transition: background 0.3s;
}

.btn-edit:hover {
  background: #5568d3;
}

.btn-delete {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.3s;
}

.btn-delete:hover {
  background: #5568d3;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
