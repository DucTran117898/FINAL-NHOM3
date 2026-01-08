/**
 * Add Subject Page Script
 */

let selectedFile = null;

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth()) return;
    setupEventListeners();

    // Logout handler
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
});

function setupEventListeners() {
    // File Input Preview
    document.getElementById('avatar').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                AlertUtils.error('Vui lòng chọn file hình ảnh (jpg, png, gif...)');
                this.value = '';
                selectedFile = null;
                document.getElementById('avatarPreview').classList.remove('show');
                return;
            }
            selectedFile = file;
            const reader = new FileReader();
            reader.onload = function (e) {
                const preview = document.getElementById('avatarPreview');
                preview.src = e.target.result;
                preview.classList.add('show');

                // Update confirm preview as well
                document.getElementById('confirmAvatar').src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // Navigation Buttons
    document.getElementById('btnToConfirm').addEventListener('click', showConfirm);
    document.getElementById('btnBackToEdit').addEventListener('click', showInput);
    document.getElementById('btnRegister').addEventListener('click', registerSubject);
}

function showConfirm() {
    // Validate Input
    const name = document.getElementById('name').value.trim();
    const schoolYear = document.getElementById('school_year').value;
    const description = document.getElementById('description').value.trim();
    const avatarInput = document.getElementById('avatar');

    if (!name) {
        AlertUtils.warning('Vui lòng nhập tên môn học');
        return;
    }
    if (!schoolYear) {
        AlertUtils.warning('Vui lòng chọn khóa');
        return;
    }
    if (!description) {
        AlertUtils.warning('Vui lòng nhập mô tả chi tiết');
        return;
    }
    if (!selectedFile) {
        AlertUtils.warning('Vui lòng chọn ảnh đại diện');
        return;
    }

    // Populate Confirm View
    document.getElementById('confirmName').textContent = name;
    document.getElementById('confirmYear').textContent = schoolYear;
    document.getElementById('confirmDesc').textContent = description;

    // Switch View
    document.getElementById('step-input').classList.remove('active');
    document.getElementById('step-confirm').classList.add('active');

    // Clear Alerts
    const alertContainer = document.getElementById('alertContainer');
    if (alertContainer) alertContainer.innerHTML = '';
}

function showInput() {
    document.getElementById('step-confirm').classList.remove('active');
    document.getElementById('step-input').classList.add('active');
}

async function registerSubject() {
    const name = document.getElementById('name').value.trim();
    const schoolYear = document.getElementById('school_year').value;
    const description = document.getElementById('description').value.trim();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('school_year', schoolYear);
    formData.append('description', description);
    formData.append('avatar', selectedFile);

    try {
        // Disable button to prevent double submit
        const btnRegister = document.getElementById('btnRegister');
        const originalText = btnRegister.textContent;
        btnRegister.disabled = true;
        btnRegister.textContent = 'Đang đăng ký...';

        await subjectService.create(formData);

        // Show Success Step
        document.getElementById('step-confirm').classList.remove('active');
        document.getElementById('step-success').classList.add('active');

    } catch (error) {
        console.error('Failed to create subject:', error);
        AlertUtils.error(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');

        // Re-enable button
        const btnRegister = document.getElementById('btnRegister');
        btnRegister.disabled = false;
        btnRegister.textContent = 'Đăng ký';
    }
}
