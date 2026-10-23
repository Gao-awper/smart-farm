// 活动相关API调用
import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: '/api', // 后端API基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 获取活动列表
export const getActivities = async (params = {}) => {
  try {
    const response = await api.get('/activities', { params });
    return response.data;
  } catch (error) {
    console.error('获取活动列表失败:', error);
    throw error;
  }
};

// 获取活动详情
export const getActivityDetail = async (id) => {
  try {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  } catch (error) {
    console.error('获取活动详情失败:', error);
    throw error;
  }
};

// 报名活动
export const registerActivity = async (activityId) => {
  try {
    // 从登录状态获取用户ID
    const userInfoStr = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
    if (!userInfoStr) {
      throw new Error('用户未登录，请先登录');
    }
    
    const userInfo = JSON.parse(userInfoStr);
    const userId = userInfo.id;
    
    const response = await api.post(`/activities/${activityId}/register`, null, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('报名活动失败:', error);
    throw error;
  }
};

// 取消活动报名
export const cancelRegistration = async (activityId) => {
  try {
    // 从登录状态获取用户ID
    const userInfoStr = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
    if (!userInfoStr) {
      throw new Error('用户未登录，请先登录');
    }
    
    const userInfo = JSON.parse(userInfoStr);
    const userId = userInfo.id;
    
    const response = await api.post(`/activities/${activityId}/cancel`, null, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('取消活动报名失败:', error);
    throw error;
  }
};

// 获取用户报名的活动
export const getUserActivities = async () => {
  try {
    // 从登录状态获取用户ID
    const userInfoStr = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
    if (!userInfoStr) {
      throw new Error('用户未登录，请先登录');
    }
    
    const userInfo = JSON.parse(userInfoStr);
    const userId = userInfo.id;
    
    // 调用后端API获取用户已报名活动
    const response = await api.get(`/activities/user/activities`, {
      params: { userId }
    });
    return response.data;
    return response.data;
  } catch (error) {
    console.error('获取用户报名活动失败:', error);
    throw error;
  }
};

// 创建活动（管理员）
export const createActivity = async (activityData) => {
  try {
    const response = await api.post('/activities', activityData);
    return response.data;
  } catch (error) {
    console.error('创建活动失败:', error);
    throw error;
  }
};

// 更新活动（管理员）
export const updateActivity = async (id, activityData) => {
  try {
    const response = await api.put(`/activities/${id}`, activityData);
    return response.data;
  } catch (error) {
    console.error('更新活动失败:', error);
    throw error;
  }
};

// 删除活动（管理员）
export const deleteActivity = async (id) => {
  try {
    const response = await api.delete(`/activities/${id}`);
    return response.data;
  } catch (error) {
    console.error('删除活动失败:', error);
    throw error;
  }
};

export default {
  getActivities,
  getActivityDetail,
  registerActivity,
  cancelRegistration,
  getUserActivities,
  createActivity,
  updateActivity,
  deleteActivity
};