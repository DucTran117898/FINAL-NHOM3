/**
 * Teachers Management Page Script
 */

let currentEditingId = null;

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) return;

    loadTeachers();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('addBtn').addEventListener('click', openAddModal);
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('saveBtn').addEventListener('click', saveTeacher);
    document.getElementById('searchBtn').addEventListener('click', searchTeachers);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchTeachers();
    });
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('teacherModal').addEventListener('click', (e) => {
        if (e.target.id === 'teacherModal') closeModal();
    });
}

async function loadTeachers() {
    try {
        showLoading();
        const response = await teacherService.getAll();

        if (response && response.success && response.data) {
            renderTable(response.data);
        } else {
            renderTable([]);
        }
    } catch (error) {
        console.error('Failed to load teachers:', error);
        AlertUtils.error('Không thể tải danh sách giáo viên. Vui lòng thử lại.');
        document.getElementById('tableBody').innerHTML =
            '<tr><td colspan="7" style="text-align: center; padding: 40px; color: var(--danger);">Lỗi tải dữ liệu</td></tr>';
    }
}

function renderTable(teachers) {
    const tableBody = document.getElementById('tableBody');

    if (!teachers || teachers.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">Không có dữ liệu</td></tr>';
        return;
    }

    tableBody.innerHTML = teachers.map((teacher) => `
        <tr>
            <td>${teacher.id}</td>
            <td>${teacher.name || 'N/A'}</td>
            <td>${teacher.specialized || 'N/A'}</td>
            <td>${teacher.degree || 'N/A'}</td>
            <td>${StringUtils.truncate(teacher.description || 'N/A', 50)}</td>
            <td>${teacher.created ? DateUtils.format(teacher.created) : 'N/A'}</td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="editTeacher(${teacher.id})">✏️ Sửa</button>
                <button class="btn btn-sm btn-danger" onclick="deleteTeacher(${teacher.id})">🗑️ Xóa</button>
            </td>
        </tr>
    `).join('');
}

function openAddModal() {
    currentEditingId = null;
    document.getElementById('teacherForm').reset();
    document.getElementById('modalTitle').textContent = 'Thêm Giáo Viên';
    document.getElementById('teacherModal').classList.add('show');
}

async function editTeacher(id) {
    try {
        const response = await teacherService.getById(id);

        if (response && response.success && response.data) {
            const teacher = response.data;
            currentEditingId = id;
            document.getElementById('name').value = teacher.name || '';
            document.getElementById('specialized').value = teacher.specialized || '';
            document.getElementById('degree').value = teacher.degree || '';
            document.getElementById('description').value = teacher.description || '';
            document.getElementById('avatar').value = teacher.avatar || '';
            document.getElementById('modalTitle').textContent = 'Cập Nhật Giáo Viên';
            document.getElementById('teacherModal').classList.add('show');
        } else {
            AlertUtils.error('Không tìm thấy giáo viên.');
        }
    } catch (error) {
        console.error('Failed to load teacher:', error);
        AlertUtils.error('Không thể tải thông tin giáo viên.');
    }
}

async function saveTeacher() {
    const name = document.getElementById('name').value.trim();
    const specialized = document.getElementById('specialized').value.trim();
    const degree = document.getElementById('degree').value.trim();
    const description = document.getElementById('description').value.trim();
    const avatar = document.getElementById('avatar').value.trim();

    if (!name) {
        AlertUtils.error('Vui lòng nhập tên giáo viên.');
        return;
    }

    try {
        const data = {
            name,
            specialized,
            degree,
            description,
            avatar
        };

        let response;
        if (currentEditingId) {
            response = await teacherService.update(currentEditingId, data);
            if (response && response.success) {
                AlertUtils.success('Cập nhật giáo viên thành công!');
            } else {
                throw new Error(response?.message || 'Cập nhật thất bại');
            }
        } else {
            response = await teacherService.create(data);
            if (response && response.success) {
                AlertUtils.success('Thêm giáo viên thành công!');
            } else {
                throw new Error(response?.message || 'Thêm thất bại');
            }
        }

        closeModal();
        loadTeachers();
    } catch (error) {
        console.error('Failed to save teacher:', error);
        AlertUtils.error(error.message || 'Không thể lưu giáo viên. Vui lòng thử lại.');
    }
}

async function deleteTeacher(id) {
    if (!confirm('Bạn chắc chắn muốn xóa giáo viên này?')) return;

    try {
        const response = await teacherService.delete(id);
        if (response && response.success) {
            AlertUtils.success('Xóa giáo viên thành công!');
            loadTeachers();
        } else {
            throw new Error(response?.message || 'Xóa thất bại');
        }
    } catch (error) {
        console.error('Failed to delete teacher:', error);
        AlertUtils.error(error.message || 'Không thể xóa giáo viên. Vui lòng thử lại.');
    }
}

async function searchTeachers() {
    const query = document.getElementById('searchInput').value.trim();

    if (!query) {
        // If search is empty, reload all teachers
        loadTeachers();
        return;
    }

    try {
        showLoading();
        const response = await teacherService.search(query);

        if (response && response.success && response.data) {
            renderTable(response.data);
        } else {
            renderTable([]);
        }
    } catch (error) {
        console.error('Search error:', error);
        AlertUtils.error('Tìm kiếm thất bại. Vui lòng thử lại.');
        renderTable([]);
    }
}

// Pagination removed - backend doesn't support pagination yet

function closeModal() {
    document.getElementById('teacherModal').classList.remove('show');
    document.getElementById('teacherForm').reset();
}

function showLoading() {
    document.getElementById('tableBody').innerHTML =
        '<tr><td colspan="7" style="text-align: center; padding: 40px;"><div class="spinner"></div> Đang tải...</td></tr>';
}



