<template>
  <div class="news-container">
    <!-- 面包屑导航 -->
    <div v-if="showDetail" class="breadcrumb">
      <span @click="showDetail = false">首页</span> &gt; <span @click="showDetail = false">公告列表</span> &gt; <span>详情</span>
    </div>
    
    <!-- 公告列表 -->
    <div v-if="!showDetail" class="news-list">
      <h1 class="page-title">公告列表</h1>
      
      <!-- 筛选条件 -->
      <div class="filter-container">
        <select v-model="selectedType" @change="filterNews">
          <option value="">全部</option>
          <option value="政府通知">政府通知</option>
          <option value="公示">公示</option>
          <option value="活动通知">活动通知</option>
        </select>
      </div>
      
      <div class="news-items">
        <div 
          v-for="news in filteredNews" 
          :key="news.id" 
          class="news-item"
          @click="viewDetail(news)"
        >
          <div class="news-header">
            <span :class="['news-tag', 'tag-' + news.type]">{{ news.type }}</span>
            <h3 class="news-title">{{ news.title }}</h3>
          </div>
          <p class="news-content">{{ news.content }}</p>
          <div class="news-footer">{{ formatTime(news.time) }}</div>
        </div>
      </div>
    </div>
    
    <!-- 公告详情 -->
    <div v-else class="news-detail">
      <h1 class="detail-title">{{ currentNews.title }}</h1>
      <div class="detail-info">
        <span :class="['news-tag', 'tag-' + currentNews.type]">{{ currentNews.type }}</span>
        <span class="detail-time">{{ formatTime(currentNews.time) }}</span>
      </div>
      <div class="detail-content">
        {{ currentNews.content }}
      </div>
      <button class="back-btn" @click="showDetail = false">返回列表</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// 配置axios基础路径
axios.defaults.baseURL = 'http://localhost:8080' // 后端服务地址

// 响应式数据
const showDetail = ref(false)
const selectedType = ref('')
const newsList = ref([])
const currentNews = ref(null)

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString()
}

// 筛选公告
const filteredNews = computed(() => {
  if (!selectedType.value) return newsList.value
  return newsList.value.filter(news => news.type === selectedType.value)
})

// 加载公告数据
const loadNews = async () => {
  try {
    let url = '/api/notices'
    if (selectedType.value) {
      url += `/type/${selectedType.value}`
    }
    const response = await axios.get(url)
    newsList.value = response.data
  } catch (error) {
    console.error('获取公告列表失败:', error)
  }
}

// 查看详情
const viewDetail = async (news) => {
  try {
    // 可以直接使用列表中的数据，也可以调用详情接口获取最新数据
    // const response = await axios.get(`/api/notices/${news.id}`)
    // currentNews.value = response.data
    currentNews.value = news
    showDetail.value = true
  } catch (error) {
    console.error('获取公告详情失败:', error)
  }
}

// 筛选新闻
const filterNews = async () => {
  // 根据类型筛选时重新请求数据
  await loadNews()
}

// 生命周期钩子
onMounted(() => {
  loadNews()
})
</script>

<style scoped>
.news-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff6e6;
  min-height: calc(100vh - 80px);
}

/* 面包屑导航 */
.breadcrumb {
  font-size: 12px;
  color: #666;
  margin-bottom: 15px;
  text-align: left;
  padding-bottom: 5px;
  border-bottom: 1px solid #e0d0b0;
}

.breadcrumb span {
  cursor: pointer;
  color: #333;
}

.breadcrumb span:hover {
  text-decoration: none;
}

/* 列表视图 */
.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
  text-align: left;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0d0b0;
}

.filter-container {
  margin-bottom: 20px;
  display: block;
}

.filter-container select {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.filter-container select:focus {
  border-color: #409eff;
}

.news-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.news-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.news-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.news-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.news-tag {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
}

.tag-政府通知 {
  background-color: #409eff;
}

.tag-公示 {
  background-color: #67c23a;
}

.tag-活动通知 {
  background-color: #e6a23c;
}

.news-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
  line-height: 1.4;
}

.news-content {
  font-size: 14px;
  color: #606266;
  margin-bottom: 15px;
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.news-footer {
  font-size: 12px;
  color: #909399;
  text-align: right;
}

/* 详情视图 */
.news-detail {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* 详情视图 */
.detail-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  text-align: left;
}

.detail-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  font-size: 12px;
  color: #666;
}

.detail-content {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 20px;
  text-align: left;
}





/* 响应式设计 */
@media (max-width: 768px) {
  .news-container {
    padding: 10px;
  }
  
  .news-items {
    grid-template-columns: 1fr;
  }
  
  .detail-title {
    font-size: 22px;
  }
  
  .detail-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>