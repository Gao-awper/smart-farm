<template>
  <div class="iot-container">
    <h1>🌐 物联网设备管理</h1>

    <div class="iot-tabs">
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

    <div v-if="activeTab === 'overview'" class="tab-content">
      <div class="stats-grid">
        <div class="stat-card">
          <h3>📡 传感器</h3>
          <div class="stat-value">{{ statistics.sensors.online }}/{{ statistics.sensors.total }}</div>
          <div class="stat-label">在线设备</div>
          <div class="stat-rate">{{ statistics.sensors.onlineRate }}%</div>
        </div>
        <div class="stat-card">
          <h3>⚙️ 控制设备</h3>
          <div class="stat-value">{{ statistics.devices.online }}/{{ statistics.devices.total }}</div>
          <div class="stat-label">在线设备</div>
          <div class="stat-rate">{{ statistics.devices.onlineRate }}%</div>
        </div>
        <div class="stat-card">
          <h3>🔔 告警</h3>
          <div class="stat-value">{{ statistics.alerts.unacknowledged }}</div>
          <div class="stat-label">未确认</div>
          <div class="stat-rate critical" v-if="statistics.alerts.critical > 0">
            {{ statistics.alerts.critical }} 严重
          </div>
        </div>
        <div class="stat-card">
          <h3>📊 模拟器</h3>
          <div class="stat-value" :class="{ running: simulatorStatus.running }">
            {{ simulatorStatus.running ? '运行中' : '已停止' }}
          </div>
          <div class="stat-label">传感器数据模拟</div>
          <div class="simulator-controls">
            <button 
              @click="handleToggleSimulator" 
              class="sim-btn"
              :disabled="!loggedIn"
              :class="{ 'disabled': !loggedIn }"
            >
              {{ loggedIn ? (simulatorStatus.running ? '停止模拟' : '启动模拟') : '请登录后操作' }}
            </button>
          </div>
        </div>
      </div>

      <div class="mqtt-info card">
        <h3>📡 MQTT连接信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">MQTT Broker</span>
            <span class="info-value">localhost:1883</span>
          </div>
          <div class="info-item">
            <span class="info-label">WebSocket桥接</span>
            <span class="info-value">localhost:8082</span>
          </div>
          <div class="info-item">
            <span class="info-label">协议</span>
            <span class="info-value">MQTT 3.1.1</span>
          </div>
          <div class="info-item">
            <span class="info-label">QoS等级</span>
            <span class="info-value">0 (最多一次)</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'sensors'" class="tab-content">
      <div class="section-header">
        <h3>📡 传感器列表</h3>
        <button @click="refreshSensors" class="refresh-btn">刷新</button>
      </div>
      <div class="devices-grid">
        <div
          v-for="sensor in sensors"
          :key="sensor.id"
          class="device-card sensor-card"
          :class="{ offline: sensor.status === 'offline' }"
        >
          <div class="device-header">
            <span class="device-icon">{{ getSensorIcon(sensor.type) }}</span>
            <span class="device-status" :class="sensor.status">{{ sensor.status }}</span>
          </div>
          <div class="device-name">{{ sensor.name }}</div>
          <div class="device-info">
            <div class="info-row">
              <span>类型</span>
              <span>{{ getSensorTypeName(sensor.type) }}</span>
            </div>
            <div class="info-row">
              <span>位置</span>
              <span>{{ sensor.location.zone }}</span>
            </div>
            <div class="info-row">
              <span>最后更新</span>
              <span>{{ formatTime(sensor.lastUpdate) }}</span>
            </div>
          </div>
          <div class="device-actions">
            <button @click="configureSensor(sensor)" class="config-btn">配置</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'devices'" class="tab-content">
      <div class="section-header">
        <h3>⚙️ 控制设备列表</h3>
        <button @click="refreshDevices" class="refresh-btn">刷新</button>
      </div>
      <div class="devices-grid">
        <div
          v-for="device in devices"
          :key="device.id"
          class="device-card control-card"
          :class="{ offline: device.status === 'offline' }"
        >
          <div class="device-header">
            <span class="device-icon">{{ getDeviceIcon(device.type) }}</span>
            <span class="device-status" :class="device.status">{{ device.status }}</span>
          </div>
          <div class="device-name">{{ device.name }}</div>
          <div class="device-info">
            <div class="info-row">
              <span>类型</span>
              <span>{{ getDeviceTypeName(device.type) }}</span>
            </div>
            <div class="info-row">
              <span>位置</span>
              <span>{{ device.location.zone }}</span>
            </div>
            <div class="info-row">
              <span>状态</span>
              <span class="status-text" :class="device.status">{{ getDeviceStatusText(device) }}</span>
            </div>
          </div>
          <div class="device-actions">
            <template v-if="device.type === 'valve'">
              <button
                v-if="device.status === 'closed'"
                @click="handleControlDevice(device, 'open')"
                class="control-btn start"
                :disabled="!loggedIn"
                :class="{ 'disabled': !loggedIn }"
              >
                开启
              </button>
              <button
                v-else
                @click="handleControlDevice(device, 'close')"
                class="control-btn stop"
                :disabled="!loggedIn"
                :class="{ 'disabled': !loggedIn }"
              >
                关闭
              </button>
            </template>
            <template v-else-if="device.type === 'pump'">
              <button
                v-if="device.status === 'idle'"
                @click="handleControlDevice(device, 'start')"
                class="control-btn start"
                :disabled="!loggedIn"
                :class="{ 'disabled': !loggedIn }"
              >
                启动
              </button>
              <button
                v-else
                @click="handleControlDevice(device, 'stop')"
                class="control-btn stop"
                :disabled="!loggedIn"
                :class="{ 'disabled': !loggedIn }"
              >
                停止
              </button>
            </template>
            <template v-else-if="device.type === 'light' || device.type === 'fan'">
              <button
                v-if="device.status === 'off'"
                @click="handleControlDevice(device, 'start')"
                class="control-btn start"
                :disabled="!loggedIn"
                :class="{ 'disabled': !loggedIn }"
              >
                开启
              </button>
              <button
                v-else
                @click="handleControlDevice(device, 'stop')"
                class="control-btn stop"
                :disabled="!loggedIn"
                :class="{ 'disabled': !loggedIn }"
              >
                关闭
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'alerts'" class="tab-content">
      <div class="section-header">
        <h3>🔔 告警记录</h3>
        <button @click="refreshAlerts" class="refresh-btn">刷新</button>
      </div>
      <div class="alerts-list">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          class="alert-item"
          :class="[alert.severity, { acknowledged: alert.acknowledged }]"
        >
          <div class="alert-icon">
            {{ alert.severity === 'critical' ? '🚨' : alert.severity === 'warning' ? '⚠️' : 'ℹ️' }}
          </div>
          <div class="alert-content">
            <div class="alert-message">{{ alert.message }}</div>
            <div class="alert-meta">
              <span class="alert-type">{{ alert.type }}</span>
              <span class="alert-time">{{ formatTime(alert.timestamp) }}</span>
            </div>
          </div>
          <div class="alert-actions">
            <button
              v-if="!alert.acknowledged"
              @click="handleAcknowledgeAlert(alert.id)"
              class="ack-btn"
              :disabled="!loggedIn"
              :class="{ 'disabled': !loggedIn }"
            >
              {{ loggedIn ? '确认' : '请登录' }}
            </button>
            <span v-else class="ack-status">已确认</span>
          </div>
        </div>
        <div v-if="alerts.length === 0" class="no-data">
          暂无告警记录
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'data'" class="tab-content">
      <div class="section-header">
        <h3>📊 实时数据监控</h3>
        <span class="data-status" :class="{ connected: isConnected }">
          {{ isConnected ? '实时连接中' : '连接断开' }}
        </span>
      </div>

      <div class="data-panels">
        <div class="data-panel card">
          <h4>🌱 土壤传感器数据</h4>
          <div class="data-grid">
            <div class="data-item">
              <span class="data-label">土壤温度</span>
              <span class="data-value">{{ realtimeData.soil?.temperature?.toFixed(1) || '--' }}°C</span>
            </div>
            <div class="data-item">
              <span class="data-label">土壤湿度</span>
              <span class="data-value">{{ realtimeData.soil?.moisture?.toFixed(1) || '--' }}%</span>
            </div>
            <div class="data-item">
              <span class="data-label">土壤pH</span>
              <span class="data-value">{{ realtimeData.soil?.ph?.toFixed(1) || '--' }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">氮含量</span>
              <span class="data-value">{{ realtimeData.soil?.nitrogen?.toFixed(0) || '--' }} mg/kg</span>
            </div>
          </div>
        </div>

        <div class="data-panel card">
          <h4>🌤️ 气象站数据</h4>
          <div class="data-grid">
            <div class="data-item">
              <span class="data-label">空气温度</span>
              <span class="data-value">{{ realtimeData.weather?.airTemperature?.toFixed(1) || '--' }}°C</span>
            </div>
            <div class="data-item">
              <span class="data-label">空气湿度</span>
              <span class="data-value">{{ realtimeData.weather?.airHumidity?.toFixed(1) || '--' }}%</span>
            </div>
            <div class="data-item">
              <span class="data-label">光照强度</span>
              <span class="data-value">{{ Math.round(realtimeData.weather?.lightIntensity / 1000) || '--' }} klux</span>
            </div>
            <div class="data-item">
              <span class="data-label">风速</span>
              <span class="data-value">{{ realtimeData.weather?.windSpeed?.toFixed(1) || '--' }} m/s</span>
            </div>
          </div>
        </div>

        <div class="data-panel card">
          <h4>💧 水质监测数据</h4>
          <div class="data-grid">
            <div class="data-item">
              <span class="data-label">水温</span>
              <span class="data-value">{{ realtimeData.water?.temperature?.toFixed(1) || '--' }}°C</span>
            </div>
            <div class="data-item">
              <span class="data-label">溶解氧</span>
              <span class="data-value">{{ realtimeData.water?.dissolvedOxygen?.toFixed(1) || '--' }} mg/L</span>
            </div>
            <div class="data-item">
              <span class="data-label">水质pH</span>
              <span class="data-value">{{ realtimeData.water?.ph?.toFixed(1) || '--' }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">浊度</span>
              <span class="data-value">{{ realtimeData.water?.turbidity?.toFixed(1) || '--' }} NTU</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mqtt-topics card">
        <h4>📡 MQTT主题</h4>
        <div class="topics-list">
          <div class="topic-item">
            <span class="topic-name">farm/sensor/soil/{sensor_id}</span>
            <span class="topic-desc">土壤传感器数据</span>
          </div>
          <div class="topic-item">
            <span class="topic-name">farm/sensor/weather/{sensor_id}</span>
            <span class="topic-desc">气象站数据</span>
          </div>
          <div class="topic-item">
            <span class="topic-name">farm/sensor/water/{sensor_id}</span>
            <span class="topic-desc">水质监测数据</span>
          </div>
          <div class="topic-item">
            <span class="topic-name">farm/device/control/{device_id}</span>
            <span class="topic-desc">设备控制指令</span>
          </div>
          <div class="topic-item">
            <span class="topic-name">farm/irrigation/{zone}/control</span>
            <span class="topic-desc">灌溉控制指令</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="configModal.show" class="modal" @click.self="configModal.show = false">
      <div class="modal-content">
        <h3>配置传感器</h3>
        <div class="form-group">
          <label>设备ID</label>
          <input type="text" v-model="configModal.sensor.id" disabled />
        </div>
        <div class="form-group">
          <label>设备名称</label>
          <input type="text" v-model="configModal.sensor.name" />
        </div>
        <div class="form-group">
          <label>采集间隔 (ms)</label>
          <input type="number" v-model="configModal.sensor.config.interval" min="1000" max="60000" />
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="configModal.sensor.config.enabled" />
            启用设备
          </label>
        </div>
        <div class="modal-actions">
          <button @click="configModal.show = false" class="btn-cancel">取消</button>
          <button @click="saveSensorConfig" class="btn-save">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import webSocketService from '../utils/websocket';
import { isLoggedIn } from '../utils/auth';
import { farmStore } from '../stores/farmStore';

const tabs = [
  { id: 'overview', label: '概览', icon: '📊' },
  { id: 'sensors', label: '传感器', icon: '📡' },
  { id: 'devices', label: '控制设备', icon: '⚙️' },
  { id: 'alerts', label: '告警', icon: '🔔' },
  { id: 'data', label: '实时数据', icon: '📈' }
];

const activeTab = ref('overview');
const sensors = ref([]);
const devices = ref([]);
const alerts = ref([]);
const isConnected = ref(false);

const statistics = reactive({
  sensors: { total: 0, online: 0, offline: 0, onlineRate: '0' },
  devices: { total: 0, online: 0, offline: 0, onlineRate: '0' },
  alerts: { total: 0, unacknowledged: 0, critical: 0 }
});

const simulatorStatus = reactive({ running: false });

// 检查登录状态
const loggedIn = computed(() => isLoggedIn());

const realtimeData = reactive({
  soil: {},
  weather: {},
  water: {}
});

const configModal = reactive({
  show: false,
  sensor: {
    id: '',
    name: '',
    config: { interval: 5000, enabled: true }
  }
});

let simulatorInterval = null;

// 本地存储键名
const STORAGE_KEYS = {
  sensors: 'iot_sensors',
  devices: 'iot_devices',
  alerts: 'iot_alerts',
  simulator: 'iot_simulator'
};

// 模拟传感器数据（默认数据）
const mockSensors = [
  { id: 'soil-001', name: '土壤传感器-A区', type: 'soil', status: 'online', location: { zone: 'A区-草莓园' }, lastUpdate: Date.now(), config: { interval: 5000, enabled: true } },
  { id: 'soil-002', name: '土壤传感器-B区', type: 'soil', status: 'online', location: { zone: 'B区-番茄园' }, lastUpdate: Date.now(), config: { interval: 5000, enabled: true } },
  { id: 'soil-003', name: '土壤传感器-C区', type: 'soil', status: 'offline', location: { zone: 'C区-蔬菜区' }, lastUpdate: Date.now() - 3600000, config: { interval: 5000, enabled: false } },
  { id: 'weather-001', name: '气象站-主站', type: 'weather', status: 'online', location: { zone: '中央监测区' }, lastUpdate: Date.now(), config: { interval: 3000, enabled: true } },
  { id: 'weather-002', name: '气象站-副站', type: 'weather', status: 'online', location: { zone: '温室大棚' }, lastUpdate: Date.now(), config: { interval: 3000, enabled: true } },
  { id: 'water-001', name: '水质监测站', type: 'water', status: 'online', location: { zone: '灌溉水池' }, lastUpdate: Date.now(), config: { interval: 10000, enabled: true } }
];

// 模拟控制设备数据（默认数据）
const mockDevices = [
  { id: 'valve-001', name: '灌溉阀门-A区', type: 'valve', status: 'closed', location: { zone: 'A区-草莓园' } },
  { id: 'valve-002', name: '灌溉阀门-B区', type: 'valve', status: 'open', location: { zone: 'B区-番茄园' } },
  { id: 'pump-001', name: '主水泵', type: 'pump', status: 'running', location: { zone: '泵房' } },
  { id: 'pump-002', name: '备用水泵', type: 'pump', status: 'idle', location: { zone: '泵房' } },
  { id: 'light-001', name: '补光灯-A区', type: 'light', status: 'on', location: { zone: 'A区-草莓园' } },
  { id: 'light-002', name: '补光灯-B区', type: 'light', status: 'off', location: { zone: 'B区-番茄园' } },
  { id: 'fan-001', name: '通风扇-温室', type: 'fan', status: 'on', location: { zone: '温室大棚' } }
];

// 模拟告警数据（默认数据）
const mockAlerts = [
  { id: 'alert-001', message: '土壤湿度低于阈值(35%)，建议灌溉', type: '土壤湿度告警', severity: 'warning', timestamp: Date.now() - 1800000, acknowledged: false },
  { id: 'alert-002', message: '空气温度过高(35°C)，已自动开启通风', type: '温度告警', severity: 'info', timestamp: Date.now() - 3600000, acknowledged: true },
  { id: 'alert-003', message: '传感器soil-003离线超过1小时', type: '设备离线', severity: 'critical', timestamp: Date.now() - 3600000, acknowledged: false }
];

// 从localStorage加载数据
const loadFromStorage = () => {
  try {
    const savedSensors = localStorage.getItem(STORAGE_KEYS.sensors);
    const savedDevices = localStorage.getItem(STORAGE_KEYS.devices);
    const savedAlerts = localStorage.getItem(STORAGE_KEYS.alerts);
    
    if (savedSensors) {
      sensors.value = JSON.parse(savedSensors);
    } else {
      sensors.value = JSON.parse(JSON.stringify(mockSensors));
    }
    
    if (savedDevices) {
      devices.value = JSON.parse(savedDevices);
    } else {
      devices.value = JSON.parse(JSON.stringify(mockDevices));
    }
    
    if (savedAlerts) {
      alerts.value = JSON.parse(savedAlerts);
    } else {
      alerts.value = JSON.parse(JSON.stringify(mockAlerts));
    }
  } catch (error) {
    console.error('加载数据失败:', error);
    // 使用默认数据
    sensors.value = JSON.parse(JSON.stringify(mockSensors));
    devices.value = JSON.parse(JSON.stringify(mockDevices));
    alerts.value = JSON.parse(JSON.stringify(mockAlerts));
  }
};

// 保存数据到localStorage
const saveToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEYS.sensors, JSON.stringify(sensors.value));
    localStorage.setItem(STORAGE_KEYS.devices, JSON.stringify(devices.value));
    localStorage.setItem(STORAGE_KEYS.alerts, JSON.stringify(alerts.value));
  } catch (error) {
    console.error('保存数据失败:', error);
  }
};

const fetchDevices = async () => {
  // 从localStorage加载数据，若无则使用默认模拟数据
  loadFromStorage();
  updateStatistics();
};

const fetchStatistics = async () => {
  updateStatistics();
};

const fetchAlerts = async () => {
  // 先从localStorage加载保存的告警状态，若无则使用默认模拟数据
  const savedAlerts = localStorage.getItem(STORAGE_KEYS.alerts);
  if (savedAlerts) {
    alerts.value = JSON.parse(savedAlerts);
  } else {
    alerts.value = JSON.parse(JSON.stringify(mockAlerts));
  }
};

const updateStatistics = () => {
  // 传感器统计
  const sensorOnline = sensors.value.filter(s => s.status === 'online').length;
  statistics.sensors.total = sensors.value.length;
  statistics.sensors.online = sensorOnline;
  statistics.sensors.offline = sensors.value.length - sensorOnline;
  statistics.sensors.onlineRate = sensors.value.length > 0 ? ((sensorOnline / sensors.value.length) * 100).toFixed(0) : '0';

  // 设备统计
  const deviceOnline = devices.value.filter(d => d.status !== 'offline').length;
  statistics.devices.total = devices.value.length;
  statistics.devices.online = deviceOnline;
  statistics.devices.offline = devices.value.length - deviceOnline;
  statistics.devices.onlineRate = devices.value.length > 0 ? ((deviceOnline / devices.value.length) * 100).toFixed(0) : '0';

  // 告警统计
  statistics.alerts.total = alerts.value.length;
  statistics.alerts.unacknowledged = alerts.value.filter(a => !a.acknowledged).length;
  statistics.alerts.critical = alerts.value.filter(a => a.severity === 'critical' && !a.acknowledged).length;
};

const refreshSensors = () => {
  fetchDevices();
};

const refreshDevices = () => {
  fetchDevices();
};

const refreshAlerts = () => {
  fetchAlerts();
};

// 权限检查处理函数
const requireLogin = (action) => {
  if (!loggedIn.value) {
    alert('请先登录后再进行操作！');
    return false;
  }
  action();
  return true;
};

// 模拟器控制（带权限检查）
const handleToggleSimulator = () => requireLogin(toggleSimulator);

// 设备控制（带权限检查）
const handleControlDevice = (device, action) => requireLogin(() => controlDevice(device, action));

// 告警确认（带权限检查）
const handleAcknowledgeAlert = (id) => requireLogin(() => acknowledgeAlert(id));

const toggleSimulator = async () => {
  if (simulatorStatus.running) {
    // 停止模拟器
    if (simulatorInterval) {
      clearInterval(simulatorInterval);
      simulatorInterval = null;
    }
    simulatorStatus.running = false;
    isConnected.value = false;
    // 保存模拟器状态
    localStorage.setItem(STORAGE_KEYS.simulator, JSON.stringify({ running: false }));
  } else {
    // 启动模拟器
    simulatorStatus.running = true;
    isConnected.value = true;
    
    // 初始化模拟数据
    generateRealtimeData();
    
    // 每2秒更新一次数据
    simulatorInterval = setInterval(() => {
      generateRealtimeData();
    }, 2000);
    
    // 保存模拟器状态
    localStorage.setItem(STORAGE_KEYS.simulator, JSON.stringify({ running: true }));
  }
};

const generateRealtimeData = () => {
  // 土壤传感器数据
  realtimeData.soil = {
    temperature: 22 + Math.random() * 4,
    moisture: 45 + Math.random() * 20,
    ph: 6.2 + Math.random() * 0.8,
    nitrogen: 120 + Math.random() * 40
  };

  // 气象站数据
  realtimeData.weather = {
    airTemperature: 26 + Math.random() * 6,
    airHumidity: 60 + Math.random() * 25,
    lightIntensity: 20000 + Math.random() * 30000,
    windSpeed: Math.random() * 3
  };

  // 水质监测数据
  realtimeData.water = {
    temperature: 20 + Math.random() * 3,
    dissolvedOxygen: 6 + Math.random() * 2,
    ph: 7.0 + Math.random() * 0.6,
    turbidity: 5 + Math.random() * 5
  };

  // 发送传感器数据更新到WebSocket
  const sensorDataUpdate = {
    airTemperature: realtimeData.weather.airTemperature,
    airHumidity: realtimeData.weather.airHumidity,
    lightIntensity: realtimeData.weather.lightIntensity,
    soilMoisture: realtimeData.soil.moisture,
    soilTemperature: realtimeData.soil.temperature,
    soilPh: parseFloat(realtimeData.soil.ph.toFixed(1))
  };
  
  // 保存到localStorage供其他组件使用
  localStorage.setItem('sensor_data', JSON.stringify(sensorDataUpdate));
  
  // 通过WebSocket广播数据更新
  try {
    webSocketService.emit('sensorDataUpdate', sensorDataUpdate);
  } catch (e) {
    console.log('WebSocket not connected, using localStorage');
  }
};

const configureSensor = (sensor) => {
  configModal.sensor = JSON.parse(JSON.stringify(sensor));
  configModal.show = true;
};

const saveSensorConfig = async () => {
  const index = sensors.value.findIndex(s => s.id === configModal.sensor.id);
  if (index !== -1) {
    sensors.value[index].name = configModal.sensor.name;
    sensors.value[index].config = configModal.sensor.config;
    // 根据启用状态更新传感器状态
    sensors.value[index].status = configModal.sensor.config.enabled ? 'online' : 'offline';
    // 更新最后更新时间
    sensors.value[index].lastUpdate = Date.now();
  }
  updateStatistics();
  // 保存到本地存储
  saveToStorage();
  configModal.show = false;
};

const controlDevice = async (device, command) => {
  const index = devices.value.findIndex(d => d.id === device.id);
  if (index !== -1) {
    const deviceItem = devices.value[index];
    
    if (deviceItem.type === 'valve') {
      deviceItem.status = command === 'open' ? 'open' : 'closed';
    } else if (deviceItem.type === 'pump') {
      deviceItem.status = command === 'start' ? 'running' : 'idle';
    } else if (deviceItem.type === 'light' || deviceItem.type === 'fan') {
      deviceItem.status = command === 'start' ? 'on' : 'off';
    }
  }
  updateStatistics();
  // 保存到本地存储
  saveToStorage();
};

const acknowledgeAlert = async (alertId) => {
  const alert = alerts.value.find(a => a.id === alertId);
  if (alert) {
    alert.acknowledged = true;
    // 同时更新 farmStore 中的告警状态，确保数据同步
    farmStore.acknowledgeAlert(alertId);
  }
  updateStatistics();
  // 保存到本地存储
  saveToStorage();
};

const getSensorIcon = (type) => {
  const icons = { soil: '🌱', weather: '🌤️', water: '💧' };
  return icons[type] || '📡';
};

const getSensorTypeName = (type) => {
  const names = { soil: '土壤传感器', weather: '气象站', water: '水质监测' };
  return names[type] || '传感器';
};

const getDeviceIcon = (type) => {
  const icons = { pump: '💦', valve: '🔧', light: '💡', fan: '🌀' };
  return icons[type] || '⚙️';
};

const getDeviceTypeName = (type) => {
  const names = { pump: '水泵', valve: '阀门', light: '补光灯', fan: '通风扇' };
  return names[type] || '设备';
};

const getDeviceStatusText = (device) => {
  if (device.status === 'offline') return '离线';
  if (device.type === 'valve') {
    return device.status === 'open' ? '开启' : '关闭';
  }
  if (device.type === 'pump') {
    return device.status === 'running' ? '运行中' : '待机';
  }
  if (device.type === 'light' || device.type === 'fan') {
    return device.status === 'on' || device.status === 'running' ? '开启' : '关闭';
  }
  return device.status;
};

const formatTime = (time) => {
  if (!time) return '--';
  const date = new Date(time);
  return date.toLocaleString('zh-CN');
};

onMounted(() => {
  fetchDevices();
  fetchAlerts();
  
  // 检查之前的模拟器状态，如果是运行状态则自动启动
  const savedSimulator = localStorage.getItem(STORAGE_KEYS.simulator);
  if (savedSimulator) {
    const simulatorData = JSON.parse(savedSimulator);
    if (simulatorData.running) {
      // 自动启动模拟器
      simulatorStatus.running = true;
      isConnected.value = true;
      generateRealtimeData();
      simulatorInterval = setInterval(() => {
        generateRealtimeData();
      }, 2000);
    }
  }
});

onUnmounted(() => {
  // 页面切换时不要停止模拟器，保持运行状态
  // 只在真正关闭应用时停止
});
</script>

<style scoped>
.iot-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  color: #2d5016;
  margin-bottom: 1.5rem;
  text-align: center;
}

.iot-tabs {
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #666;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #2d5016;
  margin-bottom: 0.25rem;
}

.stat-value.running {
  color: #28a745;
}

.stat-label {
  font-size: 0.85rem;
  color: #999;
  margin-bottom: 0.5rem;
}

.stat-rate {
  font-size: 0.85rem;
  color: #28a745;
}

.stat-rate.critical {
  color: #dc3545;
  font-weight: bold;
}

.simulator-controls {
  margin-top: 0.75rem;
}

.sim-btn {
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.sim-btn:hover {
  background: #0056b3;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.card h3, .card h4 {
  color: #2d5016;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f7e6;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.info-value {
  font-size: 1rem;
  font-weight: bold;
  color: #2d5016;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  margin: 0;
  color: #2d5016;
}

.refresh-btn {
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.refresh-btn:hover {
  background: #545b62;
}

.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.device-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.device-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.device-card.offline {
  opacity: 0.6;
}

.device-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.device-icon {
  font-size: 1.5rem;
}

.device-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
}

.device-status.online,
.device-status.open,
.device-status.running,
.device-status.on {
  background: #d4edda;
  color: #155724;
}

.device-status.offline,
.device-status.closed,
.device-status.idle,
.device-status.off {
  background: #f8d7da;
  color: #721c24;
}

.device-name {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.75rem;
}

.device-info {
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  font-size: 0.85rem;
}

.info-row span:first-child {
  color: #666;
}

.info-row span:last-child {
  color: #333;
  font-weight: 500;
}

.status-text.running,
.status-text.open,
.status-text.on {
  color: #28a745;
}

.status-text.closed,
.status-text.idle,
.status-text.off {
  color: #6c757d;
}

.device-actions {
  display: flex;
  gap: 0.5rem;
}

.config-btn,
.control-btn {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: bold;
}

.config-btn {
  background: #007bff;
  color: white;
}

.control-btn.start {
  background: #28a745;
  color: white;
}

.control-btn.stop {
  background: #dc3545;
  color: white;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #ffc107;
}

.alert-item.critical {
  border-left-color: #dc3545;
}

.alert-item.warning {
  border-left-color: #ffc107;
}

.alert-item.info {
  border-left-color: #17a2b8;
}

.alert-item.acknowledged {
  opacity: 0.6;
}

.alert-icon {
  font-size: 1.5rem;
}

.alert-content {
  flex: 1;
}

.alert-message {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}

.alert-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #666;
}

.alert-actions {
  min-width: 80px;
  text-align: right;
}

.ack-btn {
  padding: 0.4rem 0.8rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.ack-status {
  font-size: 0.8rem;
  color: #28a745;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #999;
  background: white;
  border-radius: 8px;
}

.data-status {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.85rem;
  background: #f8d7da;
  color: #721c24;
}

.data-status.connected {
  background: #d4edda;
  color: #155724;
}

.data-panels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.data-panel h4 {
  margin-bottom: 1rem;
  font-size: 1rem;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.data-item {
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
}

.data-label {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.data-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2d5016;
}

.topics-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.topic-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.topic-name {
  font-family: monospace;
  font-size: 0.9rem;
  color: #2d5016;
}

.topic-desc {
  font-size: 0.85rem;
  color: #666;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  min-width: 400px;
  max-width: 90%;
}

.modal-content h3 {
  margin: 0 0 1.5rem 0;
  color: #2d5016;
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

.form-group input[type="text"],
.form-group input[type="number"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.form-group input:disabled {
  background: #f8f9fa;
  color: #666;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-cancel,
.btn-save {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-save {
  background: #2d5016;
  color: white;
}

@media (max-width: 768px) {
  .iot-container {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .devices-grid {
    grid-template-columns: 1fr;
  }

  .data-panels {
    grid-template-columns: 1fr;
  }
}
</style>