/**
 * Teacher Edit Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const teacherEdit = new TeacherEdit();
    teacherEdit.init();
});

class TeacherEdit {
    constructor() {
        // Get teacher ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        this.teacherId = urlParams.get('id');

        if (!this.teacherId) {
            AlertUtils.error('Không tìm thấy ID giáo viên');
            setTimeout(() => {
                window.location.href = 'teachers.html';
            }, 2000);
            return;
        }

        // Steps
        this.stepInput = DOM.getElementById('stepInput');
        this.stepConfirm = DOM.getElementById('stepConfirm');
        this.stepComplete = DOM.getElementById('stepComplete');

        // Form fields
        this.form = DOM.getElementById('teacherForm');
        this.inputName = DOM.getElementById('name');
        this.inputSpecialized = DOM.getElementById('specialized');
        this.inputDegree = DOM.getElementById('degree');
        this.inputDescription = DOM.getElementById('description');
        this.inputAvatar = DOM.getElementById('avatar');
        this.avatarPreview = DOM.getElementById('avatarPreview');
        this.avatarPreviewContainer = DOM.getElementById('avatarPreviewContainer');

        // Buttons
        this.btnConfirm = DOM.getElementById('btnConfirm');
        this.btnEdit = DOM.getElementById('btnEdit');
        this.btnUpdate = DOM.getElementById('btnUpdate');

        // Confirm Display Fields
        this.confirmName = DOM.getElementById('confirm-name');
        this.confirmSpecialized = DOM.getElementById('confirm-specialized');
        this.confirmDegree = DOM.getElementById('confirm-degree');
        this.confirmDescription = DOM.getElementById('confirm-description');
        this.confirmAvatar = DOM.getElementById('confirm-avatar');

        // Data
        this.avatarFile = null;
        this.currentAvatarFilename = null;

        // Constants
        this.SPECIALIZED_MAP = {
            '001': 'Khoa học máy tính',
            '002': 'Khoa học dữ liệu',
            '003': 'Hải dương học'
        };
        this.DEGREE_MAP = {
            '001': 'Cử nhân',
            '002': 'Thạc sĩ',
            '003': 'Tiến sĩ',
            '004': 'Phó giáo sư',
            '005': 'Giáo sư'
        };
    }

    async init() {
        if (!this.teacherId) return;
        await this.loadTeacherData();
        this.setupEventListeners();
    }

    async loadTeacherData() {
        try {
            const response = await teacherService.getById(this.teacherId);

            if (response && response.data) {
                const teacher = response.data;
                
                // Populate form with existing data
                this.inputName.value = teacher.name || '';
                this.inputSpecialized.value = teacher.specialized || '';
                this.inputDegree.value = teacher.degree || '';
                this.inputDescription.value = teacher.description || '';
                
                // Store current avatar filename
                this.currentAvatarFilename = teacher.avatar;
                
                // Show existing avatar if available
                if (teacher.avatar) {
                    const avatarUrl = `http://localhost:8000/web/avatar/teacher/${teacher.avatar}`;
                    this.avatarPreview.src = avatarUrl;
                    DOM.show(this.avatarPreviewContainer);
                }
            } else {
                AlertUtils.error('Không tìm thấy thông tin giáo viên');
                setTimeout(() => {
                    window.location.href = 'teachers.html';
                }, 2000);
            }
        } catch (error) {
            console.error('Failed to load teacher:', error);
            AlertUtils.error('Không thể tải thông tin giáo viên');
            setTimeout(() => {
                window.location.href = 'teachers.html';
            }, 2000);
        }
    }

    setupEventListeners() {
        // Image preview
        DOM.on(this.inputAvatar, 'change', (e) => this.handleAvatarChange(e));

        // Step navigation
        DOM.on(this.btnConfirm, 'click', () => this.goToConfirm());
        DOM.on(this.btnEdit, 'click', () => this.goToInput());
        DOM.on(this.btnUpdate, 'click', (e) => {
            if (e) e.preventDefault();
            this.updateTeacher();
        });

        // Real-time validation clear
        [this.inputName, this.inputSpecialized, this.inputDegree, this.inputDescription, this.inputAvatar].forEach(input => {
            if (input) {
                DOM.on(input, 'input', () => this.clearError(input));
                DOM.on(input, 'change', () => this.clearError(input));
            }
        });
    }

    handleAvatarChange(e) {
        const file = e.target.files[0];
        if (file) {
            this.avatarFile = file;
            const reader = new FileReader();
            reader.onload = (event) => {
                this.avatarPreview.src = event.target.result;
                DOM.show(this.avatarPreviewContainer);
            };
            reader.readAsDataURL(file);
        }
    }

    validateForm() {
        let isValid = true;

        if (ValidationUtils.isEmpty(this.inputName.value)) {
            this.showError(this.inputName, 'Hãy nhập tên giáo viên.');
            isValid = false;
        } else if (this.inputName.value.length > 100) {
            this.showError(this.inputName, 'Không nhập quá 100 ký tự.');
            isValid = false;
        }

        if (ValidationUtils.isEmpty(this.inputSpecialized.value)) {
            this.showError(this.inputSpecialized, 'Hãy chọn bộ môn.');
            isValid = false;
        }

        if (ValidationUtils.isEmpty(this.inputDegree.value)) {
            this.showError(this.inputDegree, 'Hãy chọn bằng cấp.');
            isValid = false;
        }

        if (ValidationUtils.isEmpty(this.inputDescription.value)) {
            this.showError(this.inputDescription, 'Hãy nhập mô tả chi tiết');
            isValid = false;
        } else if (this.inputDescription.value.length > 1000) {
            this.showError(this.inputDescription, 'Không nhập quá 1000 ký tự');
            isValid = false;
        }

        // Avatar is required only if no existing avatar
        if (!this.avatarFile && !this.currentAvatarFilename) {
            this.showError(this.inputAvatar, 'Hãy chọn avatar');
            isValid = false;
        }

        return isValid;
    }

    showError(input, message) {
        const group = input.closest('.form-group');
        DOM.addClass(group, 'has-error');
        const errorDiv = group.querySelector('.error-message');
        if (errorDiv) errorDiv.textContent = message;
    }

    clearError(input) {
        const group = input.closest('.form-group');
        DOM.removeClass(group, 'has-error');
    }

    goToConfirm() {
        if (!this.validateForm()) return;

        // Populate confirm screen
        this.confirmName.textContent = this.inputName.value;
        this.confirmSpecialized.textContent = this.SPECIALIZED_MAP[this.inputSpecialized.value] || this.inputSpecialized.value;
        this.confirmDegree.textContent = this.DEGREE_MAP[this.inputDegree.value] || this.inputDegree.value;
        this.confirmDescription.textContent = this.inputDescription.value;
        this.confirmAvatar.src = this.avatarPreview.src;

        // Switch screen
        DOM.hide(this.stepInput);
        DOM.show(this.stepConfirm);
        this.stepConfirm.classList.add('active');
        this.stepInput.classList.remove('active');
    }

    goToInput() {
        DOM.hide(this.stepConfirm);
        DOM.show(this.stepInput);
        this.stepInput.classList.add('active');
        this.stepConfirm.classList.remove('active');
    }

    async updateTeacher() {
        try {
            this.btnUpdate.disabled = true;
            this.btnUpdate.textContent = 'Đang xử lý...';

            const formData = new FormData();
            formData.append('name', this.inputName.value);
            formData.append('specialized', this.inputSpecialized.value);
            formData.append('degree', this.inputDegree.value);
            formData.append('description', this.inputDescription.value);
            formData.append('_method', 'PUT');
            
            // Only append new avatar if user selected a new file
            if (this.avatarFile) {
                formData.append('avatar', this.avatarFile);
            } else if (this.currentAvatarFilename) {
                formData.append('existing_avatar', this.currentAvatarFilename);
            }

            const response = await fetch(`http://localhost:8000/api/teachers/${this.teacherId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiClient.getToken()}`
                },
                body: formData
            });

            if (response.status === 401) {
                apiClient.setToken(null);
                window.location.href = 'login.html';
                return;
            }

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `HTTP ${response.status}`);
            }

            // Success - go to complete step
            this.goToComplete();
        } catch (error) {
            console.error('Update error:', error);
            AlertUtils.error('Có lỗi xảy ra: ' + error.message);
        } finally {
            this.btnUpdate.disabled = false;
            this.btnUpdate.textContent = 'Đăng ký';
        }
    }

    goToComplete() {
        DOM.hide(this.stepConfirm);
        DOM.show(this.stepComplete);
        this.stepComplete.classList.add('active');
        this.stepConfirm.classList.remove('active');
    }
}
