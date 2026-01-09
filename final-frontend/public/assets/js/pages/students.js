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
/*

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
            '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--danger);">Lỗi tải dữ liệu</td></tr>';
    }
}
    */

async function loadStudents(page = 1, limit = 10) {
    try {
        showLoading();
        const response = await studentService.getAll(page, limit);

        console.log('API response:', response);

        const resultCountEl = document.getElementById('resultCount');

        if (response.success) {
            renderTable(response.data);

            if (response.pagination && typeof response.pagination.total_records === 'number') {
                resultCountEl.textContent = response.pagination.total_records;
            } else {
                resultCountEl.textContent = 0;
            }

            renderPagination(response.pagination, page);
        } else {
            renderTable([]);
            resultCountEl.textContent = 0;
        }
    } catch (error) {
        console.error('Failed to load students:', error);
        AlertUtils.error('Không thể tải danh sách học sinh. Vui lòng thử lại.');
        document.getElementById('tableBody').innerHTML =
            '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--danger);">Lỗi tải dữ liệu</td></tr>';
        document.getElementById('resultCount').textContent = 0;
    }
}







function renderTable(students) {
    const tableBody = document.getElementById('tableBody');

    if (!students || students.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">Không có dữ liệu</td></tr>';
        return;
    }

    tableBody.innerHTML = students
        .map((student, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td>${student.name || 'N/A'}</td>
            <td>${student.description || ''}</td>
            <td>
                <button class="btn btn-sm btn-danger" 
                onclick="deleteStudent(${student.id}, '${student.name || ''}')">
                🗑️ Xóa
                </button>
            </td>

            <td><button class="btn btn-sm btn-outline" onclick="editStudent(${student.id})">✏️ Sửa</button></td>
        </tr>
    `)
        .join('');
}
/*
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
    */

function openAddModal() {
    currentEditingId = null;
    document.getElementById('studentForm').reset();
    document.getElementById('modalTitle').textContent = 'Thêm Học Sinh';
    document.getElementById('studentModal').classList.add('show');
}
/*
async function editStudent(id) {
    try {
        const response = await studentService.getById(id);
        console.log('API response:', response); // kiểm tra dữ liệu thực tế

        if (response && response.success) {
            // Nếu data là object
            const student = Array.isArray(response.data) ? response.data[0] : response.data;

            currentEditingId = student.id;
            document.getElementById('name').value = student.name || '';
            document.getElementById('description').value = student.description || ''; 
            document.getElementById('avatar').value = student.avatar || '';
            document.getElementById('modalTitle').textContent = 'Cập Nhật Học Sinh';
            document.getElementById('studentModal').classList.add('show');
        }
    } catch (error) {
        console.error('Failed to load student:', error);
        AlertUtils.error('Không thể tải thông tin học sinh.');
    }
}
    */
function editStudent(id) {
    window.location.href = `student-edit.html?id=${id}`;
}



async function saveStudent() {
    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim(); 
    const avatar = document.getElementById('avatar').value.trim();
    if (!name) {
        AlertUtils.error('Vui lòng nhập tên học sinh.');
        return;
    }

    try {
        const data = { name, description, avatar };

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

async function deleteStudent(id, name) {
    // Hiện popup confirm với tên sinh viên
    const confirmed = confirm(`Bạn chắc chắn muốn xóa sinh viên ${name}?`);
    if (!confirmed) return; // Nếu Cancel thì dừng, không xử lý gì

    try {
        // Gọi API xóa
        await studentService.delete(id);

        // Thông báo thành công
        AlertUtils.success(`Đã xóa sinh viên ${name} thành công!`);

        // Refresh lại danh sách
        loadStudents();
    } catch (error) {
        console.error('Failed to delete student:', error);
        AlertUtils.error(`Không thể xóa sinh viên ${name}. Vui lòng thử lại.`);
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
        const page = 1;
        const limit = 10;
        const response = await studentService.search(query, page, limit);

        const resultCountEl = document.getElementById('resultCount');

        if (response && response.success && Array.isArray(response.data)) {
            renderTable(response.data);
            // Update result count (use pagination if available)
            if (response.pagination && typeof response.pagination.total_records === 'number') {
                resultCountEl.textContent = response.pagination.total_records;
            } else {
                resultCountEl.textContent = response.data.length || 0;
            }
            renderPagination(response.pagination, page);
        } else {
            renderTable([]);
            if (resultCountEl) resultCountEl.textContent = '0';
            document.getElementById('paginationContainer').innerHTML = '';
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
        '<tr><td colspan="5" style="text-align: center; padding: 40px;"><div class="spinner"></div> Đang tải...</td></tr>';
}
