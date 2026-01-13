<template>
  <div class="subject-page-wrapper">
    <div
      id="alertContainer"
      style="position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;"
    ></div>

    <div class="subject-content">
      <div class="header-row">
        <h1 class="page-title">Quản Lý Môn Học</h1>
      </div>

      <div class="search-form">
        <div class="search-field">
          <label for="schoolYearInput">Khóa học</label>
          <select
            id="schoolYearInput"
            v-model="searchForm.schoolYear"
            class="search-input"
          >
            <option value="">Tất cả</option>
            <option
              v-for="year in schoolYearOptions"
              :key="year"
              :value="year"
            >
              {{ year }}
            </option>
          </select>
        </div>
        <div class="search-field">
          <label for="keywordInput">Từ khóa</label>
          <input
            id="keywordInput"
            type="text"
            v-model="searchForm.keyword"
            @keypress.enter="searchSubjects"
            placeholder="Nhập tên hoặc mô tả..."
            class="search-input"
          />
        </div>
        <div class="search-field search-action-field">
          <label class="label-placeholder" aria-hidden="true">&nbsp;</label>
          <button class="btn-search" @click="searchSubjects">Tìm kiếm</button>
        </div>
      </div>

      <div class="result-count">
        Số môn học tìm thấy: <strong>{{ resultCount }}</strong>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Tên môn học</th>
              <th>Khóa học</th>
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
            <tr v-else-if="subjects.length === 0">
              <td colspan="5" style="text-align: center; padding: 40px;">Không có dữ liệu</td>
            </tr>
            <tr v-else v-for="(subject, index) in subjects" :key="subject.id">
              <td>{{ index + 1 }}</td>
              <td>{{ subject.name || 'N/A' }}</td>
              <td>{{ subject.school_year || 'N/A' }}</td>
              <td class="description-cell">{{ subject.description || 'N/A' }}</td>
              <td>
                <button class="btn-delete" @click="deleteSubject(subject)">Xóa</button>
                <button class="btn-edit" @click="editSubject(subject.id)">Sửa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { subjectService, apiClient, authService } from '../services/api.js'
import { StorageUtils, AlertUtils } from '../utils/helpers.js'

export default {
  name: 'SubjectsList',
  data() {
    return {
      subjects: [],
      loading: false,
      searchForm: {
        schoolYear: '',
        keyword: ''
      },
      resultCount: 0,
      user: null,
      schoolYearOptions: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4', 'Năm 5']
    }
  },
  async mounted() {
    await this.checkAuthentication()
    await this.loadSubjects()
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
    async loadSubjects() {
      try {
        this.loading = true
        const response = await subjectService.getAll()

        if (response && response.success) {
          this.subjects = response.data || []
        } else if (Array.isArray(response)) {
          // In case API returns plain array
          this.subjects = response
        } else if (response && Array.isArray(response.data)) {
          this.subjects = response.data
        } else {
          this.subjects = []
        }

        this.resultCount = this.subjects.length
      } catch (error) {
        console.error('Failed to load subjects:', error)
        AlertUtils.error('Không thể tải danh sách môn học. Vui lòng thử lại.')
        this.subjects = []
        this.resultCount = 0
      } finally {
        this.loading = false
      }
    },
    async searchSubjects() {
      const keyword = (this.searchForm.keyword || '').trim()
      const schoolYear = this.searchForm.schoolYear || ''
      this.searchForm.keyword = keyword

      if (!keyword && !schoolYear) {
        await this.loadSubjects()
        return
      }

      try {
        this.loading = true
        const response = await subjectService.search(keyword, schoolYear)

        if (response && response.success) {
          this.subjects = response.data || []
        } else if (Array.isArray(response)) {
          this.subjects = response
        } else if (response && Array.isArray(response.data)) {
          this.subjects = response.data
        } else {
          this.subjects = []
        }

        this.resultCount = this.subjects.length
      } catch (error) {
        console.error('Search error:', error)
        AlertUtils.error('Tìm kiếm thất bại. Vui lòng thử lại.')
        await this.loadSubjects()
      } finally {
        this.loading = false
      }
    },
    editSubject(id) {
      // Đi tới trang sửa Vue mới, sử dụng ?id=
      this.$router.push(`/subjects/edit?id=${id}`)
    },
    async deleteSubject(subject) {
      const name = subject?.name || 'này'
      const confirmed = confirm(`Bạn chắc chắn muốn xóa môn học ${name} ?`)
      if (!confirmed) return

      try {
        await subjectService.delete(subject.id)
        AlertUtils.success('Xóa môn học thành công!')
        if (this.searchForm.keyword || this.searchForm.schoolYear) {
          await this.searchSubjects()
        } else {
          await this.loadSubjects()
        }
      } catch (error) {
        console.error('Failed to delete subject:', error)
        AlertUtils.error('Không thể xóa môn học. Vui lòng thử lại.')
      }
    }
  }
}
</script>

<style scoped>
.subject-page-wrapper {
  width: 100vw;
  min-height: 100vh;
  background: white;
  padding: 0;
  margin: 0;
  position: relative;
  overflow-x: hidden;
}

.subject-content {
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

@media (min-width: 768px) {
  .search-form {
    flex-direction: column;
  }
}

.search-field {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
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

tbody tr:nth-child(even) {
  background: #f9fafb;
}

.description-cell {
  max-width: 360px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-edit,
.btn-delete {
  padding: 6px 10px;
  border-radius: 4px;
  border: none;
  font-size: 13px;
  cursor: pointer;
  margin-right: 6px;
}

.btn-edit {
  background-color: #667eea;
  color: white;
}

.btn-delete {
  background-color: #667eea;
  color: white;
}

.btn-edit:hover,
.btn-delete:hover {
  background-color: #5568d3;
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
