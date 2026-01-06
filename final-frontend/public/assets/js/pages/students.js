/**
 * Students Management Page Script
 */

let currentEditingId = null;

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) return;

    loadStudents();
    // loadClassroomsForSelect(); // API not available
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('addBtn').addEventListener('click', openAddModal);
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('saveBtn').addEventListener('click', saveStudent);
    document.getElementById('searchBtn').addEventListener('click', searchStudents);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchStudents();
    });
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('studentModal').addEventListener('click', (e) => {
        if (e.target.id === 'studentModal') closeModal();
    });
}

async function loadStudents(page = 1) {
    try {
        showLoading();
        const response = await studentService.getAll(page, 10);

        if (response && response.data) {
            renderTable(response.data);
            renderPagination(response.pagination, page);
        } else {
            renderTable([]); // Show "No data" if response format is unexpected
        }
    } catch (error) {
        console.error('Failed to load students:', error);
        AlertUtils.error('Không thể tải danh sách học sinh. Vui lòng thử lại.');
        document.getElementById('tableBody').innerHTML =
            '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--danger);">Lỗi tải dữ liệu</td></tr>';
    }
}

function renderTable(students) {
    const tableBody = document.getElementById('tableBody');

    if (!students || students.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">Không có dữ liệu</td></tr>';
        return;
    }

    tableBody.innerHTML = students.map((student) => `
        <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.classroom_name || 'N/A'}</td>
            <td>${DateUtils.format(student.created_at)}</td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="editStudent(${student.id})">✏️ Sửa</button>
                <button class="btn btn-sm btn-danger" onclick="deleteStudent(${student.id})">🗑️ Xóa</button>
            </td>
        </tr>
    `).join('');
}

async function loadClassroomsForSelect() {
    // API not implemented yet
    const select = document.getElementById('classroomId');
    select.innerHTML = '<option value="">-- Nhập Lớp --</option>';

    // For now, allow manual input or hardcoded options if needed
    // But since the UI is a select, we might need to change it to input or mock data.
    // Given the constraints, let's better change the HTML to be a text input or just leave it empty.
    // Ideally we should switch the HTML input type, but for JS only fix:
    const classes = [
        { id: 1, name: '10A1' },
        { id: 2, name: '10A2' },
        { id: 3, name: '11A1' },
        { id: 4, name: '11A2' },
        { id: 5, name: '12A1' },
        { id: 6, name: '12A2' }
    ];

    classes.forEach((classroom) => {
        const option = document.createElement('option');
        option.value = classroom.id; // This ID might not map to real DB if DB requires FK
        // If DB requires valid FK, we are in trouble without the API. 
        // But assuming we can't create classroom table, let's just show some dummy options for UI.
        option.textContent = classroom.name;
        select.appendChild(option);
    });
}

function openAddModal() {
    currentEditingId = null;
    document.getElementById('studentForm').reset();
    document.getElementById('modalTitle').textContent = 'Thêm Học Sinh';
    document.getElementById('studentModal').classList.add('show');
}

async function editStudent(id) {
    try {
        const response = await studentService.getById(id);

        if (response) {
            currentEditingId = id;
            document.getElementById('name').value = response.name;
            document.getElementById('email').value = response.email;
            document.getElementById('classroomId').value = response.classroom_id;
            document.getElementById('modalTitle').textContent = 'Cập Nhật Học Sinh';
            document.getElementById('studentModal').classList.add('show');
        }
    } catch (error) {
        console.error('Failed to load student:', error);
        AlertUtils.error('Không thể tải thông tin học sinh.');
    }
}

async function saveStudent() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const classroomId = document.getElementById('classroomId').value;

    if (!name) {
        AlertUtils.error('Vui lòng nhập tên học sinh.');
        return;
    }

    if (!email || !ValidationUtils.isEmail(email)) {
        AlertUtils.error('Vui lòng nhập email hợp lệ.');
        return;
    }

    if (!classroomId) {
        AlertUtils.error('Vui lòng chọn lớp học.');
        return;
    }

    try {
        const data = { name, email, classroom_id: classroomId };

        if (currentEditingId) {
            await studentService.update(currentEditingId, data);
            AlertUtils.success('Cập nhật học sinh thành công!');
        } else {
            await studentService.create(data);
            AlertUtils.success('Thêm học sinh thành công!');
        }

        closeModal();
        loadStudents();
    } catch (error) {
        console.error('Failed to save student:', error);
        AlertUtils.error('Không thể lưu học sinh. Vui lòng thử lại.');
    }
}

async function deleteStudent(id) {
    if (!confirm('Bạn chắc chắn muốn xóa học sinh này?')) return;

    try {
        await studentService.delete(id);
        AlertUtils.success('Xóa học sinh thành công!');
        loadStudents();
    } catch (error) {
        console.error('Failed to delete student:', error);
        AlertUtils.error('Không thể xóa học sinh. Vui lòng thử lại.');
    }
}

async function searchStudents() {
    const query = document.getElementById('searchInput').value.trim();

    if (!query) {
        AlertUtils.warning('Vui lòng nhập từ khóa tìm kiếm.');
        return;
    }

    try {
        showLoading();
        const response = await studentService.search(query);

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
        html += `<li><a href="#" onclick="loadStudents(${pagination.current_page - 1})">← Trước</a></li>`;
    }

    for (let i = 1; i <= pagination.total_pages; i++) {
        if (i === pagination.current_page) {
            html += `<li><span class="active">${i}</span></li>`;
        } else {
            html += `<li><a href="#" onclick="loadStudents(${i})">${i}</a></li>`;
        }
    }

    if (pagination.current_page < pagination.total_pages) {
        html += `<li><a href="#" onclick="loadStudents(${pagination.current_page + 1})">Sau →</a></li>`;
    }

    html += '</ul>';
    container.innerHTML = html;
}

function closeModal() {
    document.getElementById('studentModal').classList.remove('show');
    document.getElementById('studentForm').reset();
}

function showLoading() {
    document.getElementById('tableBody').innerHTML =
        '<tr><td colspan="6" style="text-align: center; padding: 40px;"><div class="spinner"></div> Đang tải...</td></tr>';
}
