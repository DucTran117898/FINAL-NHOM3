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

async function loadTeachers(page = 1) {
    try {
        showLoading();
        const response = await teacherService.getAll(page, 10);

        if (response && response.data) {
            renderTable(response.data);
            renderPagination(response.pagination, page);
        }
    } catch (error) {
        console.error('Failed to load teachers:', error);
        AlertUtils.error('Không thể tải danh sách giáo viên. Vui lòng thử lại.');
        document.getElementById('tableBody').innerHTML =
            '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--danger);">Lỗi tải dữ liệu</td></tr>';
    }
}

function renderTable(teachers) {
    const tableBody = document.getElementById('tableBody');

    if (!teachers || teachers.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">Không có dữ liệu</td></tr>';
        return;
    }

    tableBody.innerHTML = teachers.map((teacher) => `
        <tr>
            <td>${teacher.id}</td>
            <td>${teacher.name}</td>
            <td>${teacher.email}</td>
            <td>${teacher.phone || 'N/A'}</td>
            <td>${DateUtils.format(teacher.created_at)}</td>
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
    // Redirect to teacher edit page with multi-step form
    window.location.href = `teacher_edit.html?id=${id}`;
}

async function saveTeacher() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!name) {
        AlertUtils.error('Vui lòng nhập tên giáo viên.');
        return;
    }

    if (!email || !ValidationUtils.isEmail(email)) {
        AlertUtils.error('Vui lòng nhập email hợp lệ.');
        return;
    }

    try {
        const data = { name, email, phone };

        if (currentEditingId) {
            await teacherService.update(currentEditingId, data);
            AlertUtils.success('Cập nhật giáo viên thành công!');
        } else {
            await teacherService.create(data);
            AlertUtils.success('Thêm giáo viên thành công!');
        }

        closeModal();
        loadTeachers();
    } catch (error) {
        console.error('Failed to save teacher:', error);
        AlertUtils.error('Không thể lưu giáo viên. Vui lòng thử lại.');
    }
}

async function deleteTeacher(id) {
    if (!confirm('Bạn chắc chắn muốn xóa giáo viên này?')) return;

    try {
        await teacherService.delete(id);
        AlertUtils.success('Xóa giáo viên thành công!');
        loadTeachers();
    } catch (error) {
        console.error('Failed to delete teacher:', error);
        AlertUtils.error('Không thể xóa giáo viên. Vui lòng thử lại.');
    }
}

async function searchTeachers() {
    const query = document.getElementById('searchInput').value.trim();

    if (!query) {
        AlertUtils.warning('Vui lòng nhập từ khóa tìm kiếm.');
        return;
    }

    try {
        showLoading();
        const response = await teacherService.search(query);

        if (response) {
            renderTable(response.data || []);
        }
    } catch (error) {
        console.error('Search error:', error);
        AlertUtils.error('Tìm kiếm thất bại. Vui lòng thử lại.');
    }
}

function renderPagination(pagination, currentPage) {
    const container = document.getElementById('paginationContainer');

    if (!pagination || pagination.total_pages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '<ul class="pagination">';

    if (pagination.current_page > 1) {
        html += `<li><a href="#" onclick="loadTeachers(${pagination.current_page - 1})">← Trước</a></li>`;
    }

    for (let i = 1; i <= pagination.total_pages; i++) {
        if (i === pagination.current_page) {
            html += `<li><span class="active">${i}</span></li>`;
        } else {
            html += `<li><a href="#" onclick="loadTeachers(${i})">${i}</a></li>`;
        }
    }

    if (pagination.current_page < pagination.total_pages) {
        html += `<li><a href="#" onclick="loadTeachers(${pagination.current_page + 1})">Sau →</a></li>`;
    }

    html += '</ul>';
    container.innerHTML = html;
}

function closeModal() {
    document.getElementById('teacherModal').classList.remove('show');
    document.getElementById('teacherForm').reset();
}

function showLoading() {
    document.getElementById('tableBody').innerHTML =
        '<tr><td colspan="6" style="text-align: center; padding: 40px;"><div class="spinner"></div> Đang tải...</td></tr>';
}
