const express = require('express');
const router = express.Router();
const { categories } = require('../data.js');

// 获取所有分类
router.get('/', (req, res) => {
  // 转换分类数据结构以匹配前端期望的格式
  const formattedCategories = categories.flatMap(mainCat => {
    const mainCategory = {
      id: mainCat.value,
      name: mainCat.label,
      value: mainCat.value,
      level: 1,
      parentId: 0
    };
    
    const subCategories = mainCat.subCategories.map((subCat, index) => ({
      id: `${mainCat.value}-${subCat.value}`,
      name: subCat.label,
      value: subCat.value,
      level: 2,
      parentId: mainCat.value
    }));
    
    return [mainCategory, ...subCategories];
  });
  
  // 打印成功返回的数据日志
  console.log('成功返回分类数据:', formattedCategories.length, '条记录');
  
  res.json({
    status: 'success',
    data: formattedCategories
  });
});

// 根据ID获取分类
router.get('/:id', (req, res) => {
  const { id } = req.params;
  // 首先查找主分类
  const mainCategory = categories.find(cat => cat.value === id);
  if (mainCategory) {
    // 转换为主分类格式
    const formattedCategory = {
      id: mainCategory.value,
      name: mainCategory.label,
      value: mainCategory.value,
      level: 1,
      parentId: null
    };
    
    // 打印成功返回的数据日志
    console.log('成功返回单条分类数据:', formattedCategory.id, formattedCategory.name);
    
    res.json({
      status: 'success',
      data: formattedCategory
    });
  } else {
    // 查找子分类
    let foundSubCategory = null;
    let parentCategory = null;
    
    for (const cat of categories) {
      const subCategory = cat.subCategories.find(subCat => subCat.value === id);
      if (subCategory) {
        foundSubCategory = subCategory;
        parentCategory = cat;
        break;
      }
    }
    
    if (foundSubCategory && parentCategory) {
      // 转换为子分类格式
      const formattedCategory = {
        id: `${parentCategory.value}-${foundSubCategory.value}`,
        name: foundSubCategory.label,
        value: foundSubCategory.value,
        level: 2,
        parentId: parentCategory.value
      };
      
      // 打印成功返回的数据日志
      console.log('成功返回单条分类数据:', formattedCategory.id, formattedCategory.name);
      
      res.json({
        status: 'success',
        data: formattedCategory
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: '分类不存在'
      });
    }
  }
});

module.exports = router;