<template>
  <div class="farming-calendar">
    <div class="calendar-header">
      <button class="nav-btn" @click="prevMonth">◀</button>
      <h2>{{ currentYear }}年{{ currentMonth }}月</h2>
      <button class="nav-btn" @click="nextMonth">▶</button>
    </div>
    
    <div class="calendar-grid">
      <div class="weekday-header">
        <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
      </div>
      
      <div class="days-grid">
        <div 
          v-for="(day, index) in calendarDays" 
          :key="index"
          :class="['day', { 
            'other-month': !day.isCurrentMonth,
            'today': day.isToday,
            'selected': isSelected(day),
            'has-activity': day.hasActivity
          }]"
          @click="selectDate(day)"
        >
          {{ day.date }}
          <div v-if="day.hasActivity" class="activity-dot"></div>
        </div>
      </div>
    </div>
    
    <div class="activity-panel" v-if="selectedDate">
      <h3>{{ selectedDate.toLocaleDateString('zh-CN') }} 的农事活动</h3>
      <div v-if="selectedActivities.length === 0" class="empty-message">
        当天暂无农事活动安排
      </div>
      <div v-else class="activity-list">
        <div 
          v-for="activity in selectedActivities" 
          :key="activity.id"
          :class="['activity-item', activity.status]"
        >
          <div class="activity-header">
            <span class="activity-icon">{{ getActivityIcon(activity.type) }}</span>
            <span class="activity-title">{{ activity.title }}</span>
            <span :class="['status-badge', activity.status]">{{ getStatusText(activity.status) }}</span>
          </div>
          <p class="activity-description">{{ activity.description }}</p>
          <div class="activity-crops">
            <span v-for="cropId in activity.cropIds" :key="cropId" class="crop-tag">
              {{ getCropName(cropId) }}
            </span>
          </div>
        </div>
      </div>
      
      <button class="add-activity-btn" @click="showAddModal = true">+ 添加农事活动</button>
    </div>
    
    <!-- 添加活动弹窗 -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-content">
        <h3>添加农事活动</h3>
        <form @submit.prevent="addActivity">
          <div class="form-group">
            <label>活动标题</label>
            <input v-model="newActivity.title" type="text" required />
          </div>
          <div class="form-group">
            <label>活动描述</label>
            <textarea v-model="newActivity.description"></textarea>
          </div>
          <div class="form-group">
            <label>活动类型</label>
            <select v-model="newActivity.type" required>
              <option value="planting">播种</option>
              <option value="irrigation">灌溉</option>
              <option value="fertilizing">施肥</option>
              <option value="harvesting">收获</option>
              <option value="pruning">修剪</option>
              <option value="pest-control">病虫害防治</option>
            </select>
          </div>
          <div class="form-group">
            <label>关联作物</label>
            <div class="crop-checkboxes">
              <label v-for="crop in crops" :key="crop.id" class="checkbox-label">
                <input 
                  type="checkbox" 
                  :value="crop.id" 
                  v-model="newActivity.cropIds"
                />
                {{ crop.name }}
              </label>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="showAddModal = false">取消</button>
            <button type="submit" class="btn-submit">添加</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { farmStore } from '../stores/farmStore';
import type { FarmingActivity } from '../types';

const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);
const selectedDate = ref<Date | null>(new Date());
const showAddModal = ref(false);

const crops = computed(() => farmStore.state.crops);

// 模拟农事活动数据
const activities = ref<FarmingActivity[]>([
  { id: 1, title: '草莓园灌溉', description: '为A区草莓园进行定期灌溉', date: formatDate(new Date()), type: 'irrigation', status: 'completed', cropIds: [3] },
  { id: 2, title: '番茄施肥', description: '为B区番茄园施加复合肥', date: formatDate(new Date()), type: 'fertilizing', status: 'in-progress', cropIds: [5] },
  { id: 3, title: '小麦除草', description: 'D区小麦田除草作业', date: formatDate(addDays(new Date(), 1)), type: 'pest-control', status: 'pending', cropIds: [1] },
  { id: 4, title: '黄瓜收获', description: 'C区黄瓜采摘', date: formatDate(addDays(new Date(), 2)), type: 'harvesting', status: 'pending', cropIds: [4] },
  { id: 5, title: '玉米灌溉', description: 'D区玉米地灌溉', date: formatDate(addDays(new Date(), 3)), type: 'irrigation', status: 'pending', cropIds: [2] }
]);

const newActivity = reactive({
  title: '',
  description: '',
  type: 'irrigation' as FarmingActivity['type'],
  cropIds: [] as number[]
});

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function addDays(date: Date, days: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value - 1;
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const today = new Date();
  
  const days: { date: number; isCurrentMonth: boolean; isToday: boolean; hasActivity: boolean; fullDate: string }[] = [];
  
  // 上月空白日期
  const startDay = firstDay.getDay();
  for (let i = startDay - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({
      date: d.getDate(),
      isCurrentMonth: false,
      isToday: false,
      hasActivity: false,
      fullDate: formatDate(d)
    });
  }
  
  // 当月日期
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month, i);
    const dateStr = formatDate(d);
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday: d.toDateString() === today.toDateString(),
      hasActivity: activities.value.some(a => a.date === dateStr),
      fullDate: dateStr
    });
  }
  
  // 下月空白日期
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    days.push({
      date: i,
      isCurrentMonth: false,
      isToday: false,
      hasActivity: false,
      fullDate: formatDate(d)
    });
  }
  
  return days;
});

const selectedActivities = computed(() => {
  if (!selectedDate.value) return [];
  const dateStr = formatDate(selectedDate.value);
  return activities.value.filter(a => a.date === dateStr);
});

function prevMonth() {
  if (currentMonth.value === 1) {
    currentMonth.value = 12;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 12) {
    currentMonth.value = 1;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}

function isSelected(day: { fullDate: string }) {
  if (!selectedDate.value) return false;
  return day.fullDate === formatDate(selectedDate.value);
}

function selectDate(day: { fullDate: string; isCurrentMonth: boolean }) {
  if (!day.isCurrentMonth) {
    const parts = day.fullDate.split('-').map(Number);
    const year = parts[0] ?? currentYear.value;
    const month = parts[1] ?? currentMonth.value;
    currentYear.value = year;
    currentMonth.value = month;
  }
  selectedDate.value = new Date(day.fullDate);
}

function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    planting: '🌱',
    irrigation: '💧',
    fertilizing: '🧪',
    harvesting: '🍎',
    pruning: '✂️',
    'pest-control': '🐛'
  };
  return icons[type] || '📅';
}

function getStatusText(status: string): string {
  const texts: Record<string, string> = {
    pending: '待执行',
    'in-progress': '进行中',
    completed: '已完成'
  };
  return texts[status] || status;
}

function getCropName(id: number): string {
  const crop = crops.value.find(c => c.id === id);
  return crop ? crop.name : `作物${id}`;
}

function addActivity() {
  if (!newActivity.title.trim()) return;
  
  const activity: FarmingActivity = {
    id: Date.now(),
    title: newActivity.title,
    description: newActivity.description,
    date: formatDate(selectedDate.value!),
    type: newActivity.type,
    status: 'pending',
    cropIds: [...newActivity.cropIds]
  };
  
  activities.value.push(activity);
  
  // 重置表单
  newActivity.title = '';
  newActivity.description = '';
  newActivity.type = 'irrigation';
  newActivity.cropIds = [];
  showAddModal.value = false;
}
</script>

<style scoped>
.farming-calendar {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.nav-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f0f0f0;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: #e0e0e0;
}

.calendar-header h2 {
  margin: 0;
  color: #333;
}

.calendar-grid {
  margin-bottom: 20px;
}

.weekday-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  padding: 8px 0;
  color: #888;
  font-weight: 500;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  font-size: 14px;
}

.day:hover {
  background: #f5f5f5;
}

.day.other-month {
  color: #ccc;
}

.day.today {
  background: #4CAF50;
  color: white;
}

.day.selected {
  background: #2196F3;
  color: white;
}

.day.has-activity .activity-dot {
  position: absolute;
  bottom: 4px;
  width: 6px;
  height: 6px;
  background: #FF9800;
  border-radius: 50%;
}

.activity-panel {
  border-top: 1px solid #eee;
  padding-top: 16px;
}

.activity-panel h3 {
  margin: 0 0 12px 0;
  color: #333;
}

.empty-message {
  text-align: center;
  color: #999;
  padding: 20px;
}

.activity-list {
  margin-bottom: 16px;
}

.activity-item {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  border-left: 4px solid;
}

.activity-item.pending {
  border-left-color: #FF9800;
}

.activity-item.in-progress {
  border-left-color: #2196F3;
}

.activity-item.completed {
  border-left-color: #4CAF50;
}

.activity-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.activity-icon {
  font-size: 18px;
}

.activity-title {
  flex: 1;
  font-weight: 600;
  color: #333;
}

.status-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
}

.status-badge.pending {
  background: #FFF3E0;
  color: #E65100;
}

.status-badge.in-progress {
  background: #E3F2FD;
  color: #1976D2;
}

.status-badge.completed {
  background: #E8F5E9;
  color: #2E7D32;
}

.activity-description {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
}

.activity-crops {
  display: flex;
  gap: 6px;
}

.crop-tag {
  font-size: 12px;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
  color: #666;
}

.add-activity-btn {
  width: 100%;
  padding: 12px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.add-activity-btn:hover {
  border-color: #2196F3;
  color: #2196F3;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 480px;
}

.modal-content h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group textarea {
  min-height: 80px;
}

.crop-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-cancel {
  background: #f0f0f0;
  color: #666;
}

.btn-submit {
  background: #2196F3;
  color: white;
}
</style>
