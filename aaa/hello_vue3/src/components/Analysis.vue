<template>
  <div class="analysis-container">
    <h1>数据分析</h1>
    <div class="analysis-filters">
      <div class="filter-item">
        <label>时间范围:</label>
        <select v-model="timeRange">
          <option value="week">近一周</option>
          <option value="month">近一个月</option>
          <option value="quarter">近三个月</option>
          <option value="year">近一年</option>
        </select>
      </div>
      <div class="filter-item">
        <label>数据类型:</label>
        <select v-model="dataType">
          <option value="all">全部数据</option>
          <option value="soil">土壤数据</option>
          <option value="weather">气象数据</option>
          <option value="water">灌溉数据</option>
          <option value="yield">产量数据</option>
        </select>
      </div>
      <button class="apply-filter-btn" @click="applyFilter">应用筛选</button>
    </div>
    <div class="analysis-cards">
      <div class="card">
        <h3>土壤湿度分析</h3>
        <div class="chart-container">
          <div ref="soilMoistureChart" class="chart"></div>
          <div class="chart-stats">
            <div class="stat-item">
              <span class="stat-label">平均湿度:</span>
              <span class="stat-value">{{ soilStats.average }}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">最高湿度:</span>
              <span class="stat-value">{{ soilStats.max }}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">最低湿度:</span>
              <span class="stat-value">{{ soilStats.min }}%</span>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>温度变化趋势</h3>
        <div class="chart-container">
          <div ref="temperatureChart" class="chart"></div>
          <div class="chart-stats">
            <div class="stat-item">
              <span class="stat-label">平均温度:</span>
              <span class="stat-value">{{ tempStats.average }}°C</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">最高温度:</span>
              <span class="stat-value">{{ tempStats.max }}°C</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">最低温度:</span>
              <span class="stat-value">{{ tempStats.min }}°C</span>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>灌溉用水量分析</h3>
        <div class="chart-container">
          <div ref="waterUsageChart" class="chart"></div>
          <div class="chart-stats">
            <div class="stat-item">
              <span class="stat-label">总用水量:</span>
              <span class="stat-value">{{ waterStats.total }}吨</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">日均用水:</span>
              <span class="stat-value">{{ waterStats.daily }}吨</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">节水率:</span>
              <span class="stat-value">{{ waterStats.saving }}%</span>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>产量预测分析</h3>
        <div class="chart-container">
          <div ref="yieldChart" class="chart"></div>
          <div class="chart-stats">
            <div class="stat-item">
              <span class="stat-label">预计产量:</span>
              <span class="stat-value">{{ yieldStats.predicted }}kg</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">去年产量:</span>
              <span class="stat-value">{{ yieldStats.lastYear }}kg</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">增长率:</span>
              <span class="stat-value">{{ yieldStats.growth }}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <h3>土壤pH值分析</h3>
        <div class="chart-container">
          <div ref="phChart" class="chart"></div>
          <div class="chart-stats">
            <div class="stat-item">
              <span class="stat-label">平均pH值:</span>
              <span class="stat-value">{{ phStats.average }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">最佳范围:</span>
              <span class="stat-value">{{ phStats.range }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">状态:</span>
              <span class="stat-value status">{{ phStats.status }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>光照强度分析</h3>
        <div class="chart-container">
          <div ref="lightChart" class="chart"></div>
          <div class="chart-stats">
            <div class="stat-item">
              <span class="stat-label">平均光照:</span>
              <span class="stat-value">{{ lightStats.average }}lux</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">最高光照:</span>
              <span class="stat-value">{{ lightStats.max }}lux</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">最低光照:</span>
              <span class="stat-value">{{ lightStats.min }}lux</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="analysis-reports">
      <h3>分析报告</h3>
      <div class="report-card">
        <h4>土壤健康报告</h4>
        <p>根据近一个月的土壤监测数据，您的农场土壤健康状况良好，pH值维持在6.5-7.0之间，适合大多数作物生长。建议继续保持当前的施肥和灌溉策略。</p>
        <button class="download-btn" @click="downloadReport('土壤健康报告')">下载报告</button>
      </div>
      <div class="report-card">
        <h4>灌溉效率分析</h4>
        <p>分析显示，您的灌溉系统效率为85%，比行业平均水平高10%。建议在西区增加灌溉时间，以提高玉米的生长速度。</p>
        <button class="download-btn" @click="downloadReport('灌溉效率分析')">下载报告</button>
      </div>
      <div class="report-card">
        <h4>产量预测报告</h4>
        <p>基于当前的生长状况和环境条件，预计今年的小麦产量将达到800kg/亩，比去年增长15%。建议在收获前两周增加钾肥的施用量，以提高籽粒饱满度。</p>
        <button class="download-btn" @click="downloadReport('产量预测报告')">下载报告</button>
      </div>
      <div class="report-card">
        <h4>环境条件分析</h4>
        <p>近一个月的气象数据显示，温度和湿度条件适宜作物生长，光照充足。预计未来一周天气良好，有利于作物光合作用和生长。</p>
        <button class="download-btn" @click="downloadReport('环境条件分析')">下载报告</button>
      </div>
      <div class="report-card">
        <h4>资源利用分析</h4>
        <p>水资源利用效率较高，比去年同期节约15%。电力消耗稳定，建议优化灌溉时间，进一步降低能源消耗。</p>
        <button class="download-btn" @click="downloadReport('资源利用分析')">下载报告</button>
      </div>
    </div>
    
    <div class="data-export">
      <h3>数据导出</h3>
      <div class="export-options">
        <button class="export-btn" @click="exportExcel">导出Excel数据</button>
        <button class="export-btn" @click="exportPDF">导出PDF报告</button>
        <button class="export-btn" @click="exportCSV">导出CSV数据</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, onUnmounted, computed } from 'vue';
import * as echarts from 'echarts';
import { getAnalysisData } from '../api/farmApi';
import jsPDF from 'jspdf';
import { farmStore } from '../stores/farmStore';
import { getCropStatistics, getIrrigationStatistics, getDeviceStatistics, getAlertStatistics, generateSoilMoistureTrend, generateTemperatureTrend, generateWaterUsageTrend, predictFutureYield, getHealthScore } from '../services/analysisService';

const timeRange = ref('month');
const dataType = ref('all');

const soilMoistureChart = ref(null);
const temperatureChart = ref(null);
const waterUsageChart = ref(null);
const yieldChart = ref(null);
const phChart = ref(null);
const lightChart = ref(null);

let chartInstances = [];

const soilStats = reactive({ average: 65, max: 75, min: 55 });
const tempStats = reactive({ average: 24, max: 30, min: 18 });
const waterStats = reactive({ total: 1200, daily: 40, saving: 15 });
const yieldStats = reactive({ predicted: 12000, lastYear: 10500, growth: 14.3 });
const phStats = reactive({ average: 6.8, range: '6.5-7.0', status: '良好' });
const lightStats = reactive({ average: 75000, max: 100000, min: 50000 });

// 使用新的数据分析服务
const cropStats = computed(() => getCropStatistics(farmStore.state.crops));
const irrigationStats = computed(() => getIrrigationStatistics(farmStore.state.irrigationZones));
const deviceStats = computed(() => getDeviceStatistics(farmStore.state.devices));
const alertStats = computed(() => getAlertStatistics(farmStore.state.alerts));
const healthScore = computed(() => getHealthScore(farmStore.state.crops, farmStore.state.devices, farmStore.state.alerts));

// 产量预测
const yieldPrediction = computed(() => predictFutureYield(farmStore.state.crops, farmStore.state.realtimeData));

const generateTimeLabels = (range) => {
  const labels = [];
  const now = new Date();
  let days = range === 'week' ? 7 : range === 'month' ? 30 : range === 'quarter' ? 90 : 365;
  
  for (let i = days; i >= 0; i -= range === 'week' ? 1 : range === 'month' ? 5 : 10) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
  }
  return labels;
};

const generateRandomData = (length, min, max, base = 0) => {
  return Array.from({ length }, () => base + Math.round(min + Math.random() * (max - min)));
};

const initCharts = () => {
  const timeLabels = generateTimeLabels(timeRange.value);
  const dataLength = timeLabels.length;

  if (soilMoistureChart.value) {
    const chart = echarts.init(soilMoistureChart.value);
    chartInstances.push(chart);
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: timeLabels },
      yAxis: { type: 'value', min: 40, max: 100, axisLabel: { formatter: '{value}%' } },
      series: [{
        name: '土壤湿度',
        type: 'line',
        data: generateRandomData(dataLength, 50, 25, 50),
        smooth: true,
        lineStyle: { color: '#2d5016', width: 3 },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(45, 80, 22, 0.3)' },
          { offset: 1, color: 'rgba(45, 80, 22, 0.05)' }
        ]) },
        symbol: 'circle',
        symbolSize: 6
      }]
    });
  }

  if (temperatureChart.value) {
    const chart = echarts.init(temperatureChart.value);
    chartInstances.push(chart);
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: timeLabels },
      yAxis: { type: 'value', min: 10, max: 40, axisLabel: { formatter: '{value}°C' } },
      series: [{
        name: '温度',
        type: 'line',
        data: generateRandomData(dataLength, 10, 20, 15),
        smooth: true,
        lineStyle: { color: '#e74c3c', width: 3 },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(231, 76, 60, 0.3)' },
          { offset: 1, color: 'rgba(231, 76, 60, 0.05)' }
        ]) },
        symbol: 'circle',
        symbolSize: 6
      }]
    });
  }

  if (waterUsageChart.value) {
    const chart = echarts.init(waterUsageChart.value);
    chartInstances.push(chart);
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: timeLabels },
      yAxis: { type: 'value', axisLabel: { formatter: '{value}吨' } },
      series: [{
        name: '用水量',
        type: 'bar',
        data: generateRandomData(dataLength, 20, 40, 20),
        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#3498db' },
          { offset: 1, color: '#2980b9' }
        ]) },
        barWidth: '50%'
      }]
    });
  }

  if (yieldChart.value) {
    const chart = echarts.init(yieldChart.value);
    chartInstances.push(chart);
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['今年预测', '去年实际'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['小麦', '玉米', '水稻', '大豆'] },
      yAxis: { type: 'value', axisLabel: { formatter: '{value}kg/亩' } },
      series: [
        { name: '今年预测', type: 'bar', data: [850, 920, 780, 320], itemStyle: { color: '#27ae60' } },
        { name: '去年实际', type: 'bar', data: [760, 810, 720, 280], itemStyle: { color: '#95a5a6' } }
      ]
    });
  }

  if (phChart.value) {
    const chart = echarts.init(phChart.value);
    chartInstances.push(chart);
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: timeLabels },
      yAxis: { type: 'value', min: 5.5, max: 8, precision: 1 },
      series: [{
        name: 'pH值',
        type: 'line',
        data: generateRandomData(dataLength, 0.3, 0.5, 6.6),
        smooth: true,
        lineStyle: { color: '#9b59b6', width: 3 },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(155, 89, 182, 0.3)' },
          { offset: 1, color: 'rgba(155, 89, 182, 0.05)' }
        ]) },
        markLine: {
          silent: true,
          data: [
            { yAxis: 6.5, lineStyle: { color: '#f39c12', type: 'dashed' }, label: { formatter: '最佳下限' } },
            { yAxis: 7.0, lineStyle: { color: '#f39c12', type: 'dashed' }, label: { formatter: '最佳上限' } }
          ]
        }
      }]
    });
  }

  if (lightChart.value) {
    const chart = echarts.init(lightChart.value);
    chartInstances.push(chart);
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: timeLabels },
      yAxis: { type: 'value', axisLabel: { formatter: '{value}lux' } },
      series: [{
        name: '光照强度',
        type: 'line',
        data: generateRandomData(dataLength, 20000, 40000, 50000),
        smooth: true,
        lineStyle: { color: '#f39c12', width: 3 },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(243, 156, 18, 0.3)' },
          { offset: 1, color: 'rgba(243, 156, 18, 0.05)' }
        ]) },
        symbol: 'circle',
        symbolSize: 6
      }]
    });
  }
};

const loadAnalysisData = async () => {
  try {
    const params = { timeRange: timeRange.value, dataType: dataType.value };
    const response = await getAnalysisData(params);
    if (response.data && response.data.data) {
      Object.assign(soilStats, response.data.data.soil || soilStats);
      Object.assign(tempStats, response.data.data.weather || tempStats);
    }
  } catch (error) {
    console.error('加载分析数据失败:', error);
  }
};

const applyFilter = () => {
  chartInstances.forEach(chart => chart.dispose());
  chartInstances = [];
  loadAnalysisData();
  setTimeout(() => initCharts(), 100);
};

const downloadReport = (reportName) => {
  const reportContent = generateReportContent(reportName);
  const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${reportName}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  alert(`${reportName}已下载！`);
};

const generateReportContent = (reportName) => {
  const reports = {
    '土壤健康报告': `绿野智农 - 土壤健康报告
生成时间: ${new Date().toLocaleString('zh-CN')}

一、土壤湿度分析
平均湿度: ${soilStats.average}%
最高湿度: ${soilStats.max}%  
最低湿度: ${soilStats.min}%

二、土壤pH值分析
平均pH值: ${phStats.average}
最佳范围: ${phStats.range}
状态: ${phStats.status}

三、分析结论
根据监测数据，您的农场土壤健康状况良好，pH值维持在适宜范围，适合大多数作物生长。

四、建议
1. 继续保持当前的施肥策略
2. 定期监测土壤湿度变化
3. 根据作物需求调整灌溉方案`,

    '灌溉效率分析': `绿野智农 - 灌溉效率分析报告
生成时间: ${new Date().toLocaleString('zh-CN')}

一、用水统计
总用水量: ${waterStats.total}吨
日均用水: ${waterStats.daily}吨
节水率: ${waterStats.saving}%

二、效率评估
灌溉系统效率: 85%
行业平均水平: 75%
超出行业水平: 10%

三、分析结论
灌溉系统运行高效，水资源利用合理。

四、建议
1. 在西区增加灌溉时间
2. 优化灌溉时段安排
3. 考虑引入智能灌溉系统`,

    '产量预测报告': `绿野智农 - 产量预测报告
生成时间: ${new Date().toLocaleString('zh-CN')}

一、产量预测
预计产量: ${yieldStats.predicted}kg
去年产量: ${yieldStats.lastYear}kg
增长率: ${yieldStats.growth}%

二、预测依据
- 当前作物健康状况良好
- 环境条件适宜
- 管理措施得当

三、建议
1. 在收获前两周增加钾肥施用量
2. 加强病虫害防治
3. 关注天气预报，做好防灾准备`,

    '环境条件分析': `绿野智农 - 环境条件分析报告
生成时间: ${new Date().toLocaleString('zh-CN')}

一、温度分析
平均温度: ${tempStats.average}°C
最高温度: ${tempStats.max}°C
最低温度: ${tempStats.min}°C

二、光照分析
平均光照: ${lightStats.average}lux
最高光照: ${lightStats.max}lux
最低光照: ${lightStats.min}lux

三、分析结论
温度和湿度条件适宜作物生长，光照充足。

四、建议
预计未来一周天气良好，有利于作物光合作用和生长。`,

    '资源利用分析': `绿野智农 - 资源利用分析报告
生成时间: ${new Date().toLocaleString('zh-CN')}

一、水资源利用
用水效率: 较高
较去年同期节约: 15%

二、电力消耗
消耗状态: 稳定

三、建议
1. 优化灌溉时间
2. 进一步降低能源消耗
3. 考虑引入可再生能源`
  };
  return reports[reportName] || `绿野智农 - ${reportName}
生成时间: ${new Date().toLocaleString('zh-CN')}

报告内容待补充。`;
};

const exportCSV = () => {
  const headers = ['日期', '土壤湿度(%)', '温度(°C)', 'pH值', '光照(lux)', '用水量(吨)'];
  const timeLabels = generateTimeLabels(timeRange.value);
  const rows = timeLabels.map((date, i) => [
    date,
    Math.round(50 + Math.random() * 30),
    Math.round(15 + Math.random() * 20),
    (6.5 + Math.random() * 0.8).toFixed(1),
    Math.round(50000 + Math.random() * 50000),
    Math.round(20 + Math.random() * 40)
  ]);
  
  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `农场数据分析_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  alert('CSV数据已导出！');
};

const exportExcel = () => {
  const content = `绿野智农数据分析报告
生成时间: ${new Date().toLocaleString('zh-CN')}
时间范围: ${timeRange.value === 'week' ? '近一周' : timeRange.value === 'month' ? '近一个月' : timeRange.value === 'quarter' ? '近三个月' : '近一年'}

【土壤数据】
平均湿度: ${soilStats.average}%
最高湿度: ${soilStats.max}%
最低湿度: ${soilStats.min}%
平均pH值: ${phStats.average}

【气象数据】
平均温度: ${tempStats.average}°C
最高温度: ${tempStats.max}°C
最低温度: ${tempStats.min}°C
平均光照: ${lightStats.average}lux

【灌溉数据】
总用水量: ${waterStats.total}吨
日均用水: ${waterStats.daily}吨
节水率: ${waterStats.saving}%

【产量数据】
预计产量: ${yieldStats.predicted}kg
去年产量: ${yieldStats.lastYear}kg
增长率: ${yieldStats.growth}%`;

  const blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `农场数据分析_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  alert('Excel数据已导出！');
};

const exportPDF = () => {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  doc.setFont('SimHei');
  doc.setFontSize(18);
  doc.setTextColor(45, 80, 22);
  doc.text('🌾 绿野智农数据分析报告', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(102, 102, 102);
  doc.text(`生成时间: ${new Date().toLocaleString('zh-CN')}`, pageWidth / 2, 30, { align: 'center' });
  
  doc.text(`时间范围: ${timeRange.value === 'week' ? '近一周' : timeRange.value === 'month' ? '近一个月' : timeRange.value === 'quarter' ? '近三个月' : '近一年'}`, pageWidth / 2, 38, { align: 'center' });

  let yPos = 50;
  const sectionSpacing = 8;
  const lineHeight = 7;
  
  doc.setFontSize(14);
  doc.setTextColor(45, 80, 22);
  doc.text('📊 土壤数据', 20, yPos);
  yPos += sectionSpacing;
  
  doc.setLineWidth(0.5);
  doc.setDrawColor(240, 247, 230);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += sectionSpacing;
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`平均湿度: ${soilStats.average}%`, 30, yPos);
  yPos += lineHeight;
  doc.text(`最高湿度: ${soilStats.max}%`, 30, yPos);
  yPos += lineHeight;
  doc.text(`最低湿度: ${soilStats.min}%`, 30, yPos);
  yPos += lineHeight;
  doc.text(`平均pH值: ${phStats.average}`, 30, yPos);
  yPos += lineHeight;
  doc.text(`最佳范围: ${phStats.range}`, 30, yPos);
  yPos += lineHeight;
  doc.setTextColor(39, 174, 96);
  doc.text(`土壤状态: ${phStats.status}`, 30, yPos);
  yPos += sectionSpacing + 5;

  doc.setFontSize(14);
  doc.setTextColor(45, 80, 22);
  doc.text('🌡️ 气象数据', 20, yPos);
  yPos += sectionSpacing;
  
  doc.setDrawColor(240, 247, 230);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += sectionSpacing;
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`平均温度: ${tempStats.average}°C`, 30, yPos);
  yPos += lineHeight;
  doc.text(`最高温度: ${tempStats.max}°C`, 30, yPos);
  yPos += lineHeight;
  doc.text(`最低温度: ${tempStats.min}°C`, 30, yPos);
  yPos += lineHeight;
  doc.text(`平均光照: ${(lightStats.average / 1000).toFixed(1)}K lux`, 30, yPos);
  yPos += sectionSpacing + 5;

  doc.setFontSize(14);
  doc.setTextColor(45, 80, 22);
  doc.text('💧 灌溉数据', 20, yPos);
  yPos += sectionSpacing;
  
  doc.setDrawColor(240, 247, 230);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += sectionSpacing;
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`总用水量: ${waterStats.total}吨`, 30, yPos);
  yPos += lineHeight;
  doc.text(`日均用水: ${waterStats.daily}吨`, 30, yPos);
  yPos += lineHeight;
  doc.setTextColor(39, 174, 96);
  doc.text(`节水率: ${waterStats.saving}%`, 30, yPos);
  yPos += sectionSpacing + 5;

  doc.setFontSize(14);
  doc.setTextColor(45, 80, 22);
  doc.text('📈 产量预测', 20, yPos);
  yPos += sectionSpacing;
  
  doc.setDrawColor(240, 247, 230);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += sectionSpacing;
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`预计产量: ${yieldStats.predicted}kg`, 30, yPos);
  yPos += lineHeight;
  doc.text(`去年产量: ${yieldStats.lastYear}kg`, 30, yPos);
  yPos += lineHeight;
  doc.setTextColor(39, 174, 96);
  doc.text(`增长率: ${yieldStats.growth}%`, 30, yPos);
  yPos += sectionSpacing + 10;

  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('© 2026 绿野智农管理系统', pageWidth / 2, pageHeight - 20, { align: 'center' });

  doc.save(`农场数据分析报告_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.pdf`);
  alert('PDF报告已导出！');
};

const handleResize = () => {
  chartInstances.forEach(chart => chart.resize());
};

onMounted(() => {
  loadAnalysisData();
  setTimeout(() => initCharts(), 100);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  chartInstances.forEach(chart => chart.dispose());
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.analysis-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  color: #2d5016;
  margin-bottom: 2rem;
  text-align: center;
}

.analysis-filters {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-item label {
  color: #666;
  font-weight: 500;
}

.filter-item select {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
}

.apply-filter-btn {
  background-color: #2d5016;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  align-self: center;
  transition: background-color 0.3s;
}

.apply-filter-btn:hover {
  background-color: #1e3a0f;
}

.analysis-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(550px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.card h3 {
  color: #2d5016;
  margin-bottom: 1rem;
  text-align: center;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chart {
  width: 100%;
  height: 250px;
  border-radius: 4px;
}

.chart-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1rem;
  background-color: #f8f5f0;
  border-radius: 4px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.stat-value {
  color: #2d5016;
  font-weight: bold;
  font-size: 1.1rem;
}

.stat-value.status {
  color: #27ae60;
}

.analysis-reports {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.analysis-reports h3 {
  color: #2d5016;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #f0f7e6;
  padding-bottom: 0.5rem;
}

.report-card {
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s;
}

.report-card:hover {
  box-shadow: 0 4px 12px rgba(45, 80, 22, 0.15);
}

.report-card h4 {
  color: #2d5016;
  margin-bottom: 1rem;
}

.report-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.download-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.download-btn:hover {
  background-color: #0069d9;
}

.data-export {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-top: 2rem;
}

.data-export h3 {
  color: #2d5016;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #f0f7e6;
  padding-bottom: 0.5rem;
}

.export-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.export-btn {
  background-color: #2d5016;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1rem;
}

.export-btn:hover {
  background-color: #1e3a0f;
}

@media (max-width: 768px) {
  .analysis-container {
    padding: 1rem;
  }
  
  .analysis-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .analysis-cards {
    grid-template-columns: 1fr;
  }
  
  .chart-stats {
    grid-template-columns: 1fr;
  }
  
  .export-options {
    flex-direction: column;
  }
  
  .export-btn {
    width: 100%;
  }
}
</style>