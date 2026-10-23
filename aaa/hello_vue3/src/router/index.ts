// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/components/Home.vue';
import Overview from '@/components/Overview.vue';
import Monitoring from '@/components/Monitoring.vue';
import Irrigation from '@/components/Irrigation.vue';
import Crops from '@/components/Crops.vue';
import Analysis from '@/components/Analysis.vue';
import Settings from '@/components/Settings.vue';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';
import Admin from '@/components/Admin.vue';
import AIDecision from '@/components/AIDecision.vue';
import DigitalTwin from '@/components/DigitalTwin.vue';
import IoTManagement from '@/components/IoTManagement.vue';
import FarmingCalendar from '@/components/FarmingCalendar.vue';

import { isLoggedIn, isAdmin } from '@/utils/auth';

const routes = [
  {
    path: '/', // 根路径（默认跳转首页）
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }, // 不需要登录即可访问
  },
  {
    path: '/overview', // 农场概览页面
    name: 'Overview',
    component: Overview,
    meta: { requiresAuth: false }, // 不需要登录即可访问
  },
  {
    path: '/monitoring', // 智能监测页面
    name: 'Monitoring',
    component: Monitoring,
    meta: { requiresAuth: false }, // 不需要登录即可访问
  },
  {
    path: '/irrigation', // 智能灌溉页面
    name: 'Irrigation',
    component: Irrigation,
    meta: { requiresAuth: false }, // 不需要登录即可访问
  },
  {
    path: '/crops', // 作物管理页面
    name: 'Crops',
    component: Crops,
    meta: { requiresAuth: false }, // 不需要登录即可访问
  },
  {
    path: '/analysis', // 数据分析页面
    name: 'Analysis',
    component: Analysis,
    meta: { requiresAuth: false }, // 不需要登录即可访问
  },
  {
    path: '/settings', // 系统设置页面
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true }, // 需要登录才能访问
  },
  {
    path:'/login',
    name:'Login',
    component:Login,
    meta: { requiresAuth: false }, // 不需要登录即可访问
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }, // 不需要登录即可访问
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true }, // 需要登录且是管理员
  },
  {
    path: '/ai-decision',
    name: 'AIDecision',
    component: AIDecision,
    meta: { requiresAuth: false }, // 不需要登录即可访问
  },
  {
    path: '/digital-twin',
    name: 'DigitalTwin',
    component: DigitalTwin,
    meta: { requiresAuth: false }, // 不需要登录即可访问
  },
  {
    path: '/iot',
    name: 'IoT',
    component: IoTManagement,
    meta: { requiresAuth: false }, // 不需要登录即可访问
  },
  {
    path: '/calendar',
    name: 'FarmingCalendar',
    component: FarmingCalendar,
    meta: { requiresAuth: false }, // 不需要登录即可访问
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // 路由模式（HTML5 模式）
  routes, // 导入路由规则
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const loggedIn = isLoggedIn();
  const requiresAuth = to.meta.requiresAuth;
  const requiresAdmin = to.meta.requiresAdmin;

  // 如果需要登录但未登录
  if (requiresAuth && !loggedIn) {
    alert('请先登录！');
    next('/login');
    return;
  }

  // 如果需要管理员权限但不是管理员
  if (requiresAdmin && !isAdmin()) {
    alert('您没有管理员权限！');
    next('/');
    return;
  }

  next(); // 正常放行
});

export default router;