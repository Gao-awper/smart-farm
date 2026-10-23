// 绿野智农类型定义

// 作物类型
export interface Crop {
  id: number;
  name: string;
  type: string;
  area: number;
  status: string;
  expectedHarvest: string;
  plantedDate: string;
  yield: number;
}

// 灌溉区域类型
export interface IrrigationZone {
  id: number;
  name: string;
  area: number;
  status: string;
  lastIrrigation: string;
  nextIrrigation: string;
  schedule: string;
  waterAmount: number;
}

// 用户类型
export interface User {
  id: number;
  nickname: string;
  email: string;
  phone: string;
  sex: string;
  identity: string;
  createdAt?: string;
}

// 设备类型
export interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
  location: string;
  lastOnline?: string;
  config?: {
    interval: number;
    enabled: boolean;
  };
}

// 告警类型
export interface Alert {
  id: string;
  message: string;
  type: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: number;
  acknowledged: boolean;
}

// 传感器数据类型
export interface SensorData {
  soil?: {
    temperature: number;
    moisture: number;
    ph: number;
    nitrogen: number;
  };
  weather?: {
    airTemperature: number;
    airHumidity: number;
    lightIntensity: number;
    windSpeed: number;
  };
  water?: {
    temperature: number;
    dissolvedOxygen: number;
    ph: number;
    turbidity: number;
  };
}

// 农事活动类型
export interface FarmingActivity {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'planting' | 'irrigation' | 'fertilizing' | 'harvesting' | 'pruning' | 'pest-control';
  status: 'pending' | 'in-progress' | 'completed';
  cropIds: number[];
}

// 统计数据类型
export interface Statistics {
  totalArea: number;
  activeUsers: number;
  onlineDevices: number;
  unacknowledgedAlerts: number;
  cropStats: Record<string, number>;
}
