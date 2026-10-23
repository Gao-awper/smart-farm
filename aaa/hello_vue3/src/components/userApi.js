import axios from 'axios';

// 创建axios实例
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // 后端API基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});



// 用户信息API
// 获取当前用户信息
export const getUserInfo = () => {
  return apiClient.get('/user/info');
};

// 更新用户信息
export const updateUserInfo = (userData) => {
  return apiClient.put('/user/info', userData);
};

// 上传用户头像
export const uploadAvatar = (formData) => {
  return apiClient.post('/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 用户订单API
// 获取用户订单列表
export const getUserOrders = (params) => {
  return apiClient.get('/user/orders', { params });
};

// 获取订单详情
export const getOrderDetail = (orderId) => {
  return apiClient.get(`/user/orders/${orderId}`);
};

// 取消订单
export const cancelOrder = (orderId) => {
  return apiClient.put(`/user/orders/${orderId}/cancel`);
};

// 确认收货
export const confirmOrder = (orderId) => {
  return apiClient.put(`/user/orders/${orderId}/confirm`);
};

// 用户答题记录API
// 获取用户答题记录列表
export const getUserAnswerRecords = (params) => {
  return apiClient.get('/user/answer-records', { params });
};

// 获取答题记录详情
export const getAnswerRecordDetail = (recordId) => {
  return apiClient.get(`/user/answer-records/${recordId}`);
};

// 获取用户收藏
export const getUserCollections = (params) => {
  return apiClient.get('/user/collections', { params });
};

// 添加收藏
export const addCollection = (itemId, itemType) => {
  return apiClient.post('/user/collections', { itemId, itemType });
};

// 取消收藏
export const removeCollection = (itemId, itemType) => {
  return apiClient.delete(`/user/collections/${itemId}/${itemType}`);
};