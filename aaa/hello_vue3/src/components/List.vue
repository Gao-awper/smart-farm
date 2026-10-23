<template>
  <div class="cultural-activities">
    <!-- 面包屑导航 -->
    <div class="breadcrumb" v-if="currentView === 'detail'">
      <a @click="goToHome">首页</a> / 
      <a @click="currentView = 'list'">农场活动</a> / 
      <span>{{ selectedActivity?.title }}</span>
    </div>

    <!-- 页面标题 -->
    <h1 class="page-title">农场活动</h1>

    <!-- 错误提示 -->
    <div class="error-message" v-if="error">{{ error }}</div>

    <!-- 加载状态 -->
    <div class="loading" v-if="loading && currentView === 'list'">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 列表视图 -->
    <div class="activities-list" v-if="!loading && currentView === 'list'">
      <div 
        class="activity-card" 
        v-for="activity in activities" 
        :key="activity.id"
        @click="viewActivityDetail(activity)"
      >
        <div class="activity-image">
          <div class="status-badge">{{ activity.status }}</div>
          <img :src="activity.image" :alt="activity.title" @click.stop>
        </div>
        <div class="activity-info">
          <h3 class="activity-title">{{ activity.title }}</h3>
          <p class="activity-description">{{ activity.description }}</p>
          <div class="activity-meta">
            <div class="meta-item">
              <span class="meta-icon">📅</span>
              <span>{{ activity.date }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">📍</span>
              <span>{{ activity.location }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">👥</span>
              <span>{{ activity.registrations }}/{{ activity.capacity }}人</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-if="activities.length === 0">
        <p>暂无活动数据</p>
      </div>
    </div>

    <!-- 详情视图 -->
    <div class="activity-detail" v-if="currentView === 'detail'">
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="selectedActivity">
        <div class="detail-header">
          <div class="activity-image">
            <div class="status-badge">{{ selectedActivity.status }}</div>
            <img :src="selectedActivity.image" :alt="selectedActivity.title">
          </div>
          <div class="activity-info">
            <h2 class="activity-title">{{ selectedActivity.title }}</h2>
            <div class="activity-meta">
              <div class="meta-item">
                <span class="meta-icon">📅</span>
                <span>活动时间</span>
                <p>{{ selectedActivity.date }}</p>
              </div>
              <div class="meta-item">
                <span class="meta-icon">📍</span>
                <span>活动地点</span>
                <p>{{ selectedActivity.location }}</p>
              </div>
              <div class="meta-item">
                <span class="meta-icon">👥</span>
                <span>报名人数</span>
                <p>{{ selectedActivity.registrations }}/{{ selectedActivity.capacity }}人</p>
              </div>
            </div>
            <div class="registration-info">
              <div class="progress-bar">
                <div 
                  class="progress-fill"
                  :style="{ width: (selectedActivity.registrations / selectedActivity.capacity) * 100 + '%' }"
                ></div>
              </div>
              <div class="progress-text">
                已报名 {{ selectedActivity.registrations }} 人
              </div>
              <button 
                class="register-btn" 
                @click="handleRegister"
                :disabled="selectedActivity.registrations >= selectedActivity.capacity || selectedActivity.status === '已结束'"
              >
                {{ selectedActivity.registrations >= selectedActivity.capacity ? '已满员' : '立即报名' }}
              </button>
            </div>
          </div>
        </div>

        <div class="detail-content">
          <h3>活动详情</h3>
          <p>{{ selectedActivity.detail }}</p>
          <ul class="activity-highlights">
            <li v-for="(highlight, index) in selectedActivity.highlights" :key="index">
              {{ highlight.content }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getActivities, getActivityDetail, registerActivity } from '../api/activityApi';

// 获取路由参数
const route = useRoute();

// 活动数据
const activities = ref([]);
const selectedActivity = ref(null);
const currentView = ref('list'); // 'list' 或 'detail'
const loading = ref(false);
const error = ref('');

// 格式化日期时间
const formatDateTime = (dateTime) => {
  if (!dateTime) return { date: '', time: '' };
  const date = new Date(dateTime);
  return {
    date: date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
    time: date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  };
};

// 格式化活动时间范围
const formatActivityDate = (startTime, endTime) => {
  if (!startTime || !endTime) return '';
  const start = formatDateTime(startTime);
  const end = formatDateTime(endTime);
  return `${start.date} ${start.time} - ${end.date} ${end.time}`;
};

// 获取活动列表
const fetchActivities = async () => {
  loading.value = true;
  error.value = '';
  try {
    const data = await getActivities();
    // 格式化活动数据
    activities.value = data.map(activity => ({
      ...activity,
      date: formatActivityDate(activity.startTime, activity.endTime)
    }));
  } catch (err) {
    error.value = '获取活动列表失败，请稍后重试';
    console.error('获取活动列表失败:', err);
  } finally {
    loading.value = false;
  }
};

// 获取活动详情
const fetchActivityDetail = async (id) => {
  loading.value = true;
  error.value = '';
  try {
    console.log('获取活动详情，ID:', id);
    const data = await getActivityDetail(id);
    console.log('活动详情数据:', data);
    selectedActivity.value = {
      ...data,
      date: formatActivityDate(data.startTime, data.endTime)
    };
    console.log('selectedActivity:', selectedActivity.value);
  } catch (err) {
    error.value = '获取活动详情失败，请稍后重试';
    console.error('获取活动详情失败:', err);
  } finally {
    loading.value = false;
  }
};

// 查看活动详情
const viewActivityDetail = (activity) => {
  selectedActivity.value = activity;
  currentView.value = 'detail';
  // 如果需要从服务器获取最新详情，可以调用：
  // fetchActivityDetail(activity.id);
};

// 返回列表页
const goToHome = () => {
  currentView.value = 'list';
  selectedActivity.value = null;
  // 刷新活动列表
  fetchActivities();
};

// 立即报名
const handleRegister = async () => {
  if (!selectedActivity.value) return;
  
  try {
    await registerActivity(selectedActivity.value.id);
    // 更新本地数据
    if (selectedActivity.value) {
      selectedActivity.value.registrations += 1;
    }
    // 刷新活动列表
    fetchActivities();
    alert('报名成功！');
  } catch (err) {
    console.error('报名失败:', err);
    // 检查是否是未登录错误
    if (err.message === '用户未登录，请先登录') {
      alert('请先登录后再进行报名！');
      // 可以考虑跳转到登录页面
      // router.push('/login');
    } else {
      alert('报名失败，请稍后重试');
    }
  }
};

// 组件挂载时获取活动列表或活动详情
onMounted(async () => {
  // 检查URL参数
  const activityId = route.query.activityId;
  const view = route.query.view;
  console.log('URL参数:', { activityId, view });
  
  if (activityId && view === 'detail') {
    // 如果有活动ID参数且需要查看详情，则直接加载详情
    console.log('加载活动详情，ID:', activityId);
    await fetchActivityDetail(activityId);
    currentView.value = 'detail';
    console.log('切换到详情视图，currentView:', currentView.value);
  } else {
    // 否则加载活动列表
    console.log('加载活动列表');
    fetchActivities();
  }
});
</script>

<style scoped>
.cultural-activities {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f5f0;
  min-height: 100vh;
}

.page-title {
  color: #333;
  font-size: 28px;
  margin-bottom: 30px;
  text-align: center;
}

.breadcrumb {
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}

.breadcrumb a {
  color: #8B0000;
  text-decoration: none;
  margin: 0 5px;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

/* 列表视图样式 */
.activities-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.activity-card {
  display: flex;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.activity-image {
  position: relative;
  width: 300px;
  flex-shrink: 0;
}

.activity-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #8B0000;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.activity-info {
  padding: 20px;
  flex: 1;
}

.activity-title {
  color: #333;
  font-size: 20px;
  margin-bottom: 10px;
  margin-top: 0;
}

.activity-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
  line-height: 1.5;
}

.activity-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.meta-icon {
  margin-right: 5px;
  font-size: 16px;
}

/* 详情视图样式 */
.activity-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-header {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
}

.detail-header .activity-image {
  width: 400px;
}

.detail-header .activity-image img {
  height: 100%;
}

.detail-header .activity-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.detail-header .activity-title {
  font-size: 24px;
  color: #333;
}

.detail-header .meta-item {
  margin-bottom: 15px;
}

.detail-header .meta-item span:first-of-type {
  color: #8B0000;
  font-weight: bold;
}

.registration-info {
  margin-top: 20px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #8B0000;
  border-radius: 4px;
}

.progress-text {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

.register-btn {
  background-color: #8B0000;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.register-btn:hover {
  background-color: #a52a2a;
}

.detail-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.detail-content h3 {
  color: #333;
  font-size: 20px;
  margin-bottom: 15px;
}

.detail-content p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.activity-highlights {
  list-style-type: disc;
  padding-left: 20px;
  color: #666;
}

.activity-highlights li {
  margin-bottom: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .activity-card {
    flex-direction: column;
  }

  .activity-image {
    width: 100% !important;
  }

  .activity-image img {
    height: 250px;
  }

  .detail-header {
    flex-direction: column;
  }

  .activity-meta {
    flex-direction: column;
    gap: 10px;
  }
}
</style>