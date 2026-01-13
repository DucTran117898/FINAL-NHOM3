<template>
  <div class="teacher-page-wrapper">
    <div id="alertContainer" style="position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;"></div>

    <div class="teacher-content">
      <div class="search-form">
        <div class="search-field">
          <label for="specializedInput">Bộ môn</label>
          <div class="search-input-wrapper">
            <select
              id="specializedInput"
              v-model="searchForm.specialized"
              class="search-input"
            >
              <option value="">Chọn bộ môn</option>
              <option
                v-for="option in specializedOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>
        </div>
        <div class="search-field">
          <label>Từ khóa</label>
          <input
            type="text"
            v-model="searchForm.keyword"
            @keypress.enter="searchTeachers"
            placeholder="Nhập tên hoặc mô tả..."
            class="search-input"
          />
        </div>
        <div class="search-field search-action-field">
          <label class="label-placeholder" aria-hidden="true">&nbsp;</label>
          <button class="btn-search" @click="searchTeachers">Tìm kiếm</button>
        </div>
      </div>

      <div class="result-count">
        Số giáo viên tìm thấy: <strong>{{ resultCount }}</strong>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Tên giáo viên</th>
              <th>Khoa</th>
              <th>Mô tả chi tiết</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" style="text-align: center; padding: 40px;">
                <div class="spinner"></div> Đang tải dữ liệu...
              </td>
            </tr>
            <tr v-else-if="teachers.length === 0">
              <td colspan="5" style="text-align: center; padding: 40px;">Không có dữ liệu</td>
            </tr>
            <tr v-else v-for="(teacher, index) in teachers" :key="teacher.id">
              <td>{{ index + 1 }}</td>
              <td>{{ teacher.name || 'N/A' }}</td>
              <td>{{ teacher.specialized || 'N/A' }}</td>
              <td class="description-cell">{{ teacher.description || 'N/A' }}</td>
              <td>
                <button class="btn-delete" @click="deleteTeacher(teacher)">Xóa</button>
                <button class="btn-edit" @click="editTeacher(teacher.id)">Sửa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { teacherService, apiClient, authService } from '../services/api.js'
import { StorageUtils, AlertUtils } from '../utils/helpers.js'

export default {
  name: 'TeachersList',
  data() {
    return {
      teachers: [],
      loading: false,
      searchForm: {
        specialized: '',
        keyword: ''
      },
      resultCount: 0,
      user: null
    }
  },
  computed: {
    specializedOptions() {
      const options = new Set()
      this.teachers.forEach((teacher) => {
        if (teacher?.specialized) {
          options.add(teacher.specialized)
        }
      })
      return Array.from(options).sort((a, b) => a.localeCompare(b))
    }
  },
  async mounted() {
    await this.checkAuthentication()
    await this.loadTeachers()
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
    async loadTeachers() {
      try {
        this.loading = true
        const response = await teacherService.getAll(1, 100)
        if (response && response.success) {
          this.teachers = response.data || []
        } else if (response && response.data) {
          this.teachers = response.data
        } else {
          this.teachers = []
        }
        this.resultCount = this.teachers.length
      } catch (error) {
        console.error('Failed to load teachers:', error)
        AlertUtils.error('Không thể tải danh sách giáo viên. Vui lòng thử lại.')
        this.teachers = []
        this.resultCount = 0
      } finally {
        this.loading = false
      }
    },
    async searchTeachers() {
      const keyword = this.searchForm.keyword.trim()
      const specialized = this.searchForm.specialized
      this.searchForm.keyword = keyword
      if (!keyword && !specialized) {
        await this.loadTeachers()
        return
      }

      try {
        this.loading = true
        const response = await teacherService.search(keyword, specialized)
        if (response && response.success) {
          this.teachers = response.data || []
        } else if (response && response.data) {
          this.teachers = response.data
        } else {
          this.teachers = []
        }
        this.resultCount = this.teachers.length
      } catch (error) {
        console.error('Search error:', error)
        AlertUtils.error('Tìm kiếm thất bại. Vui lòng thử lại.')
        await this.loadTeachers()
      } finally {
        this.loading = false
      }
    },
    goToAdd() {
      this.$router.push('/teachers/edit')
    },
    editTeacher(id) {
      this.$router.push(`/teachers/edit?id=${id}`)
    },
    async deleteTeacher(teacher) {
      const name = teacher?.name || 'này'
      const confirmed = confirm(`Bạn chắc chắn muốn xóa giáo viên ${name} ?`)
      if (!confirmed) return

      try {
        await teacherService.delete(teacher.id)
        AlertUtils.success('Xóa giáo viên thành công!')
        if (this.searchForm.specialized || this.searchForm.keyword) {
          await this.searchTeachers()
        } else {
          await this.loadTeachers()
        }
      } catch (error) {
        console.error('Failed to delete teacher:', error)
        AlertUtils.error('Không thể xóa giáo viên. Vui lòng thử lại.')
      }
    }
  }
}
</script>

<style scoped>
.teacher-page-wrapper {
  width: 100vw;
  min-height: 100vh;
  background: white;
  padding: 0;
  margin: 0;
  position: relative;
  overflow-x: hidden;
}

.teacher-content {
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

.search-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
  max-width: 900px;
}

.search-field {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
}

.search-input-wrapper {
  flex: 1;
  width: 100%;
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

.select-scroll {
  min-height: 140px;
  max-height: 140px;
  overflow-y: auto;
}

.select-scroll option {
  padding: 6px 8px;
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
  vertical-align: top;
}

.description-cell {
  max-width: 420px;
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
