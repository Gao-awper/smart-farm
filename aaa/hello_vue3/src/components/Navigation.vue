<template>
  <header class="header">
    <div class="header-top">
      <div class="logo-container">
        <img src="https://picsum.photos/id/152/40/40" alt="Logo" class="logo">
        <div class="site-name">
          <span>绿野智农管理系统</span>
          <span>智能农业数字化平台</span>
        </div>
      </div>
      
      <div class="header-controls">
        <div class="date-info">{{ currentDate }}</div>
        <div v-if="loggedIn" class="user-info">
          <span class="user-name">{{ currentUser?.nickname }}</span>
          <button class="logout-btn" @click="handleLogout">退出登录</button>
          <button v-if="isAdminUser" class="admin-btn" @click="goToAdmin">管理后台</button>
        </div>
        <button v-else class="user-btn" @click="goToLogin">👤 登录</button>
      </div>
    </div>
    
    <!-- 导航菜单 -->
    <nav class="main-nav">
      <ul>
        <li @click="() => {setActiveNav('首页'); goToHome()}" :class="{active: activeNav === '首页'}">首页</li>
        <li @click="setActiveNav('农场概览')" :class="{active: activeNav === '农场概览'}">农场概览</li>
        <li @click="setActiveNav('智能监测')" :class="{active: activeNav === '智能监测'}">智能监测</li>
        <li @click="setActiveNav('智能灌溉')" :class="{active: activeNav === '智能灌溉'}">智能灌溉</li>
        <li @click="setActiveNav('作物管理')" :class="{active: activeNav === '作物管理'}">作物管理</li>
        <li @click="setActiveNav('数据分析')" :class="{active: activeNav === '数据分析'}">数据分析</li>
        <li @click="setActiveNav('AI决策')" :class="{active: activeNav === 'AI决策'}">🤖 AI决策</li>
        <li @click="setActiveNav('3D可视化')" :class="{active: activeNav === '3D可视化'}">🌐 3D可视化</li>
        <li @click="setActiveNav('物联网')" :class="{active: activeNav === '物联网'}">📡 物联网</li>
        <li @click="setActiveNav('农事日历')" :class="{active: activeNav === '农事日历'}">📅 农事日历</li>
        <li v-if="loggedIn" @click="setActiveNav('系统设置')" :class="{active: activeNav === '系统设置'}">系统设置</li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authState, logout } from '@/utils/auth'

const router = useRouter()
const activeNav = ref('首页')
const currentDate = ref('')
let dateUpdateTimer = null

// 使用全局响应式认证状态的computed属性
const loggedIn = computed(() => authState.loggedIn)
const currentUser = computed(() => authState.currentUser)
const isAdminUser = computed(() => authState.isAdmin)

// 格式化日期函数
const formatDate = () => {
  const now = new Date()
  
  // 格式化公历日期
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  
  // 星期几
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const weekday = weekdays[now.getDay()]
  
  // 这里简化处理，实际项目中可能需要更复杂的农历计算
  // 这里使用一个简单的模拟，实际项目中可以使用农历库
  const lunarDate = '农历十月初三' // 实际项目中应该动态计算
  
  currentDate.value = `${year}-${month}-${day} ${weekday} ${lunarDate}`
}

const setActiveNav = (navName) => {
  activeNav.value = navName
  // 根据导航名称跳转到对应的路由
  switch(navName) {
    case '首页':
      router.push('/');
      break;
    case '农场概览':
      router.push('/overview'); // 农场概览页面
      break;
    case '智能监测':
      router.push('/monitoring'); // 智能监测页面
      break;
    case '智能灌溉':
      router.push('/irrigation'); // 智能灌溉页面
      break;
    case '作物管理':
      router.push('/crops'); // 作物管理页面
      break;
    case '数据分析':
      router.push('/analysis'); // 数据分析页面
      break;
    case 'AI决策':
      router.push('/ai-decision'); // AI智能决策页面
      break;
    case '3D可视化':
      router.push('/digital-twin'); // 3D可视化页面
      break;
    case '物联网':
      router.push('/iot'); // 物联网管理页面
      break;
    case '农事日历':
      router.push('/calendar'); // 农事日历页面
      break;
    case '系统设置':
      router.push('/settings'); // 系统设置页面
      break;
  }
}

const goToHome = () => {
  router.push('/')
}

const goToLogin = () => {
  router.push('/login')
}

const goToAdmin = () => {
  router.push('/admin')
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    logout()
    alert('已退出登录')
    router.push('/')
  }
}

// 组件挂载时初始化日期并设置定时器
onMounted(() => {
  formatDate()
  // 每分钟更新一次日期
  dateUpdateTimer = setInterval(formatDate, 60000)
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (dateUpdateTimer) {
    clearInterval(dateUpdateTimer)
  }
})
</script>

<style scoped>
/* 导航栏样式 */
.header {
  background: linear-gradient(135deg, #2d5016 0%, #3a6e18 100%);
  color: white;
  padding: 0;
  box-shadow: 0 4px 20px rgba(45, 80, 22, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.header:hover {
  box-shadow: 0 6px 30px rgba(45, 80, 22, 0.4);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.site-name {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.site-name span:first-child {
  font-size: 1.2rem;
  font-weight: bold;
}

.site-name span:last-child {
  font-size: 0.9rem;
  opacity: 0.9;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.icon-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.date-info {
  font-size: 0.9rem;
  opacity: 0.9;
}

.user-btn {
  background: none;
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.user-btn:hover {
  background-color: white;
  color: #2d5016;
}

/* 用户信息区域 */
.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  font-size: 1rem;
  font-weight: 500;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.admin-btn {
  background: #ffd700;
  border: none;
  color: #2d5016;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.admin-btn:hover {
  background: #ffed4a;
}

/* 主导航菜单 */
.main-nav {
  padding: 0.8rem 0;
  display: flex;
  justify-content: center;
}

.main-nav ul {
  display: flex;
  gap: 2rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.main-nav li {
  padding: 0.5rem 0;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  position: relative;
  transition: color 0.3s;
}

.main-nav li:hover {
  color: #ffd700;
}

.main-nav li.active {
  color: #ffd700;
}

.main-nav li.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #ffd700;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .header {
    padding: 0 1rem;
  }
  
  .main-nav ul {
    gap: 1.5rem;
  }
  
  .date-info {
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 0.5rem 1rem;
  }
  
  .site-name span:first-child {
    font-size: 1rem;
  }
  
  .site-name span:last-child {
    font-size: 0.7rem;
  }
  
  .header-controls {
    gap: 0.5rem;
  }
  
  .date-info {
    display: none;
  }
  
  .main-nav ul {
    gap: 1rem;
    padding: 0.5rem 0;
  }
  
  .main-nav li {
    font-size: 0.9rem;
  }
}
</style>