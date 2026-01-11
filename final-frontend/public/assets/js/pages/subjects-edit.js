/**
 * Edit Subject Page Script
 */

let selectedFile = null;

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth()) return;
    setupEventListeners();

    // Logout handler
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
});

function setupEventListeners() {
    // Prevent default form submission
    const form = document.getElementById('editSubjectForm');
    if (form) {
        form.addEventListener('submit', (e) => e.preventDefault());
    }

    // File Input Preview
    const avatarEl = document.getElementById('avatar');
    if (avatarEl) {
        avatarEl.addEventListener('change', function (e) {
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
            const confirmAvatar = document.getElementById('confirmAvatar');
            confirmAvatar.src = e.target.result;
            confirmAvatar.classList.add('show');
            confirmAvatar.closest('.confirm-row').classList.remove('hidden');
            }
            reader.readAsDataURL(file);
        }
    });
    }

    // Navigation Buttons
    document.getElementById('btnToConfirm').addEventListener('click', (e) => {
        e.preventDefault();
        showConfirm();
    });
    document.getElementById('btnBackToEdit').addEventListener('click', (e) => {
        e.preventDefault();
        showInput();
    });
    document.getElementById('btnEdit').addEventListener('click', (e) => {
        e.preventDefault();
        updateSubject();
    });
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
    // avatar is optional on edit; existing avatar will be kept if none selected

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
    
    const confirmAvatar = document.getElementById('confirmAvatar');
    const avatarRow = confirmAvatar.closest('.confirm-row');

    if (!selectedFile) {
        // Không có avatar mới → ẩn dòng avatar ở confirm
        avatarRow.classList.add('hidden');
    } else {
        avatarRow.classList.remove('hidden');
    }

}

function showInput() {
    document.getElementById('step-confirm').classList.remove('active');
    document.getElementById('step-input').classList.add('active');
}

async function updateSubject() {
    const name = document.getElementById('name').value.trim();
    const schoolYear = document.getElementById('school_year').value;
    const description = document.getElementById('description').value.trim();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('school_year', schoolYear);
    formData.append('description', description);
    if (selectedFile) {
        formData.append('avatar', selectedFile);
    }

    // Get subject id from URL query param ?id=123
    const params = new URLSearchParams(window.location.search);
    const subjectId = params.get('id');
    if (!subjectId) {
        AlertUtils.error('Không tìm thấy ID môn học để cập nhật.');
        return;
    }

    try {
        // Disable button to prevent double submit
        const btnEdit = document.getElementById('btnEdit');
        const originalText = btnEdit.textContent;
        btnEdit.disabled = true;
        btnEdit.textContent = 'Đang cập nhật...';

    await subjectService.update(subjectId, formData);

    // Redirect to Edit Success Page
    window.location.href = 'edit_success.html';

    } catch (error) {
        console.error('Failed to edit subject:', error);
        AlertUtils.error(error.message || 'Cập nhật thất bại. Vui lòng thử lại.');

        // Re-enable button
        const btnEdit = document.getElementById('btnEdit');
        if (btnEdit) {
            btnEdit.disabled = false;
            btnEdit.textContent = 'Xác nhận';
        }
    }
}
