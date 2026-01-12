/**
 * Edit Student Page Script
 */

let selectedFile = null;
let studentId = null;

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) return;

    studentId = getStudentId();
    if (!studentId) {
        AlertUtils.error('Không tìm thấy ID học sinh');
        return;
    }

    setupEventListeners();
    await loadStudentDetail(studentId);

    document.getElementById('logoutBtn')
        ?.addEventListener('click', handleLogout);
});

/* ================= INIT ================= */

function getStudentId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function setupEventListeners() {
    document.getElementById('editStudentForm')
        ?.addEventListener('submit', e => e.preventDefault());

    document.getElementById('avatar')
        ?.addEventListener('change', handleAvatarChange);

    document.getElementById('btnToConfirm')
        ?.addEventListener('click', showConfirm);

    document.getElementById('btnBackToEdit')
        ?.addEventListener('click', showInput);

    document.getElementById('btnRegister')
        ?.addEventListener('click', submitEdit);
}

/* ================= LOAD OLD DATA ================= */

async function loadStudentDetail(id) {
    try {
        const res = await studentService.getById(id);
        const student = res.data; 

        document.getElementById('name').value = student.name ?? '';
        document.getElementById('description').value = student.description ?? '';

        if (student.avatar) {
            const preview = document.getElementById('avatarPreview');
            const confirm = document.getElementById('confirmAvatar');

            const API_BASE = 'http://localhost:8000';

            preview.src = API_BASE + '/web/avatar/student/' + student.avatar;
            confirm.src = API_BASE + '/web/avatar/student/' + student.avatar;

           
            preview.classList.add('show');
            confirm.classList.add('show');
        }

        selectedFile = null;
    } catch (error) {
        console.error(error);
        AlertUtils.error('Không thể tải thông tin học sinh');
    }
}


/* ================= AVATAR ================= */

function handleAvatarChange(e) {
    const file = e.target.files[0];

    if (!file) {
        selectedFile = null;
        return;
    }

    if (!file.type.startsWith('image/')) {
        AlertUtils.warning('Vui lòng chọn file hình ảnh');
        e.target.value = '';
        selectedFile = null;
        return;
    }

    selectedFile = file;

    const reader = new FileReader();
    reader.onload = event => {
        document.getElementById('avatarPreview').src = event.target.result;
        document.getElementById('avatarPreview').classList.add('show');

        document.getElementById('confirmAvatar').src = event.target.result;
        document.getElementById('confirmAvatar').classList.add('show');
    };
    reader.readAsDataURL(file);
}

/* ================= STEP ================= */

function showConfirm() {
    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();
    const hasOldAvatar =
        document.getElementById('avatarPreview').classList.contains('show');

    if (!name) {
        AlertUtils.warning('Vui lòng nhập tên học sinh');
        return;
    }

    if (!description) {
        AlertUtils.warning('Vui lòng nhập mô tả');
        return;
    }

    if (!selectedFile && !hasOldAvatar) {
        AlertUtils.warning('Vui lòng chọn avatar');
        return;
    }

    document.getElementById('confirmName').textContent = name;
    document.getElementById('confirmDesc').textContent = description;

    document.getElementById('step-input').classList.remove('active');
    document.getElementById('step-confirm').classList.add('active');

    clearAlerts();
}

function showInput() {
    document.getElementById('step-confirm').classList.remove('active');
    document.getElementById('step-input').classList.add('active');
}

/* ================= SUBMIT ================= */

async function submitEdit() {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('name', document.getElementById('name').value.trim());
    formData.append('description', document.getElementById('description').value.trim());

    if (selectedFile) {
        formData.append('avatar', selectedFile);
    }

    const btn = document.getElementById('btnRegister');
    const originalText = btn.textContent;

    try {
        btn.disabled = true;
        btn.textContent = 'Đang lưu...';

        await studentService.update(studentId, formData);

        AlertUtils.success('Cập nhật học sinh thành công');

        window.location.href = 'edit-success.html';

    } catch (error) {
        console.error(error);
        AlertUtils.error(error.message || 'Cập nhật thất bại');
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

/* ================= UTILS ================= */

function clearAlerts() {
    const alertContainer = document.getElementById('alertContainer');
    if (alertContainer) alertContainer.innerHTML = '';
}
