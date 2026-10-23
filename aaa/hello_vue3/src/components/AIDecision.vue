<template>
  <div class="ai-container">
    <h1>🤖 AI智能决策</h1>

    <div class="ai-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <div class="ai-content">
      <div v-if="activeTab === 'growth'" class="tab-content">
        <div class="card">
          <h3>🌱 作物生长分析</h3>
          <div class="form-group">
            <label>选择作物</label>
            <select v-model="growthForm.cropType">
              <option value="wheat">小麦</option>
              <option value="corn">玉米</option>
              <option value="rice">水稻</option>
            </select>
          </div>
          <div class="form-group">
            <label>种植日期</label>
            <input type="date" v-model="growthForm.plantedDate" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>当前温度 (°C)</label>
              <input type="number" v-model="growthForm.currentTemp" />
            </div>
            <div class="form-group">
              <label>土壤湿度 (%)</label>
              <input type="number" v-model="growthForm.currentMoisture" />
            </div>
          </div>
          <button class="btn btn-primary" @click="handleAnalyzeGrowth">开始分析</button>
        </div>

        <div v-if="growthResult" class="result-card card">
          <h3>📊 分析结果</h3>
          <div class="result-grid">
            <div class="result-item">
              <span class="result-label">当前阶段</span>
              <span class="result-value highlight">{{ growthResult.currentStage }}</span>
            </div>
            <div class="result-item">
              <span class="result-label">生长进度</span>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: growthResult.growthProgress + '%' }"></div>
              </div>
              <span class="progress-text">{{ growthResult.growthProgress }}%</span>
            </div>
            <div class="result-item">
              <span class="result-label">健康评分</span>
              <span class="result-value" :class="getHealthClass(growthResult.healthScore)">
                {{ growthResult.healthScore }}/100
              </span>
            </div>
            <div class="result-item">
              <span class="result-label">距下一阶段</span>
              <span class="result-value">{{ growthResult.daysToNextStage }}天</span>
            </div>
          </div>
          <div class="recommendations">
            <h4>💡 建议</h4>
            <ul>
              <li v-for="(rec, index) in growthResult.recommendations" :key="index">{{ rec }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'disease'" class="tab-content">
        <div class="card">
          <h3>🦠 病虫害预警</h3>
          <div class="form-row">
            <div class="form-group">
              <label>环境温度 (°C)</label>
              <input type="number" v-model="diseaseForm.temperature" />
            </div>
            <div class="form-group">
              <label>环境湿度 (%)</label>
              <input type="number" v-model="diseaseForm.humidity" />
            </div>
          </div>
          <div class="form-group">
            <label>作物类型</label>
            <select v-model="diseaseForm.cropType">
              <option value="">全部作物</option>
              <option value="wheat">小麦</option>
              <option value="corn">玉米</option>
              <option value="rice">水稻</option>
            </select>
          </div>
          <button class="btn btn-primary" @click="handleDetectDisease">开始检测</button>
        </div>

        <div v-if="diseaseResult" class="result-card card">
          <div class="risk-header" :class="diseaseResult.riskLevel">
            <span class="risk-label">风险等级</span>
            <span class="risk-value">{{ getRiskText(diseaseResult.riskLevel) }}</span>
          </div>
          <div class="risk-score-display">
            <span class="risk-score-label">风险指数</span>
            <span class="risk-score-value" :class="getRiskScoreClass(diseaseResult.riskScore)">
              {{ diseaseResult.riskScore }}%
            </span>
          </div>
          <div v-if="diseaseResult.affectedDiseases && diseaseResult.affectedDiseases.length > 0" class="risk-list">
            <h4>⚠️ 受影响病虫害</h4>
            <div v-for="disease in diseaseResult.affectedDiseases" :key="disease" class="risk-item">
              <span class="risk-name">{{ disease }}</span>
            </div>
          </div>
          <div v-else class="no-risk">
            <p>✅ 当前环境条件良好，未检测到明显病虫害风险</p>
          </div>
          <div class="recommendations">
            <h4>💡 防治建议</h4>
            <ul>
              <li v-for="(rec, index) in diseaseResult.recommendations" :key="index">{{ rec }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'irrigation'" class="tab-content">
        <div class="card">
          <h3>💧 智能灌溉建议</h3>
          <div class="form-group">
            <label>选择作物</label>
            <select v-model="irrigationForm.cropType">
              <option value="wheat">小麦</option>
              <option value="corn">玉米</option>
              <option value="rice">水稻</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>土壤湿度 (%)</label>
              <input type="number" v-model="irrigationForm.soilMoisture" />
            </div>
            <div class="form-group">
              <label>空气温度 (°C)</label>
              <input type="number" v-model="irrigationForm.airTemperature" />
            </div>
          </div>
          <div class="form-group">
            <label>天气预报</label>
            <select v-model="irrigationForm.forecast">
              <option value="">无特殊预报</option>
              <option value="rain">未来有雨</option>
              <option value="heatwave">高温预警</option>
              <option value="normal">晴朗</option>
            </select>
          </div>
          <button class="btn btn-primary" @click="handleGetIrrigationAdvice">获取建议</button>
        </div>

        <div v-if="irrigationResult" class="result-card card">
          <div class="advice-header" :class="irrigationResult.waterNeed">
            <span class="advice-icon">{{ getAdviceIcon(irrigationResult.waterNeed) }}</span>
            <span class="advice-text">{{ irrigationResult.advice }}</span>
          </div>
          <div class="advice-details">
            <div class="advice-item">
              <span class="advice-label">当前湿度</span>
              <span class="advice-value">{{ irrigationForm.soilMoisture }}%</span>
            </div>
            <div class="advice-item">
              <span class="advice-label">建议水量</span>
              <span class="advice-value">{{ irrigationResult.recommendedAmount }}立方米</span>
            </div>
            <div class="advice-item">
              <span class="advice-label">最佳时间</span>
              <span class="advice-value">{{ irrigationResult.bestTime }}</span>
            </div>
            <div class="advice-item">
              <span class="advice-label">灌溉时长</span>
              <span class="advice-value">{{ irrigationResult.duration }}</span>
            </div>
          </div>
          <div class="recommendations">
            <h4>💡 建议</h4>
            <ul>
              <li v-for="(rec, index) in irrigationResult.recommendations" :key="index">{{ rec }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'yield'" class="tab-content">
        <div class="card">
          <h3>📈 产量预测</h3>
          <div class="form-group">
            <label>选择作物</label>
            <select v-model="yieldForm.cropType">
              <option value="wheat">小麦</option>
              <option value="corn">玉米</option>
              <option value="rice">水稻</option>
            </select>
          </div>
          <div class="form-group">
            <label>种植日期</label>
            <input type="date" v-model="yieldForm.plantedDate" />
          </div>
          <div class="form-group">
            <label>种植面积 (亩)</label>
            <input type="number" v-model="yieldForm.area" />
          </div>
          <div class="form-group">
            <label>健康度评分</label>
            <input type="range" min="0" max="100" v-model="yieldForm.currentHealth" />
            <span class="range-value">{{ yieldForm.currentHealth }}%</span>
          </div>
          <button class="btn btn-primary" @click="handlePredictYield">开始预测</button>
        </div>

        <div v-if="yieldResult" class="result-card card">
          <h3>🎯 预测结果</h3>
          <div class="yield-display">
            <div class="yield-circle">
              <span class="yield-value">{{ yieldResult.predictedYield }}</span>
              <span class="yield-unit">公斤/亩</span>
            </div>
          </div>
          <div class="yield-info">
            <div class="yield-item">
              <span>预测收获日期</span>
              <span class="highlight">{{ yieldResult.harvestDate }}</span>
            </div>
            <div class="yield-item">
              <span>距收获还有</span>
              <span>{{ yieldResult.daysToHarvest }}天</span>
            </div>
            <div class="yield-item">
              <span>当前进度</span>
              <span>{{ yieldResult.currentGrowthProgress }}%</span>
            </div>
            <div class="yield-item">
              <span>预测置信度</span>
              <span>{{ yieldResult.confidence }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'chat'" class="tab-content">
        <div class="card chat-card">
          <h3>💬 AI农业助手</h3>
          <div class="chat-messages" ref="chatMessagesRef">
            <div v-for="(msg, index) in chatMessages" :key="index" :class="['message', msg.type]">
              <div class="message-avatar">{{ msg.type === 'user' ? '👨‍🌾' : '🤖' }}</div>
              <div class="message-content">
                <div class="message-text" v-html="formatMessage(msg.text)"></div>
                <div class="message-time">{{ msg.time }}</div>
              </div>
            </div>
          </div>
          <div class="chat-input">
            <input
              type="text"
              v-model="chatInput"
              placeholder="输入您的问题..."
              @keyup.enter="sendChat"
            />
            <button class="btn btn-primary" @click="sendChat">发送</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue';
import {
  analyzeGrowth,
  assessDiseaseRisk,
  calculateIrrigation,
  predictYield
} from '@/services/aiAlgorithmService';

const activeTab = ref('growth');
const tabs = [
  { id: 'growth', label: '生长分析', icon: '🌱' },
  { id: 'disease', label: '病虫害预警', icon: '🦠' },
  { id: 'irrigation', label: '灌溉建议', icon: '💧' },
  { id: 'yield', label: '产量预测', icon: '📈' },
  { id: 'chat', label: 'AI助手', icon: '💬' }
];

const growthForm = reactive({
  cropType: 'wheat',
  plantedDate: '2026-01-01',
  currentTemp: 25,
  currentMoisture: 65
});
const growthResult = ref(null);

const diseaseForm = reactive({
  temperature: 25,
  humidity: 70,
  cropType: ''
});
const diseaseResult = ref(null);

const irrigationForm = reactive({
  cropType: 'wheat',
  soilMoisture: 65,
  airTemperature: 25,
  airHumidity: 60,
  forecast: ''
});
const irrigationResult = ref(null);

const yieldForm = reactive({
  cropType: 'wheat',
  plantedDate: '2026-01-01',
  area: 10,
  currentHealth: 80
});
const yieldResult = ref(null);

const chatInput = ref('');
const chatMessages = ref([
  {
    type: 'bot',
    text: '您好！我是绿野智农AI助手。我可以为您提供作物生长分析、病虫害预警、灌溉建议、产量预测等服务。请问有什么可以帮助您的？',
    time: new Date().toLocaleTimeString()
  }
]);
const chatMessagesRef = ref(null);

const handleAnalyzeGrowth = () => {
  growthResult.value = analyzeGrowth(
    growthForm.cropType,
    growthForm.plantedDate,
    growthForm.currentTemp,
    growthForm.currentMoisture
  );
};

const handleDetectDisease = () => {
  diseaseResult.value = assessDiseaseRisk(
    diseaseForm.cropType || 'wheat',
    diseaseForm.temperature,
    diseaseForm.humidity
  );
};

const handleGetIrrigationAdvice = () => {
  irrigationResult.value = calculateIrrigation(
    irrigationForm.cropType,
    irrigationForm.soilMoisture,
    irrigationForm.area || 1,
    irrigationForm.airTemperature
  );
};

const handlePredictYield = () => {
  yieldResult.value = predictYield(
    yieldForm.cropType,
    yieldForm.plantedDate,
    yieldForm.currentHealth,
    yieldForm.area
  );
};

const sendChat = async () => {
  if (!chatInput.value.trim()) return;

  const userMessage = {
    type: 'user',
    text: chatInput.value,
    time: new Date().toLocaleTimeString()
  };
  chatMessages.value.push(userMessage);
  const userInput = chatInput.value;
  chatInput.value = '';

  await nextTick();
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
  }

  // 模拟AI助手回复
  const responses = [
    '您好！我是绿野智农AI助手，很高兴为您服务。',
    '根据您的问题，我建议您关注作物的生长环境和病虫害防治。',
    '合理的灌溉和施肥是保证作物高产的关键。',
    '建议定期监测土壤湿度和温度，及时调整种植策略。',
    '病虫害预防重于治疗，建议采用综合防治措施。',
    '根据数据分析，当前环境条件适合作物生长。',
    '如果您有具体的作物问题，可以告诉我作物类型和生长状况。',
    '感谢您的提问！祝您的农场丰收！'
  ];

  setTimeout(() => {
    const botMessage = {
      type: 'bot',
      text: responses[Math.floor(Math.random() * responses.length)],
      time: new Date().toLocaleTimeString()
    };
    chatMessages.value.push(botMessage);
    
    nextTick(() => {
      if (chatMessagesRef.value) {
        chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
      }
    });
  }, 500 + Math.random() * 1000);
};

const getHealthClass = (score) => {
  if (score >= 80) return 'health-good';
  if (score >= 60) return 'health-warning';
  return 'health-danger';
};

const getRiskText = (level) => {
  const map = { high: '高风险', medium: '中等风险', low: '低风险' };
  return map[level] || '未知';
};

const getRiskScoreClass = (score) => {
  if (score >= 70) return 'risk-high';
  if (score >= 40) return 'risk-medium';
  return 'risk-low';
};

const getAdviceIcon = (waterNeed) => {
  const icons = {
    high: '🚨',
    medium: '⚠️',
    low: '✅'
  };
  return icons[waterNeed] || '💧';
};

const formatMessage = (text) => {
  // 将换行符转换为<br/>
  return text.replace(/\n/g, '<br/>');
};
</script>

<style scoped>
.ai-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #2d5016;
  margin-bottom: 1.5rem;
  text-align: center;
}

.ai-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.tab-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 100px;
}

.tab-btn:hover {
  border-color: #2d5016;
}

.tab-btn.active {
  background: #2d5016;
  border-color: #2d5016;
  color: white;
}

.tab-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.tab-label {
  font-size: 0.9rem;
  font-weight: 500;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.card h3 {
  color: #2d5016;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f0f7e6;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #2d5016;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #2d5016;
  color: white;
  width: 100%;
}

.btn-primary:hover {
  background: #3d6820;
}

.result-card {
  border-left: 4px solid #2d5016;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.result-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.result-label {
  display: block;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.result-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d5016;
}

.result-value.highlight {
  color: #28a745;
}

.health-good {
  color: #28a745;
}

.health-warning {
  color: #ffc107;
}

.health-danger {
  color: #dc3545;
}

.progress-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2d5016, #28a745);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: #2d5016;
  font-weight: bold;
}

.recommendations {
  margin-top: 1rem;
  padding: 1rem;
  background: #e8f5e9;
  border-radius: 8px;
}

.recommendations h4 {
  color: #2d5016;
  margin-bottom: 0.75rem;
}

.recommendations ul {
  margin: 0;
  padding-left: 1.5rem;
}

.recommendations li {
  margin-bottom: 0.5rem;
  color: #555;
}

.risk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.risk-header.high {
  background: #ffebee;
}

.risk-header.medium {
  background: #fff3e0;
}

.risk-header.low {
  background: #e8f5e9;
}

.risk-label {
  font-weight: 500;
  color: #333;
}

.risk-value {
  font-size: 1.25rem;
  font-weight: bold;
}

.risk-header.high .risk-value {
  color: #dc3545;
}

.risk-header.medium .risk-value {
  color: #ff9800;
}

.risk-header.low .risk-value {
  color: #4caf50;
}

.risk-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.risk-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.risk-header-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.risk-name {
  font-weight: bold;
  color: #333;
}

.risk-score {
  font-weight: bold;
}

.risk-high {
  color: #dc3545;
}

.risk-medium {
  color: #ff9800;
}

.risk-low {
  color: #4caf50;
}

.risk-symptom {
  color: #666;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.risk-prevention {
  padding: 0.5rem;
  background: #e8f5e9;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #2d5016;
}

.no-risk {
  text-align: center;
  padding: 2rem;
  color: #4caf50;
}

.advice-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.advice-header.high {
  background: #ffebee;
}

.advice-header.medium {
  background: #fff3e0;
}

.advice-header.low {
  background: #e8f5e9;
}

.advice-icon {
  font-size: 2rem;
}

.advice-text {
  flex: 1;
  font-weight: 500;
  color: #333;
}

.advice-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.advice-item {
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  text-align: center;
}

.advice-label {
  display: block;
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.advice-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2d5016;
}

.yield-display {
  text-align: center;
  padding: 2rem;
}

.yield-circle {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2d5016, #4a7c23);
  color: white;
}

.yield-value {
  font-size: 3rem;
  font-weight: bold;
}

.yield-unit {
  font-size: 1rem;
  opacity: 0.9;
}

.yield-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
}

.yield-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
}

.yield-item span:first-child {
  display: block;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.yield-item .highlight {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2d5016;
}

.chat-card {
  height: 500px;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.message {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.message-content {
  max-width: 70%;
}

.message-text {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.message.user .message-text {
  background: #2d5016;
  color: white;
}

.message-time {
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.25rem;
}

.message.user .message-time {
  text-align: right;
}

.chat-input {
  display: flex;
  gap: 0.75rem;
}

.chat-input input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.chat-input .btn {
  width: auto;
  padding: 0.75rem 1.5rem;
}

@media (max-width: 768px) {
  .ai-container {
    padding: 1rem;
  }

  .ai-tabs {
    flex-wrap: wrap;
  }

  .tab-btn {
    min-width: 80px;
    padding: 0.5rem 1rem;
  }

  .form-row,
  .result-grid,
  .advice-details,
  .yield-info {
    grid-template-columns: 1fr;
  }
}
</style>