<template>
  <div class="auth-container">
    <!-- 动态背景 -->
    <div class="auth-bg">
      <div class="bg-image"></div>
      <div class="bg-gradient"></div>
      <div class="bg-particles">
        <div class="particle" v-for="i in 25" :key="i" :style="getParticleStyle(i)"></div>
      </div>
      <div class="bg-content">
        <div class="logo-section">
          <div class="logo-icon">🌾</div>
        </div>
        <h1 class="bg-title">绿野智农管理系统</h1>
        <p class="bg-subtitle">开启智慧农业之旅</p>
        <div class="feature-list">
          <div class="feature-item">🌱 智能监测</div>
          <div class="feature-item">💧 精准灌溉</div>
          <div class="feature-item">📊 数据分析</div>
          <div class="feature-item">🤖 AI决策</div>
        </div>
      </div>
    </div>
    
    <!-- 注册表单 -->
    <div class="auth-form-wrapper">
      <div class="register-card">
        <div class="card-header">
          <div class="header-icon">🌾</div>
          <h2>创建账户</h2>
          <p class="header-desc">开启您的绿野智农之旅</p>
        </div>
        
        <form class="register-form" @submit.prevent="handleRegister">
          <!-- 用户名输入 -->
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input 
                type="text" 
                v-model="nickname" 
                required
                placeholder="用户名"
                class="form-input"
              >
            </div>
          </div>
          
          <!-- 身份选择 -->
          <div class="form-group">
            <div class="input-wrapper select-wrapper">
              <span class="input-icon">🎭</span>
              <select 
                v-model="identity" 
                required
                class="form-input"
              >
                <option value="">请选择身份</option>
                <option value="regular">普通用户</option>
                <option value="farmer">农场管理员</option>
                <option value="admin">管理员</option>
              </select>
            </div>
          </div>
          
          <!-- 邮箱输入 -->
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">📧</span>
              <input 
                type="email" 
                v-model="email" 
                required
                placeholder="邮箱地址"
                class="form-input"
              >
            </div>
          </div>
          
          <!-- 密码输入 -->
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input 
                type="password" 
                v-model="password" 
                required
                placeholder="密码（不少于6位）"
                class="form-input"
                minlength="6"
              >
              <button type="button" class="toggle-pwd" @click="togglePassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <div v-if="passwordStrength" class="password-strength">
              <div :class="['strength-bar', passwordStrength]"></div>
            </div>
            <span class="strength-text">{{ strengthText }}</span>
          </div>
          
          <!-- 确认密码 -->
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">🔑</span>
              <input 
                type="password" 
                v-model="confirmPassword" 
                required
                placeholder="确认密码"
                class="form-input"
                minlength="6"
              >
            </div>
            <span v-if="confirmPassword && password !== confirmPassword" class="error-text">
              ⚠️ 两次密码不一致
            </span>
          </div>
          
          <!-- 登录按钮 -->
          <button type="submit" class="register-btn" :disabled="loading || !isFormValid">
            <span v-if="loading" class="btn-loader">
              <span class="loader"></span>
            </span>
            <span>{{ loading ? '注册中...' : '注 册' }}</span>
          </button>
          
          <!-- 登录链接 -->
          <div class="login-section">
            <span>已有账户？</span>
            <a href="/login" @click.prevent="goToLogin">立即登录</a>
          </div>
        </form>
        
        <!-- 分隔线 -->
        <div class="divider">
          <span class="divider-line"></span>
          <span class="divider-text">或</span>
          <span class="divider-line"></span>
        </div>
        
        <!-- 快捷注册 -->
        <div class="social-login">
          <button class="social-btn wechat">
            <span>💬</span>
            <span>微信注册</span>
          </button>
          <button class="social-btn phone">
            <span>📱</span>
            <span>手机验证</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

// 表单数据
const nickname = ref('');
const identity = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const showPassword = ref(false);

// 切换密码显示
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// 计算密码强度
const passwordStrength = computed(() => {
  const pwd = password.value;
  if (pwd.length < 6) return '';
  if (pwd.length < 8) return 'weak';
  if (pwd.length < 12) return 'medium';
  return 'strong';
});

const strengthText = computed(() => {
  switch (passwordStrength.value) {
    case 'weak': return '密码强度：弱';
    case 'medium': return '密码强度：中等';
    case 'strong': return '密码强度：强';
    default: return '';
  }
});

// 表单验证
const isFormValid = computed(() => {
  return nickname.value && 
         identity.value && 
         email.value &&
         password.value.length >= 6 && 
         password.value === confirmPassword.value;
});

// 跳转登录页
const goToLogin = () => {
  router.push('/login');
};

// 生成粒子样式
const getParticleStyle = (index) => {
  const delay = (index * 0.1) % 5;
  const left = Math.random() * 100;
  const size = 3 + Math.random() * 6;
  const duration = 8 + Math.random() * 12;
  
  return {
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  };
};

// 处理注册
const handleRegister = async () => {
  // 前端验证
  if (!nickname.value || !identity.value || !email.value || !password.value || !confirmPassword.value) {
    alert('所有字段不能为空！');
    return;
  }
  
  if (password.value !== confirmPassword.value) {
    alert('两次输入的密码不一致！');
    return;
  }
  
  if (password.value.length < 6) {
    alert('密码长度不能少于6位！');
    return;
  }

  loading.value = true;
  
  try {
    // 替换为真实后端注册接口
    const response = await axios.post('/api/register', {
      nickname: nickname.value,
      identity: identity.value,
      email: email.value,
      password: password.value
    });

    const { data } = response;
    if (data.status === 'success') {
      alert('注册成功！请登录');
      router.push('/login');
    } else {
      alert(data.message || '注册失败，请重试！');
    }
  } catch (error) {
    console.error('注册失败：', error);
    alert('注册失败，服务器错误，请重试！');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 整体布局 */
.auth-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: 'Inter', 'Microsoft YaHei', sans-serif;
}

/* 左侧背景区域 */
.auth-bg {
  flex: 1.2;
  position: relative;
  overflow: hidden;
}

/* 背景图片 */
.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop') center/cover;
  filter: brightness(0.7);
}

/* 渐变遮罩 */
.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(45, 80, 22, 0.9) 0%, rgba(14, 42, 10, 0.85) 50%, rgba(0, 20, 0, 0.9) 100%);
}

/* 动态粒子 */
.bg-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  bottom: -20px;
  background: radial-gradient(circle, rgba(144, 238, 144, 0.9) 0%, rgba(45, 80, 22, 0.5) 100%);
  border-radius: 50%;
  animation: floatUp linear infinite;
}

@keyframes floatUp {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(720deg);
    opacity: 0;
  }
}

/* 背景内容 */
.bg-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 3rem;
}

.logo-section {
  margin-bottom: 2rem;
}

.logo-icon {
  font-size: 7rem;
  animation: pulse 3s ease-in-out infinite;
  filter: drop-shadow(0 0 40px rgba(144, 238, 144, 0.6));
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}

.bg-title {
  font-size: 3.8rem;
  font-weight: 800;
  margin-bottom: 1.2rem;
  text-align: center;
  background: linear-gradient(135deg, #a8e6cf 0%, #fff 45%, #a8e6cf 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 80px rgba(168, 230, 207, 0.4);
  letter-spacing: 3px;
}

.bg-subtitle {
  font-size: 1.4rem;
  opacity: 0.95;
  margin-bottom: 3.5rem;
  letter-spacing: 2px;
  font-weight: 300;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  max-width: 420px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 1.8rem;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(15px);
  border-radius: 14px;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* 右侧表单区域 */
.auth-form-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(180deg, #fafffe 0%, #e8f5e9 50%, #d4edda 100%);
}

/* 注册卡片 */
.register-card {
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(30px);
  border-radius: 28px;
  padding: 3.5rem;
  box-shadow: 
    0 30px 100px rgba(45, 80, 22, 0.15),
    0 0 0 1px rgba(45, 80, 22, 0.08);
  animation: slideUp 0.6s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 卡片头部 */
.card-header {
  text-align: center;
  margin-bottom: 2.8rem;
}

.header-icon {
  font-size: 4rem;
  margin-bottom: 1.2rem;
  filter: drop-shadow(0 6px 20px rgba(45, 80, 22, 0.35));
}

.card-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.6rem;
}

.header-desc {
  color: #64748b;
  font-size: 1rem;
}

/* 表单样式 */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.form-group {
  width: 100%;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.select-wrapper {
  pointer-events: none;
}

.select-wrapper select {
  pointer-events: auto;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 3rem;
}

.input-icon {
  position: absolute;
  left: 1.2rem;
  font-size: 1.2rem;
  z-index: 1;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 1.1rem 1.1rem 1.1rem 3.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  background: #fafbfc;
}

.form-input:focus {
  outline: none;
  border-color: #2d5016;
  background: white;
  box-shadow: 0 0 0 5px rgba(45, 80, 22, 0.1);
}

.form-input::placeholder {
  color: #94a3b8;
}

.toggle-pwd {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 10px;
  transition: all 0.2s;
}

.toggle-pwd:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: scale(1.1);
}

/* 密码强度指示 */
.password-strength {
  height: 5px;
  background: #e2e8f0;
  border-radius: 3px;
  margin-top: 0.6rem;
  overflow: hidden;
}

.strength-bar {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 3px;
}

.strength-bar.weak {
  width: 33%;
  background: linear-gradient(90deg, #ef4444, #f87171);
}

.strength-bar.medium {
  width: 66%;
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.strength-bar.strong {
  width: 100%;
  background: linear-gradient(90deg, #22c55e, #4ade80);
}

.strength-text {
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 0.4rem;
  display: block;
}

.error-text {
  font-size: 0.85rem;
  color: #ef4444;
  margin-top: 0.4rem;
  display: block;
}

/* 注册按钮 */
.register-btn {
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, #2d5016 0%, #388e3c 50%, #4caf50 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(45, 80, 22, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;
}

.register-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
  transition: left 0.6s ease;
}

.register-btn:hover::before {
  left: 100%;
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-4px);
  box-shadow: 0 14px 40px rgba(45, 80, 22, 0.55);
}

.register-btn:active:not(:disabled) {
  transform: translateY(-2px);
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* 按钮加载器 */
.btn-loader {
  display: flex;
  align-items: center;
}

.loader {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 登录区域 */
.login-section {
  text-align: center;
  padding-top: 1.2rem;
  font-size: 0.95rem;
  color: #64748b;
}

.login-section a {
  color: #2d5016;
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.4rem;
}

.login-section a:hover {
  text-decoration: underline;
}

/* 分隔线 */
.divider {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin: 1.8rem 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #cbd5e1, transparent);
}

.divider-text {
  font-size: 0.9rem;
  color: #94a3b8;
}

/* 社交登录 */
.social-login {
  display: flex;
  gap: 1.2rem;
}

.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  font-weight: 500;
  color: #334155;
}

.social-btn:hover {
  border-color: #2d5016;
  background: rgba(45, 80, 22, 0.06);
  transform: translateY(-3px);
}

.social-btn span:first-child {
  font-size: 1.3rem;
}

/* 响应式设计 */
@media (max-width: 900px) {
  .auth-bg {
    display: none;
  }
  
  .auth-form-wrapper {
    width: 100%;
    padding: 1.5rem;
  }
  
  .register-card {
    padding: 2.5rem;
  }
}

@media (max-width: 480px) {
  .register-card {
    padding: 1.8rem;
  }
  
  .card-header h2 {
    font-size: 1.6rem;
  }
  
  .header-icon {
    font-size: 3rem;
  }
}
</style>