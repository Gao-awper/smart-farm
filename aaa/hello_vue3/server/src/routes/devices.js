const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// 存储设备数据的文件路径
const devicesFile = path.join(__dirname, '..', 'data', 'devices.json');

// 确保数据目录存在
if (!fs.existsSync(path.join(__dirname, '..', 'data'))) {
  fs.mkdirSync(path.join(__dirname, '..', 'data'), { recursive: true });
}

// 读取设备数据
let devices = [
  {
    id: 1,
    name: '土壤传感器1',
    type: '土壤传感器',
    status: '在线',
    location: '东区',
    lastOnline: '2026-03-09 10:00'
  },
  {
    id: 2,
    name: '气象站1',
    type: '气象站',
    status: '在线',
    location: '西区',
    lastOnline: '2026-03-09 10:05'
  },
  {
    id: 3,
    name: '灌溉控制器1',
    type: '灌溉控制器',
    status: '离线',
    location: '南区',
    lastOnline: '2026-03-08 18:00'
  },
  {
    id: 4,
    name: '摄像头1',
    type: '监控摄像头',
    status: '在线',
    location: '北区',
    lastOnline: '2026-03-09 10:10'
  }
];

try {
  if (fs.existsSync(devicesFile)) {
    const data = fs.readFileSync(devicesFile, 'utf8');
    devices = JSON.parse(data);
  } else {
    // 写入初始数据到文件
    fs.writeFileSync(devicesFile, JSON.stringify(devices, null, 2));
  }
} catch (error) {
  console.error('读取设备数据失败:', error);
}

// 保存设备数据到文件
const saveDevices = () => {
  try {
    fs.writeFileSync(devicesFile, JSON.stringify(devices, null, 2));
  } catch (error) {
    console.error('保存设备数据失败:', error);
  }
};

// 获取所有设备
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    data: devices
  });
});

// 更新设备状态
router.put('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const deviceIndex = devices.findIndex(item => item.id === parseInt(id));
  
  if (deviceIndex !== -1) {
    devices[deviceIndex].status = status;
    if (status === '在线') {
      devices[deviceIndex].lastOnline = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }
    
    saveDevices();
    
    res.json({
      status: 'success',
      data: devices[deviceIndex]
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: '设备不存在'
    });
  }
});

module.exports = router;