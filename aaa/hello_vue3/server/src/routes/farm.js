const express = require('express');
const router = express.Router();
const { readData, writeData, updateData } = require('../data/storage');

// 农场概览数据
router.get('/overview', (req, res) => {
  const farmData = readData('farm');
  res.json({
    status: 'success',
    data: farmData.overview
  });
});

// 实时监测数据
router.get('/realtime', (req, res) => {
  const farmData = readData('farm');
  res.json({
    status: 'success',
    data: farmData.realtime
  });
});

// 土壤数据
router.get('/soil', (req, res) => {
  const soilData = readData('soil');
  res.json({
    status: 'success',
    data: soilData
  });
});

// 气象数据
router.get('/weather', (req, res) => {
  const weatherData = readData('weather');
  res.json({
    status: 'success',
    data: weatherData
  });
});

// 灌溉数据
router.get('/irrigation', (req, res) => {
  const irrigationData = readData('irrigation');
  res.json({
    status: 'success',
    data: irrigationData
  });
});

// 作物数据
router.get('/crops', (req, res) => {
  const cropsData = readData('crops');
  res.json({
    status: 'success',
    data: cropsData
  });
});

// 数据分析
router.get('/analysis', (req, res) => {
  const { timeRange, dataType } = req.query;
  
  // 根据时间范围和数据类型返回不同的分析数据
  res.json({
    status: 'success',
    data: {
      soil: {
        moisture: [65, 63, 67, 64, 66, 65, 64],
        temperature: [22, 21, 23, 22, 24, 23, 22],
        ph: [6.8, 6.7, 6.9, 6.8, 6.7, 6.8, 6.8]
      },
      weather: {
        temperature: [25, 24, 26, 23, 22, 24, 25],
        humidity: [60, 62, 58, 65, 68, 63, 60],
        light: [75000, 72000, 80000, 65000, 60000, 70000, 75000]
      },
      irrigation: {
        waterUsage: [40, 38, 42, 35, 39, 38, 40],
        efficiency: [85, 86, 84, 87, 85, 86, 85]
      },
      yield: {
        prediction: [12000, 11800, 12200, 11900, 12100, 11900, 12000],
        actual: [10500, 10300, 10600, 10400, 10500, 10400, 10500]
      }
    }
  });
});

// 历史数据
router.get('/history', (req, res) => {
  const { startDate, endDate, dataType } = req.query;
  
  res.json({
    status: 'success',
    data: [
      { date: '2026-03-10', type: 'soil', value: 65, unit: '%', location: '东区' },
      { date: '2026-03-09', type: 'soil', value: 63, unit: '%', location: '东区' },
      { date: '2026-03-08', type: 'soil', value: 67, unit: '%', location: '东区' },
      { date: '2026-03-10', type: 'weather', value: 25, unit: '°C', location: '西区' },
      { date: '2026-03-09', type: 'weather', value: 24, unit: '°C', location: '西区' },
      { date: '2026-03-10', type: 'irrigation', value: 40, unit: '吨', location: '南区' },
      { date: '2026-03-09', type: 'irrigation', value: 38, unit: '吨', location: '南区' }
    ]
  });
});

// 控制灌溉系统
router.post('/irrigation/control', (req, res) => {
  const { zoneId, status, duration } = req.body;
  
  // 更新灌溉状态
  const success = updateData('farm', (farmData) => {
    farmData.realtime.irrigation.status = status === 'on' ? '开启' : '关闭';
    return farmData;
  });
  
  const startTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
  if (success) {
    res.json({
      status: 'success',
      message: `灌溉区域 ${zoneId} ${status === 'on' ? '开启' : '关闭'} 成功，${duration ? `持续时间 ${duration} 分钟` : ''}`,
      data: {
        zoneId,
        status,
        duration,
        startTime
      }
    });
  } else {
    res.json({
      status: 'error',
      message: '灌溉控制失败'
    });
  }
});

// 获取农场设置
router.get('/settings', (req, res) => {
  const settingsData = readData('settings');
  res.json({
    status: 'success',
    data: settingsData
  });
});

// 更新农场设置
router.put('/settings', (req, res) => {
  const settings = req.body;
  const success = writeData('settings', settings);
  
  if (success) {
    res.json({
      status: 'success',
      message: '农场设置更新成功',
      data: settings
    });
  } else {
    res.json({
      status: 'error',
      message: '农场设置更新失败'
    });
  }
});

module.exports = router;