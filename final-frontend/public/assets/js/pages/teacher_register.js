/**
 * Teacher Register Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const teacherRegister = new TeacherRegister();
    teacherRegister.init();
});

class TeacherRegister {
    constructor() {
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
        this.btnRegister = DOM.getElementById('btnRegister');

        // Confirm Display Fields
        this.confirmName = DOM.getElementById('confirm-name');
        this.confirmSpecialized = DOM.getElementById('confirm-specialized');
        this.confirmDegree = DOM.getElementById('confirm-degree');
        this.confirmDescription = DOM.getElementById('confirm-description');
        this.confirmAvatar = DOM.getElementById('confirm-avatar');

        // Data
        this.formData = null;
        this.avatarFile = null;

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

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Image preview
        DOM.on(this.inputAvatar, 'change', (e) => this.handleAvatarChange(e));

        // Step navigation
        DOM.on(this.btnConfirm, 'click', () => this.goToConfirm());
        DOM.on(this.btnEdit, 'click', () => this.goToInput());
        DOM.on(this.btnRegister, 'click', (e) => {
            if (e) e.preventDefault();
            this.registerTeacher();
        });

        // Real-time validation clear
        [this.inputName, this.inputSpecialized, this.inputDegree, this.inputDescription, this.inputAvatar].forEach(input => {
            DOM.on(input, 'input', () => this.clearError(input));
            DOM.on(input, 'change', () => this.clearError(input));
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

        if (!this.avatarFile) {
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
        this.confirmSpecialized.textContent = this.SPECIALIZED_MAP[this.inputSpecialized.value];
        this.confirmDegree.textContent = this.DEGREE_MAP[this.inputDegree.value];
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

    async registerTeacher() {
        try {
            this.btnRegister.disabled = true;
            this.btnRegister.textContent = 'Đang xử lý...';

            const formData = new FormData();
            formData.append('name', this.inputName.value);
            formData.append('specialized', this.inputSpecialized.value);
            formData.append('degree', this.inputDegree.value);
            formData.append('description', this.inputDescription.value);
            formData.append('avatar', this.avatarFile);

            // Use apiClient.request to automatically handle parsing and errors
            const result = await apiClient.request('POST', '/api/teacher_register', formData);

            // If no error was thrown, registration was successful
            // Success - go to complete step
            this.goToComplete();
        } catch (error) {
            console.error('Registration error:', error);

            // Handle validation errors or system errors
            // Since apiClient throws generic Error, we might need to parse if it was a 400 JSON response
            // But apiClient.request currently throws "HTTP 400" or similar message if not JSON
            // We need to check if we can get the error data.
            // Looking at apiClient: it throws "error.message" from JSON if available.

            // Ideally we should see if error object contains details. 
            // The current apiClient implementation swallows the error details into 'message' mostly, 
            // unless we modify it or the error message is a stringified JSON (unlikely).

            // For now, let's just show a general error or specific message if available
            AlertUtils.error('Có lỗi xảy ra: ' + error.message);
        } finally {
            this.btnRegister.disabled = false;
            this.btnRegister.textContent = 'Đăng ký';
        }
    }

    goToComplete() {
        DOM.hide(this.stepConfirm);
        DOM.show(this.stepComplete);
        this.stepComplete.classList.add('active');
        this.stepConfirm.classList.remove('active');
    }
}
