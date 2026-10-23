<template>
  <div class="overview-container">
    <h1>农场概览</h1>
    
    <!-- 统计卡片 -->
    <div class="overview-cards">
      <div class="card">
        <div class="card-icon">🌾</div>
        <div class="card-content">
          <h3>作物状态</h3>
          <p>当前种植面积: {{ totalArea }}亩</p>
          <p>作物种类: {{ cropCount }}种</p>
          <p>生长状态: {{ overallStatus }}</p>
        </div>
      </div>
      <div class="card">
        <div class="card-icon">💧</div>
        <div class="card-content">
          <h3>灌溉系统</h3>
          <p>当前状态: {{ irrigationStatus }}</p>
          <p>今日用水量: {{ todayWaterUsage }}吨</p>
          <p>下次灌溉: {{ nextIrrigationTime }}</p>
        </div>
      </div>
      <div class="card">
        <div class="card-icon">🌡️</div>
        <div class="card-content">
          <h3>环境监测</h3>
          <p>当前温度: {{ realtimeData.soil.temperature }}°C</p>
          <p>湿度: {{ realtimeData.soil.moisture }}%</p>
          <p>光照: {{ realtimeData.weather.lightIntensity.toLocaleString() }} lux</p>
        </div>
      </div>
      <div class="card">
        <div class="card-icon">📊</div>
        <div class="card-content">
          <h3>产量预测</h3>
          <p>预计产量: {{ predictedYield }}kg</p>
          <p>预计收入: ¥{{ predictedIncome.toLocaleString() }}</p>
          <p>同比增长: {{ growthRate }}%</p>
        </div>
      </div>
    </div>

    <!-- 健康评分 -->
    <div class="health-score-section">
      <h2>农场健康评分</h2>
      <div class="health-score-container">
        <div class="score-circle" :class="scoreClass">
          <span class="score-value">{{ healthScore.score }}</span>
          <span class="score-label">分</span>
        </div>
        <div class="score-breakdown">
          <div class="breakdown-item">
            <span class="breakdown-label">作物健康</span>
            <div class="progress-bar">
              <div class="progress-fill" :style="{width: healthScore.breakdown.crops + '%', backgroundColor: getProgressColor(healthScore.breakdown.crops)}"></div>
            </div>
            <span class="breakdown-value">{{ healthScore.breakdown.crops }}%</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">灌溉状态</span>
            <div class="progress-bar">
              <div class="progress-fill" :style="{width: healthScore.breakdown.irrigation + '%', backgroundColor: getProgressColor(healthScore.breakdown.irrigation)}"></div>
            </div>
            <span class="breakdown-value">{{ healthScore.breakdown.irrigation }}%</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">告警处理</span>
            <div class="progress-bar">
              <div class="progress-fill" :style="{width: healthScore.breakdown.alerts + '%', backgroundColor: getProgressColor(healthScore.breakdown.alerts)}"></div>
            </div>
            <span class="breakdown-value">{{ healthScore.breakdown.alerts }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 农场地图 -->
    <div class="farm-map">
      <h2>农场区域分布</h2>
      <div class="map-container">
        <div class="custom-map">
          <div 
            v-for="zone in irrigationZones" 
            :key="zone.id"
            :class="['map-zone', getZonePosition(zone.id)]"
            :style="{ backgroundColor: getZoneColor(zone.status) }"
            @click="showZoneDetail(zone)"
          >
            <div class="zone-label">{{ zone.name }}</div>
            <div class="zone-info">{{ getZoneCrops(zone) }}</div>
            <div class="zone-status" :class="zone.status.toLowerCase().replace(' ', '-')">{{ zone.status }}</div>
          </div>
          <div class="map-center">
            <div class="center-building">农场中心</div>
          </div>
        </div>
      </div>
      <div class="zone-legend">
        <div class="legend-item"><span class="legend-color good"></span> 正常</div>
        <div class="legend-item"><span class="legend-color warning"></span> 警告</div>
        <div class="legend-item"><span class="legend-color danger"></span> 危险</div>
      </div>
    </div>

    <!-- 实时传感器数据 -->
    <div class="sensor-section">
      <h2>实时传感器数据</h2>
      <div class="sensor-grid">
        <div class="sensor-card">
          <span class="sensor-icon">🌡️</span>
          <div class="sensor-info">
            <span class="sensor-label">土壤温度</span>
            <span class="sensor-value">{{ realtimeData.soil.temperature }}°C</span>
          </div>
        </div>
        <div class="sensor-card">
          <span class="sensor-icon">💧</span>
          <div class="sensor-info">
            <span class="sensor-label">土壤湿度</span>
            <span class="sensor-value">{{ realtimeData.soil.moisture }}%</span>
          </div>
        </div>
        <div class="sensor-card">
          <span class="sensor-icon">⚗️</span>
          <div class="sensor-info">
            <span class="sensor-label">土壤pH值</span>
            <span class="sensor-value">{{ realtimeData.soil.ph }}</span>
          </div>
        </div>
        <div class="sensor-card">
          <span class="sensor-icon">💨</span>
          <div class="sensor-info">
            <span class="sensor-label">空气温度</span>
            <span class="sensor-value">{{ realtimeData.weather.airTemperature }}°C</span>
          </div>
        </div>
        <div class="sensor-card">
          <span class="sensor-icon">🌬️</span>
          <div class="sensor-info">
            <span class="sensor-label">空气湿度</span>
            <span class="sensor-value">{{ realtimeData.weather.airHumidity }}%</span>
          </div>
        </div>
        <div class="sensor-card">
          <span class="sensor-icon">☀️</span>
          <div class="sensor-info">
            <span class="sensor-label">光照强度</span>
            <span class="sensor-value">{{ realtimeData.weather.lightIntensity.toLocaleString() }} lux</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { farmStore } from '../stores/farmStore';
import { getHealthScore, predictFutureYield } from '../services/analysisService';

// 响应式数据
const crops = ref([]);
const irrigationZones = ref([]);

// 加载数据
const loadData = () => {
  crops.value = [...farmStore.state.crops];
  irrigationZones.value = [...farmStore.state.irrigationZones];
};

// 计算属性 - 作物统计
const totalArea = computed(() => {
  return crops.value.reduce((sum, crop) => sum + crop.area, 0);
});

const cropCount = computed(() => {
  return crops.value.length;
});

const overallStatus = computed(() => {
  const warningCount = crops.value.filter(c => c.status === '警告').length;
  const dangerCount = crops.value.filter(c => c.status === '危险').length;
  
  if (dangerCount > 0) return '⚠️ 有危险作物';
  if (warningCount > 0) return '⚠️ 有警告作物';
  return '良好';
});

// 计算属性 - 灌溉系统
const irrigationStatus = computed(() => {
  const warningZones = irrigationZones.value.filter(z => z.status === '警告').length;
  return warningZones > 0 ? '部分区域需要关注' : '正常';
});

const todayWaterUsage = computed(() => {
  // 模拟计算今日用水量
  return Math.round(irrigationZones.value.reduce((sum, zone) => {
    const usage = zone.waterAmount || 30;
    return sum + usage * 0.4;
  }, 0));
});

const nextIrrigationTime = computed(() => {
  // 获取最近的灌溉时间
  const now = new Date();
  let minDiff = Infinity;
  
  irrigationZones.value.forEach(zone => {
    if (zone.nextIrrigation) {
      const nextTime = new Date(zone.nextIrrigation);
      const diff = nextTime - now;
      if (diff > 0 && diff < minDiff) {
        minDiff = diff;
      }
    }
  });
  
  if (minDiff === Infinity) return '暂无计划';
  
  const hours = Math.floor(minDiff / (1000 * 60 * 60));
  const minutes = Math.floor((minDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) return `${hours}小时${minutes}分钟后`;
  return `${minutes}分钟后`;
});

// 实时数据
const realtimeData = computed(() => {
  return farmStore.state.realtimeData || {
    soil: { temperature: 0, moisture: 0, ph: 0, nitrogen: 0 },
    weather: { airTemperature: 0, airHumidity: 0, lightIntensity: 0, windSpeed: 0 },
    water: { temperature: 0, dissolvedOxygen: 0, ph: 0, turbidity: 0 }
  };
});

// 产量预测
const yieldPrediction = computed(() => {
  return predictFutureYield(crops.value, farmStore.state.realtimeData);
});

const predictedYield = computed(() => yieldPrediction.value.prediction);
const predictedIncome = computed(() => Math.round(predictedYield.value * 30)); // 假设每kg 30元
const growthRate = computed(() => 15); // 模拟增长率

// 健康评分
const healthScore = computed(() => {
  return getHealthScore(crops.value, farmStore.state.devices, farmStore.state.alerts);
});

const scoreClass = computed(() => {
  const score = healthScore.value.score;
  if (score >= 80) return 'score-excellent';
  if (score >= 60) return 'score-good';
  if (score >= 40) return 'score-warning';
  return 'score-danger';
});

const getProgressColor = (score) => {
  if (score >= 80) return '#28a745';
  if (score >= 60) return '#17a2b8';
  if (score >= 40) return '#ffc107';
  return '#dc3545';
};

// 区域位置映射
const zonePositions = ['north-zone', 'east-zone', 'south-zone', 'west-zone'];
const getZonePosition = (id) => {
  return zonePositions[(id - 1) % zonePositions.length];
};

// 区域颜色
const getZoneColor = (status) => {
  switch(status) {
    case '警告': return 'rgba(255, 193, 7, 0.6)';
    case '危险': return 'rgba(220, 53, 69, 0.6)';
    default: return 'rgba(144, 238, 144, 0.6)';
  }
};

// 获取区域作物信息
const getZoneCrops = (zone) => {
  const zoneName = zone.name.replace('区', '');
  const zoneCrops = crops.value.filter(crop => 
    crop.name.includes(zoneName) || zoneName.includes(crop.name.slice(0, 1))
  );
  
  if (zoneCrops.length === 0) return `${zone.area}亩`;
  return zoneCrops.map(c => `${c.name} ${c.area}亩`).join(', ');
};

// 显示区域详情
const showZoneDetail = (zone) => {
  const zoneCrops = crops.value.filter(crop => {
    const zoneName = zone.name.replace('区', '');
    return crop.name.includes(zoneName) || zoneName.includes(crop.name.slice(0, 1));
  });
  
  let detail = `区域: ${zone.name}\n面积: ${zone.area}亩\n状态: ${zone.status}\n上次灌溉: ${zone.lastIrrigation || '未记录'}\n下次灌溉: ${zone.nextIrrigation || '未计划'}`;
  
  if (zoneCrops.length > 0) {
    detail += `\n种植作物: ${zoneCrops.map(c => c.name).join(', ')}`;
  }
  
  alert(detail);
};

// 初始化
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.overview-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  color: #2d5016;
  margin-bottom: 2rem;
  text-align: center;
}

h2 {
  color: #2d5016;
  margin-bottom: 1.5rem;
  text-align: center;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #2d5016, #8bc34a);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(45, 80, 22, 0.15);
}

.card-icon {
  font-size: 2.5rem;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f7e6, #dcedc1);
  border-radius: 12px;
  flex-shrink: 0;
}

.card-content h3 {
  color: #2d5016;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.card-content p {
  margin: 0.25rem 0;
  color: #555;
  font-size: 0.9rem;
}

/* 健康评分区域 */
.health-score-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.health-score-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  flex-wrap: wrap;
}

.score-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.3s ease;
}

.score-excellent {
  background: linear-gradient(135deg, #28a745, #81c784);
  box-shadow: 0 4px 20px rgba(40, 167, 69, 0.3);
}

.score-good {
  background: linear-gradient(135deg, #17a2b8, #4dd0e1);
  box-shadow: 0 4px 20px rgba(23, 162, 184, 0.3);
}

.score-warning {
  background: linear-gradient(135deg, #ffc107, #ffd54f);
  box-shadow: 0 4px 20px rgba(255, 193, 7, 0.3);
}

.score-danger {
  background: linear-gradient(135deg, #dc3545, #ef9a9a);
  box-shadow: 0 4px 20px rgba(220, 53, 69, 0.3);
}

.score-value {
  font-size: 3rem;
  color: white;
}

.score-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.score-breakdown {
  flex: 1;
  max-width: 400px;
}

.breakdown-item {
  margin-bottom: 1rem;
}

.breakdown-label {
  display: block;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.breakdown-value {
  float: right;
  color: #2d5016;
  font-weight: bold;
}

/* 农场地图 */
.farm-map {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.map-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.custom-map {
  position: relative;
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
  border: 2px solid #2d5016;
  border-radius: 8px;
  overflow: hidden;
}

.map-zone {
  position: absolute;
  border: 2px solid rgba(45, 80, 22, 0.4);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.map-zone:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 20px rgba(45, 80, 22, 0.25);
  z-index: 10;
}

.zone-label {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2d5016;
  margin-bottom: 0.3rem;
}

.zone-info {
  font-size: 0.85rem;
  color: #555;
  text-align: center;
  padding: 0 0.5rem;
}

.zone-status {
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: bold;
  color: white;
}

.zone-status.正常 {
  background: #28a745;
}

.zone-status.警告 {
  background: #ffc107;
  color: #333;
}

.zone-status.危险 {
  background: #dc3545;
}

.east-zone {
  top: 10%;
  right: 10%;
  width: 35%;
  height: 80%;
}

.west-zone {
  top: 10%;
  left: 10%;
  width: 35%;
  height: 80%;
}

.south-zone {
  bottom: 10%;
  left: 10%;
  width: 80%;
  height: 35%;
}

.north-zone {
  top: 10%;
  left: 10%;
  width: 80%;
  height: 35%;
}

.map-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20%;
  height: 20%;
  background: linear-gradient(135deg, #2d5016, #388e3c);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  box-shadow: 0 4px 15px rgba(45, 80, 22, 0.4);
}

.center-building {
  color: white;
  font-weight: bold;
  text-align: center;
  font-size: 0.85rem;
}

.zone-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color.good {
  background: rgba(144, 238, 144, 0.8);
}

.legend-color.warning {
  background: rgba(255, 193, 7, 0.8);
}

.legend-color.danger {
  background: rgba(220, 53, 69, 0.8);
}

/* 传感器数据区域 */
.sensor-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.sensor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.sensor-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f8f9fa, #f0f7e6);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.sensor-card:hover {
  background: linear-gradient(135deg, #f0f7e6, #dcedc1);
  transform: translateY(-2px);
}

.sensor-icon {
  font-size: 1.8rem;
}

.sensor-info {
  display: flex;
  flex-direction: column;
}

.sensor-label {
  font-size: 0.85rem;
  color: #666;
}

.sensor-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2d5016;
}

@media (max-width: 768px) {
  .overview-container {
    padding: 1rem;
  }
  
  .overview-cards {
    grid-template-columns: 1fr;
  }
  
  .health-score-container {
    flex-direction: column;
    gap: 2rem;
  }
  
  .custom-map {
    height: 300px;
  }
  
  .sensor-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>