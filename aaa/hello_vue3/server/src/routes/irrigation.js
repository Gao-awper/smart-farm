const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { readData, updateData } = require('../data/storage');

// 存储灌溉区域数据的文件路径
const irrigationFile = path.join(__dirname, '..', 'data', 'irrigation.json');

// 确保数据目录存在
if (!fs.existsSync(path.join(__dirname, '..', 'data'))) {
  fs.mkdirSync(path.join(__dirname, '..', 'data'), { recursive: true });
}

// 读取灌溉区域数据
let irrigationZones = [
  {
    id: 1,
    name: '东区灌溉区',
    area: 50,
    status: '正常',
    lastIrrigation: '2026-03-09 18:00',
    nextIrrigation: '2026-03-10 18:00'
  },
  {
    id: 2,
    name: '西区灌溉区',
    area: 30,
    status: '正常',
    lastIrrigation: '2026-03-09 19:00',
    nextIrrigation: '2026-03-10 19:00'
  },
  {
    id: 3,
    name: '南区灌溉区',
    area: 10,
    status: '正常',
    lastIrrigation: '2026-03-09 20:00',
    nextIrrigation: '2026-03-10 20:00'
  },
  {
    id: 4,
    name: '北区灌溉区',
    area: 10,
    status: '正常',
    lastIrrigation: '2026-03-09 21:00',
    nextIrrigation: '2026-03-10 21:00'
  }
];

try {
  if (fs.existsSync(irrigationFile)) {
    const data = fs.readFileSync(irrigationFile, 'utf8');
    irrigationZones = JSON.parse(data);
  } else {
    // 写入初始数据到文件
    fs.writeFileSync(irrigationFile, JSON.stringify(irrigationZones, null, 2));
  }
} catch (error) {
  console.error('读取灌溉区域数据失败:', error);
}

// 保存灌溉区域数据到文件
const saveIrrigationZones = () => {
  try {
    fs.writeFileSync(irrigationFile, JSON.stringify(irrigationZones, null, 2));
  } catch (error) {
    console.error('保存灌溉区域数据失败:', error);
  }
};

// 获取所有灌溉区域
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    data: irrigationZones
  });
});

// 添加灌溉区域
router.post('/', (req, res) => {
  const { name, area, status, lastIrrigation, nextIrrigation } = req.body;
  
  // 创建新灌溉区域
  const newZone = {
    id: irrigationZones.length > 0 ? Math.max(...irrigationZones.map(z => z.id)) + 1 : 1,
    name,
    area,
    status,
    lastIrrigation,
    nextIrrigation
  };
  
  irrigationZones.push(newZone);
  saveIrrigationZones();
  
  res.json({
    status: 'success',
    data: newZone
  });
});

// 更新灌溉区域
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, area, status, lastIrrigation, nextIrrigation } = req.body;
  
  const zoneIndex = irrigationZones.findIndex(item => item.id === parseInt(id));
  
  if (zoneIndex !== -1) {
    irrigationZones[zoneIndex] = {
      ...irrigationZones[zoneIndex],
      name,
      area,
      status,
      lastIrrigation,
      nextIrrigation
    };
    
    saveIrrigationZones();
    
    res.json({
      status: 'success',
      data: irrigationZones[zoneIndex]
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: '灌溉区域不存在'
    });
  }
});

// 删除灌溉区域
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const zoneIndex = irrigationZones.findIndex(item => item.id === parseInt(id));
  
  if (zoneIndex !== -1) {
    irrigationZones.splice(zoneIndex, 1);
    
    saveIrrigationZones();
    
    res.json({
      status: 'success',
      message: '灌溉区域删除成功'
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: '灌溉区域不存在'
    });
  }
});

// 智能灌溉决策
router.get('/smart/decision', (req, res) => {
  const { zoneId } = req.query;
  
  // 获取土壤数据和气象数据
  const soilData = readData('soil');
  const weatherData = readData('weather');
  
  // 分析最新数据
  const latestSoil = soilData[soilData.length - 1];
  const latestWeather = weatherData[weatherData.length - 1];
  
  // 智能决策算法
  let irrigationNeeded = false;
  let recommendedDuration = 0;
  let recommendationReason = '';
  
  // 基于土壤湿度判断
  if (latestSoil && latestSoil.moisture < 60) {
    irrigationNeeded = true;
    // 根据湿度值计算推荐灌溉时间
    recommendedDuration = Math.round((65 - latestSoil.moisture) * 5);
    recommendationReason += `土壤湿度较低 (${latestSoil.moisture}%)，需要灌溉；`;
  }
  
  // 基于气象数据调整
  if (latestWeather) {
    if (latestWeather.rainfall > 5) {
      irrigationNeeded = false;
      recommendationReason = `最近有降雨 (${latestWeather.rainfall}mm)，不需要灌溉`;
    } else if (latestWeather.temperature > 30) {
      // 高温天气增加灌溉时间
      if (irrigationNeeded) {
        recommendedDuration += 10;
        recommendationReason += `天气炎热 (${latestWeather.temperature}°C)，增加灌溉时间；`;
      }
    }
  }
  
  res.json({
    status: 'success',
    data: {
      zoneId,
      irrigationNeeded,
      recommendedDuration,
      recommendationReason,
      soilData: latestSoil,
      weatherData: latestWeather
    }
  });
});

// 灌溉计划管理
router.get('/schedule', (req, res) => {
  const scheduleFile = path.join(__dirname, '..', 'data', 'irrigation_schedule.json');
  
  try {
    if (fs.existsSync(scheduleFile)) {
      const data = fs.readFileSync(scheduleFile, 'utf8');
      const schedule = JSON.parse(data);
      res.json({ status: 'success', data: schedule });
    } else {
      // 初始灌溉计划
      const initialSchedule = [
        {
          id: 1,
          zoneId: 1,
          time: '08:00',
          duration: 30,
          days: [1, 3, 5],
          status: 'active'
        },
        {
          id: 2,
          zoneId: 2,
          time: '18:00',
          duration: 45,
          days: [2, 4, 6],
          status: 'active'
        },
        {
          id: 3,
          zoneId: 3,
          time: '09:00',
          duration: 20,
          days: [1, 4],
          status: 'active'
        },
        {
          id: 4,
          zoneId: 4,
          time: '19:00',
          duration: 25,
          days: [3, 6],
          status: 'active'
        }
      ];
      fs.writeFileSync(scheduleFile, JSON.stringify(initialSchedule, null, 2));
      res.json({ status: 'success', data: initialSchedule });
    }
  } catch (error) {
    console.error('读取灌溉计划失败:', error);
    res.status(500).json({ status: 'error', message: '读取灌溉计划失败' });
  }
});

// 添加灌溉计划
router.post('/schedule', (req, res) => {
  const scheduleFile = path.join(__dirname, '..', 'data', 'irrigation_schedule.json');
  const newSchedule = req.body;
  
  try {
    let schedules = [];
    if (fs.existsSync(scheduleFile)) {
      const data = fs.readFileSync(scheduleFile, 'utf8');
      schedules = JSON.parse(data);
    }
    
    newSchedule.id = schedules.length > 0 ? Math.max(...schedules.map(s => s.id)) + 1 : 1;
    schedules.push(newSchedule);
    
    fs.writeFileSync(scheduleFile, JSON.stringify(schedules, null, 2));
    res.json({ status: 'success', data: newSchedule });
  } catch (error) {
    console.error('添加灌溉计划失败:', error);
    res.status(500).json({ status: 'error', message: '添加灌溉计划失败' });
  }
});

// 更新灌溉计划
router.put('/schedule/:id', (req, res) => {
  const scheduleFile = path.join(__dirname, '..', 'data', 'irrigation_schedule.json');
  const { id } = req.params;
  const updatedSchedule = req.body;
  
  try {
    if (fs.existsSync(scheduleFile)) {
      const data = fs.readFileSync(scheduleFile, 'utf8');
      let schedules = JSON.parse(data);
      
      const scheduleIndex = schedules.findIndex(s => s.id === parseInt(id));
      if (scheduleIndex !== -1) {
        schedules[scheduleIndex] = { ...schedules[scheduleIndex], ...updatedSchedule };
        fs.writeFileSync(scheduleFile, JSON.stringify(schedules, null, 2));
        res.json({ status: 'success', data: schedules[scheduleIndex] });
      } else {
        res.status(404).json({ status: 'error', message: '灌溉计划不存在' });
      }
    } else {
      res.status(404).json({ status: 'error', message: '灌溉计划文件不存在' });
    }
  } catch (error) {
    console.error('更新灌溉计划失败:', error);
    res.status(500).json({ status: 'error', message: '更新灌溉计划失败' });
  }
});

// 删除灌溉计划
router.delete('/schedule/:id', (req, res) => {
  const scheduleFile = path.join(__dirname, '..', 'data', 'irrigation_schedule.json');
  const { id } = req.params;
  
  try {
    if (fs.existsSync(scheduleFile)) {
      const data = fs.readFileSync(scheduleFile, 'utf8');
      let schedules = JSON.parse(data);
      
      const scheduleIndex = schedules.findIndex(s => s.id === parseInt(id));
      if (scheduleIndex !== -1) {
        schedules.splice(scheduleIndex, 1);
        fs.writeFileSync(scheduleFile, JSON.stringify(schedules, null, 2));
        res.json({ status: 'success', message: '灌溉计划删除成功' });
      } else {
        res.status(404).json({ status: 'error', message: '灌溉计划不存在' });
      }
    } else {
      res.status(404).json({ status: 'error', message: '灌溉计划文件不存在' });
    }
  } catch (error) {
    console.error('删除灌溉计划失败:', error);
    res.status(500).json({ status: 'error', message: '删除灌溉计划失败' });
  }
});

// 灌溉效果分析
router.get('/analysis', (req, res) => {
  const irrigationData = readData('irrigation');
  
  // 分析灌溉数据
  const totalWaterUsage = irrigationData.reduce((sum, item) => sum + item.waterUsage, 0);
  const averageEfficiency = irrigationData.reduce((sum, item) => sum + item.efficiency, 0) / irrigationData.length;
  const totalDuration = irrigationData.reduce((sum, item) => sum + item.duration, 0);
  
  // 按日期排序
  const sortedData = irrigationData.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  res.json({
    status: 'success',
    data: {
      totalWaterUsage,
      averageEfficiency: Math.round(averageEfficiency),
      totalDuration,
      trends: sortedData.map(item => ({
        date: item.date,
        waterUsage: item.waterUsage,
        efficiency: item.efficiency
      }))
    }
  });
});

module.exports = router;