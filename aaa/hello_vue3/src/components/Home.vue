<template>
  <div class="app-container">
    <!-- 加载状态 -->
    <div class="loading-overlay" v-if="loading">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <div class="error-message" v-if="error" @click="error = null">
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <span>{{ error }}</span>
        <button class="error-close">×</button>
      </div>
    </div>
    
    <!-- 主横幅：农场概览 -->
    <section class="hero-carousel">
      <div class="carousel-container" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <!-- 轮播项1：绿野智农 -->
        <div class="carousel-item">
          <div class="carousel-content">
            <div class="left-decoration">
              <div class="couplet">智慧农业</div>
              <div class="couplet">科技兴农</div>
              <div class="couplet">绿色发展</div>
            </div>
            
            <div class="center-content">
              <h1 class="chinese-new-year">绿野智农</h1>
              <p class="sub-title">利用现代科技实现农业生产智能化管理</p>
              <div class="highlight-container">
                <p class="highlight-text">提高产量，降低成本，保护环境</p>
              </div>
              <div class="cta-buttons">
                <button class="cta-primary" @click="goToFeature('overview')">查看概览</button>
                <button class="cta-secondary" @click="goToFeature('analysis')">数据分析</button>
              </div>
            </div>
            
            <div class="right-image">
              <img src="https://picsum.photos/id/152/600/400" alt="绿野智农" class="carousel-image">
            </div>
          </div>
        </div>
        
        <!-- 轮播项2：智能监测 -->
        <div class="carousel-item">
          <div class="carousel-content">
            <div class="left-decoration">
              <div class="couplet">实时监测</div>
              <div class="couplet">数据采集</div>
              <div class="couplet">智能分析</div>
            </div>
            
            <div class="center-content">
              <h1 class="chinese-new-year">智能监测</h1>
              <p class="sub-title">24小时实时监测土壤、气象、水质数据</p>
              <div class="highlight-container">
                <p class="highlight-text">精准掌握农场环境状况</p>
              </div>
              <div class="cta-buttons">
                <button class="cta-primary" @click="goToFeature('monitoring')">查看监测</button>
                <button class="cta-secondary" @click="goToFeature('analysis')">数据详情</button>
              </div>
            </div>
            
            <div class="right-image">
              <img src="https://picsum.photos/id/177/600/400" alt="智能监测" class="carousel-image">
            </div>
          </div>
        </div>
        
        <!-- 轮播项3：智能灌溉 -->
        <div class="carousel-item">
          <div class="carousel-content">
            <div class="left-decoration">
              <div class="couplet">精准灌溉</div>
              <div class="couplet">节水节能</div>
              <div class="couplet">智能控制</div>
            </div>
            
            <div class="center-content">
              <h1 class="chinese-new-year">智能灌溉</h1>
              <p class="sub-title">根据土壤湿度自动调节灌溉时间和水量</p>
              <div class="highlight-container">
                <p class="highlight-text">节约水资源，提高灌溉效率</p>
              </div>
              <div class="cta-buttons">
                <button class="cta-primary" @click="goToFeature('irrigation')">灌溉控制</button>
                <button class="cta-secondary" @click="goToFeature('analysis')">灌溉分析</button>
              </div>
            </div>
            
            <div class="right-image">
              <img src="https://picsum.photos/id/179/600/400" alt="智能灌溉" class="carousel-image">
            </div>
          </div>
        </div>
        
        <!-- 轮播项4：数据分析 -->
        <div class="carousel-item">
          <div class="carousel-content">
            <div class="left-decoration">
              <div class="couplet">数据驱动</div>
              <div class="couplet">智能分析</div>
              <div class="couplet">科学决策</div>
            </div>
            
            <div class="center-content">
              <h1 class="chinese-new-year">数据分析</h1>
              <p class="sub-title">基于大数据分析优化农场管理决策</p>
              <div class="highlight-container">
                <p class="highlight-text">提高产量，降低成本</p>
              </div>
              <div class="cta-buttons">
                <button class="cta-primary" @click="goToFeature('analysis')">查看分析</button>
                <button class="cta-secondary" @click="goToFeature('settings')">系统设置</button>
              </div>
            </div>
            
            <div class="right-image">
              <img src="https://picsum.photos/id/180/600/400" alt="数据分析" class="carousel-image">
            </div>
          </div>
        </div>
      </div>
      
      <!-- 轮播指示器 -->
      <div class="carousel-indicators">
        <button 
          v-for="(item, index) in carouselItems" 
          :key="index"
          :class="['indicator', { active: currentIndex === index }]"
          @click="currentIndex = index"
        ></button>
      </div>
      
      <!-- 左右切换按钮 -->
      <button class="carousel-prev" @click="prevSlide" aria-label="上一张">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      <button class="carousel-next" @click="nextSlide" aria-label="下一张">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </section>
    
    <!-- 农场数据概览 -->
    <section class="farm-overview">
      <h2 class="section-title">农场数据概览</h2>
      <div class="overview-cards">
        <div v-for="item in overviewData" :key="item.id" :class="['overview-card', { 'highlight': item.trend > 0 }]">
          <div class="card-icon">{{ item.icon }}</div>
          <div class="card-content">
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-value">{{ item.value }}</p>
            <span :class="['card-trend', { 'up': item.trend > 0, 'down': item.trend < 0 }]">
              {{ item.trend > 0 ? '↑' : '↓' }} {{ Math.abs(item.trend) }}%
            </span>
          </div>
          <div class="card-bg"></div>
        </div>
      </div>
    </section>

    <!-- 实时监测数据 -->
    <section class="realtime-monitoring">
      <h2 class="section-title">实时监测数据</h2>
      <div class="monitoring-cards">
        <div class="monitoring-card">
          <div class="card-header">
            <h3>土壤数据</h3>
            <span class="card-subtitle">实时更新</span>
          </div>
          <div class="data-items">
            <div class="data-item">
              <span class="data-label">湿度:</span>
              <span class="data-value">{{ soilData.moisture }}%</span>
              <div class="data-bar">
                <div class="data-bar-fill" :style="{ width: `${soilData.moisture}%` }"></div>
              </div>
            </div>
            <div class="data-item">
              <span class="data-label">温度:</span>
              <span class="data-value">{{ soilData.temperature }}°C</span>
              <div class="data-bar">
                <div class="data-bar-fill" :style="{ width: `${(soilData.temperature / 40) * 100}%` }"></div>
              </div>
            </div>
            <div class="data-item">
              <span class="data-label">pH值:</span>
              <span class="data-value">{{ soilData.ph }}</span>
              <div class="data-bar">
                <div class="data-bar-fill" :style="{ width: `${(soilData.ph / 14) * 100}%` }"></div>
              </div>
            </div>
          </div>
          <div class="chart-container">
            <div ref="soilChart" class="chart"></div>
          </div>
        </div>
        <div class="monitoring-card">
          <div class="card-header">
            <h3>气象数据</h3>
            <span class="card-subtitle">实时更新</span>
          </div>
          <div class="data-items">
            <div class="data-item">
              <span class="data-label">温度:</span>
              <span class="data-value">{{ weatherData.temperature }}°C</span>
              <div class="data-bar">
                <div class="data-bar-fill" :style="{ width: `${(weatherData.temperature / 40) * 100}%` }"></div>
              </div>
            </div>
            <div class="data-item">
              <span class="data-label">湿度:</span>
              <span class="data-value">{{ weatherData.humidity }}%</span>
              <div class="data-bar">
                <div class="data-bar-fill" :style="{ width: `${weatherData.humidity}%` }"></div>
              </div>
            </div>
            <div class="data-item">
              <span class="data-label">光照:</span>
              <span class="data-value">{{ weatherData.light }}lux</span>
              <div class="data-bar">
                <div class="data-bar-fill" :style="{ width: `${(weatherData.light / 100000) * 100}%` }"></div>
              </div>
            </div>
          </div>
          <div class="chart-container">
            <div ref="weatherChart" class="chart"></div>
          </div>
        </div>
        <div class="monitoring-card">
          <div class="card-header">
            <h3>灌溉数据</h3>
            <span class="card-subtitle">实时更新</span>
          </div>
          <div class="data-items">
            <div class="data-item">
              <span class="data-label">今日用水量:</span>
              <span class="data-value">{{ irrigationData.todayWater }}吨</span>
              <div class="data-bar">
                <div class="data-bar-fill" :style="{ width: `${(irrigationData.todayWater / 200) * 100}%` }"></div>
              </div>
            </div>
            <div class="data-item">
              <span class="data-label">灌溉状态:</span>
              <span class="data-value" :class="['status-badge', irrigationData.status === '正常' ? 'status-normal' : 'status-warning']">
                {{ irrigationData.status }}
              </span>
            </div>
            <div class="data-item">
              <span class="data-label">下次灌溉:</span>
              <span class="data-value">{{ irrigationData.nextIrrigation }}</span>
            </div>
          </div>
          <div class="chart-container">
            <div ref="irrigationChart" class="chart"></div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 最新通知 -->
    <section class="notifications">
      <h2 class="section-title">最新通知</h2>
      <div class="notifications-container">
        <div class="notification-item" v-for="notification in notifications" :key="notification.id">
          <div :class="['notification-icon', notification.type]">
            {{ notification.type === 'warning' ? '⚠️' : 'ℹ️' }}
          </div>
          <div class="notification-content">
            <h4>{{ notification.title }}</h4>
            <span class="notification-time">{{ notification.time }}</span>
          </div>
          <div class="notification-action">
            <button class="action-btn" @click="viewNotification(notification)">查看</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 农场功能导航 -->
    <section class="farm-features">
      <h2 class="section-title">农场功能</h2>
      <div class="features-grid">
        <div class="feature-card" @click="goToFeature('overview')">
          <div class="feature-icon">📊</div>
          <h3>农场概览</h3>
          <p>查看农场整体情况和数据统计</p>
          <div class="feature-arrow">→</div>
        </div>
        <div class="feature-card" @click="goToFeature('monitoring')">
          <div class="feature-icon">🌡️</div>
          <h3>智能监测</h3>
          <p>实时监测土壤、气象和水质数据</p>
          <div class="feature-arrow">→</div>
        </div>
        <div class="feature-card" @click="goToFeature('irrigation')">
          <div class="feature-icon">💧</div>
          <h3>智能灌溉</h3>
          <p>自动控制灌溉系统，节约水资源</p>
          <div class="feature-arrow">→</div>
        </div>
        <div class="feature-card" @click="goToFeature('crops')">
          <div class="feature-icon">🌾</div>
          <h3>作物管理</h3>
          <p>管理作物种植和生长状态</p>
          <div class="feature-arrow">→</div>
        </div>
        <div class="feature-card" @click="goToFeature('analysis')">
          <div class="feature-icon">📈</div>
          <h3>数据分析</h3>
          <p>基于数据优化农场管理决策</p>
          <div class="feature-arrow">→</div>
        </div>
        <div class="feature-card" @click="goToFeature('settings')">
          <div class="feature-icon">⚙️</div>
          <h3>系统设置</h3>
          <p>管理农场基本信息和系统配置</p>
          <div class="feature-arrow">→</div>
        </div>
      </div>
    </section>
    
    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">
          <img src="https://picsum.photos/id/152/60/60" alt="Logo" class="footer-logo-img">
          <div class="footer-site-name">绿野智农管理系统</div>
        </div>
        <div class="footer-links">
          <a href="#" class="footer-link">关于我们</a>
          <a href="#" class="footer-link">联系方式</a>
          <a href="#" class="footer-link">隐私政策</a>
          <a href="#" class="footer-link">网站地图</a>
        </div>
        <div class="footer-info">
          <div class="copyright">
            © 2026 绿野智农管理系统 版权所有 | 京ICP备12345678号
          </div>
          <div class="footer-social">
            <a href="#" class="social-link">微信</a>
            <a href="#" class="social-link">微博</a>
            <a href="#" class="social-link">抖音</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getFarmOverview, getRealtimeData } from '../api/farmApi';
import { getCrops, getIrrigationZones } from '../utils/dataStorage';
import { isAuthenticated } from '../utils/auth';
import * as echarts from 'echarts';

const router = useRouter();
const currentIndex = ref(0); 
const carouselItems = ref([1, 2, 3, 4]); 
let carouselTimer = null; 
let dataUpdateTimer = null;

// 登录状态检查
const loggedIn = computed(() => isAuthenticated());

// 图表引用
const soilChart = ref(null);
const weatherChart = ref(null);
const irrigationChart = ref(null);

// 图表实例
let soilChartInstance = null;
let weatherChartInstance = null;
let irrigationChartInstance = null;

// 从localStorage获取作物和灌溉区域数据（与管理员页面同步）
const crops = ref(getCrops());
const irrigationZones = ref(getIrrigationZones());

// 图表数据
const chartData = reactive({
  soil: {
    time: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    moisture: [60, 62, 65, 63, 64, 65],
    temperature: [18, 19, 20, 22, 23, 22],
    ph: [6.2, 6.3, 6.4, 6.5, 6.5, 6.5]
  },
  weather: {
    time: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    temperature: [20, 19, 21, 25, 24, 22],
    humidity: [65, 70, 68, 60, 62, 65],
    light: [0, 0, 50000, 80000, 70000, 20000]
  },
  irrigation: {
    time: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    water: [0, 0, 50, 30, 20, 20]
  }
});

// 加载状态
const loading = ref(false);
// 错误信息
const error = ref(null);

// 农场概览数据（使用同步的数据）
const overviewData = ref([
  { id: 1, title: '总种植面积', value: `${crops.value.reduce((sum, c) => sum + c.area, 0)}亩`, icon: '📏', trend: 5 },
  { id: 2, title: '作物种类', value: `${crops.value.length}种`, icon: '🌾', trend: 0 },
  { id: 3, title: '预计产量', value: '12000kg', icon: '📈', trend: 15 },
  { id: 4, title: '灌溉效率', value: '85%', icon: '💧', trend: 10 }
]);

// 土壤数据
const soilData = reactive({
  moisture: 65,
  temperature: 22,
  ph: 6.5
});

// 气象数据
const weatherData = reactive({
  temperature: 25,
  humidity: 60,
  light: 80000
});

// 灌溉数据
const irrigationData = reactive({
  todayWater: 120,
  status: '正常',
  nextIrrigation: '18:00'
});

// 最新通知
const notifications = ref([
  { id: 1, title: '灌溉系统已启动', time: '10:30', type: 'info' },
  { id: 2, title: '土壤湿度低于阈值', time: '09:15', type: 'warning' },
  { id: 3, title: '今日天气预报', time: '08:00', type: 'info' }
]);

// 跳转到功能页面（需要登录）
const goToFeature = (feature) => {
  // 如果未登录，跳转到登录页面
  if (!loggedIn.value) {
    alert('请先登录以访问该功能！');
    router.push('/login');
    return;
  }
  
  switch(feature) {
    case 'overview':
      router.push('/overview');
      break;
    case 'monitoring':
      router.push('/monitoring');
      break;
    case 'irrigation':
      router.push('/irrigation');
      break;
    case 'crops':
      router.push('/crops');
      break;
    case 'analysis':
      router.push('/analysis');
      break;
    case 'settings':
      router.push('/settings');
      break;
  }
};

// 查看通知详情（需要登录）
const viewNotification = (notification) => {
  if (!loggedIn.value) {
    alert('请先登录以查看通知详情！');
    router.push('/login');
    return;
  }
  alert(`查看通知: ${notification.title}`);
};

// 轮播相关方法
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % carouselItems.value.length;
};

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + carouselItems.value.length) % carouselItems.value.length;
};

const startCarousel = () => {
  carouselTimer = setInterval(nextSlide, 5000);
};

const stopCarousel = () => {
  clearInterval(carouselTimer);
};

// 加载农场概览数据
const loadFarmOverview = async () => {
  try {
    loading.value = true;
    const response = await getFarmOverview();
    if (response.data.success || response.data.status === 'success') {
      const apiData = response.data.data;
      overviewData.value = [
        { id: 1, title: '总种植面积', value: `${apiData.totalArea || 100}亩`, icon: '📏', trend: 5 },
        { id: 2, title: '作物种类', value: `${apiData.totalCrops || 5}种`, icon: '🌾', trend: 0 },
        { id: 3, title: '设备数量', value: `${apiData.totalDevices || 8}台`, icon: '📈', trend: 15 },
        { id: 4, title: '灌溉状态', value: apiData.irrigationStatus || '正常', icon: '💧', trend: 10 }
      ];
    }
    // 不显示错误提示，使用默认模拟数据
  } catch (err) {
    // 后端服务未运行时使用模拟数据，不显示错误提示
    console.warn('后端服务未运行，使用模拟数据:', err.message);
  } finally {
    loading.value = false;
  }
};

// 加载实时监测数据
const loadRealtimeData = async () => {
  try {
    loading.value = true;
    const response = await getRealtimeData();
    if (response.data.success || response.data.status === 'success') {
      const data = response.data.data;
      if (data.soil) {
        Object.assign(soilData, data.soil);
      }
      if (data.weather) {
        Object.assign(weatherData, data.weather);
      }
      if (data.irrigation) {
        Object.assign(irrigationData, data.irrigation);
      }
    }
    // 不显示错误提示，使用默认模拟数据
  } catch (err) {
    // 后端服务未运行时使用模拟数据，不显示错误提示
    console.warn('后端服务未运行，使用模拟数据:', err.message);
  } finally {
    loading.value = false;
  }
};

// 加载农场数据
const loadFarmData = async () => {
  try {
    // 并行请求数据，提高加载速度
    const [overviewResponse, realtimeResponse] = await Promise.all([
      getFarmOverview(),
      getRealtimeData()
    ]);
    
    // 处理农场概览数据
    if (overviewResponse.data.success || overviewResponse.data.status === 'success') {
      const apiData = overviewResponse.data.data;
      overviewData.value = [
        { id: 1, title: '总种植面积', value: `${apiData.totalArea || 100}亩`, icon: '📏', trend: 5 },
        { id: 2, title: '作物种类', value: `${apiData.totalCrops || 5}种`, icon: '🌾', trend: 0 },
        { id: 3, title: '设备数量', value: `${apiData.totalDevices || 8}台`, icon: '📈', trend: 15 },
        { id: 4, title: '灌溉状态', value: apiData.irrigationStatus || '正常', icon: '💧', trend: 10 }
      ];
    }
    
    // 处理实时监测数据
    if (realtimeResponse.data.success || realtimeResponse.data.status === 'success') {
      const data = realtimeResponse.data.data;
      if (data.soil) {
        Object.assign(soilData, data.soil);
      }
      if (data.weather) {
        Object.assign(weatherData, data.weather);
      }
      if (data.irrigation) {
        Object.assign(irrigationData, data.irrigation);
      }
    }
  } catch (err) {
    // 后端服务未运行时使用模拟数据，不显示错误提示
    console.warn('后端服务未运行，使用模拟数据:', err.message);
  } finally {
    loading.value = false;
  }
};

// 模拟实时数据更新
const updateRealtimeData = () => {
  // 只在用户可见时更新数据，减少不必要的计算
  if (document.visibilityState === 'visible') {
    soilData.moisture = Math.round((60 + Math.random() * 10) * 10) / 10;
    soilData.temperature = Math.round((20 + Math.random() * 4) * 10) / 10;
    weatherData.temperature = Math.round((23 + Math.random() * 4) * 10) / 10;
    weatherData.humidity = Math.round((55 + Math.random() * 10) * 10) / 10;
    
    // 更新图表数据
    updateChartData();
  }
};

// 初始化土壤图表
const initSoilChart = () => {
  if (soilChart.value) {
    soilChartInstance = echarts.init(soilChart.value);
    const option = {
      title: {
        text: '土壤数据趋势',
        textStyle: {
          fontSize: 14,
          color: '#2d5016'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['湿度', '温度', 'pH值'],
        textStyle: {
          fontSize: 12
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartData.soil.time,
        axisLabel: {
          fontSize: 10
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '湿度(%)',
          min: 50,
          max: 80,
          axisLabel: {
            fontSize: 10
          }
        },
        {
          type: 'value',
          name: '温度(°C)',
          min: 15,
          max: 30,
          axisLabel: {
            fontSize: 10
          }
        },
        {
          type: 'value',
          name: 'pH值',
          min: 5,
          max: 8,
          axisLabel: {
            fontSize: 10
          }
        }
      ],
      series: [
        {
          name: '湿度',
          type: 'line',
          data: chartData.soil.moisture,
          smooth: true,
          itemStyle: {
            color: '#2d5016'
          }
        },
        {
          name: '温度',
          type: 'line',
          yAxisIndex: 1,
          data: chartData.soil.temperature,
          smooth: true,
          itemStyle: {
            color: '#ff7f50'
          }
        },
        {
          name: 'pH值',
          type: 'line',
          yAxisIndex: 2,
          data: chartData.soil.ph,
          smooth: true,
          itemStyle: {
            color: '#1e90ff'
          }
        }
      ]
    };
    soilChartInstance.setOption(option);
  }
};

// 初始化气象图表
const initWeatherChart = () => {
  if (weatherChart.value) {
    weatherChartInstance = echarts.init(weatherChart.value);
    const option = {
      title: {
        text: '气象数据趋势',
        textStyle: {
          fontSize: 14,
          color: '#2d5016'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['温度', '湿度', '光照'],
        textStyle: {
          fontSize: 12
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartData.weather.time,
        axisLabel: {
          fontSize: 10
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '温度(°C)',
          min: 15,
          max: 30,
          axisLabel: {
            fontSize: 10
          }
        },
        {
          type: 'value',
          name: '湿度(%)',
          min: 50,
          max: 80,
          axisLabel: {
            fontSize: 10
          }
        },
        {
          type: 'value',
          name: '光照(lux)',
          min: 0,
          max: 100000,
          axisLabel: {
            fontSize: 10,
            formatter: '{value}'
          }
        }
      ],
      series: [
        {
          name: '温度',
          type: 'line',
          data: chartData.weather.temperature,
          smooth: true,
          itemStyle: {
            color: '#ff7f50'
          }
        },
        {
          name: '湿度',
          type: 'line',
          yAxisIndex: 1,
          data: chartData.weather.humidity,
          smooth: true,
          itemStyle: {
            color: '#1e90ff'
          }
        },
        {
          name: '光照',
          type: 'line',
          yAxisIndex: 2,
          data: chartData.weather.light,
          smooth: true,
          itemStyle: {
            color: '#ffd700'
          }
        }
      ]
    };
    weatherChartInstance.setOption(option);
  }
};

// 初始化灌溉图表
const initIrrigationChart = () => {
  if (irrigationChart.value) {
    irrigationChartInstance = echarts.init(irrigationChart.value);
    const option = {
      title: {
        text: '灌溉用水量趋势',
        textStyle: {
          fontSize: 14,
          color: '#2d5016'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: chartData.irrigation.time,
        axisLabel: {
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value',
        name: '用水量(吨)',
        axisLabel: {
          fontSize: 10
        }
      },
      series: [
        {
          name: '用水量',
          type: 'bar',
          data: chartData.irrigation.water,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2d5016' },
              { offset: 1, color: '#3a6e18' }
            ])
          }
        }
      ]
    };
    irrigationChartInstance.setOption(option);
  }
};

// 更新图表数据
const updateChartData = () => {
  // 模拟数据更新
  chartData.soil.moisture.push(soilData.moisture);
  chartData.soil.moisture.shift();
  chartData.soil.temperature.push(soilData.temperature);
  chartData.soil.temperature.shift();
  
  chartData.weather.temperature.push(weatherData.temperature);
  chartData.weather.temperature.shift();
  chartData.weather.humidity.push(weatherData.humidity);
  chartData.weather.humidity.shift();
  
  // 更新图表
  if (soilChartInstance) {
    soilChartInstance.setOption({
      series: [
        { data: chartData.soil.moisture },
        { data: chartData.soil.temperature },
        { data: chartData.soil.ph }
      ]
    });
  }
  
  if (weatherChartInstance) {
    weatherChartInstance.setOption({
      series: [
        { data: chartData.weather.temperature },
        { data: chartData.weather.humidity },
        { data: chartData.weather.light }
      ]
    });
  }
  
  if (irrigationChartInstance) {
    irrigationChartInstance.setOption({
      series: [{ data: chartData.irrigation.water }]
    });
  }
};

// 初始化所有图表
const initCharts = () => {
  // 检查元素是否存在，避免不必要的初始化
  if (soilChart.value) initSoilChart();
  if (weatherChart.value) initWeatherChart();
  if (irrigationChart.value) initIrrigationChart();
  
  // 监听窗口大小变化，使用节流函数减少触发频率
  const throttledResize = throttle(handleResize, 200);
  window.addEventListener('resize', throttledResize);
  
  // 保存节流函数引用，以便后续移除
  window.__chartResizeHandler = throttledResize;
};

// 节流函数
const throttle = (func, delay) => {
  let timer = null;
  return function() {
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, arguments);
        timer = null;
      }, delay);
    }
  };
};

// 处理窗口大小变化
const handleResize = () => {
  // 只在图表实例存在时调用resize
  if (soilChartInstance) soilChartInstance.resize();
  if (weatherChartInstance) weatherChartInstance.resize();
  if (irrigationChartInstance) irrigationChartInstance.resize();
};

// 销毁图表实例
const destroyCharts = () => {
  // 销毁图表实例
  if (soilChartInstance) soilChartInstance.dispose();
  if (weatherChartInstance) weatherChartInstance.dispose();
  if (irrigationChartInstance) irrigationChartInstance.dispose();
  
  // 移除事件监听器
  if (window.__chartResizeHandler) {
    window.removeEventListener('resize', window.__chartResizeHandler);
    delete window.__chartResizeHandler;
  }
};

onMounted(() => {
  startCarousel();
  loadFarmData();
  
  // 初始化图表
  setTimeout(initCharts, 100); // 延迟初始化，确保DOM已渲染
  
  // 定时更新数据
  dataUpdateTimer = setInterval(() => {
    loadFarmData();
    updateRealtimeData();
  }, 30000); // 每30秒更新一次
});

onUnmounted(() => {
  stopCarousel();
  if (dataUpdateTimer) {
    clearInterval(dataUpdateTimer);
  }
  // 销毁图表
  destroyCharts();
});
</script>

<style scoped>
/* 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'SimSun', 'STSong', 'Microsoft YaHei', sans-serif;
}

.app-container {
  background-color: #f8f5f0;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  position: relative;
}

/* 轮播图样式 */
.hero-carousel {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #2d5016 0%, #3a6e18 100%);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  height: 100vh;
  z-index: 10;
  padding: 0;
  margin: 0;
  top: 0;
  left: 0;
  right: 0;
  box-sizing: border-box;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .hero-carousel {
    height: auto;
    min-height: 80vh;
    padding: 2rem 1rem;
  }
  
  .carousel-content {
    flex-direction: column;
    text-align: center;
  }
  
  .left-decoration {
    display: none;
  }
  
  .center-content {
    width: 100%;
    padding: 1rem;
  }
  
  .chinese-new-year {
    font-size: 3rem;
  }
  
  .sub-title {
    font-size: 1.2rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .right-image {
    width: 100%;
    padding: 1rem;
  }
  
  .carousel-image {
    max-height: 250px;
  }
  
  .farm-overview,
  .realtime-monitoring,
  .notifications,
  .farm-features {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .overview-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .monitoring-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .feature-card {
    padding: 1.5rem;
  }
  
  .feature-icon {
    font-size: 2.5rem;
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 0.5rem;
  }
}

/* 平板适配 */
@media (min-width: 769px) and (max-width: 1024px) {
  .hero-carousel {
    height: 80vh;
  }
  
  .chinese-new-year {
    font-size: 4rem;
  }
  
  .overview-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .monitoring-cards {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 大屏幕适配 */
@media (min-width: 1025px) {
  .hero-carousel {
    height: 100vh;
  }
  
  .overview-cards {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .monitoring-cards {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.carousel-container {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease-in-out;
}

.carousel-item {
  width: 100%;
  flex-shrink: 0;
  height: 100%;
}

.carousel-content {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
  flex-wrap: wrap;
}

.left-decoration {
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  flex: 1 1 200px;
}

.couplet {
  font-size: 1.8rem;
  color: white;
  font-weight: bold;
  writing-mode: vertical-rl;
  text-orientation: upright;
  letter-spacing: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.couplet:hover {
  transform: scale(1.1);
}

.center-content {
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  color: white;
  flex: 1 1 300px;
}

.chinese-new-year {
  font-size: 6rem;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 1rem;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
  line-height: 1;
  animation: fadeInUp 1s ease-out;
}

.sub-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 1s ease-out 0.2s both;
}

.highlight-container {
  margin-bottom: 2rem;
  animation: fadeInUp 1s ease-out 0.4s both;
}

.highlight-text {
  font-size: 1.2rem;
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  display: inline-block;
  border-radius: 4px;
  border-left: 3px solid #ffd700;
  transition: all 0.3s ease;
}

.highlight-text:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateX(5px);
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  animation: fadeInUp 1s ease-out 0.6s both;
}

.cta-primary {
  background-color: #ffd700;
  color: #2d5016;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.cta-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(255, 215, 0, 0.4);
  background-color: #ffed4e;
}

.cta-secondary {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-secondary:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}

.right-image {
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  flex: 1 1 300px;
}

.carousel-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  max-height: 400px;
  object-fit: cover;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
}

.carousel-image:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.4);
}

/* 轮播指示器 */
.carousel-indicators {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.8rem;
  z-index: 3;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.indicator:hover {
  background-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

.indicator.active {
  background-color: #ffd700;
  width: 30px;
  border-radius: 6px;
  animation: pulse 2s infinite;
}

/* 轮播左右切换按钮 */
.carousel-prev, .carousel-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.3);
  border: none;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.carousel-prev {
  left: 2rem;
}

.carousel-next {
  right: 2rem;
}

.carousel-prev:hover, .carousel-next:hover {
  background-color: rgba(0, 0, 0, 0.5);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* 农场数据概览 */
.farm-overview {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 2rem;
}

.section-title {
  color: #2d5016;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2.2rem;
  font-weight: bold;
  position: relative;
  padding-bottom: 1rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #2d5016, #3a6e18);
  border-radius: 2px;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.overview-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid #e9ecef;
}

.overview-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(45, 80, 22, 0.2);
  border-color: #2d5016;
}

.overview-card.highlight {
  border-color: #28a745;
  box-shadow: 0 4px 16px rgba(40, 167, 69, 0.1);
}

.overview-card.highlight::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: #28a745;
}

.card-icon {
  font-size: 3rem;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f7e6;
  border-radius: 50%;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.overview-card:hover .card-icon {
  transform: scale(1.1);
  background-color: #e6f3d6;
}

.card-content {
  flex: 1;
}

.card-title {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.card-value {
  color: #2d5016;
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  transition: color 0.3s ease;
}

.overview-card:hover .card-value {
  color: #3a6e18;
}

.card-trend {
  font-size: 0.9rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.card-trend.up {
  color: #28a745;
}

.card-trend.down {
  color: #dc3545;
}

.card-bg {
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(45, 80, 22, 0.05), rgba(58, 110, 24, 0.05));
  border-radius: 0 12px 0 100px;
}

/* 实时监测数据 */
.realtime-monitoring {
  padding: 3rem 2rem;
  background-color: #f0f7e6;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.realtime-monitoring::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2d5016, #3a6e18, #2d5016);
}

.monitoring-cards {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.monitoring-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.monitoring-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(45, 80, 22, 0.15);
  border-color: #2d5016;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f7e6;
}

.card-header h3 {
  color: #2d5016;
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0;
}

.card-subtitle {
  color: #999;
  font-size: 0.85rem;
  font-weight: 500;
}

.data-items {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.data-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f7e6;
  transition: all 0.3s ease;
}

.data-item:hover {
  background-color: rgba(240, 247, 230, 0.5);
  padding-left: 1rem;
  border-radius: 8px;
}

.data-item:last-child {
  border-bottom: none;
}

.data-label {
  color: #666;
  font-weight: 500;
  font-size: 0.95rem;
}

.data-value {
  color: #2d5016;
  font-weight: bold;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.data-bar {
  width: 100%;
  height: 8px;
  background-color: #f0f7e6;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.data-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #2d5016, #3a6e18);
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* 图表容器样式 */
.chart-container {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f0f7e6;
}

.chart {
  width: 100%;
  height: 250px;
  min-height: 200px;
  transition: all 0.3s ease;
}

.monitoring-card:hover .chart {
  transform: scale(1.02);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
}

.status-normal {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-warning {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

/* 最新通知 */
.notifications {
  padding: 2rem;
  background-color: #f8f5f0;
  margin-bottom: 2rem;
}

.notifications-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  border: 1px solid #e9ecef;
}

.notification-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem;
  border-bottom: 1px solid #f0f7e6;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin-bottom: 0.75rem;
}

.notification-item:hover {
  background-color: #f0f7e6;
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(45, 80, 22, 0.1);
}

.notification-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.notification-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.notification-item:hover .notification-icon {
  transform: scale(1.1);
}

.notification-icon.info {
  background-color: #e3f2fd;
  color: #1976d2;
}

.notification-icon.warning {
  background-color: #fff3e0;
  color: #f57c00;
}

.notification-content {
  flex: 1;
}

.notification-content h4 {
  color: #2d5016;
  margin-bottom: 0.25rem;
  font-size: 1.1rem;
  font-weight: bold;
}

.notification-time {
  color: #999;
  font-size: 0.85rem;
}

.notification-action {
  flex-shrink: 0;
}

.action-btn {
  background-color: #2d5016;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background-color: #3a6e18;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(45, 80, 22, 0.3);
}

/* 农场功能导航 */
.farm-features {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  position: relative;
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 24px rgba(45, 80, 22, 0.15);
  border-color: #2d5016;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2d5016, #3a6e18);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  color: #2d5016;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
  color: #3a6e18;
}

.feature-card h3 {
  color: #2d5016;
  margin-bottom: 1rem;
  font-size: 1.4rem;
  font-weight: bold;
  transition: color 0.3s ease;
}

.feature-card:hover h3 {
  color: #3a6e18;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
  transition: color 0.3s ease;
}

.feature-card:hover p {
  color: #444;
}

.feature-arrow {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  font-size: 1.5rem;
  color: #2d5016;
  font-weight: bold;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateX(10px);
}

.feature-card:hover .feature-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* 页脚 */
.footer {
  background-color: #333;
  color: white;
  padding: 3rem 2rem;
  margin-top: 3rem;
  position: relative;
  overflow: hidden;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2d5016, #3a6e18, #2d5016);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
}

.footer-logo:hover {
  transform: translateY(-5px);
}

.footer-logo-img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ffd700;
  transition: all 0.3s ease;
}

.footer-logo:hover .footer-logo-img {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.footer-site-name {
  font-size: 1.4rem;
  font-weight: bold;
  color: #ffd700;
}

.footer-links {
  display: flex;
  gap: 2.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-link {
  color: #ccc;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  position: relative;
  padding: 0.5rem 0;
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #ffd700;
  transition: width 0.3s ease;
}

.footer-link:hover {
  color: #ffd700;
}

.footer-link:hover::after {
  width: 100%;
}

.footer-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  border-top: 1px solid #444;
  padding-top: 2rem;
}

.copyright {
  font-size: 0.9rem;
  color: #999;
  text-align: center;
}

.footer-social {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
}

.social-link {
  color: #ccc;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.1);
}

.social-link:hover {
  color: #ffd700;
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-3px);
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.2);
}

/* 移动端页脚适配 */
@media (max-width: 768px) {
  .footer {
    padding: 2rem 1rem;
  }
  
  .footer-logo {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .footer-logo-img {
    width: 60px;
    height: 60px;
  }
  
  .footer-site-name {
    font-size: 1.2rem;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
  
  .footer-link {
    font-size: 1rem;
  }
  
  .footer-info {
    padding-top: 1.5rem;
  }
  
  .copyright {
    font-size: 0.8rem;
  }
  
  .footer-social {
    gap: 1rem;
  }
  
  .social-link {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
}

/* 加载状态样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  background-color: white;
  padding: 2.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.3s ease;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f0f7e6;
  border-top: 4px solid #2d5016;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.loading-spinner p {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2d5016;
  margin: 0;
}

/* 错误提示样式 */
.error-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #f8d7da;
  color: #721c24;
  padding: 1.25rem 1.5rem;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  cursor: pointer;
  animation: slideIn 0.3s ease-out;
  max-width: 400px;
  transition: all 0.3s ease;
}

.error-message:hover {
  transform: translateX(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.error-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.error-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.error-close {
  background: none;
  border: none;
  color: #721c24;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.error-close:hover {
  background-color: rgba(114, 28, 36, 0.1);
  transform: rotate(90deg);
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .chinese-new-year {
    font-size: 4.5rem;
  }
  
  .hero-carousel {
    min-height: 80vh;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .cta-primary, .cta-secondary {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .chinese-new-year {
    font-size: 3.5rem;
    text-align: center;
  }
  
  .sub-title, .highlight-text {
    text-align: center;
  }
  
  .highlight-text {
    margin: 0 auto;
    display: block;
    width: fit-content;
  }
  
  .couplet {
    writing-mode: horizontal-tb;
    font-size: 1.2rem;
    letter-spacing: 0.2rem;
  }
  
  .farm-overview, .realtime-monitoring, .farm-features, .notifications {
    padding: 1.5rem;
  }
  
  .overview-cards, .monitoring-cards, .features-grid {
    grid-template-columns: 1fr;
  }
  
  .carousel-prev, .carousel-next {
    width: 40px;
    height: 40px;
  }
  
  .carousel-indicators {
    bottom: 20px;
  }
  
  .footer-links {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .footer-social {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .chinese-new-year {
    font-size: 2.8rem;
  }
  
  .sub-title {
    font-size: 1.2rem;
  }
  
  .indicator {
    width: 10px;
    height: 10px;
  }
  
  .indicator.active {
    width: 25px;
  }
  
  .carousel-prev, .carousel-next {
    width: 35px;
    height: 35px;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .feature-card {
    padding: 2rem;
  }
  
  .footer {
    padding: 2rem 1rem;
  }
}
</style>