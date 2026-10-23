import axios from 'axios';

// 创建axios实例
const apiClient = axios.create({
  baseURL: '/api', // springstudy后端API基础URL（使用相对路径）
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});



// 用户API
export const userApi = {
  // 用户注册
  register: (userData) => apiClient.post('/register', userData),
  // 用户登录
  login: (loginData) => apiClient.post('/login', loginData),
  // 退出登录
  logout: () => apiClient.post('/logout'),
  // 根据ID获取用户
  getUserById: (id) => apiClient.get(`/user/${id}`),
  // 更新用户信息
  updateUserInfo: (id, userData) => apiClient.put(`/user/${id}`, userData),
  // 添加用户
  addUser: (userData) => apiClient.post('/users', userData),
  // 获取所有用户
  getAllUsers: () => apiClient.get('/users'),
  // 搜索用户
  searchUsers: (keyword) => apiClient.get('/users/search', { params: { keyword } }),
  // 删除用户
  deleteUser: (id) => apiClient.delete(`/user/${id}`)
};

// 商品API
export const goodsApi = {
  // 获取所有商品
  getAllGoods: () => apiClient.get('/goods'),
  // 根据分类获取商品
  getGoodsByCategory: (category) => apiClient.get(`/goods/category/${category}`),
  // 根据ID获取商品
  getGoodsById: (id) => apiClient.get(`/goods/${id}`),
  // 搜索商品
  searchGoods: (keyword) => apiClient.get('/goods/search', { params: { keyword } }),
  // 添加商品
  addGoods: (goods) => apiClient.post('/goods', goods),
  // 更新商品
  updateGoods: (goods) => apiClient.put('/goods', goods),
  // 删除商品
  deleteGoods: (id) => apiClient.delete(`/goods/${id}`)
};

// 订单API
export const orderApi = {
  // 创建订单
  createOrder: (order) => apiClient.post('/orders', order),
  // 获取所有订单
  getAllOrders: () => apiClient.get('/orders'),
  // 根据用户ID获取订单
  getOrdersByUserId: (userId) => apiClient.get(`/orders/user/${userId}`),
  // 根据ID获取订单
  getOrderById: (id) => apiClient.get(`/orders/${id}`),
  // 搜索订单
  searchOrders: (keyword) => apiClient.get('/orders/search', { params: { keyword } }),
  // 取消订单
  cancelOrder: (id) => apiClient.put(`/orders/${id}/cancel`),
  // 支付订单
  payOrder: (id) => apiClient.put(`/orders/${id}/pay`),
  // 确认收货
  confirmReceipt: (id) => apiClient.put(`/orders/${id}/confirm`),
  // 删除订单
  deleteOrder: (id) => apiClient.delete(`/orders/${id}/delete`)
};

// 题目API
export const questionApi = {
  // 根据ID获取题目
  getQuestionById: (id) => apiClient.get(`/questions/${id}`),
  // 根据分类获取题目
  getQuestionsByCategory: (category) => apiClient.get(`/questions/category/${category}`),
  // 根据分类和难度获取题目
  getQuestionsByCategoryAndDifficulty: (category, difficulty) => 
    apiClient.get(`/questions/category/${category}/difficulty/${difficulty}`),
  // 获取随机题目
  getRandomQuestions: (category, count) => 
    apiClient.get('/questions/random', { params: { category, count } }),
  // 创建题目
  createQuestion: (question) => apiClient.post('/questions', question),
  // 更新题目
  updateQuestion: (id, question) => apiClient.put(`/questions/${id}`, question),
  // 删除题目
  deleteQuestion: (id) => apiClient.delete(`/questions/${id}`),
  // 验证答案
  validateAnswer: (id, selectedOption) => 
    apiClient.post(`/questions/${id}/validate`, { selectedOption }),
  // 批量创建题目
  batchCreateQuestions: (questions) => apiClient.post('/questions/batch', questions)
};



// 作物API
export const cropApi = {
  // 获取所有作物
  getAllCrops: () => apiClient.get('/crops'),
  // 添加作物
  addCrop: (crop) => apiClient.post('/crops', crop),
  // 更新作物
  updateCrop: (id, crop) => apiClient.put(`/crops/${id}`, crop),
  // 删除作物
  deleteCrop: (id) => apiClient.delete(`/crops/${id}`)
};

// 灌溉API
export const irrigationApi = {
  // 获取所有灌溉区域
  getAllIrrigationZones: () => apiClient.get('/irrigation'),
  // 添加灌溉区域
  addIrrigationZone: (zone) => apiClient.post('/irrigation', zone),
  // 更新灌溉区域
  updateIrrigationZone: (id, zone) => apiClient.put(`/irrigation/${id}`, zone),
  // 删除灌溉区域
  deleteIrrigationZone: (id) => apiClient.delete(`/irrigation/${id}`)
};

// 系统设置API
export const settingsApi = {
  // 获取系统设置
  getSettings: () => apiClient.get('/settings'),
  // 保存系统设置
  saveSettings: (settings) => apiClient.post('/settings', settings)
};

export default apiClient;