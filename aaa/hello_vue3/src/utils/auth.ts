// 登录状态管理工具

import { reactive } from 'vue';

const LOGIN_KEY = 'smart_farm_logged_in';
const CURRENT_USER_KEY = 'smart_farm_current_user';

// 从 localStorage 读取初始用户
const getInitialUser = (): { id: number; nickname: string; email: string; identity: string } | null => {
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

// 获取登录状态
export const isLoggedIn = (): boolean => {
  const loggedIn = localStorage.getItem(LOGIN_KEY);
  return loggedIn === 'true';
};

// 设置登录状态
export const setLoggedIn = (value: boolean): void => {
  localStorage.setItem(LOGIN_KEY, value.toString());
};

// 获取当前用户
export const getCurrentUser = (): { id: number; nickname: string; email: string; identity: string } | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// 设置当前用户
export const setCurrentUser = (user: { id: number; nickname: string; email: string; identity: string } | null): void => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// 登录
export const login = (user: { id: number; nickname: string; email: string; identity: string }): void => {
  setLoggedIn(true);
  setCurrentUser(user);
  updateAuthState();
};

// 登出
export const logout = (): void => {
  setLoggedIn(false);
  setCurrentUser(null);
  updateAuthState();
};

// 检查是否是管理员
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.identity === 'admin';
};