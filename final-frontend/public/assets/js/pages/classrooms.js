/**
 * Classrooms Management Page Script
 */

let currentEditingId = null;

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) return;

    loadClassrooms();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('addBtn').addEventListener('click', openAddModal);
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('saveBtn').addEventListener('click', saveClassroom);
    document.getElementById('searchBtn').addEventListener('click', searchClassrooms);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchClassrooms();
    });
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('classroomModal').addEventListener('click', (e) => {
        if (e.target.id === 'classroomModal') closeModal();
    });
}

async function loadClassrooms(page = 1) {
    try {
        showLoading();
        const response = await classroomService.getAll(page, 10);

        if (response && response.data) {
            renderTable(response.data);
            renderPagination(response.pagination, page);
        }
    } catch (error) {
        console.error('Failed to load classrooms:', error);
        AlertUtils.error('Không thể tải danh sách lớp học. Vui lòng thử lại.');
        document.getElementById('tableBody').innerHTML =
            '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--danger);">Lỗi tải dữ liệu</td></tr>';
    }
}

function renderTable(classrooms) {
    const tableBody = document.getElementById('tableBody');

    if (!classrooms || classrooms.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">Không có dữ liệu</td></tr>';
        return;
    }

    tableBody.innerHTML = classrooms.map((classroom) => `
        <tr>
            <td>${classroom.id}</td>
            <td>${classroom.name}</td>
            <td>${StringUtils.truncate(classroom.description || 'N/A', 50)}</td>
            <td>${classroom.capacity || 0}</td>
            <td>${DateUtils.format(classroom.created_at)}</td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="editClassroom(${classroom.id})">✏️ Sửa</button>
                <button class="btn btn-sm btn-danger" onclick="deleteClassroom(${classroom.id})">🗑️ Xóa</button>
            </td>
        </tr>
    `).join('');
}

function openAddModal() {
    currentEditingId = null;
    document.getElementById('classroomForm').reset();
    document.getElementById('modalTitle').textContent = 'Thêm Lớp Học';
    document.getElementById('classroomModal').classList.add('show');
}

async function editClassroom(id) {
    try {
        const response = await classroomService.getById(id);

        if (response) {
            currentEditingId = id;
            document.getElementById('name').value = response.name;
            document.getElementById('description').value = response.description || '';
            document.getElementById('capacity').value = response.capacity || '';
            document.getElementById('modalTitle').textContent = 'Cập Nhật Lớp Học';
            document.getElementById('classroomModal').classList.add('show');
        }
    } catch (error) {
        console.error('Failed to load classroom:', error);
        AlertUtils.error('Không thể tải thông tin lớp học.');
    }
}

async function saveClassroom() {
    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();
    const capacity = document.getElementById('capacity').value;

    if (!name) {
        AlertUtils.error('Vui lòng nhập tên lớp học.');
        return;
    }

    if (!capacity || parseInt(capacity) <= 0) {
        AlertUtils.error('Vui lòng nhập sĩ số lớp học hợp lệ.');
        return;
    }

    try {
        const data = { name, description, capacity: parseInt(capacity) };

        if (currentEditingId) {
            await classroomService.update(currentEditingId, data);
            AlertUtils.success('Cập nhật lớp học thành công!');
        } else {
            await classroomService.create(data);
            AlertUtils.success('Thêm lớp học thành công!');
        }

        closeModal();
        loadClassrooms();
    } catch (error) {
        console.error('Failed to save classroom:', error);
        AlertUtils.error('Không thể lưu lớp học. Vui lòng thử lại.');
    }
}

async function deleteClassroom(id) {
    if (!confirm('Bạn chắc chắn muốn xóa lớp học này?')) return;

    try {
        await classroomService.delete(id);
        AlertUtils.success('Xóa lớp học thành công!');
        loadClassrooms();
    } catch (error) {
        console.error('Failed to delete classroom:', error);
        AlertUtils.error('Không thể xóa lớp học. Vui lòng thử lại.');
    }
}

async function searchClassrooms() {
    const query = document.getElementById('searchInput').value.trim();

    if (!query) {
        AlertUtils.warning('Vui lòng nhập từ khóa tìm kiếm.');
        return;
    }

    try {
        showLoading();
        const response = await classroomService.search(query);

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
        html += `<li><a href="#" onclick="loadClassrooms(${pagination.current_page - 1})">← Trước</a></li>`;
    }

    for (let i = 1; i <= pagination.total_pages; i++) {
        if (i === pagination.current_page) {
            html += `<li><span class="active">${i}</span></li>`;
        } else {
            html += `<li><a href="#" onclick="loadClassrooms(${i})">${i}</a></li>`;
        }
    }

    if (pagination.current_page < pagination.total_pages) {
        html += `<li><a href="#" onclick="loadClassrooms(${pagination.current_page + 1})">Sau →</a></li>`;
    }

    html += '</ul>';
    container.innerHTML = html;
}

function closeModal() {
    document.getElementById('classroomModal').classList.remove('show');
    document.getElementById('classroomForm').reset();
}

function showLoading() {
    document.getElementById('tableBody').innerHTML =
        '<tr><td colspan="6" style="text-align: center; padding: 40px;"><div class="spinner"></div> Đang tải...</td></tr>';
}
