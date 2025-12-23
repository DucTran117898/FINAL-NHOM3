/**
 * Subjects Management Page Script
 */

let currentEditingId = null;

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) return;

    loadSubjects();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('addBtn').addEventListener('click', openAddModal);
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('saveBtn').addEventListener('click', saveSubject);
    document.getElementById('searchBtn').addEventListener('click', searchSubjects);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchSubjects();
    });
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('subjectModal').addEventListener('click', (e) => {
        if (e.target.id === 'subjectModal') closeModal();
    });
}

async function loadSubjects(page = 1) {
    try {
        showLoading();
        const response = await subjectService.getAll(page, 10);

        if (response && response.data) {
            renderTable(response.data);
            renderPagination(response.pagination, page);
        }
    } catch (error) {
        console.error('Failed to load subjects:', error);
        AlertUtils.error('Không thể tải danh sách môn học. Vui lòng thử lại.');
        document.getElementById('tableBody').innerHTML =
            '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--danger);">Lỗi tải dữ liệu</td></tr>';
    }
}

function renderTable(subjects) {
    const tableBody = document.getElementById('tableBody');

    if (!subjects || subjects.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">Không có dữ liệu</td></tr>';
        return;
    }

    tableBody.innerHTML = subjects.map((subject) => `
        <tr>
            <td>${subject.id}</td>
            <td>${subject.name}</td>
            <td>${StringUtils.truncate(subject.description || 'N/A', 50)}</td>
            <td>${DateUtils.format(subject.created_at)}</td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="editSubject(${subject.id})">✏️ Sửa</button>
                <button class="btn btn-sm btn-danger" onclick="deleteSubject(${subject.id})">🗑️ Xóa</button>
            </td>
        </tr>
    `).join('');
}

function openAddModal() {
    currentEditingId = null;
    document.getElementById('subjectForm').reset();
    document.getElementById('modalTitle').textContent = 'Thêm Môn Học';
    document.getElementById('subjectModal').classList.add('show');
}

async function editSubject(id) {
    try {
        const response = await subjectService.getById(id);

        if (response) {
            currentEditingId = id;
            document.getElementById('name').value = response.name;
            document.getElementById('description').value = response.description || '';
            document.getElementById('modalTitle').textContent = 'Cập Nhật Môn Học';
            document.getElementById('subjectModal').classList.add('show');
        }
    } catch (error) {
        console.error('Failed to load subject:', error);
        AlertUtils.error('Không thể tải thông tin môn học.');
    }
}

async function saveSubject() {
    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();

    if (!name) {
        AlertUtils.error('Vui lòng nhập tên môn học.');
        return;
    }

    try {
        const data = { name, description };

        if (currentEditingId) {
            await subjectService.update(currentEditingId, data);
            AlertUtils.success('Cập nhật môn học thành công!');
        } else {
            await subjectService.create(data);
            AlertUtils.success('Thêm môn học thành công!');
        }

        closeModal();
        loadSubjects();
    } catch (error) {
        console.error('Failed to save subject:', error);
        AlertUtils.error('Không thể lưu môn học. Vui lòng thử lại.');
    }
}

async function deleteSubject(id) {
    if (!confirm('Bạn chắc chắn muốn xóa môn học này?')) return;

    try {
        await subjectService.delete(id);
        AlertUtils.success('Xóa môn học thành công!');
        loadSubjects();
    } catch (error) {
        console.error('Failed to delete subject:', error);
        AlertUtils.error('Không thể xóa môn học. Vui lòng thử lại.');
    }
}

async function searchSubjects() {
    const query = document.getElementById('searchInput').value.trim();

    if (!query) {
        AlertUtils.warning('Vui lòng nhập từ khóa tìm kiếm.');
        return;
    }

    try {
        showLoading();
        const response = await subjectService.search(query);

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
        html += `<li><a href="#" onclick="loadSubjects(${pagination.current_page - 1})">← Trước</a></li>`;
    }

    for (let i = 1; i <= pagination.total_pages; i++) {
        if (i === pagination.current_page) {
            html += `<li><span class="active">${i}</span></li>`;
        } else {
            html += `<li><a href="#" onclick="loadSubjects(${i})">${i}</a></li>`;
        }
    }

    if (pagination.current_page < pagination.total_pages) {
        html += `<li><a href="#" onclick="loadSubjects(${pagination.current_page + 1})">Sau →</a></li>`;
    }

    html += '</ul>';
    container.innerHTML = html;
}

function closeModal() {
    document.getElementById('subjectModal').classList.remove('show');
    document.getElementById('subjectForm').reset();
}

function showLoading() {
    document.getElementById('tableBody').innerHTML =
        '<tr><td colspan="5" style="text-align: center; padding: 40px;"><div class="spinner"></div> Đang tải...</td></tr>';
}
