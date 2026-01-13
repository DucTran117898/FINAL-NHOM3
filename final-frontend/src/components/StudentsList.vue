<template>
  <div class="student-page-wrapper">
    <div id="alertContainer" style="position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;"></div>

    <div class="student-content">
      <div class="header-row">
        <h1 class="page-title">Quản Lý Học Sinh</h1>
      </div>

      <div class="search-form">
        <div class="search-field">
          <label for="keywordInput">Từ khóa</label>
          <input
            id="keywordInput"
            type="text"
            v-model="searchQuery"
            @keypress.enter="searchStudents"
            placeholder="Nhập tên hoặc mô tả..."
            class="search-input"
          />
        </div>
        <div class="search-field search-action-field">
          <label class="label-placeholder" aria-hidden="true">&nbsp;</label>
          <button class="btn-search" @click="searchStudents">Tìm kiếm</button>
        </div>
      </div>

      <div class="result-count">
        Số sinh viên tìm thấy: <strong>{{ resultCount }}</strong>
      </div>

      <div class="table-wrapper">
        <table id="studentsTable">
          <thead>
            <tr>
              <th>No</th>
              <th>Tên sinh viên</th>
              <th>Mô tả chi tiết</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="tableBody">
            <tr v-if="loading">
              <td colspan="4" style="text-align: center; padding: 40px;">
                <div class="spinner"></div> Đang tải dữ liệu...
              </td>
            </tr>
            <tr v-else-if="students.length === 0">
              <td colspan="4" style="text-align: center; padding: 40px;">Không có dữ liệu</td>
            </tr>
            <tr v-else v-for="(student, idx) in students" :key="student.id">
              <td>{{ idx + 1 }}</td>
              <td>{{ student.name || 'N/A' }}</td>
              <td>{{ student.description || 'N/A' }}</td>
              <td>
                <button class="btn-delete" @click="deleteStudent(student.id, student.name || '')">Xóa</button>
                <button class="btn-edit" @click="editStudent(student.id)">Sửa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="paginationContainer" v-if="pagination && pagination.total_pages > 1">
        <ul class="pagination">
          <li v-if="pagination.current_page > 1">
            <a href="#" @click.prevent="loadStudents(pagination.current_page - 1)">← Trước</a>
          </li>
          <li v-for="i in pagination.total_pages" :key="i">
            <span v-if="i === pagination.current_page" class="active">{{ i }}</span>
            <a v-else href="#" @click.prevent="loadStudents(i)">{{ i }}</a>
          </li>
          <li v-if="pagination.current_page < pagination.total_pages">
            <a href="#" @click.prevent="loadStudents(pagination.current_page + 1)">Sau →</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { studentService, apiClient, authService } from '../services/api.js'
import { StorageUtils, AlertUtils } from '../utils/helpers.js'

export default {
  name: 'StudentsList',
  data() {
    return {
      students: [],
      loading: false,
      searchQuery: '',
      resultCount: 0,
      pagination: null,
      currentPage: 1,
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
    await this.loadStudents()
  },
  methods: {
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
    async loadStudents(page = 1, limit = 10) {
      try {
        this.loading = true
        this.currentPage = page

        const response = await studentService.getAll(page, limit)

        if (response && response.success) {
          this.students = response.data || []
          this.pagination = response.pagination || null

          if (response.pagination && typeof response.pagination.total_records === 'number') {
            this.resultCount = response.pagination.total_records
          } else {
            this.resultCount = this.students.length
          }
        } else {
          this.students = []
          this.resultCount = 0
        }
      } catch (error) {
        console.error('Failed to load students:', error)
        AlertUtils.error('Không thể tải danh sách học sinh. Vui lòng thử lại.')
        this.students = []
        this.resultCount = 0
      } finally {
        this.loading = false
      }
    },
    async searchStudents() {
      const query = this.searchQuery.trim()

      if (!query) {
        AlertUtils.warning('Vui lòng nhập từ khóa tìm kiếm.')
        return
      }

      try {
        this.loading = true
        const page = 1
        const limit = 10
        const response = await studentService.search(query, page, limit)

        if (response && response.success && Array.isArray(response.data)) {
          this.students = response.data
          if (response.pagination && typeof response.pagination.total_records === 'number') {
            this.resultCount = response.pagination.total_records
          } else {
            this.resultCount = response.data.length || 0
          }
          this.pagination = response.pagination || null
        } else {
          this.students = []
          this.resultCount = 0
          this.pagination = null
        }
      } catch (error) {
        console.error('Search error:', error)
        AlertUtils.error('Tìm kiếm thất bại. Vui lòng thử lại.')
      } finally {
        this.loading = false
      }
    },
    async deleteStudent(id, name) {
      const confirmed = confirm(`Bạn chắc chắn muón xóa sinh viên viên ${name} ?`)
      if (!confirmed) return

      try {
        await studentService.delete(id)
        AlertUtils.success(`Đã xóa sinh viên ${name} thành công!`)
        await this.loadStudents(this.currentPage)
      } catch (error) {
        console.error('Failed to delete student:', error)
        AlertUtils.error(`Không thể xóa sinh viên ${name}. Vui lòng thử lại.`)
      }
    },
    editStudent(id) {
      this.$router.push(`/students/edit?id=${id}`)
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
.student-page-wrapper {
  width: 100vw;
  min-height: 100vh;
  background: white;
  padding: 0;
  margin: 0;
  position: relative;
  overflow-x: hidden;
}

.student-content {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 30px;
  background: white;
  box-sizing: border-box;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 25px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1f2933;
}

.btn-add {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-add:hover {
  background: #5568d3;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
  max-width: 600px;
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
  min-width: 120px;
  flex-shrink: 0;
}

.label-placeholder {
  visibility: hidden;
}

.search-input {
  flex: 1;
  width: 100%;
  padding: 10px 15px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.search-action-field {
  justify-content: flex-end;
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
}

.search-action-field .btn-search {
  flex: 1;
  width: 100%;
  padding: 10px 15px;
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

.btn-edit,
.btn-delete {
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.3s;
  color: white;
}

.btn-delete,
.btn-edit {
  background: #667eea;
}

.btn-delete:hover,
.btn-edit:hover {
  background: #5568d3;
}

.btn-edit {
  margin-left: 8px;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

