<template>
  <div class="monitoring-container">
    <h1>智能监测</h1>
    <div class="connection-status">
      <span :class="['status-indicator', { connected: isConnected }]"></span>
      {{ isConnected ? '实时连接中' : '连接断开' }}
    </div>
    <div class="monitoring-cards">
      <div class="card">
        <h3>土壤监测</h3>
        <div class="sensor-data">
          <div class="data-item">
            <span class="data-label">土壤湿度:</span>
            <span class="data-value">{{ soilMoisture.toFixed(1) }}%</span>
          </div>
          <div class="data-item">
            <span class="data-label">土壤温度:</span>
            <span class="data-value">{{ soilTemperature.toFixed(1) }}°C</span>
          </div>
          <div class="data-item">
            <span class="data-label">土壤pH值:</span>
            <span class="data-value">{{ soilPh }}</span>
          </div>
          <div class="data-item">
            <span class="data-label">土壤养分:</span>
            <span class="data-value">{{ soilNutrient }}mg/kg</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>气象监测</h3>
        <div class="sensor-data">
          <div class="data-item">
            <span class="data-label">空气温度:</span>
            <span class="data-value">{{ airTemperature.toFixed(1) }}°C</span>
          </div>
          <div class="data-item">
            <span class="data-label">空气湿度:</span>
            <span class="data-value">{{ airHumidity.toFixed(1) }}%</span>
          </div>
          <div class="data-item">
            <span class="data-label">光照强度:</span>
            <span class="data-value">{{ Math.round(lightIntensity) }}lux</span>
          </div>
          <div class="data-item">
            <span class="data-label">风速:</span>
            <span class="data-value">{{ windSpeed.toFixed(1) }}m/s</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>水质监测</h3>
        <div class="sensor-data">
          <div class="data-item">
            <span class="data-label">水温:</span>
            <span class="data-value">{{ waterTemperature.toFixed(1) }}°C</span>
          </div>
          <div class="data-item">
            <span class="data-label">溶解氧:</span>
            <span class="data-value">{{ dissolvedOxygen.toFixed(1) }}mg/L</span>
          </div>
          <div class="data-item">
            <span class="data-label">pH值:</span>
            <span class="data-value">{{ waterPh }}</span>
          </div>
          <div class="data-item">
            <span class="data-label">电导率:</span>
            <span class="data-value">{{ conductivity }}μS/cm</span>
          </div>
        </div>
      </div>
    </div>
    <div class="charts-container">
      <div class="chart-card">
        <h3>土壤湿度趋势</h3>
        <div ref="soilChartRef" class="chart"></div>
      </div>
      <div class="chart-card">
        <h3>温度变化趋势</h3>
        <div ref="temperatureChartRef" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import webSocketService from '../utils/websocket';

const soilMoisture = ref(65);
const soilTemperature = ref(22);
const soilPh = ref(6.5);
const soilNutrient = ref(1200);
const airTemperature = ref(25);
const airHumidity = ref(60);
const lightIntensity = ref(80000);
const windSpeed = ref(3.5);
const waterTemperature = ref(20);
const dissolvedOxygen = ref(8.5);
const waterPh = ref(7.0);
const conductivity = ref(500);

const isConnected = ref(false);
const soilChartRef = ref(null);
const temperatureChartRef = ref(null);

let soilChart = null;
let temperatureChart = null;

const soilHistory = [];
const temperatureHistory = [];
const maxHistoryLength = 20;

const initCharts = () => {
  if (soilChartRef.value) {
    soilChart = echarts.init(soilChartRef.value);
    soilChart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: [] },
      yAxis: { type: 'value', name: '湿度%', min: 40, max: 100 },
      series: [{ name: '土壤湿度', type: 'line', smooth: true, data: [] }]
    });
  }

  if (temperatureChartRef.value) {
    temperatureChart = echarts.init(temperatureChartRef.value);
    temperatureChart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: [] },
      yAxis: { type: 'value', name: '温度°C', min: 15, max: 35 },
      series: [
        { name: '土壤温度', type: 'line', smooth: true, data: [] },
        { name: '空气温度', type: 'line', smooth: true, data: [] }
      ]
    });
  }
};

const updateCharts = () => {
  if (soilChart) {
    soilChart.setOption({
      xAxis: { data: soilHistory.map((_, i) => `${i}s`) },
      series: [{ data: soilHistory }]
    });
  }

  if (temperatureChart) {
    temperatureChart.setOption({
      xAxis: { data: temperatureHistory.map((_, i) => `${i}s`) },
      series: [
        { data: temperatureHistory.map(t => t.soil) },
        { data: temperatureHistory.map(t => t.air) }
      ]
    });
  }
};

const handleSensorDataUpdate = (data) => {
  soilMoisture.value = data.soilMoisture;
  soilTemperature.value = data.soilTemperature;
  soilPh.value = data.soilPh;
  soilNutrient.value = data.soilNutrient;
  airTemperature.value = data.airTemperature;
  airHumidity.value = data.airHumidity;
  lightIntensity.value = data.lightIntensity;
  windSpeed.value = data.windSpeed;
  waterTemperature.value = data.waterTemperature;
  dissolvedOxygen.value = data.dissolvedOxygen;
  waterPh.value = data.waterPh;
  conductivity.value = data.conductivity;

  soilHistory.push(data.soilMoisture);
  if (soilHistory.length > maxHistoryLength) soilHistory.shift();

  temperatureHistory.push({ soil: data.soilTemperature, air: data.airTemperature });
  if (temperatureHistory.length > maxHistoryLength) temperatureHistory.shift();

  updateCharts();
};

const handleInitData = (data) => {
  if (data.sensorData) {
    handleSensorDataUpdate(data.sensorData);
  }
};

let simulationInterval = null;

const simulateSensorData = () => {
  const data = {
    soilMoisture: soilMoisture.value + (Math.random() - 0.5) * 2,
    soilTemperature: soilTemperature.value + (Math.random() - 0.5) * 0.5,
    soilPh: soilPh.value + (Math.random() - 0.5) * 0.1,
    soilNutrient: soilNutrient.value + (Math.random() - 0.5) * 20,
    airTemperature: airTemperature.value + (Math.random() - 0.5) * 0.8,
    airHumidity: airHumidity.value + (Math.random() - 0.5) * 2,
    lightIntensity: lightIntensity.value + (Math.random() - 0.5) * 500,
    windSpeed: windSpeed.value + (Math.random() - 0.5) * 0.3,
    waterTemperature: waterTemperature.value + (Math.random() - 0.5) * 0.3,
    dissolvedOxygen: dissolvedOxygen.value + (Math.random() - 0.5) * 0.2,
    waterPh: waterPh.value + (Math.random() - 0.5) * 0.05,
    conductivity: conductivity.value + (Math.random() - 0.5) * 5
  };
  
  // 限制数值范围
  data.soilMoisture = Math.max(40, Math.min(100, data.soilMoisture));
  data.soilTemperature = Math.max(15, Math.min(35, data.soilTemperature));
  data.soilPh = Math.max(4.5, Math.min(8.5, data.soilPh));
  data.airTemperature = Math.max(10, Math.min(40, data.airTemperature));
  data.airHumidity = Math.max(30, Math.min(95, data.airHumidity));
  
  handleSensorDataUpdate(data);
};

onMounted(() => {
  initCharts();
  
  // 使用模拟数据而不是真实的WebSocket连接
  isConnected.value = true;
  
  // 初始化历史数据
  for (let i = 0; i < 10; i++) {
    soilHistory.push(65 + Math.random() * 10);
    temperatureHistory.push({ soil: 22 + Math.random() * 3, air: 25 + Math.random() * 3 });
  }
  updateCharts();
  
  // 启动模拟数据更新
  simulationInterval = setInterval(simulateSensorData, 2000);
});

onUnmounted(() => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }

  if (soilChart) {
    soilChart.dispose();
    soilChart = null;
  }
  if (temperatureChart) {
    temperatureChart.dispose();
    temperatureChart = null;
  }
});
</script>

<style scoped>
.monitoring-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #2d5016;
  margin-bottom: 1rem;
  text-align: center;
}

.connection-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #666;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #dc3545;
}

.status-indicator.connected {
  background-color: #28a745;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.monitoring-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.card h3 {
  color: #2d5016;
  margin-bottom: 1rem;
  border-bottom: 2px solid #f0f7e6;
  padding-bottom: 0.5rem;
}

.sensor-data {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f7e6;
}

.data-label {
  color: #666;
  font-weight: 500;
}

.data-value {
  color: #2d5016;
  font-weight: bold;
  font-size: 1.1rem;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 1.5rem;
}

.chart-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.chart-card h3 {
  color: #2d5016;
  margin-bottom: 1rem;
  text-align: center;
}

.chart {
  width: 100%;
  height: 300px;
}

@media (max-width: 768px) {
  .monitoring-container {
    padding: 1rem;
  }

  .monitoring-cards {
    grid-template-columns: 1fr;
  }

  .charts-container {
    grid-template-columns: 1fr;
  }

  .chart {
    height: 250px;
  }
}
</style>