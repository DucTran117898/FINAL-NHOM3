let studentId = null;

/* ================= EDIT PAGE ================= */

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('editForm')) initEditPage();
  if (document.getElementById('confirmPage')) initConfirmPage();
});

function initEditPage() {
  const params = new URLSearchParams(window.location.search);
  studentId = params.get('id');

  if (!studentId) {
    alert('Thiếu ID');
    window.location.href = 'index.html';
    return;
  }

  loadImagePreview();
  loadDraft();
  loadStudentFromApi();
}

function loadImagePreview() {
  const input = document.getElementById('avatar');
  const preview = document.getElementById('avatarPreview');

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
      preview.classList.remove('d-none');
    };
    reader.readAsDataURL(file);
  });
}

function saveToLocal() {
  const name = document.getElementById('name').value.trim();
  const description = document.getElementById('description').value.trim();
  const avatarPreview = document.getElementById('avatarPreview');
  if (!name) return alert('Nhập tên học sinh');
  if (name.length > 100) return alert('Tên học sinh phải không quá 100 ký tự');
  if (!description) return alert('Nhập mô tả học sinh');
  if (description.length > 1000) return alert('Mô tả học sinh phải không quá 1000 ký tự');
  if (avatarPreview.classList.contains('d-none')) return alert('Chọn ảnh đại diện cho học sinh');
  const data = {
    id: studentId,
    name,
    description: document.getElementById('description').value,
    avatar: document.getElementById('avatarPreview').classList.contains('d-none')
      ? ''
      : document.getElementById('avatarPreview').src
  };

  localStorage.setItem('studentDraft', JSON.stringify(data));
  window.location.href = 'confirm.html';
}

function loadDraft() {
  const draft = JSON.parse(localStorage.getItem('studentDraft'));
  if (!draft || draft.id != studentId) return;

  document.getElementById('name').value = draft.name;
  document.getElementById('description').value = draft.description;

  if (draft.avatar) {
    const preview = document.getElementById('avatarPreview');
    preview.src = draft.avatar;
    preview.classList.remove('d-none');
  }
}

async function loadStudentFromApi() {
  const draft = JSON.parse(localStorage.getItem('studentDraft'));
  if (draft && draft.id == studentId) return;

  const res = await studentService.getById(studentId);
  if (res.success) {
    const s = res.data;
    console.log("student", s);
    document.getElementById('name').value = s.name || '';
    document.getElementById('description').value = s.description || '';
    document.getElementById('avatarPreview').src = `http://localhost:8000/web/avatar/${s.avatar}` || '';
    avatarPreview.classList.remove('d-none');
  }
}

/* ================= CONFIRM PAGE ================= */

function initConfirmPage() {
  const draft = JSON.parse(localStorage.getItem('studentDraft'));
  if (!draft) return location.href = 'index.html';

  document.getElementById('name').innerText = draft.name;
  document.getElementById('description').innerText = draft.description;

  if (draft.avatar) {
    const img = document.getElementById('avatarPreview');
    img.src = draft.avatar;
    img.classList.remove('d-none');
  }

  document.getElementById('backBtn').onclick =
    () => window.location.href = `student-edit.html?id=${draft.id}`;

  document.getElementById('confirmBtn').onclick =
    () => confirmSave(draft);
}

async function confirmSave(data) {

  await studentService.update(data.id, data);
  console.log("data", data);
  localStorage.removeItem('studentDraft');
  alert('Cập nhật thành công');
  window.location.href = 'index.html';
}
