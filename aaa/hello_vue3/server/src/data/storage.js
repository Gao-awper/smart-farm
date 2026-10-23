const fs = require('fs');
const path = require('path');

// 数据存储目录
const DATA_DIR = path.join(__dirname, '..', 'data');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 数据文件路径
const DATA_FILES = {
  farm: path.join(DATA_DIR, 'farm.json'),
  soil: path.join(DATA_DIR, 'soil.json'),
  weather: path.join(DATA_DIR, 'weather.json'),
  irrigation: path.join(DATA_DIR, 'irrigation.json'),
  crops: path.join(DATA_DIR, 'crops.json'),
  settings: path.join(DATA_DIR, 'settings.json'),
  users: path.join(DATA_DIR, 'users.json')
};

// 初始数据
const INITIAL_DATA = {
  farm: {
    overview: {
      totalArea: 100,
      totalCrops: 4,
      totalDevices: 4,
      irrigationStatus: '正常',
      weatherStatus: '良好',
      soilStatus: '健康',
      recentActivities: [
        { id: 1, type: '灌溉', time: '2026-03-10 08:00', area: '东区' },
        { id: 2, type: '施肥', time: '2026-03-09 14:30', area: '西区' },
        { id: 3, type: '监测', time: '2026-03-09 10:15', area: '南区' }
      ]
    },
    realtime: {
      soil: {
        moisture: 65,
        temperature: 22,
        ph: 6.8
      },
      weather: {
        temperature: 25,
        humidity: 60,
        windSpeed: 12,
        rainfall: 0
      },
      irrigation: {
        status: '正常',
        waterLevel: 85,
        flowRate: 15
      }
    }
  },
  soil: [
    { date: '2026-03-10', moisture: 65, temperature: 22, ph: 6.8 },
    { date: '2026-03-09', moisture: 63, temperature: 21, ph: 6.7 },
    { date: '2026-03-08', moisture: 67, temperature: 23, ph: 6.9 },
    { date: '2026-03-07', moisture: 64, temperature: 22, ph: 6.8 },
    { date: '2026-03-06', moisture: 66, temperature: 24, ph: 6.7 }
  ],
  weather: [
    { date: '2026-03-10', temperature: 25, humidity: 60, windSpeed: 12, rainfall: 0 },
    { date: '2026-03-09', temperature: 24, humidity: 62, windSpeed: 10, rainfall: 0 },
    { date: '2026-03-08', temperature: 26, humidity: 58, windSpeed: 15, rainfall: 0 },
    { date: '2026-03-07', temperature: 23, humidity: 65, windSpeed: 8, rainfall: 5 },
    { date: '2026-03-06', temperature: 22, humidity: 68, windSpeed: 5, rainfall: 10 }
  ],
  irrigation: [
    { date: '2026-03-10', waterUsage: 40, duration: 120, efficiency: 85 },
    { date: '2026-03-09', waterUsage: 38, duration: 115, efficiency: 86 },
    { date: '2026-03-08', waterUsage: 42, duration: 125, efficiency: 84 },
    { date: '2026-03-07', waterUsage: 35, duration: 110, efficiency: 87 },
    { date: '2026-03-06', waterUsage: 39, duration: 118, efficiency: 85 }
  ],
  crops: [
    { id: 1, name: '小麦', type: '粮食作物', area: 50, status: '生长中', expectedHarvest: '2026-06-15' },
    { id: 2, name: '玉米', type: '粮食作物', area: 30, status: '生长中', expectedHarvest: '2026-07-20' },
    { id: 3, name: '西红柿', type: '蔬菜', area: 10, status: '生长中', expectedHarvest: '2026-05-10' },
    { id: 4, name: '黄瓜', type: '蔬菜', area: 10, status: '生长中', expectedHarvest: '2026-05-05' }
  ],
  settings: {
    farmName: '智慧农场',
    farmAddress: '北京市海淀区农业科技园区',
    contactPhone: '13800138000',
    totalArea: 120,
    irrigationSchedule: '每天 8:00 和 18:00',
    soilMonitoringInterval: '30分钟',
    weatherMonitoringInterval: '15分钟'
  },
  users: [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'user', password: 'user123', role: 'user' }
  ]
};

// 初始化数据文件
const initializeData = () => {
  Object.entries(DATA_FILES).forEach(([key, filePath]) => {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(INITIAL_DATA[key], null, 2), 'utf8');
      console.log(`初始化数据文件: ${filePath}`);
    }
  });
};

// 读取数据
const readData = (dataType) => {
  try {
    const filePath = DATA_FILES[dataType];
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return INITIAL_DATA[dataType] || null;
  } catch (error) {
    console.error(`读取数据失败 (${dataType}):`, error);
    return INITIAL_DATA[dataType] || null;
  }
};

// 写入数据
const writeData = (dataType, data) => {
  try {
    const filePath = DATA_FILES[dataType];
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`写入数据失败 (${dataType}):`, error);
    return false;
  }
};

// 更新数据
const updateData = (dataType, updateFn) => {
  try {
    const currentData = readData(dataType);
    const updatedData = updateFn(currentData);
    return writeData(dataType, updatedData);
  } catch (error) {
    console.error(`更新数据失败 (${dataType}):`, error);
    return false;
  }
};

// 导出方法
module.exports = {
  initializeData,
  readData,
  writeData,
  updateData,
  DATA_FILES
};