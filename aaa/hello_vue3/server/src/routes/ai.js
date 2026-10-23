const express = require('express');
const router = express.Router();

const cropModels = {
  wheat: {
    name: '小麦',
    growthStages: [
      { stage: '播种期', days: 0, tempRange: [12, 18], moistureRange: [60, 70] },
      { stage: '发芽期', days: 7, tempRange: [15, 20], moistureRange: [65, 75] },
      { stage: '分蘖期', days: 30, tempRange: [12, 18], moistureRange: [60, 70] },
      { stage: '拔节期', days: 60, tempRange: [15, 22], moistureRange: [65, 75] },
      { stage: '抽穗期', days: 90, tempRange: [18, 24], moistureRange: [70, 80] },
      { stage: '开花期', days: 105, tempRange: [20, 26], moistureRange: [70, 80] },
      { stage: '灌浆期', days: 120, tempRange: [22, 28], moistureRange: [65, 75] },
      { stage: '成熟期', days: 150, tempRange: [20, 30], moistureRange: [50, 60] }
    ],
    optimalTemp: 22,
    optimalMoisture: 70,
    growthDays: 150
  },
  corn: {
    name: '玉米',
    growthStages: [
      { stage: '播种期', days: 0, tempRange: [15, 20], moistureRange: [60, 70] },
      { stage: '发芽期', days: 6, tempRange: [20, 25], moistureRange: [65, 75] },
      { stage: '苗期', days: 20, tempRange: [18, 24], moistureRange: [60, 70] },
      { stage: '拔节期', days: 40, tempRange: [20, 26], moistureRange: [65, 75] },
      { stage: '抽雄期', days: 60, tempRange: [24, 28], moistureRange: [70, 80] },
      { stage: '吐丝期', days: 75, tempRange: [24, 30], moistureRange: [70, 80] },
      { stage: '灌浆期', days: 90, tempRange: [22, 28], moistureRange: [65, 75] },
      { stage: '成熟期', days: 120, tempRange: [20, 30], moistureRange: [50, 60] }
    ],
    optimalTemp: 25,
    optimalMoisture: 75,
    growthDays: 120
  },
  rice: {
    name: '水稻',
    growthStages: [
      { stage: '播种期', days: 0, tempRange: [15, 20], moistureRange: [70, 80] },
      { stage: '发芽期', days: 5, tempRange: [25, 30], moistureRange: [80, 90] },
      { stage: '秧苗期', days: 20, tempRange: [20, 25], moistureRange: [70, 80] },
      { stage: '分蘖期', days: 40, tempRange: [22, 28], moistureRange: [75, 85] },
      { stage: '拔节期', days: 65, tempRange: [25, 30], moistureRange: [80, 90] },
      { stage: '抽穗期', days: 85, tempRange: [25, 30], moistureRange: [80, 85] },
      { stage: '灌浆期', days: 100, tempRange: [22, 28], moistureRange: [75, 85] },
      { stage: '成熟期', days: 130, tempRange: [20, 30], moistureRange: [50, 60] }
    ],
    optimalTemp: 26,
    optimalMoisture: 80,
    growthDays: 130
  }
};

const diseaseLibrary = [
  {
    id: 'd001',
    name: '小麦锈病',
    crops: ['wheat'],
    symptoms: '叶片出现橙黄色孢子堆，呈长条状排列',
    conditions: { temp: [15, 25], humidity: [80, 100] },
    prevention: '喷施三唑酮、丙环唑等杀菌剂',
    severity: 'high'
  },
  {
    id: 'd002',
    name: '玉米大斑病',
    crops: ['corn'],
    symptoms: '叶片出现大型梭形病斑，边缘深褐色',
    conditions: { temp: [20, 27], humidity: [80, 95] },
    prevention: '喷施多菌灵、甲基托布津',
    severity: 'medium'
  },
  {
    id: 'd003',
    name: '稻瘟病',
    crops: ['rice'],
    symptoms: '叶片出现梭形病斑，边缘褐色中央灰白色',
    conditions: { temp: [24, 28], humidity: [90, 100] },
    prevention: '使用春雷霉素、三环唑防治',
    severity: 'high'
  },
  {
    id: 'd004',
    name: '小麦白粉病',
    crops: ['wheat'],
    symptoms: '叶片表面覆盖白色粉末状霉层',
    conditions: { temp: [15, 22], humidity: [60, 80] },
    prevention: '喷施戊唑醇、苯醚甲环唑',
    severity: 'medium'
  },
  {
    id: 'd005',
    name: '玉米螟虫',
    crops: ['corn'],
    symptoms: '叶片出现整齐排孔，茎秆被蛀食',
    conditions: { temp: [20, 30], humidity: [50, 80] },
    prevention: '释放赤眼蜂、使用Bt制剂',
    severity: 'high'
  }
];

const pestLibrary = [
  {
    id: 'p001',
    name: '蚜虫',
    crops: ['wheat', 'corn', 'rice'],
    symptoms: '叶片卷曲、发黄，分泌蜜露',
    conditions: { temp: [18, 25], humidity: [40, 70] },
    prevention: '释放瓢虫、喷施吡虫啉',
    severity: 'medium'
  },
  {
    id: 'p002',
    name: '红蜘蛛',
    crops: ['wheat', 'corn'],
    symptoms: '叶片出现黄白色小点，叶背有蛛丝',
    conditions: { temp: [26, 30], humidity: [30, 50] },
    prevention: '喷施阿维菌素、哒螨灵',
    severity: 'medium'
  },
  {
    id: 'p003',
    name: '粘虫',
    crops: ['wheat', 'corn'],
    symptoms: '叶片被啃食成缺刻，严重时吃光叶片',
    conditions: { temp: [20, 28], humidity: [60, 90] },
    prevention: '使用杀虫灯、喷施氯虫苯甲酰胺',
    severity: 'high'
  }
];

router.get('/crop-models', (req, res) => {
  const crops = Object.entries(cropModels).map(([key, value]) => ({
    id: key,
    name: value.name,
    growthDays: value.growthDays,
    optimalTemp: value.optimalTemp,
    optimalMoisture: value.optimalMoisture
  }));
  res.json({ status: 'success', data: crops });
});

router.get('/crop-model/:cropType', (req, res) => {
  const { cropType } = req.params;
  const model = cropModels[cropType];
  if (!model) {
    return res.status(404).json({ status: 'error', message: '作物模型不存在' });
  }
  res.json({ status: 'success', data: model });
});

router.post('/crop-growth-analysis', (req, res) => {
  const { cropType, plantedDate, currentTemp, currentMoisture } = req.body;
  const model = cropModels[cropType];
  if (!model) {
    return res.status(404).json({ status: 'error', message: '作物模型不存在' });
  }

  const today = new Date();
  const planted = new Date(plantedDate);
  const daysSincePlanting = Math.floor((today - planted) / (1000 * 60 * 60 * 24));

  let currentStage = model.growthStages[0];
  for (const stage of model.growthStages) {
    if (daysSincePlanting >= stage.days) {
      currentStage = stage;
    }
  }

  const nextStage = model.growthStages.find(s => s.days > daysSincePlanting);
  const daysToNextStage = nextStage ? nextStage.days - daysSincePlanting : 0;

  const tempDeviation = Math.abs(currentTemp - model.optimalTemp);
  const moistureDeviation = Math.abs(currentMoisture - model.optimalMoisture);

  let healthScore = 100;
  if (tempDeviation > 5) healthScore -= 20;
  else if (tempDeviation > 2) healthScore -= 10;

  if (moistureDeviation > 15) healthScore -= 25;
  else if (moistureDeviation > 10) healthScore -= 15;
  else if (moistureDeviation > 5) healthScore -= 5;

  const growthProgress = Math.min(100, (daysSincePlanting / model.growthDays) * 100);

  const recommendations = [];
  if (currentTemp < model.optimalTemp - 5) {
    recommendations.push('建议：气温偏低，可考虑搭建小拱棚保温');
  } else if (currentTemp > model.optimalTemp + 5) {
    recommendations.push('建议：气温偏高，增加灌溉频率降温');
  }

  if (currentMoisture < model.optimalMoisture - 10) {
    recommendations.push('建议：土壤偏干，建议增加灌溉量');
  } else if (currentMoisture > model.optimalMoisture + 10) {
    recommendations.push('建议：土壤偏湿，适当减少灌溉防止涝害');
  }

  res.json({
    status: 'success',
    data: {
      cropType: model.name,
      plantedDate,
      daysSincePlanting,
      currentStage: currentStage.stage,
      nextStage: nextStage ? nextStage.stage : '已成熟',
      daysToNextStage,
      growthProgress: growthProgress.toFixed(1),
      healthScore,
      currentConditions: { temperature: currentTemp, moisture: currentMoisture },
      optimalConditions: { temperature: model.optimalTemp, moisture: model.optimalMoisture },
      recommendations
    }
  });
});

router.post('/disease-detection', (req, res) => {
  const { temperature, humidity, cropType } = req.body;

  const risks = [];

  diseaseLibrary.forEach(disease => {
    if (cropType && !disease.crops.includes(cropType)) return;

    const tempInRange = temperature >= disease.conditions.temp[0] && temperature <= disease.conditions.temp[1];
    const humidityInRange = humidity >= disease.conditions.humidity[0] && humidity <= disease.conditions.humidity[1];

    if (tempInRange && humidityInRange) {
      const riskScore = ((temperature - disease.conditions.temp[0]) /
        (disease.conditions.temp[1] - disease.conditions.temp[0])) * 50 +
        ((humidity - disease.conditions.humidity[0]) /
        (disease.conditions.humidity[1] - disease.conditions.humidity[0])) * 50;

      risks.push({
        ...disease,
        riskScore: Math.min(100, riskScore).toFixed(1),
        cropName: cropModels[disease.crops[0]]?.name
      });
    }
  });

  risks.sort((a, b) => b.riskScore - a.riskScore);

  res.json({
    status: 'success',
    data: {
      currentConditions: { temperature, humidity, cropType },
      riskLevel: risks.length > 0 ? (risks[0].riskScore > 70 ? 'high' : risks[0].riskScore > 40 ? 'medium' : 'low') : 'low',
      risks: risks.slice(0, 5),
      prevention: risks.length > 0 ? risks[0].prevention : '当前环境适宜作物生长'
    }
  });
});

router.post('/pest-detection', (req, res) => {
  const { temperature, humidity, cropType } = req.body;

  const risks = [];

  pestLibrary.forEach(pest => {
    if (cropType && !pest.crops.includes(cropType)) return;

    const tempInRange = temperature >= pest.conditions.temp[0] && temperature <= pest.conditions.temp[1];
    const humidityInRange = humidity >= pest.conditions.humidity[0] && humidity <= pest.conditions.humidity[1];

    if (tempInRange && humidityInRange) {
      const riskScore = ((temperature - pest.conditions.temp[0]) /
        (pest.conditions.temp[1] - pest.conditions.temp[0])) * 50 +
        ((humidity - pest.conditions.humidity[0]) /
        (pest.conditions.humidity[1] - pest.conditions.humidity[0])) * 50;

      risks.push({
        ...pest,
        riskScore: Math.min(100, riskScore).toFixed(1),
        cropName: cropModels[pest.crops[0]]?.name
      });
    }
  });

  risks.sort((a, b) => b.riskScore - a.riskScore);

  res.json({
    status: 'success',
    data: {
      riskLevel: risks.length > 0 ? (risks[0].riskScore > 70 ? 'high' : risks[0].riskScore > 40 ? 'medium' : 'low') : 'low',
      risks: risks.slice(0, 5),
      prevention: risks.length > 0 ? risks[0].prevention : '当前环境不易发生虫害'
    }
  });
});

router.post('/irrigation-advice', (req, res) => {
  const { cropType, soilMoisture, airTemperature, airHumidity, forecast } = req.body;

  console.log('[DEBUG] 灌溉建议请求:', req.body);
  console.log('[DEBUG] soilMoisture类型:', typeof soilMoisture, ', 值:', soilMoisture);

  const model = cropModels[cropType];
  if (!model) {
    return res.status(404).json({ status: 'error', message: '作物模型不存在' });
  }

  let advice = '保持当前灌溉策略';
  let action = 'none';
  let urgency = 'low';
  let waterAmount = 0;

  const currentDeficit = model.optimalMoisture - Number(soilMoisture);
  
  console.log('[DEBUG] optimalMoisture:', model.optimalMoisture, ', currentDeficit:', currentDeficit);

  if (currentDeficit > 20) {
    action = 'urgent_irrigation';
    advice = `紧急灌溉：土壤湿度严重不足（${soilMoisture}%），需立即灌溉`;
    urgency = 'high';
    waterAmount = Math.round(currentDeficit * 1.5);
  } else if (currentDeficit > 10) {
    action = 'irrigation';
    advice = `建议灌溉：土壤湿度偏低（${soilMoisture}%），建议进行灌溉`;
    urgency = 'medium';
    waterAmount = Math.round(currentDeficit * 1.2);
  } else if (currentDeficit > 5) {
    action = 'light_irrigation';
    advice = `轻度补水：土壤湿度略低，可适当补水`;
    urgency = 'low';
    waterAmount = Math.round(currentDeficit);
  }

  if (airTemperature > 35 && action !== 'none') {
    advice += '（高温天气建议在早晨或傍晚灌溉）';
  }

  if (forecast && forecast.includes('rain')) {
    advice = '未来有降雨，可暂缓灌溉计划';
    action = 'delay';
    waterAmount = 0;
  }

  res.json({
    status: 'success',
    data: {
      currentMoisture: soilMoisture,
      optimalMoisture: model.optimalMoisture,
      moistureDeficit: currentDeficit,
      advice,
      action,
      urgency,
      recommendedWaterAmount: waterAmount,
      bestTime: airTemperature > 30 ? '早晨或傍晚' : '任意时间',
      duration: waterAmount > 0 ? Math.round(waterAmount / 10) : 0
    }
  });
});

router.post('/yield-prediction', (req, res) => {
  const { cropType, plantedDate, area, currentHealth, weatherData } = req.body;

  const model = cropModels[cropType];
  if (!model) {
    return res.status(404).json({ status: 'error', message: '作物模型不存在' });
  }

  const today = new Date();
  const planted = new Date(plantedDate);
  const daysSincePlanting = Math.floor((today - planted) / (1000 * 60 * 60 * 24));
  const growthProgress = Math.min(1, daysSincePlanting / model.growthDays);

  const baseYield = {
    wheat: 450,
    corn: 800,
    rice: 600
  };

  const healthMultiplier = currentHealth / 100;
  const weatherMultiplier = weatherData ? weatherData.favorableDays / weatherData.totalDays : 0.8;

  const predictedYield = baseYield[cropType] * area * healthMultiplier * weatherMultiplier;
  const harvestDate = new Date(planted.getTime() + model.growthDays * 24 * 60 * 60 * 1000);

  const confidence = growthProgress > 0.8 ? 95 : growthProgress > 0.5 ? 85 : 70;

  res.json({
    status: 'success',
    data: {
      cropType: model.name,
      plantedDate,
      area,
      currentGrowthProgress: (growthProgress * 100).toFixed(1),
      predictedYield: Math.round(predictedYield),
      harvestDate: harvestDate.toISOString().split('T')[0],
      daysToHarvest: Math.max(0, model.growthDays - daysSincePlanting),
      confidence,
      yieldFactors: {
        baseYield: baseYield[cropType],
        healthImpact: (healthMultiplier * 100).toFixed(0),
        weatherImpact: (weatherMultiplier * 100).toFixed(0)
      }
    }
  });
});

router.post('/ai-chat', (req, res) => {
  const { message, context } = req.body;

  const agriculturalKnowledge = {
    // 草莓相关
    '草莓': '草莓种植要点：\n🍓 土壤要求：肥沃疏松、排水良好的微酸性土壤（pH5.5-6.5）\n🌡️ 适宜温度：生长适温15-25°C，花芽分化需要5-15°C低温\n💧 水分管理：保持土壤湿润但不积水，果实成熟期适当控水\n🌞 光照：需要充足光照，每天至少6小时\n🪴 繁殖：主要采用匍匐茎繁殖',
    '草莓怎么种': '草莓种植步骤：\n1. 选地整地：选择排水良好的地块，施足基肥\n2. 定植：秋季定植为宜，株行距30×40cm\n3. 覆盖地膜：保温保湿，防杂草\n4. 水肥管理：定植后浇透水，生长期薄肥勤施\n5. 疏花疏果：保留健壮花果，提高品质\n6. 病虫害防治：注意防治白粉病、灰霉病和蚜虫',
    '草莓施肥': '草莓施肥技巧：\n🌸 基肥：定植前施腐熟有机肥+复合肥\n🌿 追肥：\n  - 定植后：氮肥为主，促进生长\n  - 开花前：增施磷钾肥\n  - 结果期：钾肥为主，促进果实膨大\n🍂 叶面肥：花期和果实期喷施磷酸二氢钾',
    
    // 番茄相关
    '番茄': '番茄种植要点：\n🍅 土壤：肥沃疏松、排水良好\n🌡️ 温度：白天25-28°C，夜间15-18°C\n💧 水分：保持土壤湿润，忌忽干忽湿\n🌞 光照：需要充足光照\n🪜 搭架：及时搭架绑蔓，促进通风透光',
    '番茄怎么种': '番茄种植步骤：\n1. 育苗：播种后保持25-30°C，出苗后适当降温\n2. 定植：幼苗长到4-5片真叶时定植\n3. 整枝：单杆整枝，及时打杈\n4. 授粉：大棚栽培需人工授粉或放蜂\n5. 疏果：每穗留3-4个果\n6. 施肥：坐果后增施钾肥',
    
    // 蔬菜相关
    '蔬菜': '蔬菜种植通用建议：\n🥬 选择优良品种，合理轮作倒茬\n💧 适时浇水，保持土壤湿润\n🌿 科学施肥，有机肥与化肥结合\n🐛 综合防治病虫害，优先生物防治\n⏰ 适时采收，保证品质',
    
    // 灌溉相关
    '灌溉': '灌溉管理要点：\n💧 早晨或傍晚灌溉，避免中午高温\n🌡️ 高温季节增加灌溉频率\n🌧️ 雨季注意排水防涝\n📊 根据土壤湿度传感器数据精准灌溉\n🌱 幼苗期少量多次，成熟期适当控水',
    '浇水': '浇水技巧：\n💧 看天浇水：晴天多浇，阴天少浇\n🌿 看地浇水：沙质土勤浇，黏壤土少浇\n🌱 看苗浇水：苗期少浇，花果期多浇\n🚿 方式：滴灌>喷灌>漫灌',
    
    // 施肥相关
    '施肥': '科学施肥原则：\n🌿 有机肥为主，化肥为辅\n⚖️ 按作物需求配方施肥\n📅 适时适量，避免过量\n💧 水肥结合，提高利用率\n🔄 测土配方，精准施肥',
    '肥料': '常见肥料特性：\n💚 氮肥：促进茎叶生长，缺氮叶发黄\n💛 磷肥：促进根系发育和开花结果\n💙 钾肥：增强抗逆性，促进果实膨大\n🟤 有机肥：改良土壤，提供全面营养',
    
    // 病害防治
    '病害': '病害综合防治：\n🌡️ 合理密植，加强通风透光\n💧 控制湿度，避免叶面结露\n🔄 轮作倒茬，减少病原积累\n🌿 选用抗病品种\n⚗️ 及时喷药，对症下药',
    '病': '常见病害识别与防治：\n🍄 白粉病：叶片白粉状霉层，用三唑酮防治\n🟤 灰霉病：灰色霉层，用腐霉利防治\n🍂 叶斑病：叶片斑点，用代森锰锌防治\n🟡 病毒病：叶片畸形，防治传毒蚜虫',
    
    // 虫害防治
    '虫害': '虫害综合防治：\n🪲 物理防治：杀虫灯、黄板诱杀\n🐝 生物防治：释放天敌（瓢虫、赤眼蜂）\n🌿 农业防治：清洁田园，减少虫源\n⚗️ 化学防治：合理用药，注意安全间隔期',
    '虫': '常见虫害防治：\n🟢 蚜虫：用吡虫啉、啶虫脒\n🔴 红蜘蛛：用阿维菌素、哒螨灵\n🟡 菜青虫：用Bt制剂、氯虫苯甲酰胺\n🟤 地下害虫：用噻虫嗪、辛硫磷',
    
    // 土壤管理
    '土壤': '土壤管理要点：\n🌱 深耕改土，增加土壤透气性\n🍂 增施有机肥，提高土壤肥力\n🔄 合理轮作，改善土壤结构\n📏 定期检测土壤pH和养分\n🌿 种植绿肥，培肥地力',
    'pH': '土壤pH调节：\n📉 酸性土壤（pH<6.0）：施生石灰调节\n📈 碱性土壤（pH>7.5）：施硫磺粉或有机肥\n⚖️ 大多数作物适宜pH：6.0-7.0\n🍓 草莓适宜pH：5.5-6.5\n🌾 水稻适宜pH：5.5-7.0',
    
    // 天气与农业
    '天气': '农事与天气：\n☀️ 晴天：适宜喷药、施肥、收获\n🌧️ 雨天：不宜喷药施肥，注意排水\n❄️ 低温：做好防寒保暖\n🔥 高温：加强灌溉降温，遮阴保护',
    
    // 作物生长
    '生长': '作物生长周期：\n🌱 苗期：生根发芽，需要温和环境\n🌿 生长期：茎叶快速生长，需充足养分\n🌸 开花期：需要充足光照和磷钾肥\n🍎 结果期：保证水分和钾肥供应\n🍂 成熟期：适当控水，促进果实成熟',
    '阶段': '不同阶段管理重点：\n🌱 苗期：促根为主，薄肥勤施\n🌿 生长期：促进营养生长，搭架整枝\n🌸 开花期：促进授粉，防止落花\n🍎 结果期：保花保果，防治病虫害',
    
    // 产量提升
    '产量': '提高作物产量的关键：\n🌱 选择优良品种\n🌿 合理密植\n💧 科学水肥管理\n🐛 及时防治病虫害\n🌞 保证充足光照\n🔄 适时采收',
    '预测': '产量预测因素：\n📊 品种潜力\n🌾 种植密度\n💧 水肥条件\n🌡️ 气候因素\n🐛 病虫害发生情况',
    
    // 智慧农业
    '智慧农业': '智慧农业技术：\n📡 IoT物联网：实时监测环境数据\n🤖 AI决策：智能分析和预测\n🌐 数字化管理：精准农业管理系统\n🚜 自动化设备：智能灌溉、施肥系统\n📱 移动应用：远程监控和控制',
    
    // 问答技巧
    '你好': '您好！我是智慧农场AI助手，很高兴为您服务！😊',
    '你是谁': '我是智慧农场AI助手，专门为您提供农业相关的专业知识和建议，包括作物种植、病虫害防治、水肥管理等方面。',
    '帮助': '我可以帮助您解答以下问题：\n🌱 作物种植技术（草莓、番茄、蔬菜等）\n🐛 病虫害识别与防治\n💧 灌溉和施肥管理\n🌡️ 气候与农事安排\n📊 产量提升建议\n\n请问您想了解哪方面的内容？',
    'default': '您好！我是智慧农场AI助手。我可以为您提供作物种植技术、病虫害防治、水肥管理、气候农事等方面的专业建议。\n\n请问您想了解哪方面的内容？比如：\n🍓 草莓怎么种？\n🍅 番茄病虫害防治？\n💧 如何科学灌溉？'
  };

  let response = agriculturalKnowledge.default;
  
  for (const [keyword, reply] of Object.entries(agriculturalKnowledge)) {
    if (message.includes(keyword)) {
      response = reply;
      break;
    }
  }

  res.json({
    status: 'success',
    data: {
      reply: response,
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = router;