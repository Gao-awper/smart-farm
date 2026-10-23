<template>
  <div class="answer-container">
    <!-- 选项卡切换 -->
    <div class="tab-nav">
      <button class="back-btn" @click="goBack">← 返回首页</button>
      <div class="tab-container">
        <button 
          class="tab-item" 
          :class="{active: activeTab === 'entry'}"
          @click="switchTab('entry')"
        >
          答题入口
        </button>
        <button 
          class="tab-item" 
          :class="{active: activeTab === 'record'}"
          @click="switchTab('record')"
        >
          答题记录
        </button>
        <button 
          class="tab-item" 
          :class="{active: activeTab === 'ranking'}"
          @click="switchTab('ranking')"
        >
          答题榜单
        </button>
      </div>
    </div>

    <!-- 答题入口面板 -->
    <div class="tab-content" v-show="activeTab === 'entry'">
      <div class="entry-container">
        <!-- 答题分类卡片 -->
        <div class="category-grid">
          <div class="category-card" @click="startAnswer('springFestival')">
            <div class="category-icon">🧧</div>
            <div class="category-title">春节专题</div>
            <div class="category-desc">10道题 | 了解春节传统习俗</div>
            <div class="difficulty easy">简单</div>
          </div>

          <div class="category-card" @click="startAnswer('opera')">
            <div class="category-icon">🎭</div>
            <div class="category-title">戏曲专题</div>
            <div class="category-desc">15道题 | 领略国粹京剧魅力</div>
            <div class="difficulty medium">中等</div>
          </div>

          <div class="category-card" @click="startAnswer('paperCut')">
            <div class="category-icon">✂️</div>
            <div class="category-title">剪纸专题</div>
            <div class="category-desc">12道题 | 探索民间剪纸艺术</div>
            <div class="difficulty medium">中等</div>
          </div>

          <div class="category-card" @click="startAnswer('shadowPlay')">
            <div class="category-icon">🎬</div>
            <div class="category-title">皮影戏专题</div>
            <div class="category-desc">18道题 | 解密农场种植技术</div>
            <div class="difficulty hard">困难</div>
          </div>

          <div class="category-card" @click="startAnswer('general')">
            <div class="category-icon">📚</div>
            <div class="category-title">综合题库</div>
            <div class="category-desc">20道题 | 全面了解农场管理</div>
            <div class="difficulty medium">中等</div>
          </div>

          <div class="category-card" @click="startAnswer('daily')">
            <div class="category-icon">🌞</div>
            <div class="category-title">每日答题</div>
            <div class="category-desc">5道题 | 每日打卡赢积分</div>
            <div class="difficulty easy">简单</div>
          </div>
        </div>

        <!-- 答题规则说明 -->
        <div class="rules-section">
          <h3 class="rules-title">📖 答题规则</h3>
          <ul class="rules-list">
            <li>每答对1题获得10积分，每日答题额外奖励5积分</li>
            <li>答题时间限制：单题答题时间30秒，超时视为答错</li>
            <li>每个专题每日限答1次，综合题库每日限答2次</li>
            <li>积分可兑换农场产品，榜单每月清零重新排名</li>
            <li>答题记录可在「答题记录」中查看，榜单实时更新</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 答题记录面板 -->
    <div class="tab-content" v-show="activeTab === 'record'">
      <div class="record-container">
        <!-- 无记录提示 -->
        <div class="empty-record" v-if="answerRecords.length === 0">
          <div class="empty-icon">📝</div>
          <p>暂无答题记录，快去答题吧！</p>
          <button class="go-answer-btn" @click="switchTab('entry')">立即答题</button>
        </div>

        <!-- 答题记录列表 -->
        <div class="record-list" v-else>
          <div class="record-item" v-for="(record, index) in answerRecords" :key="record.id || index">
            <div class="record-left">
              <div class="record-category">{{ getCategoryName(record.type) }}</div>
              <div class="record-time">{{ formatTime(record.answerTime) }}</div>
            </div>
            <div class="record-middle">
              <div class="score-info">
                <span class="score-label">得分：</span>
                <span class="score-value">{{ record.score }}</span>
                <span class="total-score">/{{ record.totalScore }}</span>
              </div>
              <div class="accuracy">正确率：{{ calculateAccuracy(record) }}%</div>
            </div>
            <div class="record-right">
              <button class="review-btn" @click="reviewRecord(record)">查看详情</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 答题榜单面板 -->
    <div class="tab-content" v-show="activeTab === 'ranking'">
      <div class="ranking-container">
        <!-- 榜单筛选 -->
        <div class="ranking-filter">
          <button 
            class="filter-btn" 
            :class="{active: activeRanking === 'daily'}"
            @click="switchRanking('daily')"
          >
            日榜
          </button>
          <button 
            class="filter-btn" 
            :class="{active: activeRanking === 'weekly'}"
            @click="switchRanking('weekly')"
          >
            周榜
          </button>
          <button 
            class="filter-btn" 
            :class="{active: activeRanking === 'monthly'}"
            @click="switchRanking('monthly')"
          >
            月榜
          </button>
        </div>
		
		 <div class="subject-filter">
		      <span class="filter-label">答题专题：</span>
		      <button 
		        class="subject-btn" 
		        :class="{active: activeSubject === 'all'}"
		        @click="switchSubject('all')"
		      >
		        全部
		      </button>
		      <button 
		        class="subject-btn" 
		        :class="{active: activeSubject === 'springFestival'}"
		        @click="switchSubject('springFestival')"
		      >
		        春节专题
		      </button>
		      <button 
		        class="subject-btn" 
		        :class="{active: activeSubject === 'opera'}"
		        @click="switchSubject('opera')"
		      >
		        戏曲专题
		      </button>
		      <button 
		        class="subject-btn" 
		        :class="{active: activeSubject === 'paperCut'}"
		        @click="switchSubject('paperCut')"
		      >
		        剪纸专题
		      </button>
		      <button 
		        class="subject-btn" 
		        :class="{active: activeSubject === 'shadowPlay'}"
		        @click="switchSubject('shadowPlay')"
		      >
		        皮影戏专题
		      </button>
		      <button 
		        class="subject-btn" 
		        :class="{active: activeSubject === 'general'}"
		        @click="switchSubject('general')"
		      >
		        综合题库
		      </button>
		      <button 
		        class="subject-btn" 
		        :class="{active: activeSubject === 'daily'}"
		        @click="switchSubject('daily')"
		      >
		        每日答题
		      </button>
		    </div>

        <!-- 榜单列表 -->
        <div class="ranking-list">
          <!-- 前三名特殊样式 -->
          <div class="ranking-item top-item first" v-if="rankingList[0]">
            <div class="rank-number">🥇</div>
            <div class="user-info">
              <img :src="rankingList[0].avatar" alt="头像" class="user-avatar">
              <div class="user-name">{{ rankingList[0].name }}</div>
            </div>
            <div class="user-score">{{ rankingList[0].totalScore }} 积分</div>
          </div>

          <div class="ranking-item top-item second" v-if="rankingList[1]">
            <div class="rank-number">🥈</div>
            <div class="user-info">
              <img :src="rankingList[1].avatar" alt="头像" class="user-avatar">
              <div class="user-name">{{ rankingList[1].name }}</div>
            </div>
            <div class="user-score">{{ rankingList[1].totalScore }} 积分</div>
          </div>

          <div class="ranking-item top-item third" v-if="rankingList[2]">
            <div class="rank-number">🥉</div>
            <div class="user-info">
              <img :src="rankingList[2].avatar" alt="头像" class="user-avatar">
              <div class="user-name">{{ rankingList[2].name }}</div>
            </div>
            <div class="user-score">{{ rankingList[2].totalScore }} 积分</div>
          </div>

          <!-- 其他排名 -->
          <div 
            class="ranking-item normal-item" 
            v-for="(item, index) in rankingList.slice(3)" 
            :key="index"
          >
            <div class="rank-number">{{ index + 4 }}</div>
            <div class="user-info">
              <img :src="item.avatar" alt="头像" class="user-avatar">
              <div class="user-name">{{ item.name }}</div>
            </div>
            <div class="user-score">{{ item.totalScore }} 积分</div>
          </div>

          <!-- 无榜单数据 -->
          <div class="empty-ranking" v-if="rankingList.length === 0">
            <div class="empty-icon">🏆</div>
            <p>暂无榜单数据，快来成为第一个答题的人吧！</p>
          </div>
        </div>

        <!-- 我的排名：仅保留一份，使用优化后的判断逻辑 -->
        <div class="my-ranking" v-if="currentUser">
          <h3 class="my-ranking-title">我的排名</h3>
          <div class="my-ranking-item">
            <!-- 严谨判断：排名为有效数字（大于0）才显示，否则显示「未上榜」 -->
            <div class="rank-number">
              {{ typeof myRanking.rank === 'number' && myRanking.rank > 0 ? myRanking.rank : '未上榜' }}
            </div>
            <div class="user-info">
              <img :src="myRanking.avatar" alt="我的头像" class="user-avatar">
              <div class="user-name">{{ myRanking.name }}</div>
            </div>
            <div class="user-score">{{ myRanking.score || 0 }} 积分</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getUserAnswerRecords, getAnswerRanking, getUserAnswerRanking } from '@/api/answerApi';
import { getCurrentUser } from '@/utils/auth';

const router = useRouter();
// 选项卡状态（原有）
const activeTab = ref('entry');
// 榜单时间筛选状态（原有）
const activeRanking = ref('daily');
// 新增：专题筛选状态（默认全部）
const activeSubject = ref('all');

// 答题记录数据（原有）
const answerRecords = ref([]);
const loadingRecords = ref(false);

// 榜单数据（原有）
const rankingList = ref([]);
const loadingRanking = ref(false);
const currentUser = ref(getCurrentUser());
// 我的排名（原有）
const myRanking = ref({
  rank: null,
  name: '当前用户',
  avatar: currentUser.value?.avatar || 'https://picsum.photos/id/80/60/60',
  score: 0
});

// 切换选项卡（原有）
const switchTab = (tab) => {
  activeTab.value = tab;
  currentUser.value = getCurrentUser();
  if (tab === 'record') {
    loadAnswerRecords();
  } else if (tab === 'ranking') {
    loadRanking();
  }
};

// 切换榜单时间类型（原有）
const switchRanking = (type) => {
  activeRanking.value = type;
  loadRanking(); // 切换时间后重新加载榜单
};

// 新增：切换专题类型
const switchSubject = (subject) => {
  activeSubject.value = subject;
  loadRanking(); // 切换专题后重新加载榜单
};

// 返回首页（原有）
const goBack = () => {
  router.push('/');
};

// 开始答题（原有）
const startAnswer = (type) => {
  router.push({
    path: '/answer/doing',
    query: { type }
  });
};

// 获取分类名称（原有）
const getCategoryName = (type) => {
  const nameMap = {
    springFestival: '春节专题',
    opera: '戏曲专题',
    paperCut: '剪纸专题',
    shadowPlay: '皮影戏专题',
    general: '综合题库',
    daily: '每日答题'
  };
  return nameMap[type] || '答题';
};

// 格式化时间（原有）
const formatTime = (timeString) => {
  if (!timeString) return '';
  const date = new Date(timeString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 计算正确率（原有）
const calculateAccuracy = (record) => {
  if (!record || record.totalScore === 0) return 0;
  return Math.round((record.score / record.totalScore) * 100);
};

// 加载答题记录（原有）
const loadAnswerRecords = async () => {
  loadingRecords.value = true;
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert('请先登录查看答题记录！');
      router.push('/login');
      return;
    }
    const userId = currentUser.id;
    const response = await getUserAnswerRecords(userId);
    answerRecords.value = response.data.data || [];
  } catch (error) {
    console.error('加载答题记录失败:', error);
    alert('加载答题记录失败，请稍后重试');
  } finally {
    loadingRecords.value = false;
  }
};

// 加载排行榜（改造：传递专题参数）
const loadRanking = async () => {
  loadingRanking.value = true;
  // 初始化我的排名为默认状态（避免切换筛选后残留旧数据）
  myRanking.value = {
    rank: null,
    name: currentUser.value?.nickname || '当前用户',
    avatar: currentUser.value?.avatar || 'https://picsum.photos/id/80/60/60',
    score: 0
  };
  // 确保使用当前用户的真实头像
  if (currentUser.value?.avatar) {
    myRanking.value.avatar = currentUser.value.avatar;
  }
  try {
    // 新增：根据当前专题传递参数，all 对应后端空值（查询所有专题）
    const currentAnswerType = activeSubject.value === 'all' ? '' : activeSubject.value;
    // 传递专题参数给后端
    const response = await getAnswerRanking(activeRanking.value, currentAnswerType);
    rankingList.value = response.data.data || [];
    
    // 获取我的排名（同步传递专题参数）
    if (currentUser.value) {
      const userId = currentUser.value.id;
      const myRankResponse = await getUserAnswerRanking(userId, activeRanking.value, currentAnswerType);
      // 后端返回有效数据时更新
      if (myRankResponse.data && myRankResponse.data.data) {
        const rankData = myRankResponse.data.data;
        myRanking.value = {
          ...myRanking.value, 
          rank: rankData.AnswerRecordrank !== undefined ? Number(rankData.AnswerRecordrank) : null, // 转为数字类型
          score: rankData.totalScore || 0
        };
      }
      
    }
  } catch (error) {
    console.error('加载排行榜失败:', error);
    alert('加载排行榜失败，请稍后重试');
  } finally {
    loadingRanking.value = false;
  }
};

// 查看答题记录详情（原有）
const reviewRecord = (record) => {
  console.log('查看答题记录详情:', record);
  router.push(`/answer/detail/${record.id}`);
};

// 初始化（原有）
onMounted(() => {
  // 初始化时刷新用户
  currentUser.value = getCurrentUser();
  // 确保myRanking使用当前用户的真实头像
  if (currentUser.value?.avatar) {
    myRanking.value.avatar = currentUser.value.avatar;
    myRanking.value.name = currentUser.value.nickname || '当前用户';
  }
  if (activeTab.value === 'record') {
    loadAnswerRecords();
  } else if (activeTab.value === 'ranking') {
    loadRanking();
  }
});
</script>
<style scoped>
/* 基础样式 */
.answer-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f5f0 0%, #e8e3d8 100%);
  font-family: 'SimSun', 'STSong', 'Microsoft YaHei', sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* 添加装饰性背景元素 */
.answer-container::before {
  content: '';
  position: fixed;
  top: -10%;
  right: -10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(200, 16, 46, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
}

.answer-container::after {
  content: '';
  position: fixed;
  bottom: -15%;
  left: -15%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(200, 16, 46, 0.03) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
}

/* 选项卡导航 */
.tab-nav {
  background-color: white;
  border-bottom: 1px solid #eee;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tab-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  flex: 1;
}

.tab-item {
  padding: 1rem 2rem;
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: color 0.3s;
}

.tab-item.active {
  color: #c8102e;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #c8102e;
}

.tab-item:hover {
  color: #c8102e;
}

/* 选项卡内容容器 */
.tab-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* 答题入口样式 */
.entry-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.category-card {
  background: linear-gradient(135deg, white 0%, #fafafa 100%);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08), 0 2px 5px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 1px solid rgba(200, 16, 46, 0.05);
  position: relative;
  overflow: hidden;
}

/* 卡片悬浮光效 */
.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.category-card:hover::before {
  left: 100%;
}

.category-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 30px rgba(200, 16, 46, 0.15), 0 4px 15px rgba(200, 16, 46, 0.08);
  border-color: rgba(200, 16, 46, 0.15);
}

.category-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.category-card:hover .category-icon {
  transform: scale(1.1);
}

.category-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.category-desc {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.difficulty {
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.difficulty.easy {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.difficulty.medium {
  background-color: #fff8e1;
  color: #ff8f00;
}

.difficulty.hard {
  background-color: #ffebee;
  color: #c62828;
}

.rules-section {
  background: linear-gradient(135deg, white 0%, #fafafa 100%);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08), 0 2px 5px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(200, 16, 46, 0.05);
  position: relative;
  overflow: hidden;
}

/* 规则区块装饰角 */
.rules-section::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba(200, 16, 46, 0.05) 0%, transparent 50%);
  border-radius: 0 16px 0 50px;
}

.rules-title {
  font-size: 1.2rem;
  color: #c8102e;
  margin-bottom: 1rem;
  font-weight: bold;
}

.rules-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  color: #555;
  line-height: 1.6;
}

.rules-list li {
  position: relative;
  padding-left: 1.5rem;
  transition: color 0.3s ease;
}

.rules-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  top: 0.3rem;
  color: #c8102e;
  font-weight: bold;
  font-size: 0.9rem;
  background: rgba(200, 16, 46, 0.1);
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.rules-list li:hover {
  color: #c8102e;
}

.rules-list li:hover::before {
  background: rgba(200, 16, 46, 0.2);
  transform: scale(1.1);
}

/* 答题记录样式 */
.record-container {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.empty-record {
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

.go-answer-btn {
  background-color: #c8102e;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.8rem 1.5rem;
  margin-top: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.go-answer-btn:hover {
  background-color: #a80c24;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.record-item {
  padding: 1.2rem;
  border-bottom: 1px solid rgba(200, 16, 46, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.record-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: linear-gradient(to bottom, transparent, #c8102e, transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.record-item:hover {
  background-color: rgba(200, 16, 46, 0.02);
  transform: translateX(4px);
}

.record-item:hover::before {
  opacity: 1;
}

.record-item:last-child {
  border-bottom: none;
}

.record-left {
  flex: 1;
}

.record-category {
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.3rem;
}

.record-time {
  font-size: 0.85rem;
  color: #999;
}

.record-middle {
  flex: 1;
  text-align: center;
}

.score-info {
  margin-bottom: 0.3rem;
}

.score-label {
  color: #666;
  font-size: 0.9rem;
}

.score-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #c8102e;
  margin: 0 0.2rem;
}

.total-score {
  color: #999;
  font-size: 0.9rem;
}

.accuracy {
  font-size: 0.85rem;
  color: #666;
}

.record-right {
  flex: 1;
  text-align: right;
}

.review-btn {
  background-color: #f5f5f5;
  color: #c8102e;
  border: 1px solid #c8102e;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.review-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(200, 16, 46, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.review-btn:hover::before {
  width: 300px;
  height: 300px;
}

.review-btn span {
  position: relative;
  z-index: 1;
}

.review-btn:hover {
  background-color: #c8102e;
  color: white;
}

/* 答题榜单样式 */
.ranking-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.ranking-filter {
  display: flex;
  gap: 1rem;
  background: linear-gradient(135deg, white 0%, #fafafa 100%);
  padding: 1.2rem;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08), 0 2px 5px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(200, 16, 46, 0.05);
}

.filter-btn {
  padding: 0.6rem 1.8rem;
  border-radius: 20px;
  border: none;
  background: linear-gradient(135deg, #f5f5f5 0%, #e9e9e9 100%);
  color: #666;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.filter-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.filter-btn:hover::before {
  left: 100%;
}

.filter-btn.active {
  background: linear-gradient(135deg, #c8102e 0%, #a80c24 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(200, 16, 46, 0.3);
}

.filter-btn:hover {
  background: linear-gradient(135deg, #e9e9e9 0%, #d9d9d9 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.filter-btn.active:hover {
  background: linear-gradient(135deg, #b80d27 0%, #980a1f 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(200, 16, 46, 0.4);
}

.ranking-list {
  background: linear-gradient(135deg, white 0%, #fafafa 100%);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08), 0 2px 5px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  border: 1px solid rgba(200, 16, 46, 0.05);
}

.empty-ranking {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: #999;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.ranking-item:hover {
  background-color: #f9f9f9;
}

.top-item {
  background-color: #faf0f5;
  border: 2px solid #c8102e;
}

.top-item.first {
  background: linear-gradient(135deg, #fff8e1 0%, #ffe0b2 100%);
  border: 2px solid #ffd54f;
  position: relative;
  overflow: hidden;
}

/* 冠军特殊装饰 */
.top-item.first::after {
  content: '🏆';
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 1.5rem;
  opacity: 0.8;
  transform: rotate(15deg);
}

.top-item.second {
  background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
}

.top-item.third {
  background: linear-gradient(135deg, #fff3e0, #e6b990);
}

.rank-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-right: 1rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.normal-item:hover .rank-number {
  background-color: rgba(200, 16, 46, 0.1);
  color: #c8102e;
}

.user-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 1rem;
  object-fit: cover;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.ranking-item:hover .user-avatar {
  border-color: #c8102e;
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(200, 16, 46, 0.2);
}

.user-name {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
}

.user-score {
  font-size: 1.1rem;
  font-weight: bold;
  color: #c8102e;
  min-width: 80px;
  text-align: right;
}

.my-ranking {
  background: linear-gradient(135deg, white 0%, #fafafa 100%);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08), 0 2px 5px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(200, 16, 46, 0.05);
  position: relative;
  overflow: hidden;
}

/* 我的排名装饰 */
.my-ranking::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, rgba(200, 16, 46, 0.8) 0%, rgba(255, 193, 7, 0.8) 100%);
}

.my-ranking-title {
  font-size: 1.2rem;
  color: #c8102e;
  margin-bottom: 1rem;
  font-weight: bold;
}

.my-ranking-item {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce4ec 100%);
  border-radius: 12px;
  border: 1px solid rgba(200, 16, 46, 0.1);
  transition: all 0.3s ease;
}

.my-ranking-item:hover {
  background: linear-gradient(135deg, #fce4ec 0%, #fbcfe8 100%);
  transform: scale(1.01);
  box-shadow: 0 4px 10px rgba(200, 16, 46, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tab-nav {
    padding: 0 1rem;
  }

  .tab-item {
    padding: 1rem 1.2rem;
    font-size: 1rem;
  }

  .tab-content {
    padding: 1rem;
  }

  .category-grid {
    grid-template-columns: 1fr;
  }

  .record-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .record-middle, .record-right {
    text-align: left;
    width: 100%;
  }

  .ranking-filter {
    flex-wrap: wrap;
  }

  .filter-btn {
    flex: 1;
    text-align: center;
  }

  .rank-number {
    width: 30px;
    height: 30px;
    font-size: 1rem;
  }

  .user-avatar {
    width: 35px;
    height: 35px;
  }
}

@media (max-width: 480px) {
  .tab-nav {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
  }

  .tab-container {
    width: 100%;
  }

  .tab-nav .back-btn {
    width: 100%;
    text-align: center;
  }

  .tab-item {
    padding: 1rem 0.8rem;
    font-size: 0.9rem;
  }

  .ranking-item {
    padding: 0.8rem;
  }

  .user-name {
    font-size: 0.9rem;
  }

  .user-score {
    font-size: 1rem;
    min-width: 60px;
  }
}

.subject-filter {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.8rem;
  background-color: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  margin-top: 1rem;
}

.filter-label {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  white-space: nowrap;
}

.subject-btn {
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  border: none;
  background-color: #f5f5f5;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.subject-btn.active {
  background-color: #c8102e;
  color: white;
}

.subject-btn:hover {
  background-color: #eee;
}

.subject-btn.active:hover {
  background-color: #a80c24;
}

/* 响应式适配：小屏幕下专题筛选换行 */
@media (max-width: 768px) {
  .subject-filter {
    justify-content: flex-start;
  }

  .subject-btn {
    padding: 0.4rem 1rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .filter-label {
    font-size: 0.9rem;
  }

  .subject-btn {
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
  }
}
</style>