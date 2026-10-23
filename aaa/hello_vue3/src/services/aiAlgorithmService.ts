/**
 * 绿野智农 - 农业智能算法服务
 *
 * 算法基于以下农业科学模型：
 * 1. FAO 粮农组织作物水分响应模型（Stewart 模型）
 * 2. 温度响应函数（基于农业气象学）
 * 3. 土壤水分平衡方程
 * 4. 病虫害发生预测模型
 */

// ============ 作物生长阶段数据库 ============
// 数据来源：《中国农业百科全书·农作物卷》及农业气象学教材
const CROP_GROWTH_MODELS: Record<string, Array<{
  name: string;
  minDays: number;
  maxDays: number;
  optimalTemp: [number, number];   // 最适温度区间（℃）
  criticalTemp: [number, number];  // 临界温度（致死/停止生长）
  optimalMoisture: [number, number]; // 最适土壤含水率（%）
  growthStageWeight: number;       // 该阶段对最终产量的影响权重
}>> = {
  // 冬小麦：全生育期约 230 天（华北地区标准）
  wheat: [
    { name: '播种出苗期', minDays: 0, maxDays: 15, optimalTemp: [15, 20], criticalTemp: [0, 25], optimalMoisture: [65, 80], growthStageWeight: 0.05 },
    { name: '分蘖期', minDays: 15, maxDays: 45, optimalTemp: [13, 18], criticalTemp: [-5, 20], optimalMoisture: [60, 75], growthStageWeight: 0.10 },
    { name: '越冬期', minDays: 45, maxDays: 120, optimalTemp: [0, 5], criticalTemp: [-15, 10], optimalMoisture: [55, 70], growthStageWeight: 0.05 },
    { name: '返青期', minDays: 120, maxDays: 145, optimalTemp: [8, 15], criticalTemp: [-5, 20], optimalMoisture: [60, 75], growthStageWeight: 0.10 },
    { name: '拔节期', minDays: 145, maxDays: 175, optimalTemp: [12, 20], criticalTemp: [0, 25], optimalMoisture: [65, 80], growthStageWeight: 0.20 },
    { name: '抽穗扬花期', minDays: 175, maxDays: 195, optimalTemp: [18, 24], criticalTemp: [10, 30], optimalMoisture: [70, 85], growthStageWeight: 0.25 },
    { name: '灌浆期', minDays: 195, maxDays: 220, optimalTemp: [20, 25], criticalTemp: [12, 30], optimalMoisture: [65, 80], growthStageWeight: 0.20 },
    { name: '成熟期', minDays: 220, maxDays: 235, optimalTemp: [22, 28], criticalTemp: [15, 32], optimalMoisture: [55, 65], growthStageWeight: 0.05 }
  ],
  // 夏玉米：全生育期约 100 天
  corn: [
    { name: '播种出苗期', minDays: 0, maxDays: 7, optimalTemp: [20, 28], criticalTemp: [8, 35], optimalMoisture: [65, 80], growthStageWeight: 0.05 },
    { name: '苗期', minDays: 7, maxDays: 20, optimalTemp: [20, 26], criticalTemp: [10, 33], optimalMoisture: [60, 75], growthStageWeight: 0.10 },
    { name: '拔节期', minDays: 20, maxDays: 45, optimalTemp: [24, 30], criticalTemp: [15, 35], optimalMoisture: [65, 80], growthStageWeight: 0.25 },
    { name: '抽雄吐丝期', minDays: 45, maxDays: 60, optimalTemp: [25, 30], criticalTemp: [18, 35], optimalMoisture: [70, 85], growthStageWeight: 0.30 },
    { name: '灌浆期', minDays: 60, maxDays: 90, optimalTemp: [22, 28], criticalTemp: [15, 33], optimalMoisture: [65, 80], growthStageWeight: 0.25 },
    { name: '成熟期', minDays: 90, maxDays: 105, optimalTemp: [20, 26], criticalTemp: [12, 30], optimalMoisture: [55, 70], growthStageWeight: 0.05 }
  ],
  // 水稻：全生育期约 130 天（中稻）
  rice: [
    { name: '播种期', minDays: 0, maxDays: 10, optimalTemp: [25, 30], criticalTemp: [12, 38], optimalMoisture: [80, 95], growthStageWeight: 0.05 },
    { name: '秧苗期', minDays: 10, maxDays: 30, optimalTemp: [22, 28], criticalTemp: [15, 35], optimalMoisture: [75, 90], growthStageWeight: 0.10 },
    { name: '分蘖期', minDays: 30, maxDays: 60, optimalTemp: [25, 30], criticalTemp: [18, 33], optimalMoisture: [70, 85], growthStageWeight: 0.20 },
    { name: '拔节孕穗期', minDays: 60, maxDays: 85, optimalTemp: [25, 32], criticalTemp: [17, 35], optimalMoisture: [80, 95], growthStageWeight: 0.30 },
    { name: '抽穗扬花期', minDays: 85, maxDays: 100, optimalTemp: [28, 33], criticalTemp: [20, 35], optimalMoisture: [80, 95], growthStageWeight: 0.20 },
    { name: '灌浆成熟期', minDays: 100, maxDays: 130, optimalTemp: [22, 28], criticalTemp: [15, 32], optimalMoisture: [65, 80], growthStageWeight: 0.15 }
  ]
};

// ============ 病虫害数据库 ============
// 数据来源：《农作物病虫害防治手册》
const DISEASE_RISK_DATABASE: Record<string, Array<{
  diseaseName: string;
  tempRange: [number, number];      // 病害发生温度区间
  humidityRange: [number, number];  // 病害发生湿度区间
  riskLevel: 'low' | 'medium' | 'high';
  optimalTemp: number;              // 病害最易发生温度
  optimalHumidity: number;          // 病害最易发生湿度
}>> = {
  wheat: [
    { diseaseName: '小麦条锈病', tempRange: [9, 16], humidityRange: [80, 100], riskLevel: 'high', optimalTemp: 13, optimalHumidity: 95 },
    { diseaseName: '小麦叶锈病', tempRange: [15, 22], humidityRange: [70, 95], riskLevel: 'medium', optimalTemp: 18, optimalHumidity: 85 },
    { diseaseName: '小麦白粉病', tempRange: [15, 25], humidityRange: [75, 95], riskLevel: 'high', optimalTemp: 20, optimalHumidity: 90 },
    { diseaseName: '小麦赤霉病', tempRange: [20, 28], humidityRange: [85, 100], riskLevel: 'high', optimalTemp: 25, optimalHumidity: 95 },
    { diseaseName: '小麦蚜虫', tempRange: [18, 28], humidityRange: [40, 75], riskLevel: 'medium', optimalTemp: 23, optimalHumidity: 55 }
  ],
  corn: [
    { diseaseName: '玉米大斑病', tempRange: [18, 25], humidityRange: [75, 95], riskLevel: 'high', optimalTemp: 22, optimalHumidity: 90 },
    { diseaseName: '玉米小斑病', tempRange: [25, 32], humidityRange: [80, 95], riskLevel: 'high', optimalTemp: 28, optimalHumidity: 90 },
    { diseaseName: '玉米螟', tempRange: [20, 30], humidityRange: [60, 85], riskLevel: 'medium', optimalTemp: 25, optimalHumidity: 75 },
    { diseaseName: '玉米锈病', tempRange: [16, 28], humidityRange: [80, 95], riskLevel: 'medium', optimalTemp: 22, optimalHumidity: 90 },
    { diseaseName: '玉米粗缩病', tempRange: [20, 28], humidityRange: [55, 80], riskLevel: 'medium', optimalTemp: 24, optimalHumidity: 70 }
  ],
  rice: [
    { diseaseName: '水稻稻瘟病', tempRange: [20, 28], humidityRange: [85, 100], riskLevel: 'high', optimalTemp: 24, optimalHumidity: 95 },
    { diseaseName: '水稻纹枯病', tempRange: [25, 32], humidityRange: [80, 95], riskLevel: 'high', optimalTemp: 28, optimalHumidity: 90 },
    { diseaseName: '水稻白叶枯病', tempRange: [25, 30], humidityRange: [70, 90], riskLevel: 'high', optimalTemp: 28, optimalHumidity: 80 },
    { diseaseName: '稻飞虱', tempRange: [22, 30], humidityRange: [65, 85], riskLevel: 'high', optimalTemp: 26, optimalHumidity: 75 },
    { diseaseName: '水稻螟虫', tempRange: [20, 28], humidityRange: [60, 80], riskLevel: 'medium', optimalTemp: 24, optimalHumidity: 70 }
  ]
};

// ============ 作物需水参数 ============
// 数据来源：FAO Irrigation and Drainage Paper No.56
// ETc = Kc × ETo（作物系数 × 参考蒸散量）
const CROP_WATER_PARAMS: Record<string, {
  kc: number;                    // 作物系数 Kc（中期阶段）
  rootDepth: number;            // 根系深度
  fieldCapacity: number;        // 田间持水量（体积含水率 %）
  wiltingPoint: number;         // 凋萎系数（体积含水率 %）
  depletionFraction: number;    // 允许消耗比例 P
}> = {
  wheat: { kc: 1.15, rootDepth: 1.0, fieldCapacity: 32, wiltingPoint: 13, depletionFraction: 0.55 },
  corn:  { kc: 1.20, rootDepth: 1.2, fieldCapacity: 30, wiltingPoint: 11, depletionFraction: 0.50 },
  rice:  { kc: 1.20, rootDepth: 0.5, fieldCapacity: 38, wiltingPoint: 15, depletionFraction: 0.20 }
};

// ============ 产量基准数据 ============
// 数据来源：《中国农业统计年鉴》全国平均单产
const BASE_YIELDS: Record<string, number> = {
  wheat: 5800,  // kg/公顷
  corn: 6300,   // kg/公顷
  rice: 6900    // kg/公顷
};

// 作物中文名映射
const CROP_NAME_MAP: Record<string, string> = {
  wheat: '小麦',
  corn: '玉米',
  rice: '水稻'
};

/**
 * 温度响应函数（基于农业气象学 Beta 函数模型）
 *
 * 当温度在最适范围内时，响应值为 1
 * 偏离最适范围时，按钟形曲线下降
 * 超出临界温度时，响应值为 0
 *
 * 公式：f(T) = exp(-((T - T_opt) / sigma)^2)
 * 其中 sigma 基于临界温度计算
 */
const calcTempResponse = (temp: number, optimal: [number, number], critical: [number, number]): number => {
  const [optMin, optMax] = optimal;
  const [critMin, critMax] = critical;

  // 超出临界温度，不生长
  if (temp <= critMin || temp >= critMax) return 0;

  // 在最适范围内，响应值为 1
  if (temp >= optMin && temp <= optMax) return 1;

  // 偏离最适范围，按钟形曲线下降
  const T_opt = (optMin + optMax) / 2;
  // sigma 基于临界温度到最适温度的距离计算
  const sigma = temp < optMin
    ? (optMin - critMin) / 2
    : (critMax - optMax) / 2;

  if (sigma <= 0) return 0;

  const deviation = temp - T_opt;
  return Math.exp(-(deviation * deviation) / (2 * sigma * sigma));
};

/**
 * 湿度响应函数
 *
 * 基于土壤水分有效性（FAO 模型）
 * 水分胁迫系数：Ks = (θ - θp) / (θfc - θp)
 * 当土壤含水率在田间持水量和凋萎点之间时线性变化
 */
const calcMoistureResponse = (
  moisture: number,
  fieldCapacity: number,
  wiltingPoint: number
): number => {
  if (moisture <= wiltingPoint) return 0;
  if (moisture >= fieldCapacity) return 1;

  // 水分胁迫系数：0~1
  return (moisture - wiltingPoint) / (fieldCapacity - wiltingPoint);
};

/**
 * pH 适宜度函数
 *
 * 大多数作物适宜 pH 范围 5.5-7.5
 * 偏离越远适宜度越低
 */
const calcPHResponse = (ph: number): number => {
  const optimalMin = 5.5;
  const optimalMax = 7.5;
  if (ph >= optimalMin && ph <= optimalMax) return 1;

  const deviation = ph < optimalMin ? (optimalMin - ph) : (ph - optimalMax);
  // 每偏离 1 个 pH 单位，适宜度下降 30%
  return Math.max(0, 1 - deviation * 0.3);
};

/**
 * =============== 生长分析算法 ===============
 */
export const analyzeGrowth = (
  cropType: string,
  plantedDate: string,
  currentTemp: number,
  currentMoisture: number,
  currentPH: number = 6.5
) => {
  const stages = CROP_GROWTH_MODELS[cropType] || CROP_GROWTH_MODELS.wheat;
  const waterParams = CROP_WATER_PARAMS[cropType] || CROP_WATER_PARAMS.wheat;

  const planted = new Date(plantedDate);
  const today = new Date();
  const daysPassed = Math.floor((today.getTime() - planted.getTime()) / (86400000));

  // 确定当前生长阶段
  let currentStage = stages[0];
  let progress = 0;
  let stageIndex = 0;

  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    if (daysPassed >= stage.minDays && daysPassed <= stage.maxDays) {
      currentStage = stage;
      stageIndex = i;
      if (stage.maxDays !== stage.minDays) {
        progress = ((daysPassed - stage.minDays) / (stage.maxDays - stage.minDays)) * 100;
      }
      break;
    }
  }

  const lastStage = stages[stages.length - 1];
  if (daysPassed > lastStage.maxDays) {
    currentStage = lastStage;
    stageIndex = stages.length - 1;
    progress = 100;
  }

  // 计算各环境因子的响应值
  const tempResponse = calcTempResponse(
    currentTemp,
    currentStage.optimalTemp,
    currentStage.criticalTemp
  );

  const moistureResponse = calcMoistureResponse(
    currentMoisture,
    waterParams.fieldCapacity,
    waterParams.wiltingPoint
  );

  const phResponse = calcPHResponse(currentPH);

  // 综合健康评分（基于作物生理学权重）
  // 温度是影响光合作用最重要的因素，水分次之，pH 影响养分吸收
  const healthScore = Math.round(
    (tempResponse * 0.40 + moistureResponse * 0.45 + phResponse * 0.15) * 100
  );

  const daysToNextStage = Math.max(0, currentStage.maxDays - daysPassed);

  // 生成建议
  const recommendations: string[] = [];
  const cropName = CROP_NAME_MAP[cropType] || '作物';

  if (tempResponse < 0.7) {
    const [optMin, optMax] = currentStage.optimalTemp;
    if (currentTemp < optMin) {
      recommendations.push(`${cropName}当前处于${currentStage.name}，温度${currentTemp}°C低于最适范围(${optMin}-${optMax}°C)，建议采取保温措施`);
    } else {
      recommendations.push(`${cropName}当前处于${currentStage.name}，温度${currentTemp}°C高于最适范围(${optMin}-${optMax}°C)，建议采取降温措施`);
    }
  }

  if (moistureResponse < 0.7) {
    if (currentMoisture < waterParams.fieldCapacity * 0.6) {
      recommendations.push(`土壤含水率${currentMoisture}%偏低，接近凋萎点${waterParams.wiltingPoint}%，需要立即灌溉`);
    } else {
      recommendations.push(`土壤含水率${currentMoisture}%略低，建议适量灌溉维持在最适水平`);
    }
  }

  if (phResponse < 0.8) {
    recommendations.push(`土壤pH值${currentPH}偏离最适范围(5.5-7.5)，建议${currentPH < 5.5 ? '施用石灰改良酸性' : '施用石膏改良碱性'}`);
  }

  if (recommendations.length === 0) {
    recommendations.push(`${cropName}当前生长状况良好，环境条件适宜`);
    recommendations.push('建议保持当前管理措施，持续监测');
  }

  return {
    currentStage: currentStage.name,
    stageIndex,
    growthProgress: Math.round(progress),
    healthScore,
    daysToNextStage,
    tempScore: Math.round(tempResponse * 100),
    moistureScore: Math.round(moistureResponse * 100),
    phScore: Math.round(phResponse * 100),
    recommendations
  };
};

/**
 * =============== 病虫害风险评估算法 ===============
 *
 * 基于病害发生的环境条件匹配度计算
 * 使用温度湿度二维匹配度评估
 */
export const assessDiseaseRisk = (
  cropType: string,
  temperature: number,
  humidity: number
) => {
  const diseases = DISEASE_RISK_DATABASE[cropType] || DISEASE_RISK_DATABASE.wheat;

  type DiseaseRisk = {
    name: string;
    riskValue: number;      // 0-100
    level: 'low' | 'medium' | 'high';
    isHighRisk: boolean;
  };

  const diseaseRisks: DiseaseRisk[] = diseases.map(disease => {
    const [tempMin, tempMax] = disease.tempRange;
    const [humMin, humMax] = disease.humidityRange;

    // 温度匹配度（0-1）：使用钟形函数
    let tempMatch = 0;
    if (temperature >= tempMin && temperature <= tempMax) {
      const deviation = Math.abs(temperature - disease.optimalTemp);
      const range = (tempMax - tempMin) / 2;
      tempMatch = range > 0 ? Math.exp(-(deviation * deviation) / (2 * range * range)) : 1;
    }

    // 湿度匹配度（0-1）：使用钟形函数
    let humMatch = 0;
    if (humidity >= humMin && humidity <= humMax) {
      const deviation = Math.abs(humidity - disease.optimalHumidity);
      const range = (humMax - humMin) / 2;
      humMatch = range > 0 ? Math.exp(-(deviation * deviation) / (2 * range * range)) : 1;
    }

    // 综合风险值：温度和湿度都需要满足
    // 温度权重 0.4，湿度权重 0.6（湿度对病害影响更大）
    const riskValue = Math.round((tempMatch * 0.4 + humMatch * 0.6) * 100);

    // 基础风险等级加权
    const levelMultiplier = disease.riskLevel === 'high' ? 1.0 : disease.riskLevel === 'medium' ? 0.7 : 0.4;
    const finalRiskValue = Math.round(riskValue * levelMultiplier);

    return {
      name: disease.diseaseName,
      riskValue: finalRiskValue,
      level: finalRiskValue > 60 ? 'high' : finalRiskValue > 30 ? 'medium' : 'low',
      isHighRisk: finalRiskValue > 50
    };
  });

  // 综合风险评估
  const highRiskDiseases = diseaseRisks.filter(d => d.level === 'high').map(d => d.name);
  const mediumRiskDiseases = diseaseRisks.filter(d => d.level === 'medium').map(d => d.name);

  // 综合风险评分：取最高风险值的病害作为基准，加权平均
  const maxRisk = Math.max(...diseaseRisks.map(d => d.riskValue));
  const avgRisk = diseaseRisks.reduce((sum, d) => sum + d.riskValue, 0) / diseaseRisks.length;
  const overallRiskScore = Math.round(maxRisk * 0.6 + avgRisk * 0.4);

  const riskLevel = overallRiskScore > 60 ? 'high' : overallRiskScore > 30 ? 'medium' : 'low';

  const recommendations: string[] = [];
  if (highRiskDiseases.length > 0) {
    recommendations.push(`高风险病虫害预警：${highRiskDiseases.join('、')}`);
    recommendations.push('建议立即采取化学防治或生物防治措施');
  }
  if (mediumRiskDiseases.length > 0) {
    recommendations.push(`中等风险病虫害：${mediumRiskDiseases.join('、')}`);
    recommendations.push('加强田间监测，准备防治预案');
  }
  if (riskLevel === 'low') {
    recommendations.push('当前环境条件下病虫害风险较低');
    recommendations.push('建议保持田间通风，做好预防性管理');
  }

  return {
    riskLevel,
    riskScore: overallRiskScore,
    highRiskDiseases,
    mediumRiskDiseases,
    // 保持向后兼容：字符串数组（疾病名称）
    affectedDiseases: [...highRiskDiseases, ...mediumRiskDiseases],
    // 新增：详细的病虫害风险评估列表
    diseaseDetails: diseaseRisks,
    recommendations
  };
};

/**
 * =============== 灌溉决策算法 ===============
 *
 * 基于 FAO 土壤水分平衡模型
 *
 * 灌溉定额计算公式：
 *   W = (θ_target - θ_current) × h × A × 10
 * 其中：
 *   W   = 灌溉水量（m³）
 *   θ   = 体积含水率（%）
 *   h   = 计划湿润层深度
 *   A   = 灌溉面积（m²）
 *   10  = 单位换算系数（将 cm³ 转换为 m³，并处理 % 单位）
 *
 * 水分胁迫系数 Ks（Stewart 模型）：
 *   Ks = 1 - (1 - Pa/P) / (1 - P)
 * 其中：
 *   Pa = 实际水分消耗比例
 *   P  = 允许消耗比例（作物特定参数）
 */
export const calculateIrrigation = (
  cropType: string,
  soilMoisture: number,
  area: number,
  airTemperature: number
) => {
  const params = CROP_WATER_PARAMS[cropType] || CROP_WATER_PARAMS.wheat;
  const cropName = CROP_NAME_MAP[cropType] || '作物';

  // 面积单位转换：亩 -> 公顷（1 公顷 = 15 亩）
  const areaHectares = area / 15;
  const areaM2 = areaHectares * 10000;

  // 计算水分胁迫系数 Ks
  // 实际消耗比例 = (田间持水量 - 当前含水率) / 田间持水量
  const actualDepletion = (params.fieldCapacity - soilMoisture) / params.fieldCapacity;
  const allowableDepletion = params.depletionFraction;

  let Ks = 1; // 水分胁迫系数
  if (actualDepletion > allowableDepletion) {
    // 超过允许消耗量，产生水分胁迫
    if (1 - allowableDepletion > 0) {
      Ks = Math.max(0, 1 - (actualDepletion - allowableDepletion) / (1 - allowableDepletion));
    }
  }

  // 目标含水率：田间持水量的 90%（避免过量灌溉）
  const targetMoisture = params.fieldCapacity * 0.9;

  // 计算灌溉定额（立方米）
  // W = (θ_target - θ_current) × h × A × 0.1
  // 0.1 是单位换算系数（含水率从 % 转换为小数 × 100，深度从 m 转换为 cm × 100，两者抵消）
  const moistureDeficit = targetMoisture - soilMoisture;
  const irrigationAmount = moistureDeficit > 0
    ? Math.round(moistureDeficit * 0.1 * params.rootDepth * areaM2)
    : 0;

  // 判断灌溉需求等级
  let waterNeed: 'high' | 'medium' | 'low' = 'low';
  if (Ks < 0.5) {
    waterNeed = 'high';
  } else if (Ks < 0.8) {
    waterNeed = 'medium';
  }

  // 最佳灌溉时间判断
  let bestTime = '当前时段适合灌溉';
  if (airTemperature > 32) {
    bestTime = '建议在清晨6:00-8:00或傍晚17:00-19:00灌溉，避免高温时段蒸发损失';
  } else if (airTemperature > 28) {
    bestTime = '建议在清晨或傍晚灌溉，减少蒸发';
  } else if (airTemperature < 5) {
    bestTime = '气温过低，建议午间灌溉，防止冻害';
  }

  // 估算灌溉时长（假设喷灌流量 5 m³/h/亩）
  const flowRate = 5 * area; // m³/h
  const duration = irrigationAmount > 0 && flowRate > 0
    ? Math.round(irrigationAmount / flowRate * 60)
    : 0;

  const recommendations: string[] = [];
  if (waterNeed === 'high') {
    recommendations.push(`土壤水分胁迫严重（Ks=${Ks.toFixed(2)}），${cropName}需立即灌溉`);
    recommendations.push(`建议灌溉量：${irrigationAmount}立方米（约${duration}分钟）`);
  } else if (waterNeed === 'medium') {
    recommendations.push(`土壤水分轻度胁迫（Ks=${Ks.toFixed(2)}），建议近期灌溉`);
    recommendations.push(`建议灌溉量：${irrigationAmount}立方米（约${duration}分钟）`);
  } else {
    recommendations.push(`土壤水分充足（Ks=${Ks.toFixed(2)}），暂不需要灌溉`);
  }
  recommendations.push(bestTime);
  recommendations.push(`目标含水率：${targetMoisture.toFixed(1)}%（田间持水量的90%）`);

  const adviceText = {
    high: '土壤水分胁迫严重，需要立即灌溉',
    medium: '土壤水分轻度胁迫，建议近期灌溉',
    low: '土壤水分充足，暂不需要灌溉'
  };

  return {
    waterNeed,
    recommendedAmount: irrigationAmount,
    advice: adviceText[waterNeed],
    bestTime,
    duration,
    stressCoefficient: Number(Ks.toFixed(2)),
    recommendations
  };
};

/**
 * =============== 产量预测算法 ===============
 *
 * 基于 FAO 水分生产函数（Stewart 模型）：
 *   (1 - Ya/Ym) = Ky × (1 - ETa/ETm)
 * 其中：
 *   Ya  = 实际产量
 *   Ym  = 潜在最高产量
 *   Ky  = 作物产量响应系数
 *   ETa = 实际蒸散量
 *   ETm = 最大蒸散量
 *
 * 简化为：Ya = Ym × Ks × 环境综合系数
 */
export const predictYield = (
  cropType: string,
  plantedDate: string,
  currentHealth: number,
  area: number,
  soilMoisture: number = 55,
  temperature: number = 22
) => {
  const stages = CROP_GROWTH_MODELS[cropType] || CROP_GROWTH_MODELS.wheat;
  const params = CROP_WATER_PARAMS[cropType] || CROP_WATER_PARAMS.wheat;
  const baseYield = BASE_YIELDS[cropType] || 5500;
  const cropName = CROP_NAME_MAP[cropType] || '作物';

  const planted = new Date(plantedDate);
  const today = new Date();
  const daysPassed = Math.floor((today.getTime() - planted.getTime()) / 86400000);

  const lastStage = stages[stages.length - 1];
  const totalGrowthDays = lastStage.maxDays;
  const progress = Math.min(100, (daysPassed / totalGrowthDays) * 100);

  // 计算水分胁迫系数 Ks
  const actualDepletion = (params.fieldCapacity - soilMoisture) / params.fieldCapacity;
  let Ks = 1;
  if (actualDepletion > params.depletionFraction) {
    if (1 - params.depletionFraction > 0) {
      Ks = Math.max(0, 1 - (actualDepletion - params.depletionFraction) / (1 - params.depletionFraction));
    }
  }

  // 计算温度胁迫系数（基于当前阶段最适温度）
  const currentStage = stages.find(s => daysPassed >= s.minDays && daysPassed <= s.maxDays) || lastStage;
  const tempResponse = calcTempResponse(
    temperature,
    currentStage.optimalTemp,
    currentStage.criticalTemp
  );

  // 健康评分系数（综合反映病虫害、营养等非水分胁迫因素）
  const healthFactor = currentHealth / 100;

  // 综合产量预测
  // Ya = Ym × Ks × f(T) × healthFactor × area
  const potentialYield = baseYield * (area / 15); // 转换为该面积的总产量
  const predictedYield = Math.round(
    potentialYield * Ks * tempResponse * healthFactor
  );

  // 计算预测置信度
  // 生长进度越高，预测越准确；健康评分越高，环境越稳定
  const progressConfidence = Math.min(100, progress);
  const healthConfidence = currentHealth;
  const confidence = Math.round(progressConfidence * 0.6 + healthConfidence * 0.4);

  // 预计收获日期
  const harvestDate = new Date(planted);
  harvestDate.setDate(harvestDate.getDate() + totalGrowthDays);

  // 产量损失分析
  const lossFactors: string[] = [];
  const maxPossibleYield = potentialYield;
  const totalLoss = maxPossibleYield - predictedYield;

  if (Ks < 1) {
    const waterLoss = Math.round(maxPossibleYield * (1 - Ks));
    if (waterLoss > 0) lossFactors.push(`水分胁迫导致减产约 ${waterLoss}kg`);
  }
  if (tempResponse < 1) {
    const tempLoss = Math.round(maxPossibleYield * (1 - tempResponse));
    if (tempLoss > 0) lossFactors.push(`温度胁迫导致减产约 ${tempLoss}kg`);
  }
  if (healthFactor < 1) {
    const healthLoss = Math.round(maxPossibleYield * (1 - healthFactor));
    if (healthLoss > 0) lossFactors.push(`病虫害及营养不足导致减产约 ${healthLoss}kg`);
  }

  return {
    predictedYield,
    potentialYield: maxPossibleYield,
    harvestDate: harvestDate.toISOString().split('T')[0],
    daysToHarvest: Math.max(0, totalGrowthDays - daysPassed),
    currentGrowthProgress: Math.round(progress),
    confidence,
    stressCoefficient: Number(Ks.toFixed(2)),
    tempResponseCoefficient: Number(tempResponse.toFixed(2)),
    lossAnalysis: lossFactors,
    cropName
  };
};

/**
 * =============== 智能灌溉规则引擎 ===============
 *
 * 基于实时传感器数据的自动化灌溉决策
 * 集成土壤湿度、作物需水、天气预报等多因子判断
 */
export const irrigationRuleEngine = (
  soilMoisture: number,
  cropType: string,
  airTemperature: number = 22,
  forecastRain: number = 0
): { shouldIrrigate: boolean; reason: string; amount: number; priority: 'urgent' | 'normal' | 'low' } => {
  const params = CROP_WATER_PARAMS[cropType] || CROP_WATER_PARAMS.wheat;
  const cropName = CROP_NAME_MAP[cropType] || '作物';

  // 临界湿度（接近凋萎点）
  const criticalMoisture = params.wiltingPoint + (params.fieldCapacity - params.wiltingPoint) * 0.2;
  // 警戒湿度（低于最适范围）
  const warningMoisture = params.wiltingPoint + (params.fieldCapacity - params.wiltingPoint) * 0.5;

  // 规则1：土壤湿度低于临界值 - 紧急灌溉
  if (soilMoisture <= criticalMoisture) {
    const targetMoisture = params.fieldCapacity * 0.9;
    const amount = Math.round((targetMoisture - soilMoisture) * 0.1 * params.rootDepth * 10000);
    return {
      shouldIrrigate: true,
      reason: `${cropName}土壤湿度${soilMoisture}%低于临界值${criticalMoisture.toFixed(1)}%，接近凋萎点，需紧急灌溉`,
      amount,
      priority: 'urgent'
    };
  }

  // 规则2：土壤湿度低于警戒值 - 建议灌溉
  if (soilMoisture <= warningMoisture) {
    // 但如果有降雨预报，可适当推迟
    if (forecastRain >= 10) {
      return {
        shouldIrrigate: false,
        reason: `土壤湿度${soilMoisture}%偏低，但预报有${forecastRain}mm降雨，建议观察降雨情况后再决定`,
        amount: 0,
        priority: 'low'
      };
    }

    const targetMoisture = params.fieldCapacity * 0.9;
    const amount = Math.round((targetMoisture - soilMoisture) * 0.1 * params.rootDepth * 10000);
    return {
      shouldIrrigate: true,
      reason: `${cropName}土壤湿度${soilMoisture}%低于警戒值${warningMoisture.toFixed(1)}%，建议灌溉`,
      amount,
      priority: 'normal'
    };
  }

  // 规则3：高温干旱叠加条件
  if (airTemperature > 32 && soilMoisture < params.fieldCapacity * 0.7) {
    const targetMoisture = params.fieldCapacity * 0.9;
    const amount = Math.round((targetMoisture - soilMoisture) * 0.1 * params.rootDepth * 10000);
    return {
      shouldIrrigate: true,
      reason: `高温${airTemperature}°C且土壤湿度${soilMoisture}%偏低，蒸发量大，建议灌溉补水`,
      amount,
      priority: 'normal'
    };
  }

  return {
    shouldIrrigate: false,
    reason: `${cropName}土壤湿度${soilMoisture}%在适宜范围内，无需灌溉`,
    amount: 0,
    priority: 'low'
  };
};
