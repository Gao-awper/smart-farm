import axios from 'axios';

// 创建axios实例
const apiClient = axios.create({
  baseURL: '/api', // 后端API基础URL（使用相对路径）
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 答题API

// 获取随机题目（根据类型）
export const getRandomQuestions = (type, count = 10) => {
  return apiClient.get('/questions/random', {
    params: { category: type, count }
  });
};



// 获取用户积分
export const getUserPoints = (userId) => {
  return apiClient.get(`/users/${userId}/points`);
};

// 更新用户积分
export const updateUserPoints = (userId, points) => {
  return apiClient.put(`/users/${userId}/points`, {
    points
  });
};

// 创建答题记录
export const createAnswerRecord = (recordData) => {
  // 转换为后端期望的格式
  const backendFormat = {
    record: {
      userId: recordData.userId,
      type: recordData.type || 'general',
      score: recordData.score,
      totalScore: recordData.totalScore,
      duration: recordData.duration,
      correctCount: recordData.correctCount,
      errorCount: recordData.errorCount
    },
    details: recordData.answerDetails
  };
  return apiClient.post('/answer-records', backendFormat);
};

// 获取用户答题记录列表
export const getUserAnswerRecords = (userId) => {
  return apiClient.get(`/answer-records/user/${userId}`);
};

// 获取答题记录详情
export const getAnswerRecordDetail = (recordId) => {
  return apiClient.get(`/answer-records/${recordId}`);
};

// 获取用户答题统计信息
export const getUserAnswerStatistics = (userId) => {
  return apiClient.get(`/statistics/user/${userId}`);
};

// 获取答题排行榜
export const getAnswerRanking = (type = 'daily', answerType = 'farm') => {
  return apiClient.get('/answer-records/ranking', {
    params: { type, answerType }
  });
};

// 获取用户答题排名
export const getUserAnswerRanking = (userId, type = 'daily', answerType = 'farm') => {
  return apiClient.get(`/answer-records/ranking/user/${userId}`, {
    params: { type, answerType }
  });
};

// 验证答案
export const validateAnswer = (questionId, selectedOption) => {
  return apiClient.post(`/questions/${questionId}/validate`, {
    selectedOption
  });
};

// 检查每日答题限制
export const checkDailyAnswerLimit = (userId, type) => {
  return apiClient.get('/answer-records/daily-check', {
    params: {
      userId: userId,
      type: type
    }
  });
};

// 检查每日额外奖励
export const checkDailyBonus = (userId) => {
  return apiClient.get('/answer-records/daily-bonus', {
    params: {
      userId: userId
    }
  });
};