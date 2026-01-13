<template>
  <div class="score-edit-fullpage">
    <div id="alertContainer" style="position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;">
    </div>

    <!-- STEP 1: INPUT FORM -->
    <div id="step-input" class="score-form-container" :class="{ active: currentStep === 'input' }">
      
      <form id="editScoreForm" @submit.prevent="showConfirm">
        <!-- Sinh viên -->
        <div class="form-row">
          <label class="form-label" for="studentId">
            Sinh viên <span class="required">*</span>
          </label>
          <div class="form-input-wrapper">
            <div class="searchable-select" :class="{ open: studentDropdownOpen, 'has-error': errors.studentId }" ref="studentSelect">
              <div class="select-display" @click="toggleStudentDropdown">
                {{ selectedStudentName || '-- Chọn sinh viên --' }}
              </div>
              <div class="select-dropdown">
                <input 
                  type="text" 
                  class="quicksearch-input" 
                  v-model="studentSearchQuery"
                  @input="filterStudents"
                  placeholder="Tìm kiếm sinh viên..."
                  @click.stop>
                <div class="select-options" style="max-height: 200px; overflow-y: auto;">
                  <div 
                    v-for="student in filteredStudents" 
                    :key="student.id"
                    class="select-option"
                    @click="selectStudent(student)">
                    {{ student.name }}
                  </div>
                  <div v-if="filteredStudents.length === 0" class="select-option no-results">
                    Không tìm thấy
                  </div>
                </div>
              </div>
            </div>
            <span class="error-message" v-if="errors.studentId">{{ errors.studentId }}</span>
          </div>
        </div>

        <!-- Môn học -->
        <div class="form-row">
          <label class="form-label" for="subjectId">
            Môn học <span class="required">*</span>
          </label>
          <div class="form-input-wrapper">
            <div class="searchable-select" :class="{ open: subjectDropdownOpen, 'has-error': errors.subjectId }" ref="subjectSelect">
              <div class="select-display" @click="toggleSubjectDropdown">
                {{ selectedSubjectName || '-- Chọn môn học --' }}
              </div>
              <div class="select-dropdown">
                <input 
                  type="text" 
                  class="quicksearch-input" 
                  v-model="subjectSearchQuery"
                  @input="filterSubjects"
                  placeholder="Tìm kiếm môn học..."
                  @click.stop>
                <div class="select-options" style="max-height: 200px; overflow-y: auto;">
                  <div 
                    v-for="subject in filteredSubjects" 
                    :key="subject.id"
                    class="select-option"
                    @click="selectSubject(subject)">
                    {{ subject.name }}
                  </div>
                  <div v-if="filteredSubjects.length === 0" class="select-option no-results">
                    Không tìm thấy
                  </div>
                </div>
              </div>
            </div>
            <span class="error-message" v-if="errors.subjectId">{{ errors.subjectId }}</span>
          </div>
        </div>

        <!-- Giáo viên -->
        <div class="form-row">
          <label class="form-label">
            Giáo viên <span class="required">*</span>
          </label>
          <div class="form-input-wrapper">
            <div class="searchable-select" :class="{ open: teacherDropdownOpen, 'has-error': errors.teacherIds }" ref="teacherSelect">
              <div class="select-display" @click="toggleTeacherDropdown">
                {{ selectedTeacherNames || '-- Chọn giáo viên --' }}
              </div>
              <div class="select-dropdown">
                <div class="select-options" style="max-height: 200px; overflow-y: auto;">
                  <label 
                    v-for="teacher in teachers" 
                    :key="teacher.id"
                    class="select-option checkbox-option">
                    <input 
                      type="checkbox" 
                      :value="teacher.id"
                      v-model="form.teacher_ids"
                      @change="updateTeacherDisplay">
                    {{ teacher.name }}
                  </label>
                </div>
              </div>
            </div>
            <span class="error-message" v-if="errors.teacherIds">{{ errors.teacherIds }}</span>
          </div>
        </div>

        <!-- Điểm -->
        <div class="form-row">
          <label class="form-label" for="score">
            Điểm <span class="required">*</span>
          </label>
          <div class="form-input-wrapper">
            <select 
              id="score" 
              v-model="form.score" 
              class="form-select"
              :class="{ 'has-error': errors.score }"
              style="max-height: 200px; overflow-y: auto;">
              <option value="">-- Chọn điểm --</option>
              <option v-for="i in 11" :key="i - 1" :value="i - 1">{{ i - 1 }}</option>
            </select>
            <span class="error-message" v-if="errors.score">{{ errors.score }}</span>
          </div>
        </div>

        <!-- Comment chi tiết -->
        <div class="form-row">
          <label class="form-label" for="comment">
            Comment chi tiết <span class="required">*</span>
          </label>
          <div class="form-input-wrapper">
            <textarea 
              id="comment" 
              v-model="form.comment"
              class="form-textarea"
              :class="{ 'has-error': errors.comment }"
              rows="5" 
              placeholder="Nhập comment chi tiết..."></textarea>
            <span class="error-message" v-if="errors.comment">{{ errors.comment }}</span>
          </div>
        </div>

        <div class="form-actions">
          <router-link to="/scores" class="btn-cancel">Hủy</router-link>
          <button type="submit" class="btn-confirm">Xác nhận</button>
        </div>
      </form>
    </div>

    <!-- STEP 2: CONFIRMATION -->
    <div id="step-confirm" class="score-form-container" :class="{ active: currentStep === 'confirm' }">
      <h2 class="form-title">Xác Nhận Thông Tin Điểm Số</h2>

      <div class="confirm-content">
        <div class="confirm-row">
          <div class="confirm-label">Sinh viên:</div>
          <div class="confirm-value">{{ confirmData.student_name }}</div>
        </div>

        <div class="confirm-row">
          <div class="confirm-label">Môn học:</div>
          <div class="confirm-value">{{ confirmData.subject_name }}</div>
        </div>

        <div class="confirm-row">
          <div class="confirm-label">Giáo viên:</div>
          <div class="confirm-value">{{ confirmData.teacher_names }}</div>
        </div>

        <div class="confirm-row">
          <div class="confirm-label">Điểm:</div>
          <div class="confirm-value">{{ confirmData.score }}</div>
        </div>

        <div class="confirm-row">
          <div class="confirm-label">Comment chi tiết:</div>
          <div class="confirm-value" style="white-space: pre-wrap;">{{ confirmData.comment }}</div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" @click="showInput">Sửa lại</button>
        <button type="button" class="btn-confirm" @click="submitEdit" :disabled="saving">
          <span v-if="!saving">{{ isEditMode ? 'Cập nhật' : 'Đăng ký' }}</span>
          <span v-else>Đang lưu...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { scoreService, studentService, subjectService, teacherService, apiClient, authService } from '../services/api.js'
import { StorageUtils, AlertUtils } from '../utils/helpers.js'

export default {
  name: 'ScoreEdit',
  data() {
    return {
      currentStep: 'input',
      form: {
        student_id: '',
        subject_id: '',
        teacher_ids: [],
        score: '',
        comment: ''
      },
      confirmData: {},
      scoreId: null,
      saving: false,
      user: null,
      errors: {},
      students: [],
      subjects: [],
      teachers: [],
      studentDropdownOpen: false,
      subjectDropdownOpen: false,
      teacherDropdownOpen: false,
      studentSearchQuery: '',
      subjectSearchQuery: '',
      filteredStudents: [],
      filteredSubjects: []
    }
  },
  computed: {
    isEditMode() {
      return !!this.scoreId
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
    selectedStudentName() {
      if (!this.form.student_id) return ''
      const student = this.students.find(s => s.id == this.form.student_id)
      return student ? student.name : ''
    },
    selectedSubjectName() {
      if (!this.form.subject_id) return ''
      const subject = this.subjects.find(s => s.id == this.form.subject_id)
      return subject ? subject.name : ''
    },
    selectedTeacherNames() {
      if (!this.form.teacher_ids || this.form.teacher_ids.length === 0) {
        return ''
      }
      return this.teachers
        .filter(t => this.form.teacher_ids.includes(t.id))
        .map(t => t.name)
        .join(', ')
    }
  },
  watch: {
    students() {
      this.filteredStudents = this.students
    },
    subjects() {
      this.filteredSubjects = this.subjects
    }
  },
  async mounted() {
    await this.checkAuthentication()
    await this.loadStudentsForSelect()
    await this.loadSubjectsForSelect()
    await this.loadTeachersForSelect()
    
    const params = new URLSearchParams(window.location.search)
    this.scoreId = params.get('id')
    
    if (this.scoreId) {
      await this.loadScoreDetail(this.scoreId)
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    handleClickOutside(event) {
      if (this.$refs.studentSelect && !this.$refs.studentSelect.contains(event.target)) {
        this.studentDropdownOpen = false
      }
      if (this.$refs.subjectSelect && !this.$refs.subjectSelect.contains(event.target)) {
        this.subjectDropdownOpen = false
      }
      if (this.$refs.teacherSelect && !this.$refs.teacherSelect.contains(event.target)) {
        this.teacherDropdownOpen = false
      }
    },
    toggleStudentDropdown() {
      this.studentDropdownOpen = !this.studentDropdownOpen
      if (this.studentDropdownOpen) {
        this.filteredStudents = this.students
        this.studentSearchQuery = ''
      }
    },
    toggleSubjectDropdown() {
      this.subjectDropdownOpen = !this.subjectDropdownOpen
      if (this.subjectDropdownOpen) {
        this.filteredSubjects = this.subjects
        this.subjectSearchQuery = ''
      }
    },
    toggleTeacherDropdown() {
      this.teacherDropdownOpen = !this.teacherDropdownOpen
    },
    filterStudents() {
      const query = this.studentSearchQuery.toLowerCase().trim()
      if (!query) {
        this.filteredStudents = this.students
        return
      }
      this.filteredStudents = this.students.filter(student =>
        student.name.toLowerCase().includes(query)
      )
    },
    filterSubjects() {
      const query = this.subjectSearchQuery.toLowerCase().trim()
      if (!query) {
        this.filteredSubjects = this.subjects
        return
      }
      this.filteredSubjects = this.subjects.filter(subject =>
        subject.name.toLowerCase().includes(query)
      )
    },
    selectStudent(student) {
      this.form.student_id = student.id
      this.studentDropdownOpen = false
      this.studentSearchQuery = ''
      this.filteredStudents = this.students
    },
    selectSubject(subject) {
      this.form.subject_id = subject.id
      this.subjectDropdownOpen = false
      this.subjectSearchQuery = ''
      this.filteredSubjects = this.subjects
    },
    updateTeacherDisplay() {
      // This is handled by computed property
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
    async loadStudentsForSelect() {
      try {
        const response = await studentService.getAll(1, 1000)
        if (response && response.success && response.data) {
          this.students = response.data
          this.filteredStudents = response.data
        }
      } catch (error) {
        console.error('Failed to load students:', error)
      }
    },
    async loadSubjectsForSelect() {
      try {
        const response = await subjectService.getAll()
        if (response && response.success && response.data) {
          this.subjects = response.data
          this.filteredSubjects = response.data
        } else if (Array.isArray(response)) {
          this.subjects = response
          this.filteredSubjects = response
        }
      } catch (error) {
        console.error('Failed to load subjects:', error)
      }
    },
    async loadTeachersForSelect() {
      try {
        const response = await teacherService.getAll(1, 1000)
        if (response && response.success && response.data) {
          this.teachers = response.data
        }
      } catch (error) {
        console.error('Failed to load teachers:', error)
      }
    },
    async loadScoreDetail(id) {
      try {
        const res = await scoreService.getById(id)
        const data = res.data || res

        if (!data) {
          AlertUtils.error('Không tìm thấy điểm số')
          this.$router.push('/scores')
          return
        }

        this.form.student_id = data.student_id
        this.form.subject_id = data.subject_id
        this.form.score = data.score
        this.form.comment = data.description || ''

        // Handle teacher_ids - if it's an array, use it; otherwise, get from the score data
        if (Array.isArray(data.teacher_ids)) {
          this.form.teacher_ids = data.teacher_ids.map(id => Number(id))
        } else if (data.teacher_id) {
          this.form.teacher_ids = [Number(data.teacher_id)]
        } else {
          this.form.teacher_ids = []
        }
      } catch (error) {
        console.error(error)
        AlertUtils.error('Không thể tải thông tin điểm số.')
        this.$router.push('/scores')
      }
    },
    showConfirm() {
      this.errors = {}
      let hasErrors = false

      // Validate student
      if (!this.form.student_id) {
        this.errors.studentId = 'Hãy chọn sinh viên'
        hasErrors = true
      }

      // Validate subject
      if (!this.form.subject_id) {
        this.errors.subjectId = 'Hãy chọn môn học'
        hasErrors = true
      }

      // Validate teachers
      if (!this.form.teacher_ids || this.form.teacher_ids.length === 0) {
        this.errors.teacherIds = 'Hãy chọn giáo viên'
        hasErrors = true
      }

      // Validate score
      if (this.form.score === '' || this.form.score === null || this.form.score === undefined) {
        this.errors.score = 'Hãy chọn điểm'
        hasErrors = true
      } else {
        const scoreNum = parseFloat(this.form.score)
        if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
          this.errors.score = 'Điểm phải từ 0 đến 10'
          hasErrors = true
        }
      }

      // Validate comment
      if (!this.form.comment || this.form.comment.trim() === '') {
        this.errors.comment = 'Hãy nhập comment chi tiết'
        hasErrors = true
      }

      if (hasErrors) {
        return
      }

      // Get names for display
      const student = this.students.find(s => s.id == this.form.student_id)
      const subject = this.subjects.find(s => s.id == this.form.subject_id)
      const teacherNames = this.teachers
        .filter(t => this.form.teacher_ids.includes(t.id))
        .map(t => t.name)

      // Store confirm data
      this.confirmData = {
        student_name: student?.name || 'N/A',
        subject_name: subject?.name || 'N/A',
        teacher_names: teacherNames.join(', ') || 'N/A',
        score: this.form.score,
        comment: this.form.comment
      }

      this.currentStep = 'confirm'
    },
    showInput() {
      this.currentStep = 'input'
    },
    async submitEdit() {
      const data = {
        student_id: this.form.student_id,
        subject_id: this.form.subject_id,
        score: parseFloat(this.form.score),
        teacher_ids: this.form.teacher_ids,
        description: this.form.comment
      }

      try {
        this.saving = true

        if (this.scoreId) {
          await scoreService.update(this.scoreId, data)
          AlertUtils.success('Cập nhật điểm số thành công')
        } else {
          await scoreService.create(data)
          AlertUtils.success('Thêm điểm số thành công')
        }

        // Pass student name as query parameter
        const studentName = this.confirmData.student_name || ''
        const action = this.scoreId ? 'edit' : 'create'
        this.$router.push({
          path: '/scores/edit-success',
          query: { studentName: studentName, action }
        })
      } catch (error) {
        console.error(error)
        AlertUtils.error(error.message || 'Lưu điểm số thất bại')
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped>
.score-edit-fullpage {
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

.score-form-container {
  display: none;
  max-width: 900px;
  margin: 0 auto;
  background: #ffffff;
  padding: 40px;
}

.score-form-container.active {
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

.form-label .required {
  color: #dc3545;
}

.form-input-wrapper {
  flex: 1;
  position: relative;
}

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

.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4a90e2;
}

.form-select.has-error,
.form-textarea.has-error {
  border-color: #dc3545;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

/* Searchable Select Styles */
.searchable-select {
  position: relative;
  width: 100%;
}

.select-display {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  min-height: 42px;
  display: flex;
  align-items: center;
  font-size: 16px;
}

.select-display:hover {
  border-color: #4a90e2;
}

.searchable-select.open .select-display {
  border-color: #4a90e2;
}

.searchable-select.has-error .select-display {
  border-color: #dc3545;
}

.select-dropdown {
  display: none;
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  z-index: 1000;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.searchable-select.open .select-dropdown {
  display: block;
}

.quicksearch-input {
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-bottom: 1px solid #eee;
  border-radius: 4px 4px 0 0;
  font-size: 14px;
  box-sizing: border-box;
}

.quicksearch-input:focus {
  outline: none;
}

.select-options {
  max-height: 200px;
  overflow-y: auto;
}

.select-option {
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
  border-bottom: 1px solid #f0f0f0;
}

.select-option:hover {
  background-color: #f5f7fa;
}

.select-option:last-child {
  border-bottom: none;
}

.select-option.no-results {
  color: #999;
  cursor: default;
}

.select-option.no-results:hover {
  background-color: transparent;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-option input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* Confirmation Styles */
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

/* Form Actions */
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
