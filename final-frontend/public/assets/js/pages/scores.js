/**
 * Scores Management Page Script
 */

let currentPage = 1;
let currentEditingId = null;

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) return;

    await loadStudentsForSelect();
    await loadSubjectsForSelect();
    await loadTeachersForSelect();

    loadScoreSelect();
    loadScores();
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
    document.getElementById('confirmBtn').addEventListener('click', validateAndConfirm);

    // Confirm section buttons
    document.getElementById('backToFormBtn').addEventListener('click', backToForm);
    document.getElementById('saveScoreBtn').addEventListener('click', saveScoreFromConfirm);
    document.getElementById('backToHomeBtn').addEventListener('click', backToHome);

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

    tableBody.innerHTML = scores.map((score, index) => `
        <tr>
            <td>${index + 1}</td>
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
 * Clear all error messages
 */
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    document.querySelectorAll('.form-group select, .form-group textarea').forEach(el => {
        el.classList.remove('error');
    });
}

/**
 * Show error message for a field
 */
function showError(fieldId, message) {
    const errorEl = document.getElementById(fieldId + 'Error');
    const fieldEl = document.getElementById(fieldId);
    
    if (errorEl) {
        errorEl.textContent = message;
    }
    if (fieldEl) {
        fieldEl.classList.add('error');
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
    document.querySelectorAll('.multi-select-dropdown input')
        .forEach(cb => cb.checked = false);
    updateTeacherDisplay();
    clearErrors();
    backToForm(); // Ensure form section is shown
    window.scoreFormData = null; // Clear any previous data
}

/**
 * Edit score
 */
async function editScore(id) {
    try {
        const res = await scoreService.getById(id);
        const data = res.data || res;

        if (!data) return;

        currentEditingId = id;

        document.getElementById('studentId').value = data.student_id;
        document.getElementById('subjectId').value = data.subject_id;
        document.getElementById('score').value = data.score;
        document.getElementById('comment').value = data.description || '';

        // reset giáo viên
        document.querySelectorAll('.multi-select-dropdown input')
            .forEach(cb => cb.checked = false);

        // tick giáo viên
        if (Array.isArray(data.teacher_ids)) {
            document.querySelectorAll('.multi-select-dropdown input')
                .forEach(cb => {
                    cb.checked = data.teacher_ids.includes(Number(cb.value));
                });
        }

        updateTeacherDisplay();
        clearErrors();
        backToForm(); // Ensure form section is shown

        document.getElementById('modalTitle').textContent = 'Cập Nhật Điểm';
        document.getElementById('scoreModal').classList.add('show');

    } catch (error) {
        console.error(error);
        AlertUtils.error('Không thể tải thông tin điểm số.');
    }
}


/**
 * Validate form and show confirm section
 */
function validateAndConfirm() {
    clearErrors();
    
    const studentId = document.getElementById('studentId').value;
    const subjectId = document.getElementById('subjectId').value;
    const score = document.getElementById('score').value;
    const teacherIds = Array.from(
        document.querySelectorAll('.multi-select-dropdown input:checked')
    ).map(i => i.value);
    const comment = document.getElementById('comment').value.trim();

    let hasErrors = false;

    // Validate student
    if (!studentId) {
        showError('studentId', 'Vui lòng chọn học sinh');
        hasErrors = true;
    }

    // Validate subject
    if (!subjectId) {
        showError('subjectId', 'Vui lòng chọn môn học');
        hasErrors = true;
    }

    // Validate teachers
    if (!teacherIds || teacherIds.length === 0) {
        showError('teacherIds', 'Vui lòng chọn ít nhất một giáo viên');
        hasErrors = true;
    }

    // Validate score
    if (!score || score === '') {
        showError('score', 'Vui lòng chọn điểm');
        hasErrors = true;
    } else {
        const scoreNum = parseFloat(score);
        if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
            showError('score', 'Điểm phải từ 0 đến 10');
            hasErrors = true;
        }
    }

    if (hasErrors) {
        return;
    }

    // Get names for display
    const studentSelect = document.getElementById('studentId');
    const studentName = studentSelect.options[studentSelect.selectedIndex].text;
    
    const subjectSelect = document.getElementById('subjectId');
    const subjectName = subjectSelect.options[subjectSelect.selectedIndex].text;

    const teacherNames = Array.from(
        document.querySelectorAll('.multi-select-dropdown input:checked')
    ).map(cb => cb.parentNode.textContent.trim());

    // Store form data for saving later
    window.scoreFormData = {
        student_id: studentId,
        student_name: studentName,
        subject_id: subjectId,
        subject_name: subjectName,
        teacher_ids: teacherIds,
        teacher_names: teacherNames,
        score: parseFloat(score),
        comment: comment,
        editing_id: currentEditingId
    };

    // Show confirm section, hide form section
    showConfirmSection();
}

/**
 * Show confirm section with form data
 */
function showConfirmSection() {
    const formData = window.scoreFormData;
    
    // Display data in confirm section
    document.getElementById('confirmStudentName').textContent = formData.student_name || 'N/A';
    document.getElementById('confirmSubjectName').textContent = formData.subject_name || 'N/A';
    document.getElementById('confirmTeacherNames').textContent = formData.teacher_names.join(', ') || 'N/A';
    document.getElementById('confirmScore').textContent = formData.score || 'N/A';
    document.getElementById('confirmComment').textContent = formData.comment || '(Không có)';

    // Hide form and success, show confirm
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('confirmSection').style.display = 'block';
    document.getElementById('successSection').style.display = 'none';
    document.getElementById('formFooter').style.display = 'none';
    document.getElementById('confirmFooter').style.display = 'flex';
    document.getElementById('successFooter').style.display = 'none';
}

/**
 * Back to form from confirm section
 */
function backToForm() {
    const formData = window.scoreFormData;
    
    if (!formData) {
        // If no form data, just show form
        document.getElementById('formSection').style.display = 'block';
        document.getElementById('confirmSection').style.display = 'none';
        document.getElementById('successSection').style.display = 'none';
        document.getElementById('formFooter').style.display = 'flex';
        document.getElementById('confirmFooter').style.display = 'none';
        document.getElementById('successFooter').style.display = 'none';
        return;
    }

    // Restore form values
    document.getElementById('studentId').value = formData.student_id || '';
    document.getElementById('subjectId').value = formData.subject_id || '';
    document.getElementById('score').value = formData.score || '';
    document.getElementById('comment').value = formData.comment || '';

    // Restore teacher selections
    document.querySelectorAll('.multi-select-dropdown input')
        .forEach(cb => {
            const cbValue = cb.value;
            cb.checked = formData.teacher_ids && (
                formData.teacher_ids.includes(cbValue) || 
                formData.teacher_ids.includes(String(cbValue)) ||
                formData.teacher_ids.includes(Number(cbValue))
            );
        });
    updateTeacherDisplay();

    // Clear errors
    clearErrors();

    // Show form, hide confirm and success
    document.getElementById('formSection').style.display = 'block';
    document.getElementById('confirmSection').style.display = 'none';
    document.getElementById('successSection').style.display = 'none';
    document.getElementById('formFooter').style.display = 'flex';
    document.getElementById('confirmFooter').style.display = 'none';
    document.getElementById('successFooter').style.display = 'none';
}

/**
 * Save score from confirm section
 */
async function saveScoreFromConfirm() {
    const formData = window.scoreFormData;
    
    if (!formData) {
        AlertUtils.error('Không tìm thấy dữ liệu. Vui lòng thử lại.');
        return;
    }

    try {
        const data = {
            student_id: formData.student_id,
            subject_id: formData.subject_id,
            score: formData.score,
            teacher_ids: formData.teacher_ids,
            description: formData.comment || ''
        };

        let isEdit = formData.editing_id !== null && formData.editing_id !== undefined;
        let successMessage = '';

        if (isEdit) {
            await scoreService.update(formData.editing_id, data);
            successMessage = `Bạn đã sửa điểm thành công cho sinh viên ${formData.student_name} thành công`;
        } else {
            await scoreService.create(data);
            successMessage = `Bạn đã nhập điểm thành công cho sinh viên ${formData.student_name} thành công`;
        }

        // Show success section
        showSuccessSection(successMessage);

        // Reload scores in background
        loadScores();

    } catch (error) {
        console.error('Failed to save score:', error);
        AlertUtils.error('Không thể lưu điểm số. Vui lòng thử lại.');
    }
}

/**
 * Show success section with message
 */
function showSuccessSection(message) {
    document.getElementById('successMessage').textContent = message;
    
    // Hide form and confirm, show success
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('confirmSection').style.display = 'none';
    document.getElementById('successSection').style.display = 'block';
    document.getElementById('formFooter').style.display = 'none';
    document.getElementById('confirmFooter').style.display = 'none';
    document.getElementById('successFooter').style.display = 'flex';
}

/**
 * Back to home page
 */
function backToHome() {
    closeModal();
    // Optionally redirect to home page
    // window.location.href = 'index.html';
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
    clearErrors();
    backToForm(); // Reset to form view when closing
    window.scoreFormData = null; // Clear stored data
    
    // Hide all sections and show form
    document.getElementById('formSection').style.display = 'block';
    document.getElementById('confirmSection').style.display = 'none';
    document.getElementById('successSection').style.display = 'none';
    document.getElementById('formFooter').style.display = 'flex';
    document.getElementById('confirmFooter').style.display = 'none';
    document.getElementById('successFooter').style.display = 'none';
}

/**
 * Show loading
 */
function showLoading() {
    document.getElementById('tableBody').innerHTML =
        '<tr><td colspan="6" style="text-align: center; padding: 40px;"><div class="spinner"></div> Đang tải...</td></tr>';
}

function loadScoreSelect() {
    const select = document.getElementById('score');
    select.innerHTML = '<option value="">-- Chọn điểm --</option>';

    for (let i = 0; i <= 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        select.appendChild(option);
    }
}

async function loadTeachersForSelect() {
    const res = await teacherService.getAll(1, 100);
    const dropdown = document.querySelector('.multi-select-dropdown');
    const wrapper = document.querySelector('.multi-select');
    const display = document.querySelector('.multi-select-display');

    dropdown.innerHTML = '';

    res.data.forEach(t => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" value="${t.id}"> ${t.name}`;
        dropdown.appendChild(label);
    });

    display.onclick = () => wrapper.classList.toggle('open');

    dropdown.addEventListener('change', updateTeacherDisplay);

    // click ra ngoài thì đóng
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            wrapper.classList.remove('open');
        }
    });
}

const teacherIds = Array.from(
    document.querySelectorAll('.multi-select-dropdown input:checked')
).map(i => i.value);

function updateTeacherDisplay() {
    const checked = document.querySelectorAll('.multi-select-dropdown input:checked');
    const display = document.querySelector('.multi-select-display');

    display.textContent = checked.length
        ? Array.from(checked).map(c => c.parentNode.textContent.trim()).join(', ')
        : '-- Chọn Giáo Viên --';
}

