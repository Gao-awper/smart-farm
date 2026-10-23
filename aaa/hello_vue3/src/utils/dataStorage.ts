// 数据存储工具 - 用于管理员页面和首页的数据同步

// 存储键名
const STORAGE_KEYS = {
  CROPS: 'smart_farm_crops',
  IRRIGATION_ZONES: 'smart_farm_irrigation_zones',
  USERS: 'smart_farm_users',
  DEVICES: 'smart_farm_devices'
};

// 默认数据
const DEFAULT_CROPS = [
  { id: 1, name: '小麦', type: '粮食作物', area: 25, status: '生长中', expectedHarvest: '2026-06-15' },
  { id: 2, name: '玉米', type: '粮食作物', area: 30, status: '生长中', expectedHarvest: '2026-07-15' },
  { id: 3, name: '桃子', type: '水果', area: 25, status: '生长中', expectedHarvest: '2026-05-10' },
  { id: 4, name: '黄瓜', type: '蔬菜', area: 20, status: '生长中', expectedHarvest: '2026-05-05' },
  { id: 5, name: '小米', type: '粮食作物', area: 0, status: '生长中', expectedHarvest: '2026-07-20' }
];

const DEFAULT_IRRIGATION_ZONES = [
  { id: 1, name: '东区灌溉区', area: 25, status: '正常', lastIrrigation: '2026-03-10 08:00', nextIrrigation: '2026-03-11 08:00' },
  { id: 2, name: '西区灌溉区', area: 30, status: '警告', lastIrrigation: '2026-03-09 09:00', nextIrrigation: '2026-03-11 09:00' },
  { id: 3, name: '南区灌溉区', area: 20, status: '正常', lastIrrigation: '2026-03-10 07:30', nextIrrigation: '2026-03-11 07:30' },
  { id: 4, name: '北区灌溉区', area: 25, status: '正常', lastIrrigation: '2026-03-10 08:30', nextIrrigation: '2026-03-11 08:30' }
];

const DEFAULT_USERS = [
  { id: 1, nickname: 'admin', email: 'admin@smartfarm.com', phone: '13800138001', sex: '男', identity: 'admin' },
  { id: 2, nickname: 'farmer', email: 'farmer@smartfarm.com', phone: '13800138002', sex: '男', identity: 'regular' },
  { id: 3, nickname: 'technician', email: 'technician@smartfarm.com', phone: '13800138003', sex: '女', identity: 'regular' },
  { id: 4, nickname: '志远', email: '123@qq.com', phone: '15687941516', sex: '男', identity: 'regular' },
  { id: 5, nickname: '高', email: 'gao@smartfarm.com', phone: '13900139000', sex: '男', identity: 'farmer' }
];

const DEFAULT_DEVICES = [
  { id: 1, name: '土壤传感器1', type: '土壤传感器', status: '在线', location: '东区', lastOnline: '2026-03-10 10:00' },
  { id: 2, name: '气象站1', type: '气象站', status: '在线', location: '西区', lastOnline: '2026-03-10 10:05' },
  { id: 3, name: '灌溉控制器1', type: '灌溉控制器', status: '离线', location: '南区', lastOnline: '2026-03-09 18:00' },
  { id: 4, name: '摄像头1', type: '监控摄像头', status: '在线', location: '北区', lastOnline: '2026-03-10 10:10' }
];

// 获取存储的数据，如果不存在则返回默认数据
export const getStoredData = <T>(key: string, defaultValue: T[]): T[] => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    // 如果没有存储数据，保存默认数据并返回
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  } catch (error) {
    console.error('读取存储数据失败:', error);
    return defaultValue;
  }
};

// 重置所有数据为默认值
export const resetAllData = (): void => {
  localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(DEFAULT_CROPS));
  localStorage.setItem(STORAGE_KEYS.IRRIGATION_ZONES, JSON.stringify(DEFAULT_IRRIGATION_ZONES));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
  localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(DEFAULT_DEVICES));
};

// 保存数据到 localStorage
export const saveData = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('保存数据失败:', error);
  }
};

// 作物管理
export const getCrops = (): Crop[] => {
  return getStoredData<Crop>(STORAGE_KEYS.CROPS, DEFAULT_CROPS);
};

export const saveCrops = (crops: Crop[]): void => {
  saveData<Crop>(STORAGE_KEYS.CROPS, crops);
};

// 灌溉区域管理
export const getIrrigationZones = (): IrrigationZone[] => {
  return getStoredData<IrrigationZone>(STORAGE_KEYS.IRRIGATION_ZONES, DEFAULT_IRRIGATION_ZONES);
};

export const saveIrrigationZones = (zones: IrrigationZone[]): void => {
  saveData<IrrigationZone>(STORAGE_KEYS.IRRIGATION_ZONES, zones);
};

// 用户管理
export const getUsers = (): User[] => {
  return getStoredData<User>(STORAGE_KEYS.USERS, DEFAULT_USERS);
};

export const saveUsers = (users: User[]): void => {
  saveData<User>(STORAGE_KEYS.USERS, users);
};

// 设备管理
export const getDevices = (): Device[] => {
  return getStoredData<Device>(STORAGE_KEYS.DEVICES, DEFAULT_DEVICES);
};

export const saveDevices = (devices: Device[]): void => {
  saveData<Device>(STORAGE_KEYS.DEVICES, devices);
};

// 类型定义
export interface Crop {
  id: number;
  name: string;
  type: string;
  area: number;
  status: string;
  expectedHarvest: string;
}

export interface IrrigationZone {
  id: number;
  name: string;
  area: number;
  status: string;
  lastIrrigation: string;
  nextIrrigation: string;
}

export interface User {
  id: number;
  nickname: string;
  email: string;
  phone: string;
  sex: string;
  identity: string;
}

export interface Device {
  id: number;
  name: string;
  type: string;
  status: string;
  location: string;
  lastOnline: string;
}