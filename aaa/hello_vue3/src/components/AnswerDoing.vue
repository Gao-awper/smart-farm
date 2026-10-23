<template>
  <div class="answer-doing-container">
    <!-- 答题顶部信息 -->
  <header class="doing-header">
    <div class="header-left">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1 class="quiz-title">{{ quizTitle }}</h1>
    </div>
    <div class="header-right">
      <!-- 答题次数限制信息 -->
      <div v-if="limitInfo" class="limit-info">
        <span class="limit-icon">📋</span>
        <span class="limit-text">{{ limitInfo }}</span>
      </div>
      <div class="timer">
        <span class="timer-icon">⏱️</span>
        <span class="timer-text" :class="{
          warning: questionRemainingTime < 10,
          danger: questionRemainingTime <= 5
        }">
          {{ formatTime(questionRemainingTime) }}
        </span>
      </div>
    </div>
  </header>

    <!-- 答题进度 -->
    <div class="progress-section">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressWidth }">
          <span class="progress-text">{{ currentQuestionIndex + 1 }}/{{ questions.length }}</span>
        </div>
      </div>
      <div class="question-status">
        <div 
          v-for="(q, index) in questions" 
          :key="index"
          class="question-dot"
          :class="{
            active: index === currentQuestionIndex,
            answered: userAnswers[index] !== null,
            correct: userAnswers[index] === questions[index]?.correctAnswer,
            wrong: userAnswers[index] !== null && userAnswers[index] !== questions[index]?.correctAnswer
          }"
          @click="goToQuestion(index)"
        >
          {{ index + 1 }}
        </div>
      </div>
    </div>

    <!-- 题目内容 -->
    <div class="question-section">
       <div v-if="questions.length > 0 && currentQuestion" class="question-container">
        <div class="question-type">{{ getQuestionTypeName(currentQuestion.type || 1) }}</div>
        <h2 class="question-text">{{ currentQuestion.content }}</h2>
        
        <!-- 选项列表 -->
        <div class="options-list">
          <!-- 选项A -->
          <div 
            class="option-item"
            :class="{
              selected: userAnswers[currentQuestionIndex] === 'A',
              correct: showResult && currentQuestion.correctAnswer === 'A',
              wrong: showResult && userAnswers[currentQuestionIndex] === 'A' && currentQuestion.correctAnswer !== 'A'
            }"
            @click="selectOption('A')"
            :disabled="showResult"
          >
            <div class="option-letter">A</div>
            <div class="option-text">{{ currentQuestion.optionA }}</div>
            <div v-if="showResult" class="option-result">
              <span v-if="currentQuestion.correctAnswer === 'A'" class="result-correct">✓</span>
              <span v-else-if="userAnswers[currentQuestionIndex] === 'A'" class="result-wrong">✗</span>
            </div>
          </div>
          
          <!-- 选项B -->
          <div 
            class="option-item"
            :class="{
              selected: userAnswers[currentQuestionIndex] === 'B',
              correct: showResult && currentQuestion.correctAnswer === 'B',
              wrong: showResult && userAnswers[currentQuestionIndex] === 'B' && currentQuestion.correctAnswer !== 'B'
            }"
            @click="selectOption('B')"
            :disabled="showResult"
          >
            <div class="option-letter">B</div>
            <div class="option-text">{{ currentQuestion.optionB }}</div>
            <div v-if="showResult" class="option-result">
              <span v-if="currentQuestion.correctAnswer === 'B'" class="result-correct">✓</span>
              <span v-else-if="userAnswers[currentQuestionIndex] === 'B'" class="result-wrong">✗</span>
            </div>
          </div>
          
          <!-- 选项C -->
          <div 
            class="option-item"
            :class="{
              selected: userAnswers[currentQuestionIndex] === 'C',
              correct: showResult && currentQuestion.correctAnswer === 'C',
              wrong: showResult && userAnswers[currentQuestionIndex] === 'C' && currentQuestion.correctAnswer !== 'C'
            }"
            @click="selectOption('C')"
            :disabled="showResult"
          >
            <div class="option-letter">C</div>
            <div class="option-text">{{ currentQuestion.optionC }}</div>
            <div v-if="showResult" class="option-result">
              <span v-if="currentQuestion.correctAnswer === 'C'" class="result-correct">✓</span>
              <span v-else-if="userAnswers[currentQuestionIndex] === 'C'" class="result-wrong">✗</span>
            </div>
          </div>
          
          <!-- 选项D -->
          <div 
            class="option-item"
            :class="{
              selected: userAnswers[currentQuestionIndex] === 'D',
              correct: showResult && currentQuestion.correctAnswer === 'D',
              wrong: showResult && userAnswers[currentQuestionIndex] === 'D' && currentQuestion.correctAnswer !== 'D'
            }"
            @click="selectOption('D')"
            :disabled="showResult"
          >
            <div class="option-letter">D</div>
            <div class="option-text">{{ currentQuestion.optionD }}</div>
            <div v-if="showResult" class="option-result">
              <span v-if="currentQuestion.correctAnswer === 'D'" class="result-correct">✓</span>
              <span v-else-if="userAnswers[currentQuestionIndex] === 'D'" class="result-wrong">✗</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 空题库提示 -->
      <div v-else-if="questions.length === 0 && questionsLoaded" class="empty-library-container">
        <div class="empty-icon">📚</div>
        <h2 class="empty-title">题目库为空</h2>
        <p class="empty-message">当前分类下暂无题目，请返回选择其他分类或稍后再试</p>
        <button class="back-to-select-btn" @click="goBack">返回分类选择</button>
      </div>
      
      <!-- 加载中 -->
      <div v-else class="loading-container">
        <div class="loading-spinner"></div>
        <p>题目加载中...</p>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-section">
      <button 
        class="prev-btn" 
        @click="prevQuestion"
        :disabled="currentQuestionIndex === 0 || showResult"
      >
        上一题
      </button>
      
      <div class="action-center">
        <button 
          class="submit-btn"
          v-if="currentQuestionIndex === questions.length - 1 && !showResult"
          @click="submitAnswer"
        >
          提交试卷
        </button>
        
        <div v-else-if="showResult" class="result-info">
          <span class="result-text">{{ getResultText() }}</span>
        </div>
      </div>
      
      <button 
        class="next-btn" 
        @click="nextQuestion"
        :disabled="showResult || (userAnswers[currentQuestionIndex] === null && currentQuestionIndex < questions.length - 1)"
      >
        {{ currentQuestionIndex === questions.length - 1 ? '查看结果' : '下一题' }}
      </button>
    </div>

    <!-- 答题结果弹窗 -->
    <div class="result-modal" v-if="showResultModal">
      <div class="result-content">
        <div class="result-header">
          <h2 class="result-title">答题完成！</h2>
          <button class="close-btn" @click="closeResultModal">×</button>
        </div>
        
        <div class="result-body">
          <div class="score-display">
            <div class="score-circle">
              <span class="score-number">{{ finalScore }}</span>
              <span class="score-label">分</span>
            </div>
            <div class="score-info">
              <p class="correct-count">答对 {{ correctCount }} 题</p>
              <p class="wrong-count">答错 {{ wrongCount }} 题</p>
              <p class="accuracy">正确率 {{ accuracy }}%</p>
            </div>
          </div>
          
          <div class="result-stats">
            <div class="stat-item">
              <span class="stat-label">用时</span>
              <span class="stat-value">{{ formatTime(totalTimeSpent) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">得分率</span>
              <span class="stat-value">{{ scoreRate }}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">每日奖励</span>
              <span class="stat-value">{{ dailyBonus }} 积分</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">排名</span>
              <span class="stat-value">{{ ranking || '计算中...' }}</span>
            </div>
          </div>
        </div>
        
        <div class="result-footer">
          <button class="review-btn" @click="reviewAnswers">查看详情</button>
          <button class="record-btn" @click="viewHistoryRecords">历史记录</button>
          <button class="again-btn" @click="startAgain">再答一次</button>
          <button class="exit-btn" @click="exitToEntry">返回首页</button>
        </div>
      </div>
    </div>
  </div>
  <!-- 答案详情弹窗 -->
  <div class="detail-modal" v-if="showDetailModal">
    <div class="detail-overlay" @click="closeDetailModal"></div>
    <div class="detail-content">
      <!-- 详情弹窗头部 -->
      <div class="detail-header">
        <h2 class="detail-title">答题详情</h2>
        <div class="detail-progress">
          <p class="detail-progress-text">{{ currentQuestionIndex + 1 }}/{{ questions.length }}</p>
        </div>
        <button class="detail-close-btn" @click="closeDetailModal">×</button>
      </div>
  
      <!-- 详情弹窗主体 -->
      <div class="detail-body">
        <div v-if="questions.length > 0 && currentQuestion" class="detail-question-container">
          <!-- 题目类型 -->
          <div class="detail-question-type">{{ getQuestionTypeName(currentQuestion.type || 1) }}</div>
          <!-- 题目内容 -->
          <h3 class="detail-question-text">{{ currentQuestion.content }}</h3>
  
          <!-- 选项列表 -->
          <div class="detail-options-section">
            <div 
              class="detail-option-item"
              :class="{
                selected: userAnswers[currentQuestionIndex] === 'A',
                correct: currentQuestion.correctAnswer === 'A',
                wrong: userAnswers[currentQuestionIndex] === 'A' && currentQuestion.correctAnswer !== 'A'
              }"
            >
              <div class="detail-option-letter">A</div>
              <div class="detail-option-text">{{ currentQuestion.optionA }}</div>
              <div class="detail-option-result">
                <span v-if="currentQuestion.correctAnswer === 'A'" class="detail-result-correct">✓</span>
                <span v-else-if="userAnswers[currentQuestionIndex] === 'A'" class="detail-result-wrong">✗</span>
              </div>
            </div>
  
            <div 
              class="detail-option-item"
              :class="{
                selected: userAnswers[currentQuestionIndex] === 'B',
                correct: currentQuestion.correctAnswer === 'B',
                wrong: userAnswers[currentQuestionIndex] === 'B' && currentQuestion.correctAnswer !== 'B'
              }"
            >
              <div class="detail-option-letter">B</div>
              <div class="detail-option-text">{{ currentQuestion.optionB }}</div>
              <div class="detail-option-result">
                <span v-if="currentQuestion.correctAnswer === 'B'" class="detail-result-correct">✓</span>
                <span v-else-if="userAnswers[currentQuestionIndex] === 'B'" class="detail-result-wrong">✗</span>
              </div>
            </div>
  
            <div 
              class="detail-option-item"
              :class="{
                selected: userAnswers[currentQuestionIndex] === 'C',
                correct: currentQuestion.correctAnswer === 'C',
                wrong: userAnswers[currentQuestionIndex] === 'C' && currentQuestion.correctAnswer !== 'C'
              }"
            >
              <div class="detail-option-letter">C</div>
              <div class="detail-option-text">{{ currentQuestion.optionC }}</div>
              <div class="detail-option-result">
                <span v-if="currentQuestion.correctAnswer === 'C'" class="detail-result-correct">✓</span>
                <span v-else-if="userAnswers[currentQuestionIndex] === 'C'" class="detail-result-wrong">✗</span>
              </div>
            </div>
  
            <div 
              class="detail-option-item"
              :class="{
                selected: userAnswers[currentQuestionIndex] === 'D',
                correct: currentQuestion.correctAnswer === 'D',
                wrong: userAnswers[currentQuestionIndex] === 'D' && currentQuestion.correctAnswer !== 'D'
              }"
            >
              <div class="detail-option-letter">D</div>
              <div class="detail-option-text">{{ currentQuestion.optionD }}</div>
              <div class="detail-option-result">
                <span v-if="currentQuestion.correctAnswer === 'D'" class="detail-result-correct">✓</span>
                <span v-else-if="userAnswers[currentQuestionIndex] === 'D'" class="detail-result-wrong">✗</span>
              </div>
            </div>
          </div>
  
          <!-- 题目结果信息 -->
          <div class="detail-result-section">
            <div class="detail-result-item">
              <span class="detail-result-label">你的答案：</span>
              <span class="detail-result-value">{{ userAnswers[currentQuestionIndex] || '未作答' }}</span>
            </div>
            <div class="detail-result-item">
              <span class="detail-result-label">正确答案：</span>
              <span class="detail-result-value">{{ currentQuestion.correctAnswer }}</span>
            </div>
            <div class="detail-result-item">
              <span class="detail-result-label">得分：</span>
              <span class="detail-result-value">{{ userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer ? (currentQuestion.score || 10) : 0 }} 分</span>
            </div>
          </div>
  
          <!-- 题目解析（如果有） -->
          <div v-if="currentQuestion.explain" class="detail-explain-section">
            <h4 class="detail-explain-title">题目解析</h4>
            <p class="detail-explain-content">{{ currentQuestion.explain }}</p>
          </div>
        </div>
      </div>
  
      <!-- 详情弹窗底部（切换按钮） -->
      <div class="detail-footer">
        <button 
          class="detail-nav-btn" 
          @click="prevDetailQuestion"
          :disabled="currentQuestionIndex === 0"
        >
          上一题
        </button>
        <div class="detail-action-center">
          <button class="detail-finish-btn" @click="closeDetailModal">完成查看</button>
        </div>
        <button 
          class="detail-nav-btn" 
          @click="nextDetailQuestion"
          :disabled="currentQuestionIndex === questions.length - 1"
        >
          下一题
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getRandomQuestions, createAnswerRecord, validateAnswer, checkDailyAnswerLimit, checkDailyBonus } from '@/api/answerApi';
import { getCurrentUser } from '@/utils/auth';

const router = useRouter();
const route = useRoute();

// 答题状态
const questions = ref([]);
const currentQuestionIndex = ref(0);
const userAnswers = ref([]);
const showResult = ref(false);
const showResultModal = ref(false);
const timerInterval = ref(null);
const questionRemainingTime = ref(30); // 每题30秒
const totalTimeSpent = ref(0); // 总用时（秒）
const quizType = ref(route.query.type || 'general');
const questionsLoaded = ref(false);
const errorCount = ref(0); // 错误计数
const dailyBonus = ref(0); // 每日额外奖励积分
const limitInfo = ref(''); // 答题次数限制信息
const quizTitle = computed(() => {
  const titleMap = {
    springFestival: '春节专题',
    opera: '戏曲专题',
    paperCut: '剪纸专题',
    shadowPlay: '皮影戏专题',
    general: '综合题库',
    daily: '每日答题'
  };
  return titleMap[quizType.value] || '答题';
});

// 计算属性
const currentQuestion = computed(() => {
  return questions.value[currentQuestionIndex.value] || null;
});

const progressWidth = computed(() => {
  return `${((currentQuestionIndex.value + 1) / questions.value.length) * 100}%`;
});

const correctCount = computed(() => {
  return userAnswers.value.filter((answer, index) => 
    answer === questions.value[index]?.correctAnswer
  ).length;
});

const wrongCount = computed(() => {
  return userAnswers.value.filter((answer, index) => 
    answer !== null && answer !== questions.value[index]?.correctAnswer
  ).length;
});

const finalScore = computed(() => {
  // 每答对1题获得10积分，加上每日额外奖励5积分
  const baseScore = correctCount.value * 10;
  return baseScore + dailyBonus.value;
});

const accuracy = computed(() => {
  return Math.round((correctCount.value / questions.value.length) * 100);
});

const scoreRate = computed(() => {
  return Math.round((finalScore.value / (questions.value.length * 10)) * 100);
});

const ranking = ref(null);

// 初始化
onMounted(async () => {
  // 检查每日答题限制
  const canAnswer = await checkAnswerLimit();
  if (!canAnswer) {
    let limitText = '';
    if (quizType.value === 'general') {
      limitText = '综合题库每日限答2次';
    } else {
      limitText = '每个专题每日限答1次';
    }
    alert(`今日答题次数已用完！${limitText}。`);
    goBack();
    return;
  }
  
  // 检查每日额外奖励
  await checkDailyBonusPoints();
  
  loadQuestions();
});

onBeforeUnmount(() => {
  stopTimer();
});

// 监听题目加载完成
watch(questionsLoaded, (newValue) => {
  if (newValue && questions.value.length > 0) {
    // 题目加载完成后开始第一题计时
    startQuestionTimer();
  }
});

// 加载题目
const loadQuestions = async () => {
  try {
    const countMap = {
      springFestival: 10,
      opera: 15,
      paperCut: 12,
      shadowPlay: 18,
      general: 20,
      daily: 5
    };
    const count = countMap[quizType.value] || 10;
    
    const response = await getRandomQuestions(quizType.value, count);
    
    // 检查后端返回的success字段
    if (response.data.success === false) {
      console.warn('题库为空:', response.data.message);
      alert(response.data.message + '，请返回选择其他分类或稍后再试');
      goBack();
      return;
    }
    
    questions.value = response.data.data || [];
    questionsLoaded.value = true;
    
    // 额外检查题目列表是否为空
    if (questions.value.length === 0) {
      console.warn('题目列表为空');
      return;
    }
    
    userAnswers.value = new Array(questions.value.length).fill(null);
  } catch (error) {
    console.error('加载题目失败:', error);
    alert('加载题目失败，请稍后重试');
    goBack();
  }
};

// 开始当前题目的计时器
const startQuestionTimer = () => {
  // 停止之前的计时器
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
  
  // 重置当前题目的剩余时间
  questionRemainingTime.value = 30;
  
  // 开始计时
  timerInterval.value = setInterval(() => {
    if (questionRemainingTime.value > 0) {
      questionRemainingTime.value--;
      totalTimeSpent.value++;
    } else {
      // 超时，自动标记为答错并进入下一题
      handleQuestionTimeout();
    }
  }, 1000);
};

// 停止计时器
const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
};

// 处理题目超时
const handleQuestionTimeout = () => {
  // 超时视为答错，记录空答案
  userAnswers.value[currentQuestionIndex.value] = null;
  
  // 显示提示
  alert(`时间到！第${currentQuestionIndex.value + 1}题未在30秒内完成，视为答错。`);
  
  // 进入下一题
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
    startQuestionTimer();
  } else {
    // 最后一题超时，直接提交
    submitAnswer();
  }
};

// 格式化时间
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// 检查今日是否已答题
const checkAnswerLimit = async () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return true;
    
    const response = await checkDailyAnswerLimit(currentUser.id, quizType.value);
    const limitData = response.data.data;
    
    // 根据后端返回的答题次数信息判断是否允许答题
    if (limitData) {
      // 如果已达到限制次数，显示具体的限制信息
      if (!limitData.canAnswer) {
        let limitText = '';
        if (limitData.remainingAttempts === 0) {
          if (quizType.value === 'general') {
            limitText = `综合题库每日限答${limitData.dailyLimit}次，今日已用完`;
          } else {
            limitText = `该专题每日限答${limitData.dailyLimit}次，今日已用完`;
          }
        } else {
          limitText = `今日剩余答题次数：${limitData.remainingAttempts}次`;
        }
        
        // 存储限制信息，用于在界面上显示
        limitInfo.value = limitText;
        return limitData.canAnswer;
      }
    }
    
    return true;
  } catch (error) {
    console.error('检查每日答题限制失败:', error);
    return true; // 出错时允许答题
  }
};

// 检查并设置每日额外奖励
const checkDailyBonusPoints = async () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const response = await checkDailyBonus(currentUser.id);
    
    if (response.data.data?.canGetBonus) {
      dailyBonus.value = 5; // 每日额外奖励5积分
    }
  } catch (error) {
    console.error('检查每日额外奖励失败:', error);
  }
};

// 选择选项
const selectOption = async (optionId) => {
  if (!showResult.value) {
    // 直接修改数组，无需创建新数组
    userAnswers.value[currentQuestionIndex.value] = optionId;
    
    const currentQ = questions.value[currentQuestionIndex.value];
    if (!currentQ) return;

    try {
      const response = await validateAnswer(currentQ.id, optionId);
      const resData = response.data;
      console.log('答案验证结果:', resData);
      
      if (resData.success) {
        // 联动更新 errorCount
        if (!resData.isCorrect) {
          errorCount.value++;
        }
        // 可选：即时提示用户对错（提升体验）
        // ElMessage({
        //   type: resData.isCorrect ? 'success' : 'error',
        //   message: resData.isCorrect ? '回答正确！' : `回答错误，正确答案是${resData.correctAnswer}`
        // });
      } else {
        console.warn('答案验证失败:', resData.message);
        alert(resData.message);
      }
    } catch (error) {
      console.error('API调用失败:', error);
      alert('网络错误，请稍后重试');
    }
  }
};
// 上一题
const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    stopTimer();
    currentQuestionIndex.value--;
    startQuestionTimer();
  }
};

// 下一题
const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    stopTimer();
    currentQuestionIndex.value++;
    startQuestionTimer();
  } else {
    // 最后一题，查看结果：新增停止计时器
    showResult.value = true;
    stopTimer(); // 补充这一行
  }
};
// 跳转到指定题目
const goToQuestion = (index) => {
  // 修正：showResult 是ref，需要加.value
  if (!showResult.value) {
    stopTimer();
    currentQuestionIndex.value = index;
    startQuestionTimer();
  }
};

// 提交答案
const submitAnswer = async () => {
  showResult.value = true;
  stopTimer();
  
  // 检查用户是否已登录
  const currentUser = getCurrentUser();
  if (!currentUser) {
    alert('请先登录再提交答题记录！');
    router.push('/login');
    return;
  }
  
  try {
    // 计算基础得分（每题10分）
    const baseScore = questions.value.reduce((sum, question, index) => {
      const userAnswer = userAnswers.value[index];
      if (userAnswer === question.correctAnswer) {
        return sum + (question.score || 10);
      }
      return sum;
    }, 0);
    
    // 计算总得分（基础得分 + 每日额外奖励）
    const calculatedScore = baseScore + dailyBonus.value;
    
    const calculatedCorrectCount = questions.value.filter((question, index) => {
      return userAnswers.value[index] === question.correctAnswer;
    }).length;
    
    const calculatedWrongCount = questions.value.filter((question, index) => {
      return userAnswers.value[index] !== null && userAnswers.value[index] !== question.correctAnswer;
    }).length;
    
    const calculatedErrorCount = questions.value.length - calculatedCorrectCount;
    
    // 准备答题记录数据
    const answerDetails = questions.value.map((question, index) => ({
      questionId: question.id,
      questionContent: question.content,
      questionType: question.type || 1,
      userAnswer: userAnswers.value[index] || '',
      correctAnswer: question.correctAnswer,
      isCorrect: userAnswers.value[index] === question.correctAnswer,
      score: userAnswers.value[index] === question.correctAnswer ? (question.score || 10) : 0
    }));
    
    const recordData = {
      userId: currentUser ? currentUser.id : 0, // 从登录信息中获取userId
      type: quizType.value || 'general',
      score: calculatedScore,
      baseScore: baseScore,
      dailyBonus: dailyBonus.value,
      totalScore: questions.value.reduce((sum, q) => sum + (q.score || 10), 0) + 5, // 加上可能的每日奖励
      duration: totalTimeSpent.value,
      correctCount: calculatedCorrectCount,
      errorCount: calculatedErrorCount,
      answerDetails: answerDetails
    };
    
    // 保存答题记录
    const response = await createAnswerRecord(recordData);
    console.log('答题记录保存成功:', response);
    
    // 显示结果弹窗
    setTimeout(() => {
      showResultModal.value = true;
    }, 500);
  } catch (error) {
    console.error('保存答题记录失败:', error);
    alert('保存答题记录失败，请稍后重试');
  }
};

// 获取题目类型名称
const getQuestionTypeName = (type) => {
  const typeMap = {
    1: '单选题',
    2: '多选题',
    3: '判断题',
    4: '填空题',
    5: '简答题'
  };
  return typeMap[type] || '未知题型';
};

// 获取结果文本
const getResultText = () => {
  // 补充可选链，避免currentQuestion为null时报错
  if (currentQuestion.value && userAnswers.value[currentQuestionIndex.value]) {
    if (userAnswers.value[currentQuestionIndex.value] === currentQuestion.value.correctAnswer) {
      return '回答正确！';
    } else {
      return `回答错误，正确答案是：${currentQuestion.value.correctAnswer}`;
    }
  }
  return '';
};

// 关闭结果弹窗
const closeResultModal = () => {
  showResultModal.value = false;
};

// 查看历史答题记录
const viewHistoryRecords = () => {
  // 检查用户是否已登录
  const currentUser = getCurrentUser();
  if (!currentUser) {
    alert('请先登录再查看历史记录！');
    router.push('/login');
    return;
  }
  
  closeResultModal();
  router.push('/profile?tab=answer');
};

// 查看答案解析
// 1. 新增详情弹窗控制变量
const showDetailModal = ref(false);

// 2. 完善查看详情方法
const reviewAnswers = () => {
  showResultModal.value = false;
  showDetailModal.value = true; // 打开详情弹窗
  currentQuestionIndex.value = 0; // 从第一题开始查看
};

// 3. 新增关闭详情弹窗方法
const closeDetailModal = () => {
  showDetailModal.value = false;
};

// 4. 新增详情页上下题切换方法（按需补充）
const prevDetailQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

const nextDetailQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
  }
};
// 重新答题
const startAgain = async () => {
  // 检查是否还有答题次数
  const canAnswer = await checkAnswerLimit();
  if (!canAnswer) {
    alert(`今日答题次数已用完！${limitInfo.value}`);
    return;
  }
  
  // 重置所有响应式变量
  currentQuestionIndex.value = 0;
  userAnswers.value = new Array(questions.value.length).fill(null);
  showResult.value = false;
  showResultModal.value = false;
  errorCount.value = 0;
  questionRemainingTime.value = 30; // 重置单题时间
  totalTimeSpent.value = 0; // 重置总时间
  startQuestionTimer(); // 重新开始计时
};
// 退出答题
const exitToEntry = () => {
  router.push('/answer');
};

// 返回上一页
const goBack = () => {
  if (confirm('确定要退出答题吗？当前进度将不会保存。')) {
    router.push('/answer');
  }
};
</script>

<style scoped>
.answer-doing-container {
  min-height: 100vh;
  background-color: #f8f5f0;
  font-family: 'Microsoft YaHei', sans-serif;
}

/* 顶部信息 */
.doing-header {
  background-color: #c8102e;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* 答题次数限制信息 */
.limit-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.limit-icon {
  font-size: 1.2rem;
}

.limit-text {
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* 答题次数限制信息 */
.limit-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.limit-icon {
  font-size: 1.2rem;
}

.limit-text {
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* 答题次数限制信息 */
.limit-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.limit-icon {
  font-size: 1.2rem;
}

.limit-text {
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* 答题次数限制信息 */
.limit-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.limit-icon {
  font-size: 1.2rem;
}

.limit-text {
  font-weight: 500;
}

.header-left {
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
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.quiz-title {
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
}

.timer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.timer.warning {
  color: #ffeb3b;
}

.timer.danger {
  color: #ff5252;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* 进度条 */
.progress-section {
  background-color: white;
  padding: 1rem 2rem;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
}

.progress-bar {
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #c8102e;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.3s ease;
}

.progress-text {
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.question-status {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.question-dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.question-dot.active {
  background-color: #c8102e;
  color: white;
}

.question-dot.answered {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.question-dot.correct {
  background-color: #a5d6a7;
  color: #1b5e20;
}

.question-dot.wrong {
  background-color: #ef9a9a;
  color: #b71c1c;
}

.question-dot:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 题目内容 */
.question-section {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 2rem;
}

.question-container {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
}

.question-type {
  display: inline-block;
  background-color: #c8102e;
  color: white;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.question-text {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 1.2rem 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #fafafa;
}

.option-item:hover:not(:disabled) {
  border-color: #c8102e;
  background-color: #fff3f4;
  transform: translateX(5px);
}

.option-item.selected {
  border-color: #c8102e;
  background-color: #fff3f4;
}

.option-item.correct {
  border-color: #4caf50;
  background-color: #e8f5e9;
}

.option-item.wrong {
  border-color: #f44336;
  background-color: #ffebee;
}

.option-letter {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #c8102e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
  flex-shrink: 0;
}

.option-text {
  font-size: 1.1rem;
  color: #333;
  flex: 1;
}

.option-result {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
}

.result-correct {
  color: #4caf50;
}

.result-wrong {
  color: #f44336;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  background-color: white;
  border-radius: 12px;
}

.empty-questions-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  background-color: white;
  border-radius: 12px;
  text-align: center;
}

.empty-questions-container .empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #c8102e;
}

.empty-questions-container .empty-text {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.empty-questions-container .back-btn {
  padding: 0.8rem 2rem;
  background-color: #c8102e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.empty-questions-container .back-btn:hover {
  background-color: #a80c24;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #c8102e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 操作按钮 */
.action-section {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.prev-btn, .next-btn, .submit-btn {
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.prev-btn, .next-btn {
  background-color: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
}

.prev-btn:hover:not(:disabled), .next-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
  color: #333;
}

.submit-btn {
  background-color: #c8102e;
  color: white;
  border: none;
}

.submit-btn:hover {
  background-color: #a80c24;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(200, 16, 46, 0.2);
}

.prev-btn:disabled, .next-btn:disabled, .submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-center {
  flex: 1;
  text-align: center;
}

.result-info {
  font-size: 1.2rem;
  font-weight: bold;
  color: #c8102e;
}

/* 结果弹窗 */
.result-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.result-content {
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid #eee;
  background-color: #c8102e;
  color: white;
  border-radius: 16px 16px 0 0;
}

.result-title {
  font-size: 1.8rem;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.result-body {
  padding: 2rem;
}

.score-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 2rem;
}

.score-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c8102e, #ff5252);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 25px rgba(200, 16, 46, 0.3);
}

.score-number {
  font-size: 3rem;
  font-weight: bold;
}

.score-label {
  font-size: 1.2rem;
  margin-top: -0.5rem;
}

.score-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.score-info p {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
  font-weight: 500;
}

.result-stats {
  display: flex;
  justify-content: space-around;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.stat-value {
  display: block;
  font-size: 1.4rem;
  font-weight: bold;
  color: #c8102e;
}

.result-footer {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  border-top: 1px solid #eee;
}

.review-btn, .record-btn, .again-btn, .exit-btn, .share-btn, .finish-btn {
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.review-btn {
  background-color: #c8102e;
  color: white;
}

.review-btn:hover {
  background-color: #a80c24;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(200, 16, 46, 0.2);
}

.record-btn {
  background-color: #4caf50;
  color: white;
}

.record-btn:hover {
  background-color: #3d8b40;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

.again-btn {
  background-color: #ff8f00;
  color: white;
}

.again-btn:hover {
  background-color: #ff6f00;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 143, 0, 0.2);
}

.exit-btn {
  background-color: #666;
  color: white;
}

.exit-btn:hover {
  background-color: #444;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 102, 102, 0.2);
}

/* 详情模态框 */

.detail-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.detail-content {
  position: relative;
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 1rem;
}

.detail-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.detail-progress {
  flex: 1;
  text-align: center;
}

.detail-progress-text {
  font-size: 1rem;
  color: #666;
}

.detail-close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.detail-close-btn:hover {
  background-color: #f5f5f5;
  color: #333;
}

.detail-body {
  margin-bottom: 2rem;
}

.detail-question-section {
  margin-bottom: 1.5rem;
}

.detail-question-type {
  display: inline-block;
  background-color: #f0f0f0;
  color: #666;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.detail-question-text {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
}

.detail-options-section {
  margin-bottom: 1.5rem;
}

.detail-option-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  transition: all 0.3s;
}

.detail-option-item:hover {
  border-color: #d0d0d0;
}

.detail-option-item.selected {
  border-color: #c8102e;
  background-color: rgba(200, 16, 46, 0.05);
}

.detail-option-item.correct {
  border-color: #4caf50;
  background-color: rgba(76, 175, 80, 0.05);
}

.detail-option-item.wrong {
  border-color: #f44336;
  background-color: rgba(244, 67, 54, 0.05);
}

.detail-option-letter {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f0f0f0;
  color: #666;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 1rem;
}

.detail-option-item.correct .detail-option-letter {
  background-color: #4caf50;
  color: white;
}

.detail-option-item.wrong .detail-option-letter {
  background-color: #f44336;
  color: white;
}

.detail-option-text {
  flex: 1;
  font-size: 1rem;
  color: #333;
}

.detail-option-result {
  width: 30px;
  text-align: center;
}

.detail-result-correct {
  color: #4caf50;
  font-weight: bold;
  font-size: 1.2rem;
}

.detail-result-wrong {
  color: #f44336;
  font-weight: bold;
  font-size: 1.2rem;
}

.detail-result-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.detail-result-item {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.detail-result-label {
  font-weight: bold;
  color: #666;
  margin-right: 1rem;
  min-width: 80px;
}

.detail-result-value {
  font-size: 1rem;
  color: #333;
}

.detail-explain-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f0f8ff;
  border-radius: 8px;
  border-left: 4px solid #1e90ff;
}

.detail-explain-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #1e90ff;
  margin: 0 0 0.75rem 0;
}

.detail-explain-content {
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.detail-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.detail-nav-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: #f5f5f5;
  color: #333;
}

.detail-nav-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.detail-nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.detail-action-center {
  display: flex;
  justify-content: center;
  flex: 1;
}

.detail-finish-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: #c8102e;
  color: white;
}

.detail-finish-btn:hover {
  background-color: #a80d26;
}

/* 详情模态框 */


.detail-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.detail-content {
  position: relative;
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 1rem;
}

.detail-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.detail-progress {
  flex: 1;
  text-align: center;
}

.detail-progress-text {
  font-size: 1rem;
  color: #666;
}

.detail-close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.detail-close-btn:hover {
  background-color: #f5f5f5;
  color: #333;
}

.detail-body {
  margin-bottom: 2rem;
}

.detail-question-section {
  margin-bottom: 1.5rem;
}

.detail-question-type {
  display: inline-block;
  background-color: #f0f0f0;
  color: #666;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.detail-question-text {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
}

.detail-options-section {
  margin-bottom: 1.5rem;
}

.detail-option-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  transition: all 0.3s;
}

.detail-option-item:hover {
  border-color: #d0d0d0;
}

.detail-option-item.selected {
  border-color: #c8102e;
  background-color: rgba(200, 16, 46, 0.05);
}

.detail-option-item.correct {
  border-color: #4caf50;
  background-color: rgba(76, 175, 80, 0.05);
}

.detail-option-item.wrong {
  border-color: #f44336;
  background-color: rgba(244, 67, 54, 0.05);
}

.detail-option-letter {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f0f0f0;
  color: #666;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 1rem;
}

.detail-option-item.correct .detail-option-letter {
  background-color: #4caf50;
  color: white;
}

.detail-option-item.wrong .detail-option-letter {
  background-color: #f44336;
  color: white;
}

.detail-option-text {
  flex: 1;
  font-size: 1rem;
  color: #333;
}

.detail-option-result {
  width: 30px;
  text-align: center;
}

.detail-result-correct {
  color: #4caf50;
  font-weight: bold;
  font-size: 1.2rem;
}

.detail-result-wrong {
  color: #f44336;
  font-weight: bold;
  font-size: 1.2rem;
}

.detail-result-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.detail-result-item {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.detail-result-label {
  font-weight: bold;
  color: #666;
  margin-right: 1rem;
  min-width: 80px;
}

.detail-result-value {
  font-size: 1rem;
  color: #333;
}

.detail-explain-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f0f8ff;
  border-radius: 8px;
  border-left: 4px solid #1e90ff;
}

.detail-explain-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #1e90ff;
  margin: 0 0 0.75rem 0;
}

.detail-explain-content {
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.detail-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.detail-nav-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: #f5f5f5;
  color: #333;
}

.detail-nav-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.detail-nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.detail-action-center {
  display: flex;
  justify-content: center;
  flex: 1;
}

.detail-finish-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: #c8102e;
  color: white;
}

.detail-finish-btn:hover {
  background-color: #a80d26;
}

/* 详情模态框 */


.detail-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.detail-content {
  position: relative;
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 1rem;
}

.detail-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.detail-progress {
  flex: 1;
  text-align: center;
}

.detail-progress-text {
  font-size: 1rem;
  color: #666;
}

.detail-close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.detail-close-btn:hover {
  background-color: #f5f5f5;
  color: #333;
}

.detail-body {
  margin-bottom: 2rem;
}

.detail-question-section {
  margin-bottom: 1.5rem;
}

.detail-question-type {
  display: inline-block;
  background-color: #f0f0f0;
  color: #666;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.detail-question-text {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
}

.detail-options-section {
  margin-bottom: 1.5rem;
}

.detail-option-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  transition: all 0.3s;
}

.detail-option-item:hover {
  border-color: #d0d0d0;
}

.detail-option-item.selected {
  border-color: #c8102e;
  background-color: rgba(200, 16, 46, 0.05);
}

.detail-option-item.correct {
  border-color: #4caf50;
  background-color: rgba(76, 175, 80, 0.05);
}

.detail-option-item.wrong {
  border-color: #f44336;
  background-color: rgba(244, 67, 54, 0.05);
}

.detail-option-letter {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f0f0f0;
  color: #666;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 1rem;
}

.detail-option-item.correct .detail-option-letter {
  background-color: #4caf50;
  color: white;
}

.detail-option-item.wrong .detail-option-letter {
  background-color: #f44336;
  color: white;
}

.detail-option-text {
  flex: 1;
  font-size: 1rem;
  color: #333;
}

.detail-option-result {
  width: 30px;
  text-align: center;
}

.detail-result-correct {
  color: #4caf50;
  font-weight: bold;
  font-size: 1.2rem;
}

.detail-result-wrong {
  color: #f44336;
  font-weight: bold;
  font-size: 1.2rem;
}

.detail-result-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.detail-result-item {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.detail-result-label {
  font-weight: bold;
  color: #666;
  margin-right: 1rem;
  min-width: 80px;
}

.detail-result-value {
  font-size: 1rem;
  color: #333;
}

.detail-explain-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f0f8ff;
  border-radius: 8px;
  border-left: 4px solid #1e90ff;
}

.detail-explain-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #1e90ff;
  margin: 0 0 0.75rem 0;
}

.detail-explain-content {
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.detail-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.detail-nav-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: #f5f5f5;
  color: #333;
}

.detail-nav-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.detail-nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.detail-action-center {
  display: flex;
  justify-content: center;
  flex: 1;
}

.detail-finish-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: #c8102e;
  color: white;
}

.detail-finish-btn:hover {
  background-color: #a80d26;
}

/* 详情模态框 */
.detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.detail-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.detail-content {
  position: relative;
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 1rem;
}

.detail-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.detail-progress {
  flex: 1;
  text-align: center;
}

.detail-progress-text {
  font-size: 1rem;
  color: #666;
}

.detail-close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.detail-close-btn:hover {
  background-color: #f5f5f5;
  color: #333;
}

.detail-body {
  margin-bottom: 2rem;
}

.detail-question-section {
  margin-bottom: 1.5rem;
}

.detail-question-type {
  display: inline-block;
  background-color: #f0f0f0;
  color: #666;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.detail-question-text {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
}

.detail-options-section {
  margin-bottom: 1.5rem;
}

.detail-option-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  transition: all 0.3s;
}

.detail-option-item:hover {
  border-color: #d0d0d0;
}

.detail-option-item.selected {
  border-color: #c8102e;
  background-color: rgba(200, 16, 46, 0.05);
}

.detail-option-item.correct {
  border-color: #4caf50;
  background-color: rgba(76, 175, 80, 0.05);
}

.detail-option-item.wrong {
  border-color: #f44336;
  background-color: rgba(244, 67, 54, 0.05);
}

.detail-option-letter {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f0f0f0;
  color: #666;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 1rem;
}

.detail-option-item.correct .detail-option-letter {
  background-color: #4caf50;
  color: white;
}

.detail-option-item.wrong .detail-option-letter {
  background-color: #f44336;
  color: white;
}

.detail-option-text {
  flex: 1;
  font-size: 1rem;
  color: #333;
}

.detail-option-result {
  width: 30px;
  text-align: center;
}

.detail-result-correct {
  color: #4caf50;
  font-weight: bold;
  font-size: 1.2rem;
}

.detail-result-wrong {
  color: #f44336;
  font-weight: bold;
  font-size: 1.2rem;
}

.detail-result-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.detail-result-item {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.detail-result-label {
  font-weight: bold;
  color: #666;
  margin-right: 1rem;
  min-width: 80px;
}

.detail-result-value {
  font-size: 1rem;
  color: #333;
}

.detail-explain-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f0f8ff;
  border-radius: 8px;
  border-left: 4px solid #1e90ff;
}

.detail-explain-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #1e90ff;
  margin: 0 0 0.75rem 0;
}

.detail-explain-content {
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.detail-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.detail-nav-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: #f5f5f5;
  color: #333;
}

.detail-nav-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.detail-nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.detail-action-center {
  display: flex;
  justify-content: center;
  flex: 1;
}

.detail-finish-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: #c8102e;
  color: white;
}

.detail-finish-btn:hover {
  background-color: #a80d26;
}

/* 空题库提示样式 */
.empty-library-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.empty-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}

.empty-message {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 500px;
}

.back-to-select-btn {
  padding: 0.8rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  background-color: #c8102e;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-to-select-btn:hover {
  background-color: #a80c24;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(200, 16, 46, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .doing-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .progress-section {
    padding: 1rem;
  }
  
  .question-section {
    padding: 0 1rem;
  }
  
  .question-container {
    padding: 1.5rem;
  }
  
  .question-text {
    font-size: 1.2rem;
  }
  
  .action-section {
    padding: 0 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .score-display {
    flex-direction: column;
    gap: 2rem;
  }
  
  .result-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .result-footer {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .question-type {
    font-size: 0.8rem;
  }
  
  .question-text {
    font-size: 1.1rem;
  }
  
  .option-item {
    padding: 1rem;
  }
  
  .option-text {
    font-size: 1rem;
  }
  
  .score-circle {
    width: 120px;
    height: 120px;
  }
  
  .score-number {
    font-size: 2.5rem;
  }
}
</style>