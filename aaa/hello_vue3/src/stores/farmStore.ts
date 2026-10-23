// 绿野智农数据管理Store
// 采用响应式状态管理模式，统一管理农场数据

import { reactive, computed } from 'vue';
import type { Crop, IrrigationZone, User, Device, SensorData, Alert } from '../types';

// 本地存储键名
const STORAGE_KEYS = {
  CROPS: 'smart_farm_crops',
  IRRIGATION_ZONES: 'smart_farm_irrigation_zones',
  USERS: 'smart_farm_users',
  DEVICES: 'smart_farm_devices',
  SENSORS: 'smart_farm_sensors',
  ALERTS: 'smart_farm_alerts'
};

// 默认数据
const DEFAULT_CROPS: Crop[] = [
  { id: 1, name: '小麦', type: '粮食作物', area: 25, status: '生长中', expectedHarvest: '2026-06-15', plantedDate: '2026-03-01', yield: 500 },
  { id: 2, name: '玉米', type: '粮食作物', area: 30, status: '生长中', expectedHarvest: '2026-07-15', plantedDate: '2026-04-01', yield: 600 },
  { id: 3, name: '草莓', type: '水果', area: 20, status: '生长中', expectedHarvest: '2026-05-20', plantedDate: '2026-02-15', yield: 300 },
  { id: 4, name: '黄瓜', type: '蔬菜', area: 15, status: '生长中', expectedHarvest: '2026-05-05', plantedDate: '2026-03-10', yield: 400 },
  { id: 5, name: '番茄', type: '蔬菜', area: 10, status: '生长中', expectedHarvest: '2026-05-25', plantedDate: '2026-03-15', yield: 350 }
];

const DEFAULT_IRRIGATION_ZONES: IrrigationZone[] = [
  { id: 1, name: 'A区-草莓园', area: 20, status: '正常', lastIrrigation: '2026-05-25 08:00', nextIrrigation: '2026-05-26 08:00', schedule: '每日', waterAmount: 50 },
  { id: 2, name: 'B区-番茄园', area: 10, status: '正常', lastIrrigation: '2026-05-25 09:00', nextIrrigation: '2026-05-26 09:00', schedule: '每日', waterAmount: 30 },
  { id: 3, name: 'C区-蔬菜区', area: 15, status: '警告', lastIrrigation: '2026-05-24 07:30', nextIrrigation: '2026-05-25 18:00', schedule: '每日', waterAmount: 45 },
  { id: 4, name: 'D区-粮食区', area: 55, status: '正常', lastIrrigation: '2026-05-25 06:00', nextIrrigation: '2026-05-26 06:00', schedule: '每两天', waterAmount: 100 }
];

const DEFAULT_USERS: User[] = [
  { id: 1, nickname: 'admin', email: 'admin@smartfarm.com', phone: '13800138001', sex: '男', identity: 'admin', createdAt: '2026-01-01' },
  { id: 2, nickname: 'farmer', email: 'farmer@smartfarm.com', phone: '13800138002', sex: '男', identity: 'regular', createdAt: '2026-02-15' },
  { id: 3, nickname: 'technician', email: 'technician@smartfarm.com', phone: '13800138003', sex: '女', identity: 'regular', createdAt: '2026-03-01' },
  { id: 4, nickname: '志远', email: '123@qq.com', phone: '13800138004', sex: '男', identity: 'regular', createdAt: '2026-03-15' },
  { id: 5, nickname: '高', email: 'gao@smartfarm.com', phone: '13800138005', sex: '女', identity: 'farmer', createdAt: '2026-04-01' }
];

const DEFAULT_DEVICES: Device[] = [
  { id: 'soil-001', name: '土壤传感器-A区', type: 'soil', status: 'online', location: 'A区-草莓园', lastOnline: new Date().toISOString(), config: { interval: 5000, enabled: true } },
  { id: 'soil-002', name: '土壤传感器-B区', type: 'soil', status: 'online', location: 'B区-番茄园', lastOnline: new Date().toISOString(), config: { interval: 5000, enabled: true } },
  { id: 'soil-003', name: '土壤传感器-C区', type: 'soil', status: 'offline', location: 'C区-蔬菜区', lastOnline: new Date(Date.now() - 3600000).toISOString(), config: { interval: 5000, enabled: false } },
  { id: 'weather-001', name: '气象站-主站', type: 'weather', status: 'online', location: '中央监测区', lastOnline: new Date().toISOString(), config: { interval: 3000, enabled: true } },
  { id: 'valve-001', name: '灌溉阀门-A区', type: 'valve', status: 'closed', location: 'A区-草莓园' },
  { id: 'valve-002', name: '灌溉阀门-B区', type: 'valve', status: 'open', location: 'B区-番茄园' },
  { id: 'pump-001', name: '主水泵', type: 'pump', status: 'running', location: '泵房' }
];

const DEFAULT_ALERTS: Alert[] = [
  { id: 'alert-001', message: '土壤湿度低于阈值(35%)，建议灌溉', type: '土壤湿度告警', severity: 'warning', timestamp: Date.now() - 1800000, acknowledged: false },
  { id: 'alert-002', message: '空气温度过高(35°C)，已自动开启通风', type: '温度告警', severity: 'info', timestamp: Date.now() - 3600000, acknowledged: true },
  { id: 'alert-003', message: '传感器soil-003离线超过1小时', type: '设备离线', severity: 'critical', timestamp: Date.now() - 3600000, acknowledged: false }
];

// 读取localStorage数据
const loadFromStorage = <T>(key: string, defaultValue: T[]): T[] => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  } catch {
    return defaultValue;
  }
};

// 保存到localStorage
const saveToStorage = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('保存数据失败:', error);
  }
};

// 数据完整性检查：确保用户数据包含必要的用户
const ensureUsersIntegrity = (): User[] => {
  const stored = loadFromStorage<User>(STORAGE_KEYS.USERS, DEFAULT_USERS);
  const hasZhiyuan = stored.find(u => u.nickname === '志远');
  const hasGao = stored.find(u => u.nickname === '高');
  // 如果缺少必要用户，重置为默认数据
  if (!hasZhiyuan || !hasGao || stored.length < 5) {
    saveToStorage(STORAGE_KEYS.USERS, DEFAULT_USERS);
    return [...DEFAULT_USERS];
  }
  return stored;
};

// 响应式状态
const state = reactive({
  // 作物数据
  crops: loadFromStorage<Crop>(STORAGE_KEYS.CROPS, DEFAULT_CROPS),
  
  // 灌溉区域数据
  irrigationZones: loadFromStorage<IrrigationZone>(STORAGE_KEYS.IRRIGATION_ZONES, DEFAULT_IRRIGATION_ZONES),
  
  // 用户数据（带完整性检查）
  users: ensureUsersIntegrity(),
  
  // 设备数据
  devices: loadFromStorage<Device>(STORAGE_KEYS.DEVICES, DEFAULT_DEVICES),
  
  // 告警数据
  alerts: loadFromStorage<Alert>(STORAGE_KEYS.ALERTS, DEFAULT_ALERTS),
  
  // 实时传感器数据
  realtimeData: {
    soil: { temperature: 22, moisture: 55, ph: 6.5, nitrogen: 140 },
    weather: { airTemperature: 26, airHumidity: 65, lightIntensity: 35000, windSpeed: 1.5 },
    water: { temperature: 20, dissolvedOxygen: 7.2, ph: 7.0, turbidity: 8 }
  },
  
  // 当前用户
  currentUser: null as User | null,
  
  // 系统状态
  systemStatus: {
    isOnline: true,
    lastSync: Date.now()
  }
});

// 计算属性
const getters = {
  // 总种植面积
  totalArea: computed(() => state.crops.reduce((sum, crop) => sum + crop.area, 0)),
  
  // 活跃用户数
  activeUsers: computed(() => state.users.length),
  
  // 在线设备数
  onlineDevices: computed(() => state.devices.filter(d => d.status === 'online').length),
  
  // 未确认告警数
  unacknowledgedAlerts: computed(() => state.alerts.filter(a => !a.acknowledged).length),
  
  // 作物统计
  cropStats: computed(() => {
    const stats: Record<string, number> = {};
    state.crops.forEach(crop => {
      stats[crop.type] = (stats[crop.type] || 0) + crop.area;
    });
    return stats;
  })
};

// 动作方法
const actions = {
  // 作物管理
  addCrop(crop: Omit<Crop, 'id'>): void {
    const newId = Math.max(...state.crops.map(c => c.id), 0) + 1;
    state.crops.push({ ...crop, id: newId });
    saveToStorage(STORAGE_KEYS.CROPS, state.crops);
  },
  
  updateCrop(id: number, updates: Partial<Crop>): void {
    const crop = state.crops.find(c => c.id === id);
    if (crop) {
      Object.assign(crop, updates);
      saveToStorage(STORAGE_KEYS.CROPS, state.crops);
    }
  },
  
  deleteCrop(id: number): void {
    state.crops = state.crops.filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.CROPS, state.crops);
  },
  
  // 灌溉区域管理
  addIrrigationZone(zone: Omit<IrrigationZone, 'id'>): void {
    const newId = Math.max(...state.irrigationZones.map(z => z.id), 0) + 1;
    state.irrigationZones.push({ ...zone, id: newId });
    saveToStorage(STORAGE_KEYS.IRRIGATION_ZONES, state.irrigationZones);
  },
  
  updateIrrigationZone(id: number, updates: Partial<IrrigationZone>): void {
    const zone = state.irrigationZones.find(z => z.id === id);
    if (zone) {
      Object.assign(zone, updates);
      saveToStorage(STORAGE_KEYS.IRRIGATION_ZONES, state.irrigationZones);
    }
  },
  
  deleteIrrigationZone(id: number): void {
    state.irrigationZones = state.irrigationZones.filter(z => z.id !== id);
    saveToStorage(STORAGE_KEYS.IRRIGATION_ZONES, state.irrigationZones);
  },
  
  // 用户管理
  addUser(user: Omit<User, 'id' | 'createdAt'>): void {
    const newId = Math.max(...state.users.map(u => u.id), 0) + 1;
    state.users.push({ ...user, id: newId, createdAt: new Date().toISOString().split('T')[0] });
    saveToStorage(STORAGE_KEYS.USERS, state.users);
  },
  
  updateUser(id: number, updates: Partial<User>): void {
    const user = state.users.find(u => u.id === id);
    if (user) {
      Object.assign(user, updates);
      saveToStorage(STORAGE_KEYS.USERS, state.users);
    }
  },
  
  deleteUser(id: number): void {
    state.users = state.users.filter(u => u.id !== id);
    saveToStorage(STORAGE_KEYS.USERS, state.users);
  },
  
  // 设备管理
  updateDeviceStatus(deviceId: string, status: string): void {
    const index = state.devices.findIndex(d => d.id === deviceId);
    if (index !== -1) {
      const device = state.devices[index];
      if (device) {
        device.status = status;
        device.lastOnline = new Date().toISOString();
        saveToStorage(STORAGE_KEYS.DEVICES, state.devices);
      }
    }
  },
  
  updateDeviceConfig(deviceId: string, config: { interval: number; enabled: boolean }): void {
    const index = state.devices.findIndex(d => d.id === deviceId);
    if (index !== -1) {
      const device = state.devices[index];
      if (device) {
        device.config = config;
        device.status = config.enabled ? 'online' : 'offline';
        saveToStorage(STORAGE_KEYS.DEVICES, state.devices);
      }
    }
  },
  
  // 告警管理
  acknowledgeAlert(alertId: string): void {
    const alert = state.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      saveToStorage(STORAGE_KEYS.ALERTS, state.alerts);
    }
  },
  
  addAlert(alert: Omit<Alert, 'id'>): void {
    const newId = `alert-${Date.now()}`;
    state.alerts.unshift({ ...alert, id: newId });
    saveToStorage(STORAGE_KEYS.ALERTS, state.alerts);
  },
  
  // 用户认证
  setCurrentUser(user: User | null): void {
    state.currentUser = user;
  },
  
  // 更新实时数据
  updateRealtimeData(data: Partial<SensorData>): void {
    if (data.soil) Object.assign(state.realtimeData.soil, data.soil);
    if (data.weather) Object.assign(state.realtimeData.weather, data.weather);
    if (data.water) Object.assign(state.realtimeData.water, data.water);
  },
  
  // 智能灌溉决策
  calculateIrrigationRecommendation(): { needIrrigation: boolean; zones: string[]; reason: string } {
    const { soil, weather } = state.realtimeData;
    const needIrrigation = soil.moisture < 40 || (weather.airTemperature > 30 && soil.moisture < 50);
    
    const zonesNeedingIrrigation = state.irrigationZones
      .filter(z => z.status === '警告' || z.status === '正常')
      .map(z => z.name);
    
    let reason = '';
    if (soil.moisture < 35) {
      reason = `土壤湿度(${soil.moisture}%)过低，需要立即灌溉`;
    } else if (soil.moisture < 45) {
      reason = `土壤湿度(${soil.moisture}%)偏低，建议在2小时内灌溉`;
    } else if (weather.airTemperature > 32) {
      reason = `气温较高(${weather.airTemperature}°C)，建议提前灌溉降温`;
    } else {
      reason = '当前条件适宜，暂不需要灌溉';
    }
    
    return { needIrrigation, zones: zonesNeedingIrrigation, reason };
  },
  
  // 产量预测
  predictYield(cropId: number): number {
    const crop = state.crops.find(c => c.id === cropId);
    if (!crop) return 0;
    
    const { soil, weather } = state.realtimeData;
    const baseYield = crop.yield;
    
    // 根据环境因素调整产量预测
    let adjustment = 1;
    if (soil.moisture < 40) adjustment *= 0.85;
    else if (soil.moisture > 70) adjustment *= 0.9;
    
    if (weather.airTemperature < 15 || weather.airTemperature > 35) adjustment *= 0.9;
    
    if (soil.ph < 5.5 || soil.ph > 7.5) adjustment *= 0.92;
    
    return Math.round(baseYield * adjustment * crop.area);
  },
  
  // 刷新所有数据
  refreshAll(): void {
    state.crops = loadFromStorage(STORAGE_KEYS.CROPS, DEFAULT_CROPS);
    state.irrigationZones = loadFromStorage(STORAGE_KEYS.IRRIGATION_ZONES, DEFAULT_IRRIGATION_ZONES);
    state.users = loadFromStorage(STORAGE_KEYS.USERS, DEFAULT_USERS);
    state.devices = loadFromStorage(STORAGE_KEYS.DEVICES, DEFAULT_DEVICES);
    state.alerts = loadFromStorage(STORAGE_KEYS.ALERTS, DEFAULT_ALERTS);
  }
};

// 导出Store
export const farmStore = {
  state,
  ...getters,
  ...actions,
  actions
};

export type { Crop, IrrigationZone, User, Device, Alert };
