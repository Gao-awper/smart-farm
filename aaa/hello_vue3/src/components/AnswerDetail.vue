<template>
  <div class="answer-detail-container">
    <!-- 顶部导航栏 -->
    <header class="answer-detail-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h2 class="page-title">答题详情</h2>
    </header>

    <!-- 答题记录基本信息 -->
    <div class="record-info-card" v-if="recordInfo">
      <div class="info-row">
        <span class="info-label">答题类型：</span>
        <span class="info-value">{{ getAnswerTypeText(recordInfo.type || '') }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">答题时间：</span>
        <span class="info-value">{{ formatTime(recordInfo.answerTime || '') }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">答题时长：</span>
        <span class="info-value">{{ formatDuration(recordInfo.duration || 0) }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">得分：</span>
        <span class="info-value score">{{ recordInfo.score || 0 }}/{{ recordInfo.totalScore || 0 }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">正确率：</span>
        <span class="info-value accuracy">{{ calculateAccuracy(recordInfo) }}%</span>
      </div>
      <div class="info-row">
        <span class="info-label">正确题数：</span>
        <span class="info-value correct">{{ recordInfo.correctCount || 0 }}题</span>
      </div>
      <div class="info-row">
        <span class="info-label">错误题数：</span>
        <span class="info-value error">{{ recordInfo.errorCount || 0 }}题</span>
      </div>
    </div>

    <!-- 题目详情列表 -->
    <div class="question-list" v-if="answerDetails.length > 0">
      <div class="question-item" v-for="(detail, index) in answerDetails" :key="detail.id || index">
        <div class="question-header">
          <span class="question-number">第{{ index + 1 }}题</span>
          <span class="question-status" :class="detail.isCorrect ? 'correct' : 'error'">
            {{ detail.isCorrect ? '✅ 正确' : '❌ 错误' }}
          </span>
        </div>
        <div class="question-content">
          {{ detail.question }}
        </div>
        <div class="options-container">
          <div 
            class="option-item"
            v-for="(option, optionIndex) in detail.options" 
            :key="optionIndex"
            :class="{
              'user-selected': optionIndex === detail.userAnswer,
              'correct': detail.isCorrect && optionIndex === detail.correctAnswer,
              'error': !detail.isCorrect && optionIndex === detail.correctAnswer,
              'user-error': !detail.isCorrect && optionIndex === detail.userAnswer
            }"
          >
            <span class="option-label">{{ String.fromCharCode(65 + optionIndex) }}.</span>
            <span class="option-content">{{ option }}</span>
            <span v-if="optionIndex === detail.correctAnswer" class="correct-mark">正确答案</span>
            <span v-else-if="optionIndex === detail.userAnswer" class="user-mark">我的答案</span>
          </div>
        </div>
        <div class="explanation" v-if="detail.explanation">
          <div class="explanation-title">解析：</div>
          <div class="explanation-content">{{ detail.explanation }}</div>
        </div>
      </div>
    </div>

    <!-- 无数据状态 -->
    <div class="empty-detail" v-else-if="!loading">
      <div class="empty-icon">📝</div>
      <p>暂无答题详情</p>
    </div>

    <!-- 加载状态 -->
    <div class="loading-detail" v-if="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons" v-if="recordInfo">
      <button class="redo-btn" @click="redoAnswer">重新答题</button>
      <button class="back-to-list-btn" @click="goBackToList">返回记录列表</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAnswerRecordDetail } from '@/api/answerApi.js';

const route = useRoute();
const router = useRouter();

// 状态管理
const loading = ref(true);
const recordId = ref(route.params.id);
const recordInfo = ref(null);
const answerDetails = ref([]); // 初始化为空数组，避免访问length时出错

// 加载答题详情数据
const loadAnswerDetail = async () => {
  loading.value = true;
  try {
    // 使用API封装的方法获取答题记录详情
    const response = await getAnswerRecordDetail(recordId.value);
    
    // 检查响应结构
        if (response && response.data) {
          if (response.data.status === 'success' && response.data.data) {
            // 确保recordInfo结构完整（注意：后端返回的是record字段，映射到前端的recordInfo）
            recordInfo.value = {
              id: response.data.data.record?.id || '',
              type: response.data.data.record?.type || 'general',
              answerTime: response.data.data.record?.answerTime || '',
              duration: response.data.data.record?.duration || 0,
              score: response.data.data.record?.score || 0,
              totalScore: response.data.data.record?.totalScore || 0,
              correctCount: response.data.data.record?.correctCount || 0,
              errorCount: response.data.data.record?.errorCount || 0,
              userId: response.data.data.record?.userId || ''
            };
            
            // 确保answerDetails结构完整且每个题目都有必要字段（注意：后端返回的是details字段，映射到前端的answerDetails）
            answerDetails.value = (response.data.data.details || []).map(detail => ({
              id: detail.id || '',
              questionId: detail.questionId || '',
              question: detail.questionContent || '题目内容缺失',
              // 从后端的QuestionDetail结构映射到前端期望的结构
              options: [], // 后端没有直接返回选项，前端需要单独获取或使用其他方式处理
              userAnswer: detail.userAnswer || '',
              correctAnswer: detail.correctAnswer || '',
              isCorrect: detail.correct || false,
              score: detail.score || 0,
              explanation: '' // 后端没有返回解析，暂时为空
            }));
      } else {
        console.error('加载答题详情失败: 服务器返回错误', response.data.message || '未知错误');
        alert(`加载答题详情失败: ${response.data.message || '未知错误'}`);
      }
    } else {
      console.error('加载答题详情失败: 响应格式不正确', response);
      alert('加载答题详情失败，响应格式不正确');
    }
  } catch (error) {
    console.error('加载答题详情失败:', error);
    // 更友好的错误提示
    if (error.response) {
      // 服务器返回了错误状态码
      alert(`加载答题详情失败: 服务器错误 (${error.response.status})`);
    } else if (error.request) {
      // 请求已发出但没有收到响应
      alert('加载答题详情失败: 网络连接异常，请检查网络');
    } else {
      // 请求配置出错
      alert(`加载答题详情失败: ${error.message}`);
    }
  } finally {
    loading.value = false;
  }
};

// 返回上一页
const goBack = () => {
  router.go(-1);
};

// 返回记录列表
const goBackToList = () => {
  // 优先返回个人中心的答题记录
  router.push('/profile?tab=answer');
};

// 重新答题
const redoAnswer = () => {
  if (recordInfo.value) {
    router.push({
      path: '/answer/doing',
      query: { type: recordInfo.value.type }
    });
  }
};

// 获取答题类型文本
const getAnswerTypeText = (type) => {
  const typeMap = {
    springFestival: '春节专题',
    opera: '戏曲专题',
    paperCut: '剪纸专题',
    shadowPlay: '皮影戏专题',
    general: '综合题库',
    daily: '每日答题',
    traditionalCulture: '传统文化',
    history: '历史文化'
  };
  return typeMap[type] || '未知类型';
};

// 格式化时间
const formatTime = (timeString) => {
  if (!timeString) return '';
  const date = new Date(timeString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// 格式化时长
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}分${secs}秒`;
};

// 计算正确率
const calculateAccuracy = (record) => {
  if (!record || record.totalScore === 0) return 0;
  return Math.round((record.score / record.totalScore) * 100);
};

// 初始化
onMounted(() => {
  loadAnswerDetail();
});
</script>

<style scoped>
.answer-detail-container {
  min-height: 100vh;
  background-color: #f8f5f0;
  font-family: 'SimSun', 'STSong', 'Microsoft YaHei', sans-serif;
}

/* 顶部导航栏 */
.answer-detail-header {
  background-color: #c8102e;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  background: none;
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.page-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
}

/* 答题记录信息卡片 */
.record-info-card {
  background-color: white;
  margin: 1.5rem 2rem;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.info-row {
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #666;
  font-weight: 500;
  min-width: 80px;
}

.info-value {
  color: #333;
  font-size: 1rem;
}

.info-value.score {
  color: #c8102e;
  font-weight: bold;
  font-size: 1.1rem;
}

.info-value.accuracy {
  color: #2e7d32;
  font-weight: bold;
}

.info-value.correct {
  color: #2e7d32;
}

.info-value.error {
  color: #c62828;
}

/* 题目详情列表 */
.question-list {
  margin: 0 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.question-item {
  background-color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.question-number {
  font-weight: bold;
  color: #c8102e;
  font-size: 1.1rem;
}

.question-status {
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.question-status.correct {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.question-status.error {
  background-color: #ffebee;
  color: #c62828;
}

.question-content {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.5;
}

/* 选项容器 */
.options-container {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.option-item {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: default;
  transition: all 0.3s;
  display: flex;
  align-items: flex-start;
}

.option-item:hover {
  background-color: #f5f5f5;
}

.option-label {
  font-weight: bold;
  color: #c8102e;
  margin-right: 0.5rem;
  min-width: 20px;
}

.option-content {
  flex: 1;
  line-height: 1.4;
}

/* 选项状态样式 */
.option-item.user-selected {
  border-color: #c8102e;
  background-color: #fff3f3;
}

.option-item.correct {
  border-color: #4caf50;
  background-color: #e8f5e9;
}

.option-item.error {
  border-color: #f44336;
  background-color: #ffebee;
}

.option-item.user-error {
  border-color: #f44336;
  background-color: #ffebee;
}

.correct-mark {
  font-size: 0.8rem;
  color: #4caf50;
  font-weight: bold;
  margin-left: 0.5rem;
}

.user-mark {
  font-size: 0.8rem;
  color: #c8102e;
  font-weight: bold;
  margin-left: 0.5rem;
}

/* 解析部分 */
.explanation {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.explanation-title {
  color: #c8102e;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.explanation-content {
  color: #666;
  line-height: 1.5;
}

/* 空状态和加载状态 */
.empty-detail,
.loading-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: #999;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #c8102e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: 1.5rem 2rem;
}

.redo-btn,
.back-to-list-btn {
  padding: 0.8rem 2rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.redo-btn {
  background-color: #c8102e;
  color: white;
}

.redo-btn:hover {
  background-color: #a80c24;
}

.back-to-list-btn {
  background-color: #f5f5f5;
  color: #c8102e;
  border: 1px solid #c8102e;
}

.back-to-list-btn:hover {
  background-color: #e8e8e8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .answer-detail-header {
    padding: 0.8rem 1rem;
  }
  
  .record-info-card {
    margin: 1rem;
    padding: 1rem;
  }
  
  .question-list {
    margin: 0 1rem 1rem;
  }
  
  .question-item {
    padding: 1rem;
  }
  
  .action-buttons {
    padding: 1rem;
    flex-direction: column;
  }
}
</style>