// 农场分类数据
const categories = [
  {
    value: 'crop',
    label: '作物种植',
    subCategories: [
      { value: 'grain', label: '粮食作物' },
      { value: 'economic', label: '经济作物' },
      { value: 'vegetable', label: '蔬菜' },
      { value: 'fruit', label: '水果' },
      { value: 'flower', label: '花卉' }
    ]
  },
  {
    value: 'livestock',
    label: '畜禽养殖',
    subCategories: [
      { value: 'pig', label: '生猪养殖' },
      { value: 'cattle', label: '肉牛养殖' },
      { value: 'sheep', label: '肉羊养殖' },
      { value: 'poultry', label: '家禽养殖' },
      { value: 'aquatic', label: '水产养殖' }
    ]
  },
  {
    value: 'facility',
    label: '设施农业',
    subCategories: [
      { value: 'greenhouse', label: '温室大棚' },
      { value: 'hydroponics', label: '无土栽培' },
      { value: 'vertical', label: '垂直农业' },
      { value: 'smart', label: '智慧农业' },
      { value: 'organic', label: '有机农业' }
    ]
  },
  {
    value: 'irrigation',
    label: '智能灌溉',
    subCategories: [
      { value: 'drip', label: '滴灌系统' },
      { value: 'sprinkler', label: '喷灌系统' },
      { value: 'micro', label: '微灌系统' },
      { value: 'smart', label: '智能灌溉' },
      { value: 'rainwater', label: '雨水收集' }
    ]
  },
  {
    value: 'fertilizer',
    label: '肥料管理',
    subCategories: [
      { value: 'organic', label: '有机肥' },
      { value: 'chemical', label: '化肥' },
      { value: 'formula', label: '配方施肥' },
      { value: 'bio', label: '生物肥料' },
      { value: 'slow', label: '缓释肥料' }
    ]
  },
  {
    value: 'pest',
    label: '病虫害防治',
    subCategories: [
      { value: 'monitoring', label: '病虫害监测' },
      { value: 'chemical', label: '化学防治' },
      { value: 'biological', label: '生物防治' },
      { value: 'physical', label: '物理防治' },
      { value: 'integrated', label: '综合防治' }
    ]
  },
  {
    value: 'harvest',
    label: '收获加工',
    subCategories: [
      { value: 'machinery', label: '收获机械' },
      { value: 'storage', label: '储存技术' },
      { value: 'processing', label: '加工技术' },
      { value: 'packaging', label: '包装技术' },
      { value: 'transport', label: '运输技术' }
    ]
  },
  {
    value: 'marketing',
    label: '农产品营销',
    subCategories: [
      { value: 'ecommerce', label: '电商销售' },
      { value: 'brand', label: '品牌建设' },
      { value: 'market', label: '市场推广' },
      { value: 'export', label: '出口贸易' },
      { value: 'certification', label: '质量认证' }
    ]
  },
  {
    value: 'management',
    label: '农场管理',
    subCategories: [
      { value: 'planning', label: '农场规划' },
      { value: 'personnel', label: '人员管理' },
      { value: 'finance', label: '财务管理' },
      { value: 'risk', label: '风险管理' },
      { value: 'sustainability', label: '可持续发展' }
    ]
  },
  {
    value: 'technology',
    label: '农业技术',
    subCategories: [
      { value: 'iot', label: '物联网技术' },
      { value: 'ai', label: '人工智能' },
      { value: 'drones', label: '无人机' },
      { value: 'bigdata', label: '大数据' },
      { value: 'blockchain', label: '区块链' }
    ]
  }
];

module.exports = { categories };