const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// 存储作物数据的文件路径
const cropsFile = path.join(__dirname, '..', 'data', 'crops.json');

// 确保数据目录存在
if (!fs.existsSync(path.join(__dirname, '..', 'data'))) {
  fs.mkdirSync(path.join(__dirname, '..', 'data'), { recursive: true });
}

// 读取作物数据
let crops = [
  {
    id: 1,
    name: '小麦',
    type: '粮食作物',
    area: 50,
    status: '生长中',
    expectedHarvest: '2026-06-15'
  },
  {
    id: 2,
    name: '玉米',
    type: '粮食作物',
    area: 30,
    status: '生长中',
    expectedHarvest: '2026-07-20'
  },
  {
    id: 3,
    name: '西红柿',
    type: '蔬菜',
    area: 10,
    status: '生长中',
    expectedHarvest: '2026-05-10'
  },
  {
    id: 4,
    name: '黄瓜',
    type: '蔬菜',
    area: 10,
    status: '生长中',
    expectedHarvest: '2026-05-05'
  }
];

try {
  if (fs.existsSync(cropsFile)) {
    const data = fs.readFileSync(cropsFile, 'utf8');
    crops = JSON.parse(data);
  } else {
    // 写入初始数据到文件
    fs.writeFileSync(cropsFile, JSON.stringify(crops, null, 2));
  }
} catch (error) {
  console.error('读取作物数据失败:', error);
}

// 保存作物数据到文件
const saveCrops = () => {
  try {
    fs.writeFileSync(cropsFile, JSON.stringify(crops, null, 2));
  } catch (error) {
    console.error('保存作物数据失败:', error);
  }
};

// 获取所有作物
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    data: crops
  });
});

// 添加作物
router.post('/', (req, res) => {
  const { name, type, area, status, expectedHarvest } = req.body;
  
  // 创建新作物
  const newCrop = {
    id: crops.length > 0 ? Math.max(...crops.map(c => c.id)) + 1 : 1,
    name,
    type,
    area,
    status,
    expectedHarvest
  };
  
  crops.push(newCrop);
  saveCrops();
  
  res.json({
    status: 'success',
    data: newCrop
  });
});

// 更新作物
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, type, area, status, expectedHarvest } = req.body;
  
  const cropIndex = crops.findIndex(item => item.id === parseInt(id));
  
  if (cropIndex !== -1) {
    crops[cropIndex] = {
      ...crops[cropIndex],
      name,
      type,
      area,
      status,
      expectedHarvest
    };
    
    saveCrops();
    
    res.json({
      status: 'success',
      data: crops[cropIndex]
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: '作物不存在'
    });
  }
});

// 删除作物
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const cropIndex = crops.findIndex(item => item.id === parseInt(id));
  
  if (cropIndex !== -1) {
    crops.splice(cropIndex, 1);
    
    saveCrops();
    
    res.json({
      status: 'success',
      message: '作物删除成功'
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: '作物不存在'
    });
  }
});

module.exports = router;