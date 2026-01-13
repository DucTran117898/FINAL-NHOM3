<template>
  <div class="teacher-edit-fullpage">
    <div
      id="alertContainer"
      style="position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;"
    ></div>

    <!-- STEP 1: INPUT FORM -->
    <div
      id="step-input"
      class="teacher-form-container"
      :class="{ active: currentStep === 'input' }"
    >
  
      <form @submit.prevent="showConfirm">
        <!-- Họ và tên -->
        <div class="form-row" :class="{ 'has-error': errors.name }">
          <label class="form-label" for="name">Họ và Tên:</label>
          <div class="form-input-wrapper short-input">
            <input
              id="name"
              v-model.trim="form.name"
              type="text"
              maxlength="100"
              placeholder="Nhập họ và tên giáo viên"
              class="form-input"
            />
            <span class="error-message" v-if="errors.name">{{ errors.name }}</span>
          </div>
        </div>

        <!-- Chuyên ngành (scroll select) -->
        <div class="form-row" :class="{ 'has-error': errors.specialized }">
          <label class="form-label" for="specialized">Chuyên ngành:</label>
          <div class="form-input-wrapper short-input">
            <select
              id="specialized"
              v-model="form.specialized"
              class="form-select"
            >
              <option value="">-- Chọn chuyên ngành --</option>
              <option
                v-for="option in specializedOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <span class="error-message" v-if="errors.specialized">
              {{ errors.specialized }}
            </span>
          </div>
        </div>

        <!-- Học vị (scroll select) -->
        <div class="form-row" :class="{ 'has-error': errors.degree }">
          <label class="form-label" for="degree">Học vị:</label>
          <div class="form-input-wrapper short-input">
            <select
              id="degree"
              v-model="form.degree"
              class="form-select"
            >
              <option value="">-- Chọn học vị --</option>
              <option
                v-for="option in degreeOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <span class="error-message" v-if="errors.degree">
              {{ errors.degree }}
            </span>
          </div>
        </div>

        <!-- Avatar + Browse button -->
        <div class="form-row" :class="{ 'has-error': errors.avatar }">
          <label class="form-label" for="avatar">Avatar:</label>
          <div class="form-input-wrapper short-input">
            <div v-if="previewUrl" class="avatar-preview-container">
              <img :src="previewUrl" alt="Avatar preview" class="avatar-preview" />
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
            <span class="error-message" v-if="errors.avatar">
              {{ errors.avatar }}
            </span>
          </div>
        </div>

        <!-- Mô tả thêm (large textarea) -->
        <div class="form-row" :class="{ 'has-error': errors.description }">
          <label class="form-label" for="description">Mô tả thêm:</label>
          <div class="form-input-wrapper">
            <textarea
              id="description"
              v-model.trim="form.description"
              maxlength="1000"
              rows="5"
              placeholder="Nhập mô tả chi tiết về giáo viên"
              class="form-textarea"
            ></textarea>
            <span class="error-message" v-if="errors.description">
              {{ errors.description }}
            </span>
          </div>
        </div>

        <div class="form-actions">
          <router-link to="/teachers" class="btn-cancel">Hủy</router-link>
          <button type="submit" class="btn-confirm">Xác nhận</button>
        </div>
      </form>
    </div>

    <!-- STEP 2: CONFIRMATION -->
    <div
      id="step-confirm"
      class="teacher-form-container"
      :class="{ active: currentStep === 'confirm' }"
    >
      <div class="confirm-content">
        <div class="confirm-row">
          <div class="confirm-label">Họ và Tên:</div>
          <div class="confirm-value">{{ confirmData.name }}</div>
        </div>

        <div class="confirm-row">
          <div class="confirm-label">Chuyên ngành:</div>
          <div class="confirm-value">{{ confirmData.specializedLabel }}</div>
        </div>

        <div class="confirm-row">
          <div class="confirm-label">Học vị:</div>
          <div class="confirm-value">{{ confirmData.degreeLabel }}</div>
        </div>

        <div class="confirm-row">
          <div class="confirm-label">Avatar:</div>
          <div class="confirm-value">
            <img
              v-if="previewUrl"
              :src="previewUrl"
              alt="Avatar"
              class="avatar-preview"
            />
            <span v-else>(Không có)</span>
          </div>
        </div>

        <div class="confirm-row">
          <div class="confirm-label">Mô tả thêm:</div>
          <div class="confirm-value" style="white-space: pre-wrap;">
            {{ confirmData.description }}
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" @click="showInput">Sửa lại</button>
        <button
          type="button"
          class="btn-confirm"
          :disabled="saving"
          @click="submitForm"
        >
          <span v-if="!saving">{{ isEditMode ? 'Cập nhật' : 'Đăng ký' }}</span>
          <span v-else>Đang lưu...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { teacherService, apiClient, authService } from '../services/api.js'
import { StorageUtils, AlertUtils } from '../utils/helpers.js'

export default {
  name: 'TeacherEdit',
  data() {
    return {
      currentStep: 'input',
      teacherId: null,
      form: {
        name: '',
        specialized: '',
        degree: '',
        description: '',
        avatarFile: null,
        existingAvatar: ''
      },
      confirmData: {
        name: '',
        specializedLabel: '',
        degreeLabel: '',
        description: ''
      },
      previewUrl: '',
      errors: {},
      saving: false,
      user: null,
      specializedOptions: [
        { value: '001', label: 'Khoa học máy tính' },
        { value: '002', label: 'Khoa học dữ liệu' },
        { value: '003', label: 'Hải dương học' }
      ],
      degreeOptions: [
        { value: '001', label: 'Cử nhân' },
        { value: '002', label: 'Thạc sĩ' },
        { value: '003', label: 'Tiến sĩ' },
        { value: '004', label: 'Phó giáo sư' },
        { value: '005', label: 'Giáo sư' }
      ]
    }
  },
  computed: {
    isEditMode() {
      return !!this.teacherId
    },
    specializedLabelMap() {
      return this.specializedOptions.reduce((acc, cur) => {
        acc[cur.value] = cur.label
        return acc
      }, {})
    },
    degreeLabelMap() {
      return this.degreeOptions.reduce((acc, cur) => {
        acc[cur.value] = cur.label
        return acc
      }, {})
    },
    avatarFileName() {
      if (this.form.avatarFile && this.form.avatarFile.name) {
        return this.form.avatarFile.name
      }
      if (this.form.existingAvatar) {
        return this.form.existingAvatar
      }
      return ''
    }
  },
  async mounted() {
    await this.checkAuthentication()

    const params = new URLSearchParams(window.location.search)
    this.teacherId = params.get('id')

    if (this.teacherId) {
      await this.loadTeacherDetail(this.teacherId)
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
    async loadTeacherDetail(id) {
      try {
        const res = await teacherService.getById(id)
        const data = res.data || res

        if (!data) {
          AlertUtils.error('Không tìm thấy giáo viên')
          this.$router.push('/teachers')
          return
        }

        this.form.name = data.name || ''
        this.form.specialized = data.specialized || ''
        this.form.degree = data.degree || ''
        this.form.description = data.description || ''
        this.form.existingAvatar = data.avatar || ''

        if (data.avatar) {
          this.previewUrl = `http://localhost:8000/web/avatar/teacher/${data.avatar}`
        }
      } catch (error) {
        console.error(error)
        AlertUtils.error('Không thể tải thông tin giáo viên.')
        this.$router.push('/teachers')
      }
    },
    handleAvatarChange(event) {
      const file = event.target.files && event.target.files[0]
      this.form.avatarFile = file || null

      if (file) {
        const reader = new FileReader()
        reader.onload = e => {
          this.previewUrl = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    triggerAvatarBrowse() {
      if (this.$refs.avatarInput) {
        this.$refs.avatarInput.click()
      }
    },
    validateForm() {
      this.errors = {}
      let hasErrors = false

      if (!this.form.name) {
        this.errors.name = 'Hãy nhập tên giáo viên.'
        hasErrors = true
      } else if (this.form.name.length > 100) {
        this.errors.name = 'Không nhập quá 100 ký tự.'
        hasErrors = true
      }

      if (!this.form.specialized) {
        this.errors.specialized = 'Hãy chọn chuyên ngành.'
        hasErrors = true
      }

      if (!this.form.degree) {
        this.errors.degree = 'Hãy chọn bằng cấp.'
        hasErrors = true
      }

      if (!this.form.description) {
        this.errors.description = 'Hãy nhập mô tả chi tiết.'
        hasErrors = true
      } else if (this.form.description.length > 1000) {
        this.errors.description = 'Không nhập quá 1000 ký tự.'
        hasErrors = true
      }

      if (!this.form.avatarFile && !this.form.existingAvatar) {
        this.errors.avatar = 'Hãy chọn avatar.'
        hasErrors = true
      }

      return !hasErrors
    },
    showConfirm() {
      if (!this.validateForm()) return

      this.confirmData = {
        name: this.form.name,
        specializedLabel: this.specializedLabelMap[this.form.specialized] || this.form.specialized,
        degreeLabel: this.degreeLabelMap[this.form.degree] || this.form.degree,
        description: this.form.description
      }

      this.currentStep = 'confirm'
    },
    showInput() {
      this.currentStep = 'input'
    },
    async submitForm() {
      if (!this.validateForm()) return

      const formData = new FormData()
      formData.append('name', this.form.name)
      formData.append('specialized', this.form.specialized)
      formData.append('degree', this.form.degree)
      formData.append('description', this.form.description)

      if (this.form.avatarFile) {
        formData.append('avatar', this.form.avatarFile)
      }

      if (this.isEditMode) {
        formData.append('_method', 'PUT')
        if (!this.form.avatarFile && this.form.existingAvatar) {
          formData.append('existing_avatar', this.form.existingAvatar)
        }
      }

      try {
        this.saving = true

        const action = this.isEditMode ? 'edit' : 'create'

        if (this.isEditMode) {
          await apiClient.request('POST', `/api/teachers/${this.teacherId}`, formData)
          AlertUtils.success('Cập nhật giáo viên thành công!')
        } else {
          await apiClient.request('POST', '/api/teachers', formData)
          AlertUtils.success('Đăng ký giáo viên thành công!')
        }

        this.$router.push({
          path: '/teachers/edit-success',
          query: { teacherName: this.form.name, action }
        })
      } catch (error) {
        console.error('Teacher save error:', error)
        AlertUtils.error(error.message || 'Không thể lưu giáo viên.')
        this.currentStep = 'input'
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped>
.teacher-edit-fullpage {
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

.teacher-form-container {
  display: none;
  max-width: 900px;
  margin: 0 auto;
  background: #ffffff;
  padding: 40px;
}

.teacher-form-container.active {
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
.form-select,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  font-family: inherit;
}

.form-select {
  max-height: 200px;
  overflow-y: auto;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-input-file {
  display: block;
  margin-top: 8px;
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

.form-row.has-error .form-input,
.form-row.has-error .form-select,
.form-row.has-error .form-textarea {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
  display: block;
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
