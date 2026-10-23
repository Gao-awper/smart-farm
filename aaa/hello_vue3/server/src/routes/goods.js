const express = require('express');
const router = express.Router();

// 从前端代码中提取的文创产品数据
const goods = [
  {
    id: 1,
    name: '蔚县剪纸艺术衍生品',
    tag: '剪纸文创',
    image: 'https://picsum.photos/id/137/100/100',
    price: 128.0,
    sales: 156,
    category: 'paperCut'
  },
  {
    id: 2,
    name: '杨柳青年画明信片套装',
    tag: '年画文创',
    image: 'https://picsum.photos/id/142/100/100',
    price: 89.0,
    sales: 98,
    category: 'NewYearPainting'
  },
  {
    id: 3,
    name: '传统刺绣香囊',
    tag: '刺绣文创',
    image: 'https://picsum.photos/id/148/100/100',
    price: 68.0,
    sales: 123,
    category: 'embroidery'
  },
  {
    id: 4,
    name: '景德镇陶瓷茶具套装',
    tag: '陶瓷文创',
    image: 'https://picsum.photos/id/153/100/100',
    price: 299.0,
    sales: 75,
    category: 'pottery'
  },
  {
    id: 5,
    name: '潍坊风筝工艺品',
    tag: '手工饰品',
    image: 'https://picsum.photos/id/155/100/100',
    price: 299.0,
    sales: 75,
    category: 'handicraft'
  },
  {
    id: 6,
    name: '剪纸工具套装（专业级）',
    tag: '剪纸文创',
    image: 'https://picsum.photos/id/237/100/100',
    price: 159.0,
    sales: 62,
    category: 'paperCut'
  }
];

// 获取文创产品列表
router.get('/', (req, res) => {
  const { ids } = req.query;
  let result = [...goods];
  
  // 按ID列表筛选
  if (ids) {
    const idArray = ids.split(',').map(Number);
    result = result.filter(item => idArray.includes(item.id));
  }
  
  // 打印成功返回的数据日志
  console.log('成功返回文创产品数据:', result.length, '条记录');
  
  res.json({
    status: 'success',
    data: result
  });
});

// 根据ID获取文创产品详情
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const good = goods.find(item => item.id === parseInt(id));
  
  if (good) {
    // 打印成功返回的数据日志
    console.log('成功返回单条文创产品数据:', good.id, good.name);
    
    res.json({
      status: 'success',
      data: good
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: '文创产品不存在'
    });
  }
});

module.exports = router;