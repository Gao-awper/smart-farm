/**
 * 登录状态管理工具
 */

import { reactive } from 'vue';

const LOGIN_KEY = 'smart_farm_logged_in';
const CURRENT_USER_KEY = 'smart_farm_current_user';

// 从 localStorage 读取初始用户
const getInitialUser = () => {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const initialUser = getInitialUser();
const initialLoggedIn = localStorage.getItem(LOGIN_KEY) === 'true';

// 全局响应式认证状态（初始化时从 localStorage 读取）
export const authState = reactive({
  loggedIn: initialLoggedIn,
  currentUser: initialUser,
  isAdmin: initialUser?.identity === 'admin'
});

// 更新响应式状态
const updateAuthState = () => {
  authState.loggedIn = isLoggedIn();
  authState.currentUser = getCurrentUser();
  authState.isAdmin = isAdmin();
};

/**
 * 获取登录状态
 */
export const isLoggedIn = () => {
  const loggedIn = localStorage.getItem(LOGIN_KEY);
  return loggedIn === 'true';
};

/**
 * 设置登录状态
 */
export const setLoggedIn = (value) => {
  localStorage.setItem(LOGIN_KEY, value.toString());
};

/**
 * 获取当前用户
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

/**
 * 设置当前用户
 */
export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

/**
 * 登录
 */
export const login = (user) => {
  setLoggedIn(true);
  setCurrentUser(user);
  updateAuthState();
};

/**
 * 登出
 */
export const logout = () => {
  setLoggedIn(false);
  setCurrentUser(null);
  updateAuthState();
};

/**
 * 检查是否是管理员
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.identity === 'admin';
};

/**
 * 检查用户是否已登录（别名，兼容旧代码）
 */
export const isAuthenticated = () => {
  return isLoggedIn();
};
