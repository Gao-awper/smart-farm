import type { Crop, IrrigationZone, Device, Alert } from '../types';

// 作物统计
export const getCropStatistics = (crops: Crop[]) => {
  const totalArea = crops.reduce((sum, crop) => sum + crop.area, 0);
  const healthyCount = crops.filter(c => c.status === '健康').length;
  const warningCount = crops.filter(c => c.status === '警告').length;
  const dangerCount = crops.filter(c => c.status === '危险').length;
  
  return {
    totalCount: crops.length,
    totalArea: totalArea.toFixed(1),
    healthyCount,
    warningCount,
    dangerCount,
    healthRate: crops.length > 0 ? ((healthyCount / crops.length) * 100).toFixed(1) : '0'
  };
};

// 灌溉统计
export const getIrrigationStatistics = (zones: IrrigationZone[]) => {
  const totalWater = zones.reduce((sum, zone) => sum + (zone.waterAmount || 0), 0);
  const activeZones = zones.filter(z => z.status === '灌溉中').length;
  
  return {
    totalZones: zones.length,
    activeZones,
    totalWater: totalWater.toFixed(1),
    efficiency: '85.5'
  };
};

// 设备统计
export const getDeviceStatistics = (devices: Device[]) => {
  const onlineCount = devices.filter(d => d.status === 'online').length;
  const offlineCount = devices.filter(d => d.status === 'offline').length;
  
  return {
    totalCount: devices.length,
    onlineCount,
    offlineCount,
    onlineRate: devices.length > 0 ? ((onlineCount / devices.length) * 100).toFixed(1) : '0'
  };
};

// 告警统计
export const getAlertStatistics = (alerts: Alert[]) => {
  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length;
  const warningCount = alerts.filter(a => a.severity === 'warning' && !a.acknowledged).length;
  const acknowledgedCount = alerts.filter(a => a.acknowledged).length;
  
  return {
    totalCount: alerts.length,
    criticalCount,
    warningCount,
    acknowledgedCount,
    pendingCount: criticalCount + warningCount
  };
};

// 生成土壤湿度趋势数据
export const generateSoilMoistureTrend = (days: number = 7) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      value: 55 + Math.random() * 20
    });
  }
  
  return data;
};

// 生成温度趋势数据
export const generateTemperatureTrend = (days: number = 7) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      high: 28 + Math.random() * 8,
      low: 15 + Math.random() * 8
    });
  }
  
  return data;
};

// 生成用水量趋势数据
export const generateWaterUsageTrend = (days: number = 7) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      value: 80 + Math.random() * 60
    });
  }
  
  return data;
};

// 产量预测
export const predictFutureYield = (crops: Crop[], sensorData?: any): number => {
  if (!crops || crops.length === 0) return 0;
  
  let totalPrediction = 0;
  
  crops.forEach(crop => {
    let prediction = (crop.yield || 0) * (crop.area || 0);
    
    if (sensorData && sensorData.soil) {
      if (sensorData.soil.moisture < 40) prediction *= 0.85;
      else if (sensorData.soil.moisture > 70) prediction *= 0.9;
      
      if (sensorData.soil.ph < 5.5 || sensorData.soil.ph > 7.5) prediction *= 0.92;
    }
    
    if (sensorData && sensorData.weather) {
      if (sensorData.weather.airTemperature < 15 || sensorData.weather.airTemperature > 35) {
        prediction *= 0.9;
      }
    }
    
    totalPrediction += prediction;
  });
  
  return Math.round(totalPrediction);
};

// 单个作物产量预测
export const predictCropYield = (crop: Crop, sensorData?: any): number => {
  if (!crop) return 0;
  
  let prediction = crop.yield * crop.area;
  
  if (sensorData && sensorData.soil) {
    if (sensorData.soil.moisture < 40) prediction *= 0.85;
    else if (sensorData.soil.moisture > 70) prediction *= 0.9;
    
    if (sensorData.soil.ph < 5.5 || sensorData.soil.ph > 7.5) prediction *= 0.92;
  }
  
  if (sensorData && sensorData.weather) {
    if (sensorData.weather.airTemperature < 15 || sensorData.weather.airTemperature > 35) {
      prediction *= 0.9;
    }
  }
  
  return Math.round(prediction);
};

// 健康评分
export const getHealthScore = (crops: Crop[], devices: Device[], alerts: Alert[]): { score: number; breakdown: { crops: number; irrigation: number; alerts: number } } => {
  // 作物健康评分：生长中、成熟期、收获期都视为健康状态
  const healthyStatuses = ['健康', '生长中', '成熟期', '收获期'];
  const cropScore = crops.length > 0 
    ? Math.round((crops.filter(c => healthyStatuses.includes(c.status)).length / crops.length) * 100) 
    : 100;
  
  // 设备/灌溉状态评分：online、open、running、closed都视为正常工作状态
  // closed表示阀门关闭，也是正常状态（只是没有在灌溉）
  const activeStatuses = ['online', 'open', 'running', 'closed'];
  const deviceScore = devices.length > 0 
    ? Math.round((devices.filter(d => activeStatuses.includes(d.status)).length / devices.length) * 100) 
    : 100;
  
  // 告警处理评分
  const alertScore = alerts.length > 0 
    ? Math.round((alerts.filter(a => a.acknowledged).length / alerts.length) * 100) 
    : 100;
  
  // 严重告警惩罚
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length;
  const criticalPenalty = criticalAlerts * 10;
  
  // 计算总分
  const totalScore = Math.max(0, Math.round((cropScore * 0.4 + deviceScore * 0.3 + alertScore * 0.3) - criticalPenalty));
  
  return {
    score: totalScore,
    breakdown: {
      crops: cropScore,
      irrigation: deviceScore,
      alerts: alertScore
    }
  };
};

// 数据分析报告生成
export const generateAnalysisReport = (crops: Crop[], zones: IrrigationZone[], devices: Device[], alerts: Alert[]) => {
  const cropStats = getCropStatistics(crops);
  const irrigationStats = getIrrigationStatistics(zones);
  const deviceStats = getDeviceStatistics(devices);
  const alertStats = getAlertStatistics(alerts);
  
  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalCrops: cropStats.totalCount,
      totalArea: cropStats.totalArea,
      totalWaterUsage: irrigationStats.totalWater,
      onlineDevices: deviceStats.onlineCount,
      pendingAlerts: alertStats.pendingCount
    },
    sections: [
      {
        title: '作物生长状况',
        content: `共有 ${cropStats.totalCount} 种作物，总面积 ${cropStats.totalArea} 亩。健康作物占比 ${cropStats.healthRate}%，${cropStats.warningCount} 种作物需要关注，${cropStats.dangerCount} 种作物处于危险状态。`
      },
      {
        title: '灌溉系统运行',
        content: `灌溉系统覆盖 ${irrigationStats.totalZones} 个区域，当前 ${irrigationStats.activeZones} 个区域正在灌溉。累计用水量 ${irrigationStats.totalWater} 吨，灌溉效率 ${irrigationStats.efficiency}%。`
      },
      {
        title: '设备状态',
        content: `共有 ${deviceStats.totalCount} 台设备，${deviceStats.onlineCount} 台在线，${deviceStats.offlineCount} 台离线，在线率 ${deviceStats.onlineRate}%。`
      },
      {
        title: '告警处理',
        content: `当前有 ${alertStats.pendingCount} 条未处理告警，其中 ${alertStats.criticalCount} 条严重告警。已处理 ${alertStats.acknowledgedCount} 条告警。`
      }
    ]
  };
};

// 别名导出，兼容旧代码
export { predictCropYield as predictYield };
