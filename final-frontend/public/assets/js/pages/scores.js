/**
 * Scores Management Page Script
 */

let currentPage = 1;
let currentEditingId = null;

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) return;

    loadScores();
    loadStudentsForSelect();
    loadSubjectsForSelect();
    setupEventListeners();
});

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Add button
    document.getElementById('addBtn').addEventListener('click', openAddModal);

    // Modal controls
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('saveBtn').addEventListener('click', saveScore);

    // Close modal when clicking outside
    document.getElementById('scoreModal').addEventListener('click', (e) => {
        if (e.target.id === 'scoreModal') closeModal();
    });

    // Search
    document.getElementById('searchBtn').addEventListener('click', searchScores);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchScores();
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

/**
 * Load all scores
 */
async function loadScores(page = 1) {
    try {
        showLoading();
        const response = await scoreService.getAll(page, 10);

        if (response && response.data) {
            renderScoresTable(response.data);
            renderPagination(response.pagination, page);
        }
    } catch (error) {
        console.error('Failed to load scores:', error);
        AlertUtils.error('Không thể tải danh sách điểm số. Vui lòng thử lại.');
        document.getElementById('tableBody').innerHTML =
            '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--danger);">Lỗi tải dữ liệu</td></tr>';
    }
}

/**
 * Render scores in table
 */
function renderScoresTable(scores) {
    const tableBody = document.getElementById('tableBody');

    if (!scores || scores.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">Không có dữ liệu</td></tr>';
        return;
    }

    tableBody.innerHTML = scores.map((score) => `
        <tr>
            <td>${score.id}</td>
            <td>${score.student_name || 'N/A'}</td>
            <td>${score.subject_name || 'N/A'}</td>
            <td>${score.score}</td>
            <td>${DateUtils.format(score.created_at)}</td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="editScore(${score.id})">✏️ Sửa</button>
                <button class="btn btn-sm btn-danger" onclick="deleteScore(${score.id})">🗑️ Xóa</button>
            </td>
        </tr>
    `).join('');
}

/**
 * Load students for select dropdown
 */
async function loadStudentsForSelect() {
    try {
        const response = await studentService.getAll(1, 100);
        const select = document.getElementById('studentId');

        if (response && response.data) {
            response.data.forEach((student) => {
                const option = document.createElement('option');
                option.value = student.id;
                option.textContent = student.name;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Failed to load students:', error);
    }
}

/**
 * Load subjects for select dropdown
 */
async function loadSubjectsForSelect() {
    try {
        const response = await subjectService.getAll(1, 100);
        const select = document.getElementById('subjectId');

        if (response && response.data) {
            response.data.forEach((subject) => {
                const option = document.createElement('option');
                option.value = subject.id;
                option.textContent = subject.name;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Failed to load subjects:', error);
    }
}

/**
 * Open add modal
 */
function openAddModal() {
    currentEditingId = null;
    document.getElementById('scoreForm').reset();
    document.getElementById('modalTitle').textContent = 'Thêm Điểm';
    document.getElementById('scoreModal').classList.add('show');
}

/**
 * Edit score
 */
async function editScore(id) {
    try {
        const response = await scoreService.getById(id);

        if (response) {
            currentEditingId = id;
            document.getElementById('studentId').value = response.student_id;
            document.getElementById('subjectId').value = response.subject_id;
            document.getElementById('score').value = response.score;
            document.getElementById('modalTitle').textContent = 'Cập Nhật Điểm';
            document.getElementById('scoreModal').classList.add('show');
        }
    } catch (error) {
        console.error('Failed to load score:', error);
        AlertUtils.error('Không thể tải thông tin điểm số.');
    }
}

/**
 * Save score
 */
async function saveScore() {
    const studentId = document.getElementById('studentId').value;
    const subjectId = document.getElementById('subjectId').value;
    const score = document.getElementById('score').value;

    if (!studentId || !subjectId || !score) {
        AlertUtils.error('Vui lòng điền đầy đủ thông tin.');
        return;
    }

    try {
        const data = {
            student_id: studentId,
            subject_id: subjectId,
            score: parseFloat(score),
        };

        if (currentEditingId) {
            await scoreService.update(currentEditingId, data);
            AlertUtils.success('Cập nhật điểm số thành công!');
        } else {
            await scoreService.create(data);
            AlertUtils.success('Thêm điểm số thành công!');
        }

        closeModal();
        loadScores();
    } catch (error) {
        console.error('Failed to save score:', error);
        AlertUtils.error('Không thể lưu điểm số. Vui lòng thử lại.');
    }
}

/**
 * Delete score
 */
async function deleteScore(id) {
    if (!confirm('Bạn chắc chắn muốn xóa điểm số này?')) return;

    try {
        await scoreService.delete(id);
        AlertUtils.success('Xóa điểm số thành công!');
        loadScores();
    } catch (error) {
        console.error('Failed to delete score:', error);
        AlertUtils.error('Không thể xóa điểm số. Vui lòng thử lại.');
    }
}

/**
 * Search scores
 */
async function searchScores() {
    const query = document.getElementById('searchInput').value.trim();

    if (!query) {
        AlertUtils.warning('Vui lòng nhập từ khóa tìm kiếm.');
        return;
    }

    try {
        showLoading();
        const response = await scoreService.search(query);

        if (response) {
            renderScoresTable(response.data || []);
        }
    } catch (error) {
        console.error('Search error:', error);
        AlertUtils.error('Tìm kiếm thất bại. Vui lòng thử lại.');
    }
}

/**
 * Render pagination
 */
function renderPagination(pagination, currentPage) {
    const container = document.getElementById('paginationContainer');

    if (!pagination || pagination.total_pages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '<ul class="pagination">';

    if (pagination.current_page > 1) {
        html += `<li><a href="#" onclick="loadScores(${pagination.current_page - 1})">← Trước</a></li>`;
    }

    for (let i = 1; i <= pagination.total_pages; i++) {
        if (i === pagination.current_page) {
            html += `<li><span class="active">${i}</span></li>`;
        } else {
            html += `<li><a href="#" onclick="loadScores(${i})">${i}</a></li>`;
        }
    }

    if (pagination.current_page < pagination.total_pages) {
        html += `<li><a href="#" onclick="loadScores(${pagination.current_page + 1})">Sau →</a></li>`;
    }

    html += '</ul>';
    container.innerHTML = html;
}

/**
 * Close modal
 */
function closeModal() {
    document.getElementById('scoreModal').classList.remove('show');
    document.getElementById('scoreForm').reset();
}

/**
 * Show loading
 */
function showLoading() {
    document.getElementById('tableBody').innerHTML =
        '<tr><td colspan="6" style="text-align: center; padding: 40px;"><div class="spinner"></div> Đang tải...</td></tr>';
}
