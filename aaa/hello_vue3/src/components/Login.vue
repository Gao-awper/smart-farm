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
        <p class="bg-subtitle">让农业生产更智能、更高效</p>
        <div class="feature-list">
          <div class="feature-item">🌱 智能监测</div>
          <div class="feature-item">💧 精准灌溉</div>
          <div class="feature-item">📊 数据分析</div>
          <div class="feature-item">🤖 AI决策</div>
        </div>
      </div>
    </div>
    
    <!-- 登录表单 -->
    <div class="auth-form-wrapper">
      <div class="login-card">
        <div class="card-header">
          <div class="header-icon">🌾</div>
          <h2>欢迎回来</h2>
          <p class="header-desc">请登录您的账户</p>
        </div>
        
        <form class="login-form" @submit.prevent="handleLogin">
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
          
          <!-- 密码输入 -->
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input 
                type="password" 
                v-model="password" 
                required
                placeholder="密码"
                class="form-input"
              >
              <button type="button" class="toggle-pwd" @click="togglePassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>
          
          <!-- 角色选择 -->
          <div class="role-section">
            <div class="role-label">登录身份</div>
            <div class="role-options">
              <label class="role-option" :class="{ active: isAdmin }">
                <input type="radio" name="role" v-model="role" value="admin">
                <span class="role-icon">👑</span>
                <span class="role-text">管理员</span>
              </label>
              <label class="role-option" :class="{ active: role === 'user' }">
                <input type="radio" name="role" v-model="role" value="user">
                <span class="role-icon">👨‍🌾</span>
                <span class="role-text">普通用户</span>
              </label>
            </div>
          </div>
          
          <!-- 记住我 & 忘记密码 -->
          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe">
              <span class="checkmark"></span>
              <span>记住我</span>
            </label>
            <a href="#" class="forgot-link">忘记密码？</a>
          </div>
          
          <!-- 登录按钮 -->
          <button type="submit" class="login-btn" :disabled="loading">
            <span v-if="loading" class="btn-loader">
              <span class="loader"></span>
            </span>
            <span>{{ loading ? '登录中...' : '登 录' }}</span>
          </button>
          
          <!-- 注册链接 -->
          <div class="register-section">
            <span>还没有账户？</span>
            <a href="/register" @click.prevent="goToRegister">立即注册</a>
          </div>
        </form>
        
        <!-- 分隔线 -->
        <div class="divider">
          <span class="divider-line"></span>
          <span class="divider-text">或</span>
          <span class="divider-line"></span>
        </div>
        
        <!-- 快捷登录 -->
        <div class="social-login">
          <button class="social-btn wechat">
            <span>💬</span>
            <span>微信登录</span>
          </button>
          <button class="social-btn phone">
            <span>📱</span>
            <span>短信验证</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { login as authLogin } from '@/utils/auth';

const router = useRouter();
const route = useRoute();

// 表单数据
const nickname = ref('');
const password = ref('');
const rememberMe = ref(false);
const loading = ref(false);
const showPassword = ref(false);
const role = ref('user');

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

// 切换密码显示
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// 跳转注册页
const goToRegister = () => {
  router.push('/register');
};

// 处理登录
const handleLogin = async () => {
  if (!nickname.value || !password.value) {
    alert('用户名或密码不能为空！');
    return;
  }

  loading.value = true;
  
  try {
    // 模拟用户数据（用于本地测试）
    const mockUsers = [
      { id: 1, nickname: 'admin', password: 'admin123', identity: 'admin', email: 'admin@smartfarm.com' },
      { id: 2, nickname: 'farmer', password: 'admin123', identity: 'regular', email: 'farmer@smartfarm.com' },
      { id: 3, nickname: 'technician', password: 'admin123', identity: 'regular', email: 'technician@smartfarm.com' },
      { id: 4, nickname: '志远', password: 'admin123', identity: 'regular', email: '123@qq.com' },
      { id: 5, nickname: '高', password: 'admin123', identity: 'farmer', email: 'gao@smartfarm.com' }
    ];
    
    // 查找用户
    const mockUser = mockUsers.find(u => u.nickname === nickname.value && u.password === password.value);
    
    if (mockUser) {
      // 使用新的登录工具
      authLogin({
        id: mockUser.id,
        nickname: mockUser.nickname,
        email: mockUser.email,
        identity: mockUser.identity
      });
      
      // 用户选择了管理员登录但实际不是管理员
      if (role.value === 'admin' && mockUser.identity !== 'admin') {
        alert('权限不够，无法以管理员身份登录！');
        loading.value = false;
        return;
      }
      
      // 用户选择了用户登录但实际不是用户
      if (role.value === 'user' && mockUser.identity === 'admin') {
        alert('权限不够，无法以用户身份登录！');
        loading.value = false;
        return;
      }
    
    // 根据用户角色和选择的登录方式进行路由跳转
      if (role.value === 'admin' && mockUser.identity === 'admin') {
        router.push('/admin');
      } else if (role.value === 'user' && mockUser.identity !== 'admin') {
        const redirect = route.query.redirect || '/';
        router.push(redirect);
      } else {
        const redirect = route.query.redirect || '/';
        router.push(redirect);
      }
      loading.value = false;
      return;
    }
    
    // 如果模拟登录失败，尝试后端接口
    const response = await axios.post('/api/login', {
      nickname: nickname.value,
      password: password.value,
      isAdmin: role.value === 'admin',
      isUser: role.value === 'user'
    });

    const { data } = response;
    if (data.status === 'success') {
      // 从后端返回的数据中提取用户信息和权限信息
      const userData = data.data;
      
      // 使用新的登录工具
      authLogin({
        id: userData.id,
        nickname: userData.nickname,
        email: userData.email || '',
        identity: userData.isAdmin ? 'admin' : 'regular'
      });
      
      // 用户选择了管理员登录但实际不是管理员
      if (role.value === 'admin' && !userData.isAdmin) {
        alert('权限不够，无法以管理员身份登录！');
        loading.value = false;
        return;
      }
      
      // 用户选择了用户登录但实际不是用户
      if (role.value === 'user' && userData.isAdmin) {
        alert('权限不够，无法以用户身份登录！');
        loading.value = false;
        return;
      }
    
    // 根据用户角色和选择的登录方式进行路由跳转
      if (role.value === 'admin' && userData.isAdmin) {
        router.push('/admin');
      } else if (role.value === 'user' && !userData.isAdmin) {
        const redirect = route.query.redirect || '/';
        router.push(redirect);
      } else {
        const redirect = route.query.redirect || '/';
        router.push(redirect);
      }
      alert('登录成功！');
    } else {
      alert(data.message || '登录失败，请检查用户名或密码！');
    }
  } catch (error) {
    console.error('登录失败：', error);
    alert('登录失败，请检查用户名或密码！');
  } finally {
    loading.value = false;
  }
};

// 初始化表单
const initForm = () => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const user = JSON.parse(userInfo);
    nickname.value = user.nickname;
    rememberMe.value = true;
    role.value = user.isAdmin ? 'admin' : 'user';
  }
};

initForm();
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
  background: url('https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&h=800&fit=crop') center/cover;
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

/* 登录卡片 */
.login-card {
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
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.form-group {
  width: 100%;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1.2rem;
  font-size: 1.2rem;
  z-index: 1;
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

/* 角色选择 */
.role-section {
  margin-top: 0.5rem;
}

.role-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 1rem;
  display: block;
}

.role-options {
  display: flex;
  gap: 1.2rem;
}

.role-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.2rem;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafbfc;
}

.role-option:hover {
  border-color: #2d5016;
  background: rgba(45, 80, 22, 0.06);
}

.role-option.active {
  border-color: #2d5016;
  background: rgba(45, 80, 22, 0.1);
  box-shadow: 0 0 0 4px rgba(45, 80, 22, 0.12);
}

.role-option input {
  display: none;
}

.role-icon {
  font-size: 2rem;
  margin-bottom: 0.6rem;
}

.role-text {
  font-size: 0.95rem;
  font-weight: 600;
  color: #334155;
}

.role-option.active .role-text {
  color: #2d5016;
}

/* 表单选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;
  color: #475569;
  font-weight: 500;
}

.remember-me input {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 7px;
  position: relative;
  transition: all 0.2s ease;
}

.remember-me input:checked + .checkmark {
  background: #2d5016;
  border-color: #2d5016;
}

.remember-me input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.85rem;
  font-weight: bold;
}

.forgot-link {
  color: #2d5016;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.forgot-link:hover {
  color: #1e3a0f;
  text-decoration: underline;
}

/* 登录按钮 */
.login-btn {
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

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
  transition: left 0.6s ease;
}

.login-btn:hover::before {
  left: 100%;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-4px);
  box-shadow: 0 14px 40px rgba(45, 80, 22, 0.55);
}

.login-btn:active:not(:disabled) {
  transform: translateY(-2px);
}

.login-btn:disabled {
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

/* 注册区域 */
.register-section {
  text-align: center;
  padding-top: 1.2rem;
  font-size: 0.95rem;
  color: #64748b;
}

.register-section a {
  color: #2d5016;
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.4rem;
}

.register-section a:hover {
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
  
  .login-card {
    padding: 2.5rem;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.8rem;
  }
  
  .card-header h2 {
    font-size: 1.6rem;
  }
  
  .header-icon {
    font-size: 3rem;
  }
  
  .role-options {
    gap: 0.6rem;
  }
  
  .role-option {
    padding: 0.9rem 0.6rem;
  }
  
  .role-icon {
    font-size: 1.5rem;
  }
  
  .role-text {
    font-size: 0.85rem;
  }
}
</style>