<template>
  <div class="student-edit-fullpage">
    <div
      id="alertContainer"
      style="position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;"
    ></div>

    <!-- STEP 1: INPUT FORM -->
    <div
      id="step-input"
      class="student-form-container"
      :class="{ active: currentStep === 'input' }"
    >
    
      <form @submit.prevent="showConfirm">
        <!-- Họ và tên -->
        <div class="form-row" :class="{ 'has-error': errors.name }">
          <label class="form-label" for="name">Họ và tên:</label>
          <div class="form-input-wrapper short-input">
            <input
              id="name"
              v-model.trim="form.name"
              type="text"
              maxlength="100"
              placeholder="Nhập họ và tên học sinh"
              class="form-input"
            />
            <span class="error-message" v-if="errors.name">{{ errors.name }}</span>
          </div>
        </div>

        <!-- Avatar -->
        <div class="form-row" :class="{ 'has-error': errors.avatar }">
          <label class="form-label" for="avatar">Avatar:</label>
          <div class="form-input-wrapper short-input">
            <div v-if="avatarPreviewUrl" class="avatar-preview-container">
              <img :src="avatarPreviewUrl" alt="Avatar preview" class="avatar-preview" />
            </div>
            <div class="avatar-input-row">
              <input
                type="text"
                class="form-input avatar-filename-input"
                :value="avatarFileName"
                placeholder="Chưa chọn file"
                readonly
              />
              <button type="button" class="btn-browse" @click="triggerAvatarBrowse">
                Chọn file
              </button>
            </div>
            <input
              id="avatar"
              ref="avatarInput"
              type="file"
              accept="image/*"
              @change="handleAvatarChange"
              class="hidden-file-input"
            />
            <span class="error-message" v-if="errors.avatar">{{ errors.avatar }}</span>
          </div>
        </div>

        <!-- Mô tả thêm -->
        <div class="form-row" :class="{ 'has-error': errors.description }">
          <label class="form-label" for="description">Mô tả thêm:</label>
          <div class="form-input-wrapper">
            <textarea
              id="description"
              v-model.trim="form.description"
              maxlength="1000"
              rows="5"
              placeholder="Nhập mô tả chi tiết về học sinh"
              class="form-textarea"
            ></textarea>
            <span class="error-message" v-if="errors.description">{{ errors.description }}</span>
          </div>
        </div>

        <div class="form-actions">
          <router-link to="/students" class="btn-cancel">Hủy</router-link>
          <button type="submit" class="btn-confirm">Xác nhận</button>
        </div>
      </form>
    </div>

    <!-- STEP 2: CONFIRMATION -->
    <div
      id="step-confirm"
      class="student-form-container"
      :class="{ active: currentStep === 'confirm' }"
    >
      <h2 class="form-title">Xác Nhận Thông Tin Học Sinh</h2>

      <div class="confirm-content">
        <div class="confirm-row">
          <div class="confirm-label">Họ và tên:</div>
          <div class="confirm-value">{{ form.name }}</div>
        </div>

        <div class="confirm-row">
          <div class="confirm-label">Avatar:</div>
          <div class="confirm-value">
            <img
              v-if="confirmAvatarUrl"
              :src="confirmAvatarUrl"
              alt="Avatar"
              class="avatar-preview"
            />
            <span v-else>(Không có)</span>
          </div>
        </div>

        <div class="confirm-row">
          <div class="confirm-label">Mô tả thêm:</div>
          <div class="confirm-value" style="white-space: pre-wrap;">
            {{ form.description }}
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" @click="showInput">Sửa lại</button>
        <button
          type="button"
          class="btn-confirm"
          @click="submitEdit"
          :disabled="saving"
        >
          <span v-if="!saving">{{ isEditMode ? 'Cập nhật' : 'Đăng ký' }}</span>
          <span v-else>Đang lưu...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { studentService, apiClient, authService } from '../services/api.js'
import { StorageUtils, AlertUtils } from '../utils/helpers.js'

const API_BASE = 'http://localhost:8000'

export default {
  name: 'StudentEdit',
  data() {
    return {
      currentStep: 'input',
      form: {
        name: '',
        description: ''
      },
      selectedFile: null,
      avatarPreviewUrl: '',
      confirmAvatarUrl: '',
      studentId: null,
      saving: false,
      user: null,
      errors: {},
      existingAvatar: ''
    }
  },
  computed: {
    isEditMode() {
      return !!this.studentId
    },
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
    avatarFileName() {
      if (this.selectedFile && this.selectedFile.name) {
        return this.selectedFile.name
      }
      if (this.existingAvatar) {
        return this.existingAvatar
      }
      return ''
    }
  },
  async mounted() {
    await this.checkAuthentication()
    
    const params = new URLSearchParams(window.location.search)
    this.studentId = params.get('id')
    
    if (this.studentId) {
      await this.loadStudentDetail(this.studentId)
    }
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
    async loadStudentDetail(id) {
      try {
        const res = await studentService.getById(id)
        const student = res.data

        this.form.name = student.name ?? ''
        this.form.description = student.description ?? ''

        if (student.avatar) {
          let avatarName = student.avatar
          // Normalize legacy values like 'avatar/filename.jpg' or 'avatar/student/filename.jpg'
          avatarName = avatarName.replace(/^avatar\/(student\/)?/, '')
          this.existingAvatar = avatarName
          this.avatarPreviewUrl = API_BASE + '/web/avatar/student/' + avatarName
          this.confirmAvatarUrl = API_BASE + '/web/avatar/student/' + avatarName
        }

        this.selectedFile = null
      } catch (error) {
        console.error(error)
        AlertUtils.error('Không thể tải thông tin học sinh')
      }
    },
    triggerAvatarBrowse() {
      if (this.$refs.avatarInput) {
        this.$refs.avatarInput.click()
      }
    },
    handleAvatarChange(e) {
      const file = e.target.files[0]

      if (!file) {
        this.selectedFile = null
        return
      }

      if (!file.type.startsWith('image/')) {
        AlertUtils.warning('Vui lòng chọn file hình ảnh')
        e.target.value = ''
        this.selectedFile = null
        return
      }

      this.selectedFile = file

      const reader = new FileReader()
      reader.onload = (event) => {
        this.avatarPreviewUrl = event.target.result
        this.confirmAvatarUrl = event.target.result
      }
      reader.readAsDataURL(file)
    },
    showConfirm() {
      this.errors = {}
      let hasErrors = false

      const name = this.form.name.trim()
      const description = this.form.description.trim()

      if (!name) {
        this.errors.name = 'Hãy nhập tên học sinh.'
        hasErrors = true
      } else if (name.length > 100) {
        this.errors.name = 'Không nhập quá 100 ký tự.'
        hasErrors = true
      }

      if (!description) {
        this.errors.description = 'Hãy nhập mô tả chi tiết.'
        hasErrors = true
      } else if (description.length > 1000) {
        this.errors.description = 'Không nhập quá 1000 ký tự.'
        hasErrors = true
      }

      // Require avatar: either existing preview or newly selected file
      if (!this.selectedFile && !this.avatarPreviewUrl) {
        this.errors.avatar = 'Hãy chọn avatar.'
        hasErrors = true
      }

      if (hasErrors) {
        return
      }

      // Update confirm avatar URL if we have a new file
      if (this.selectedFile && this.avatarPreviewUrl) {
        this.confirmAvatarUrl = this.avatarPreviewUrl
      }

      this.currentStep = 'confirm'
    },
    showInput() {
      this.currentStep = 'input'
    },
    async submitEdit() {
      const formData = new FormData()
      formData.append('_method', 'PUT')
      formData.append('name', this.form.name.trim())
      formData.append('description', this.form.description.trim())

      if (this.selectedFile) {
        formData.append('avatar', this.selectedFile)
      }

      try {
        this.saving = true

        const action = this.studentId ? 'edit' : 'create'

        if (this.studentId) {
          await studentService.update(this.studentId, formData)
          AlertUtils.success('Cập nhật học sinh thành công')
        } else {
          // For create, we need to use POST without _method
          const createFormData = new FormData()
          createFormData.append('name', this.form.name.trim())
          createFormData.append('description', this.form.description.trim())
          if (this.selectedFile) {
            createFormData.append('avatar', this.selectedFile)
          }
          await studentService.create(createFormData)
          AlertUtils.success('Thêm học sinh thành công')
        }

        this.$router.push({
          path: '/students/edit-success',
          query: { studentName: this.form.name.trim(), action }
        })
      } catch (error) {
        console.error(error)
        AlertUtils.error(error.message || 'Cập nhật thất bại')
      } finally {
        this.saving = false
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
.student-edit-fullpage {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  padding: 40px 20px;
  overflow-y: auto;
  z-index: 1000;
}

.student-form-container {
  display: none;
  max-width: 900px;
  margin: 0 auto;
  background: #ffffff;
  padding: 40px;
}

.student-form-container.active {
  display: block;
}

.form-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.form-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 25px;
  gap: 20px;
}

.form-label {
  min-width: 180px;
  font-weight: 500;
  color: #333;
  padding-top: 10px;
  font-size: 16px;
}

.form-input-wrapper {
  flex: 1;
  position: relative;
}

.short-input {
  max-width: 500px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  font-family: inherit;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.avatar-input-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.avatar-filename-input {
  flex: 1;
}

.btn-browse {
  padding: 10px 18px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.btn-browse:hover {
  background: #e5e7eb;
}

.hidden-file-input {
  display: none;
}

.avatar-preview-container {
  margin-bottom: 10px;
}

.avatar-preview {
  width: 150px;
  height: 150px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #ddd;
}

.confirm-content {
  margin-bottom: 30px;
}

.confirm-row {
  display: flex;
  align-items: flex-start;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  gap: 20px;
}

.confirm-label {
  min-width: 180px;
  font-weight: 600;
  color: #555;
  font-size: 16px;
}

.confirm-value {
  flex: 1;
  color: #333;
  font-size: 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.btn-cancel {
  padding: 12px 30px;
  background: #fff;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-cancel:hover {
  background: #f5f5f5;
  border-color: #bbb;
}

.btn-confirm {
  padding: 12px 30px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.3s;
}

.btn-confirm:hover:not(:disabled) {
  background: #357abd;
}

.btn-confirm:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>

