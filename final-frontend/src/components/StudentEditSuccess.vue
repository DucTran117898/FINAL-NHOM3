<template>
  <div class="student-success-fullpage">
    <div class="success-container">
      <h1 class="success-title">
        Bạn đã {{ isEdit ? 'sửa' : 'đăng ký' }} học sinh
        <strong>{{ studentName || 'N/A' }}</strong> thành công.
      </h1>
      <router-link to="/" class="btn-back">Trở về Trang chủ</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentEditSuccess',
  computed: {
    studentName() {
      return this.$route.query.studentName || ''
    },
    isEdit() {
      const action = this.$route.query.action || this.$route.query.mode
      return action === 'edit'
    }
  }
}
</script>

<style scoped>
.student-success-fullpage {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
  overflow-y: auto;
}

.success-container {
  max-width: 640px;
  text-align: center;
  background: #fff;
  padding: 60px 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.success-title {
  font-size: 28px;
  margin-bottom: 20px;
  color: #333;
  font-weight: 600;
}

.btn-back {
  background: #4a90e2;
  color: white;
  padding: 12px 30px;
  border-radius: 4px;
  text-decoration: none;
  display: inline-block;
  font-weight: 500;
  font-size: 16px;
  transition: background 0.3s;
}

.btn-back:hover {
  background: #357abd;
}
</style>

