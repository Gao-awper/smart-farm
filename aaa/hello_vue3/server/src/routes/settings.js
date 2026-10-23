const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { readData } = require('../data/storage');

// 存储设置数据的文件路径
const settingsFile = path.join(__dirname, '..', 'data', 'settings.json');

// 确保数据目录存在
if (!fs.existsSync(path.join(__dirname, '..', 'data'))) {
  fs.mkdirSync(path.join(__dirname, '..', 'data'), { recursive: true });
}

// 读取设置数据
let settings = {
  farmInfo: {
    name: '智慧农场',
    address: '北京市海淀区农业科技园区',
    phone: '13800138000',
    area: 100
  },
  notificationSettings: {
    soil: true,
    weather: true,
    irrigation: true,
    crop: true,
    system: true,
    email: true,
    sms: false,
    app: true
  }
};

try {
  if (fs.existsSync(settingsFile)) {
    const data = fs.readFileSync(settingsFile, 'utf8');
    settings = JSON.parse(data);
  } else {
    // 写入初始数据到文件
    fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
  }
} catch (error) {
  console.error('读取设置数据失败:', error);
}

// 保存设置数据到文件
const saveSettings = () => {
  try {
    fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('保存设置数据失败:', error);
  }
};

// 获取系统设置
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    data: settings
  });
});

// 保存系统设置
router.post('/', (req, res) => {
  const { farmInfo, notificationSettings } = req.body;
  
  if (farmInfo) {
    settings.farmInfo = { ...settings.farmInfo, ...farmInfo };
  }
  
  if (notificationSettings) {
    settings.notificationSettings = { ...settings.notificationSettings, ...notificationSettings };
  }
  
  saveSettings();
  
  res.json({
    status: 'success',
    data: settings
  });
});

// 生成数据备份
router.get('/backup', (req, res) => {
  try {
    // 创建备份目录
    const backupDir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // 生成备份文件名
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilename = `backup-${timestamp}.json`;
    const backupPath = path.join(backupDir, backupFilename);
    
    // 读取所有数据
    const backupData = {
      timestamp: new Date().toISOString(),
      data: {
        farm: readData('farm'),
        soil: readData('soil'),
        weather: readData('weather'),
        irrigation: readData('irrigation'),
        crops: readData('crops'),
        settings: settings
      }
    };
    
    // 写入备份文件
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf8');
    
    // 返回备份信息
    res.json({
      status: 'success',
      message: '数据备份成功',
      data: {
        backupFilename,
        backupPath,
        timestamp: backupData.timestamp
      }
    });
  } catch (error) {
    console.error('备份数据失败:', error);
    res.status(500).json({
      status: 'error',
      message: '备份数据失败'
    });
  }
});

// 恢复数据
router.post('/restore', (req, res) => {
  try {
    const { backupFilename } = req.body;
    
    if (!backupFilename) {
      return res.status(400).json({
        status: 'error',
        message: '请提供备份文件名'
      });
    }
    
    // 读取备份文件
    const backupPath = path.join(__dirname, '..', 'backups', backupFilename);
    if (!fs.existsSync(backupPath)) {
      return res.status(404).json({
        status: 'error',
        message: '备份文件不存在'
      });
    }
    
    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    
    // 恢复数据到各个文件
    const dataDir = path.join(__dirname, '..', 'data');
    
    if (backupData.data.farm) {
      fs.writeFileSync(path.join(dataDir, 'farm.json'), JSON.stringify(backupData.data.farm, null, 2), 'utf8');
    }
    
    if (backupData.data.soil) {
      fs.writeFileSync(path.join(dataDir, 'soil.json'), JSON.stringify(backupData.data.soil, null, 2), 'utf8');
    }
    
    if (backupData.data.weather) {
      fs.writeFileSync(path.join(dataDir, 'weather.json'), JSON.stringify(backupData.data.weather, null, 2), 'utf8');
    }
    
    if (backupData.data.irrigation) {
      fs.writeFileSync(path.join(dataDir, 'irrigation.json'), JSON.stringify(backupData.data.irrigation, null, 2), 'utf8');
    }
    
    if (backupData.data.crops) {
      fs.writeFileSync(path.join(dataDir, 'crops.json'), JSON.stringify(backupData.data.crops, null, 2), 'utf8');
    }
    
    if (backupData.data.settings) {
      settings = backupData.data.settings;
      saveSettings();
    }
    
    res.json({
      status: 'success',
      message: '数据恢复成功',
      data: {
        backupFilename,
        timestamp: backupData.timestamp
      }
    });
  } catch (error) {
    console.error('恢复数据失败:', error);
    res.status(500).json({
      status: 'error',
      message: '恢复数据失败'
    });
  }
});

// 获取备份列表
router.get('/backups', (req, res) => {
  try {
    const backupDir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
      return res.json({
        status: 'success',
        data: []
      });
    }
    
    // 读取备份文件列表
    const backupFiles = fs.readdirSync(backupDir)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(backupDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          size: stats.size,
          createdAt: stats.birthtime
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);
    
    res.json({
      status: 'success',
      data: backupFiles
    });
  } catch (error) {
    console.error('获取备份列表失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取备份列表失败'
    });
  }
});

module.exports = router;