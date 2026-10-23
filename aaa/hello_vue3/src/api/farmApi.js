// src/api/farmApi.js
import axios from 'axios';

// 创建axios实例
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // 农场IoT后端(Node)API基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 农场概览API
export const getFarmOverview = () => {
  return apiClient.get('/farm/overview');
};

// 实时监测数据API
export const getRealtimeData = () => {
  return apiClient.get('/farm/realtime');
};

// 土壤数据API
export const getSoilData = () => {
  return apiClient.get('/farm/soil');
};

// 气象数据API
export const getWeatherData = () => {
  return apiClient.get('/farm/weather');
};

// 灌溉数据API
export const getIrrigationData = () => {
  return apiClient.get('/farm/irrigation');
};

// 控制灌溉系统API
export const controlIrrigation = (data) => {
  return apiClient.post('/farm/irrigation/control', data);
};

// 作物数据API
export const getCropsData = () => {
  return apiClient.get('/crops');
};

// 添加作物API
export const addCrop = (data) => {
  return apiClient.post('/crops', data);
};

// 更新作物API
export const updateCrop = (id, data) => {
  return apiClient.put(`/crops/${id}`, data);
};

// 删除作物API
export const deleteCrop = (id) => {
  return apiClient.delete(`/crops/${id}`);
};

// 设备数据API
export const getDevicesData = () => {
  return apiClient.get('/devices');
};

// 更新设备状态API
export const updateDeviceStatus = (id, status) => {
  return apiClient.put(`/devices/${id}/status`, { status });
};

// 数据分析API
export const getAnalysisData = (params) => {
  return apiClient.get('/farm/analysis', { params });
};
