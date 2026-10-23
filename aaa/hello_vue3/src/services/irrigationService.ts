// 智能灌溉决策服务
// 基于传感器数据和作物需求，实现智能化灌溉决策

import type { SensorData, IrrigationZone, Crop } from '../types';

// 灌溉决策结果
export interface IrrigationDecision {
  needIrrigation: boolean;
  zones: IrrigationZone[];
  recommendedZones: IrrigationZone[];
  reason: string;
  waterAmount: number;
  optimalTime: string;
}

// 作物水分需求配置
const CROP_WATER_REQUIREMENTS: Record<string, { minMoisture: number; maxMoisture: number; waterPerArea: number }> = {
  '小麦': { minMoisture: 40, maxMoisture: 70, waterPerArea: 25 },
  '玉米': { minMoisture: 45, maxMoisture: 75, waterPerArea: 30 },
  '草莓': { minMoisture: 50, maxMoisture: 80, waterPerArea: 35 },
  '黄瓜': { minMoisture: 55, maxMoisture: 85, waterPerArea: 40 },
  '番茄': { minMoisture: 45, maxMoisture: 75, waterPerArea: 32 },
  '粮食作物': { minMoisture: 40, maxMoisture: 70, waterPerArea: 28 },
  '水果': { minMoisture: 45, maxMoisture: 75, waterPerArea: 35 },
  '蔬菜': { minMoisture: 50, maxMoisture: 80, waterPerArea: 38 }
};

// 获取作物水分需求
const getCropWaterRequirement = (cropName: string, cropType: string) => {
  return CROP_WATER_REQUIREMENTS[cropName] || CROP_WATER_REQUIREMENTS[cropType] || CROP_WATER_REQUIREMENTS['蔬菜'];
};

// 计算灌溉需求评分
const calculateIrrigationScore = (soilMoisture: number, airTemperature: number, humidity: number, cropRequirement: { minMoisture: number; maxMoisture: number }) => {
  let score = 0;
  
  // 土壤湿度评分
  if (soilMoisture < cropRequirement.minMoisture) {
    score += (cropRequirement.minMoisture - soilMoisture) * 2;
  } else if (soilMoisture > cropRequirement.maxMoisture) {
    score += (soilMoisture - cropRequirement.maxMoisture);
  }
  
  // 温度评分（高温增加灌溉需求）
  if (airTemperature > 30) {
    score += (airTemperature - 30) * 1.5;
  }
  
  // 湿度评分（低湿度增加灌溉需求）
  if (humidity < 50) {
    score += (50 - humidity) * 0.5;
  }
  
  return score;
};

// 获取最佳灌溉时间
const getOptimalIrrigationTime = (hour: number): string => {
  if (hour >= 6 && hour < 10) {
    return '当前正是灌溉最佳时间（早晨6-10点）';
  } else if (hour >= 17 && hour < 20) {
    return '当前适合灌溉（傍晚17-20点）';
  } else if (hour >= 10 && hour < 17) {
    return '建议等待至傍晚灌溉，避免中午高温蒸发';
  } else {
    return '夜间温度较低，可进行灌溉';
  }
};

// 主决策函数
export const calculateIrrigationRecommendation = (
  sensorData: SensorData,
  zones: IrrigationZone[],
  crops: Crop[]
): IrrigationDecision => {
  const { soil, weather } = sensorData;
  
  if (!soil || !weather) {
    return {
      needIrrigation: false,
      zones: [],
      recommendedZones: [],
      reason: '传感器数据不足，无法做出决策',
      waterAmount: 0,
      optimalTime: ''
    };
  }
  
  const currentHour = new Date().getHours();
  const recommendations: { zone: IrrigationZone; score: number; reason: string }[] = [];
  
  zones.forEach(zone => {
    // 找到该区域种植的作物
    const zoneNamePart = zone.name.split('-')[1]?.replace('区', '') || '';
    const zoneCrops = crops.filter(crop => zone.name.includes(crop.name.replace('园', '')) || 
                                         crop.name.includes(zoneNamePart));
    
    if (zoneCrops.length === 0) return;
    
    const mainCrop = zoneCrops[0];
    if (!mainCrop) return;
    
    const requirement = getCropWaterRequirement(mainCrop.name, mainCrop.type);
    if (!requirement) return;
    
    const score = calculateIrrigationScore(soil.moisture, weather.airTemperature, weather.airHumidity, requirement);
    
    let reason = '';
    if (score > 50) {
      reason = `需要立即灌溉 - ${mainCrop.name}区域土壤湿度(${soil.moisture}%)低于需求(${requirement.minMoisture}%)`;
    } else if (score > 25) {
      reason = `建议近期灌溉 - ${mainCrop.name}区域土壤湿度(${soil.moisture}%)偏低`;
    } else {
      reason = `${mainCrop.name}区域当前水分充足`;
    }
    
    recommendations.push({ zone, score, reason });
  });
  
  // 按评分排序
  recommendations.sort((a, b) => b.score - a.score);
  
  const needIrrigation = recommendations.some(r => r.score > 25);
  const recommendedZones = recommendations.filter(r => r.score > 25).map(r => r.zone);
  
  // 计算总需水量
  const totalWaterAmount = recommendedZones.reduce((sum, zone) => {
    const zoneCrops = crops.filter(crop => zone.name.includes(crop.name.replace('园', '')));
    if (zoneCrops.length > 0 && zoneCrops[0]) {
      const crop = zoneCrops[0];
      const requirement = getCropWaterRequirement(crop.name, crop.type);
      if (requirement) {
        return sum + zone.area * requirement.waterPerArea;
      }
    }
    return sum + zone.area * 30;
  }, 0);
  
  // 生成综合原因
  let reason = '';
  if (recommendations.length === 0) {
    reason = '未找到匹配的灌溉区域';
  } else if (recommendations[0] && recommendations[0].score > 50) {
    reason = `紧急：${recommendations[0].reason}`;
  } else if (needIrrigation) {
    reason = recommendations.filter(r => r.score > 25).map(r => r.reason).join('；');
  } else {
    reason = '当前所有区域水分充足，暂不需要灌溉';
  }
  
  return {
    needIrrigation,
    zones,
    recommendedZones,
    reason,
    waterAmount: Math.round(totalWaterAmount),
    optimalTime: getOptimalIrrigationTime(currentHour)
  };
};

// 执行灌溉
export const executeIrrigation = (
  zones: IrrigationZone[],
  waterAmount: number
): { success: boolean; message: string; updatedZones: IrrigationZone[] } => {
  const now = new Date();
  const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const updatedZones = zones.map(zone => ({
    ...zone,
    status: '正常',
    lastIrrigation: formattedTime,
    nextIrrigation: calculateNextIrrigation(zone.schedule)
  }));
  
  return {
    success: true,
    message: `已成功灌溉 ${zones.length} 个区域，共用水 ${waterAmount} 立方米`,
    updatedZones
  };
};

// 计算下次灌溉时间
const calculateNextIrrigation = (schedule: string): string => {
  const now = new Date();
  let nextDate = new Date(now);
  
  switch (schedule) {
    case '每日':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case '每两天':
      nextDate.setDate(nextDate.getDate() + 2);
      break;
    case '每周':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    default:
      nextDate.setDate(nextDate.getDate() + 1);
  }
  
  return `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')} 08:00`;
};

// 获取灌溉历史统计
export const getIrrigationStatistics = (zones: IrrigationZone[]) => {
  const totalArea = zones.reduce((sum, z) => sum + z.area, 0);
  const normalZones = zones.filter(z => z.status === '正常').length;
  const warningZones = zones.filter(z => z.status === '警告').length;
  const totalWaterUsed = zones.reduce((sum, z) => sum + z.waterAmount, 0);
  
  return {
    totalArea,
    normalZones,
    warningZones,
    totalWaterUsed,
    avgWaterPerArea: totalArea > 0 ? Math.round(totalWaterUsed / totalArea) : 0
  };
};
