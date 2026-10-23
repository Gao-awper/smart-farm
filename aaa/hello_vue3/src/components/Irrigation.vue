<template>
  <div class="irrigation-container">
    <h1>智能灌溉</h1>
    <div class="connection-status">
      <span :class="['status-indicator', { connected: isConnected }]"></span>
      {{ isConnected ? '实时连接中' : '连接断开' }}
    </div>
    <div class="irrigation-status">
      <div class="status-card">
        <h3>灌溉系统状态</h3>
        <div class="status-item">
          <span class="status-label">当前状态:</span>
          <span class="status-value" :class="{ 'status-active': irrigationStatus === '运行中', 'status-idle': irrigationStatus === '待机' }">
            {{ irrigationStatus }}
          </span>
        </div>
        <div class="status-item">
          <span class="status-label">上次灌溉:</span>
          <span class="status-value">{{ lastIrrigation }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">下次灌溉:</span>
          <span class="status-value">{{ nextIrrigation }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">今日用水量:</span>
          <span class="status-value">{{ todayWaterUsage }}吨</span>
        </div>
      </div>
      <div class="control-card">
        <h3>灌溉控制</h3>
        <div class="control-buttons">
          <button 
            class="control-btn start-btn" 
            @click="handleControlClick(startIrrigation)" 
            :disabled="irrigationStatus === '运行中' || isControlDisabled"
            :class="{ 'disabled': isControlDisabled }"
          >
            {{ loggedIn ? '开始灌溉' : '请登录后操作' }}
          </button>
          <button 
            class="control-btn stop-btn" 
            @click="handleControlClick(stopIrrigation)" 
            :disabled="irrigationStatus === '待机' || isControlDisabled"
            :class="{ 'disabled': isControlDisabled }"
          >
            {{ loggedIn ? '停止灌溉' : '请登录后操作' }}
          </button>
          <button 
            class="control-btn manual-btn" 
            @click="handleControlClick(toggleManualMode)"
            :disabled="isControlDisabled"
            :class="{ 'disabled': isControlDisabled }"
          >
            {{ loggedIn ? (manualMode ? '切换到自动模式' : '切换到手动模式') : '请登录后操作' }}
          </button>
        </div>
        <div class="schedule-section" v-if="!manualMode">
          <h4>灌溉计划</h4>
          <div class="schedule-item" v-for="(schedule, index) in irrigationSchedule" :key="index">
            <span>{{ schedule.time }}</span>
            <span>{{ schedule.duration }}分钟</span>
            <span>{{ schedule.area }}</span>
            <button class="edit-btn" @click="editSchedule(index)">编辑</button>
          </div>
          <button class="add-schedule-btn" @click="addSchedule">添加灌溉计划</button>
        </div>
      </div>
    </div>
    <div class="irrigation-zones">
      <h3>灌溉区域</h3>
      <div class="zones-grid">
        <div class="zone-card" v-for="zone in irrigationZones" :key="zone.id">
          <h4>{{ zone.name }}</h4>
          <div class="zone-info">
            <p>面积: {{ zone.area }}亩</p>
            <p>作物: {{ zone.crop }}</p>
            <p>土壤湿度: {{ zone.moisture }}%</p>
            <p>状态: <span :class="{ 'zone-active': zone.status === '正常', 'zone-warning': zone.status === '警告' }">
              {{ zone.status }}
            </span></p>
          </div>
          <button class="zone-control-btn" @click="controlZone(zone.id)">
            {{ zone.controlStatus === '开启' ? '关闭' : '开启' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import webSocketService from '../utils/websocket';
import { isLoggedIn } from '../utils/auth';

const STORAGE_KEY = 'irrigation_state';

const irrigationStatus = ref('待机');

// 检查当前是否登录
const loggedIn = computed(() => isLoggedIn());

// 检查按钮是否应该禁用（未登录时禁用）
const isControlDisabled = computed(() => !loggedIn.value);
const lastIrrigation = ref('2026-03-09 08:00');
const nextIrrigation = ref('2026-03-09 18:00');
const todayWaterUsage = ref(120);
const manualMode = ref(false);

const isConnected = ref(false);

// 保存灌溉状态到localStorage
const saveIrrigationState = () => {
  const state = {
    irrigationStatus: irrigationStatus.value,
    lastIrrigation: lastIrrigation.value,
    nextIrrigation: nextIrrigation.value,
    todayWaterUsage: todayWaterUsage.value,
    manualMode: manualMode.value
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

// 控制按钮点击处理（权限检查）
const handleControlClick = (action) => {
  if (!loggedIn.value) {
    alert('请先登录后再进行操作！');
    return;
  }
  action();
};

// 从localStorage加载灌溉状态
const loadIrrigationState = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const state = JSON.parse(saved);
      irrigationStatus.value = state.irrigationStatus || '待机';
      lastIrrigation.value = state.lastIrrigation || '2026-03-09 08:00';
      nextIrrigation.value = state.nextIrrigation || '2026-03-09 18:00';
      todayWaterUsage.value = state.todayWaterUsage || 120;
      manualMode.value = state.manualMode || false;
    } catch (e) {
      console.error('加载灌溉状态失败:', e);
    }
  }
};

// 检查socket连接状态
const checkConnectionStatus = () => {
  const socket = webSocketService.getSocket();
  if (socket && socket.connected) {
    isConnected.value = true;
  } else {
    // 如果没有连接，尝试重新连接
    webSocketService.connect('http://localhost:3000');
  }
};

// 监听状态变化，自动保存
watch([irrigationStatus, manualMode, todayWaterUsage], () => {
  saveIrrigationState();
});

const irrigationSchedule = ref([
  { time: '08:00', duration: 30, area: '东区' },
  { time: '18:00', duration: 45, area: '西区' },
  { time: '22:00', duration: 20, area: '南区' }
]);

const irrigationZones = ref([
  { id: 1, name: '东区', area: 25, crop: '小麦', moisture: 65, status: '正常', controlStatus: '关闭' },
  { id: 2, name: '西区', area: 30, crop: '玉米', moisture: 55, status: '警告', controlStatus: '关闭' },
  { id: 3, name: '南区', area: 20, crop: '蔬菜', moisture: 70, status: '正常', controlStatus: '关闭' },
  { id: 4, name: '北区', area: 25, crop: '水果', moisture: 60, status: '正常', controlStatus: '关闭' }
]);

const handleIrrigationStatusUpdate = (data) => {
  irrigationStatus.value = data.status;
  lastIrrigation.value = data.lastIrrigation;
  nextIrrigation.value = data.nextIrrigation;
  todayWaterUsage.value = data.todayWaterUsage;
  manualMode.value = data.manualMode;
};

const handleInitData = (data) => {
  if (data.irrigationStatus) {
    handleIrrigationStatusUpdate(data.irrigationStatus);
  }
};

const startIrrigation = () => {
  irrigationStatus.value = '运行中';
  lastIrrigation.value = new Date().toLocaleString('zh-CN');
  
  // 发送灌溉状态更新
  webSocketService.emit('controlIrrigation', { action: 'start' });
  
  // 广播灌溉状态更新给其他组件
  webSocketService.emit('irrigationStatusUpdate', {
    status: '运行中',
    todayWaterUsage: todayWaterUsage.value
  });
};

const stopIrrigation = () => {
  irrigationStatus.value = '待机';
  
  // 发送灌溉停止命令
  webSocketService.emit('controlIrrigation', { action: 'stop' });
  
  // 广播灌溉状态更新给其他组件
  webSocketService.emit('irrigationStatusUpdate', {
    status: '待机',
    todayWaterUsage: todayWaterUsage.value
  });
};

const toggleManualMode = () => {
  manualMode.value = !manualMode.value;
  webSocketService.emit('updateIrrigationStatus', { manualMode: manualMode.value });
};

const controlZone = (zoneId) => {
  const zone = irrigationZones.value.find(z => z.id === zoneId);
  if (zone) {
    zone.controlStatus = zone.controlStatus === '开启' ? '关闭' : '开启';
  }
};

const editSchedule = (index) => {
  const schedule = irrigationSchedule.value[index];
  alert(`编辑灌溉计划: ${schedule.time} - ${schedule.area} - ${schedule.duration}分钟`);
};

const addSchedule = () => {
  alert('添加新的灌溉计划');
};

onMounted(() => {
  // 加载之前保存的灌溉状态
  loadIrrigationState();
  
  // 使用模拟连接状态（没有后端服务器）
  isConnected.value = true;
});

onUnmounted(() => {
  // 清理工作
});
</script>

<style scoped>
.irrigation-container {
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

.irrigation-status {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.status-card, .control-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.status-card h3, .control-card h3 {
  color: #2d5016;
  margin-bottom: 1rem;
  border-bottom: 2px solid #f0f7e6;
  padding-bottom: 0.5rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f7e6;
}

.status-label {
  color: #666;
  font-weight: 500;
}

.status-value {
  color: #2d5016;
  font-weight: bold;
}

.status-active {
  color: #28a745;
}

.status-idle {
  color: #6c757d;
}

.control-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.control-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.start-btn {
  background-color: #28a745;
  color: white;
}

.start-btn:hover:not(:disabled) {
  background-color: #218838;
}

.stop-btn {
  background-color: #dc3545;
  color: white;
}

.stop-btn:hover:not(:disabled) {
  background-color: #c82333;
}

.manual-btn {
  background-color: #ffc107;
  color: #212529;
}

.manual-btn:hover {
  background-color: #e0a800;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.schedule-section {
  margin-top: 1.5rem;
}

.schedule-section h4 {
  color: #2d5016;
  margin-bottom: 1rem;
}

.schedule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.edit-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.add-schedule-btn {
  margin-top: 1rem;
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.irrigation-zones {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.irrigation-zones h3 {
  color: #2d5016;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #f0f7e6;
  padding-bottom: 0.5rem;
}

.zones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.zone-card {
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 1rem;
  transition: all 0.3s;
}

.zone-card:hover {
  box-shadow: 0 4px 12px rgba(45, 80, 22, 0.15);
}

.zone-card h4 {
  color: #2d5016;
  margin-bottom: 0.75rem;
}

.zone-info p {
  margin: 0.25rem 0;
  color: #666;
}

.zone-active {
  color: #28a745;
  font-weight: bold;
}

.zone-warning {
  color: #ffc107;
  font-weight: bold;
}

.zone-control-btn {
  margin-top: 1rem;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #2d5016;
  border-radius: 4px;
  background-color: white;
  color: #2d5016;
  cursor: pointer;
  transition: all 0.3s;
}

.zone-control-btn:hover {
  background-color: #2d5016;
  color: white;
}

@media (max-width: 768px) {
  .irrigation-container {
    padding: 1rem;
  }

  .irrigation-status {
    grid-template-columns: 1fr;
  }

  .control-buttons {
    flex-direction: column;
  }

  .zones-grid {
    grid-template-columns: 1fr;
  }
}
</style>