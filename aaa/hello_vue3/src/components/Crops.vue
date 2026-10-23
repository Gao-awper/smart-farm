<template>
  <div class="crops-container">
    <h1>作物管理</h1>
    <div class="crops-header">
      <div class="search-box">
        <input type="text" placeholder="搜索作物..." v-model="searchQuery" @input="searchCrops">
        <button class="search-btn">🔍</button>
      </div>
      <button 
        class="add-crop-btn" 
        @click="handleAddCrop"
        :disabled="!loggedIn"
        :class="{ 'disabled': !loggedIn }"
      >
        {{ loggedIn ? '添加作物' : '请登录后操作' }}
      </button>
    </div>
    
    <!-- 统计概览 -->
    <div class="crops-summary">
      <div class="summary-card">
        <div class="summary-icon">🌾</div>
        <div class="summary-content">
          <span class="summary-value">{{ totalCrops }}</span>
          <span class="summary-label">总作物种类</span>
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-icon">📏</div>
        <div class="summary-content">
          <span class="summary-value">{{ totalArea }}亩</span>
          <span class="summary-label">总种植面积</span>
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-icon">📅</div>
        <div class="summary-content">
          <span class="summary-value">{{ upcomingHarvests }}</span>
          <span class="summary-label">即将收获</span>
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-icon">⚠️</div>
        <div class="summary-content">
          <span class="summary-value">{{ cropsNeedingAttention }}</span>
          <span class="summary-label">需要关注</span>
        </div>
      </div>
    </div>
    
    <div class="crops-table">
      <table>
        <thead>
          <tr>
            <th>作物名称</th>
            <th>类型</th>
            <th>种植面积</th>
            <th>种植日期</th>
            <th>预计收获</th>
            <th>生长状态</th>
            <th>预估产量</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="crop in filteredCrops" :key="crop.id">
            <td>{{ crop.name }}</td>
            <td>{{ crop.type }}</td>
            <td>{{ crop.area }}亩</td>
            <td>{{ crop.plantedDate }}</td>
            <td>{{ crop.expectedHarvest }}</td>
            <td>
              <span :class="['status-badge', getStatusClass(crop.status)]">
                {{ crop.status }}
              </span>
            </td>
            <td>{{ getCropYield(crop) }}kg</td>
            <td>
              <button 
                class="action-btn edit-btn" 
                @click="handleEditCrop(crop)"
                :disabled="!loggedIn"
                :class="{ 'disabled': !loggedIn }"
              >✏️</button>
              <button 
                class="action-btn delete-btn" 
                @click="handleDeleteCrop(crop.id)"
                :disabled="!loggedIn"
                :class="{ 'disabled': !loggedIn }"
              >🗑️</button>
              <button class="action-btn detail-btn" @click="viewCropDetail(crop)">📋</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 作物添加/编辑模态框 -->
    <div v-if="showCropModal" class="modal-overlay" @click.self="showCropModal = false">
      <div class="modal-content">
        <h3>{{ editingCrop ? '编辑作物' : '添加作物' }}</h3>
        <form @submit.prevent="saveCrop">
          <div class="form-group">
            <label>作物名称</label>
            <input type="text" v-model="cropForm.name" required>
          </div>
          <div class="form-group">
            <label>作物类型</label>
            <select v-model="cropForm.type" required>
              <option value="">请选择类型</option>
              <option value="粮食作物">粮食作物</option>
              <option value="蔬菜">蔬菜</option>
              <option value="水果">水果</option>
              <option value="经济作物">经济作物</option>
              <option value="花卉">花卉</option>
            </select>
          </div>
          <div class="form-group">
            <label>种植面积 (亩)</label>
            <input type="number" v-model.number="cropForm.area" step="0.1" min="0" required>
          </div>
          <div class="form-group">
            <label>种植日期</label>
            <input type="date" v-model="cropForm.plantedDate" required>
          </div>
          <div class="form-group">
            <label>预计收获日期</label>
            <input type="date" v-model="cropForm.expectedHarvest" required>
          </div>
          <div class="form-group">
            <label>生长状态</label>
            <select v-model="cropForm.status">
              <option value="生长中">生长中</option>
              <option value="成熟期">成熟期</option>
              <option value="收获期">收获期</option>
              <option value="警告">警告</option>
              <option value="危险">危险</option>
            </select>
          </div>
          <div class="form-group">
            <label>预估产量 (kg/亩)</label>
            <input type="number" v-model.number="cropForm.yield" step="1" min="0" required>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="showCropModal = false">取消</button>
            <button type="submit" class="btn-confirm">确定</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 作物详情模态框 -->
    <div v-if="showDetailModal" class="modal-overlay" @click.self="showDetailModal = false">
      <div class="modal-content detail-modal">
        <h3>{{ selectedCrop?.name }} - 详情</h3>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">类型</span>
            <span class="detail-value">{{ selectedCrop?.type }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">种植面积</span>
            <span class="detail-value">{{ selectedCrop?.area }}亩</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">种植日期</span>
            <span class="detail-value">{{ selectedCrop?.plantedDate }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">预计收获</span>
            <span class="detail-value">{{ selectedCrop?.expectedHarvest }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">生长状态</span>
            <span :class="['detail-value', getStatusClass(selectedCrop?.status)]">{{ selectedCrop?.status }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">预估产量</span>
            <span class="detail-value">{{ getCropYield(selectedCrop) }}kg</span>
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="showDetailModal = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { farmStore } from '../stores/farmStore';
import { predictYield } from '../services/analysisService';
import { isLoggedIn } from '../utils/auth';

// 搜索查询
const searchQuery = ref('');
const showCropModal = ref(false);
const showDetailModal = ref(false);
const editingCrop = ref(null);
const selectedCrop = ref(null);

// 表单数据
const cropForm = ref({
  name: '',
  type: '',
  area: 0,
  plantedDate: '',
  expectedHarvest: '',
  status: '生长中',
  yield: 0
});

// 检查登录状态
const loggedIn = computed(() => isLoggedIn());

// 获取作物列表
const crops = computed(() => farmStore.state.crops);

// 搜索作物
const searchCrops = () => {};

// 过滤作物
const filteredCrops = computed(() => {
  if (!searchQuery.value.trim()) {
    return crops.value;
  }
  const query = searchQuery.value.toLowerCase();
  return crops.value.filter(crop => 
    crop.name.toLowerCase().includes(query) ||
    crop.type.toLowerCase().includes(query)
  );
});

// 统计数据
const totalCrops = computed(() => crops.value.length);
const totalArea = computed(() => crops.value.reduce((sum, crop) => sum + crop.area, 0));
const upcomingHarvests = computed(() => {
  const today = new Date();
  return crops.value.filter(crop => {
    const harvestDate = new Date(crop.expectedHarvest);
    const diffDays = Math.ceil((harvestDate - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  }).length;
});
const cropsNeedingAttention = computed(() => {
  return crops.value.filter(crop => crop.status === '警告' || crop.status === '危险').length;
});

// 获取作物预估产量
const getCropYield = (crop) => {
  if (!crop) return 0;
  return predictYield(crop, farmStore.state.realtimeData);
};

// 获取状态样式类
const getStatusClass = (status) => {
  switch(status) {
    case '生长中': return 'status-good';
    case '成熟期': return 'status-info';
    case '收获期': return 'status-success';
    case '警告': return 'status-warning';
    case '危险': return 'status-danger';
    default: return 'status-default';
  }
};

// 权限检查处理函数
const requireLogin = (action) => {
  if (!loggedIn.value) {
    alert('请先登录后再进行操作！');
    return false;
  }
  action();
  return true;
};

// 添加作物（带权限检查）
const handleAddCrop = () => requireLogin(addCrop);

// 编辑作物（带权限检查）
const handleEditCrop = (crop) => requireLogin(() => editCrop(crop));

// 删除作物（带权限检查）
const handleDeleteCrop = (id) => requireLogin(() => deleteCrop(id));

// 添加作物
const addCrop = () => {
  editingCrop.value = null;
  cropForm.value = {
    name: '',
    type: '',
    area: 0,
    plantedDate: new Date().toISOString().split('T')[0],
    expectedHarvest: '',
    status: '生长中',
    yield: 0
  };
  showCropModal.value = true;
};

// 编辑作物
const editCrop = (crop) => {
  editingCrop.value = crop;
  cropForm.value = {
    name: crop.name,
    type: crop.type,
    area: crop.area,
    plantedDate: crop.plantedDate,
    expectedHarvest: crop.expectedHarvest,
    status: crop.status,
    yield: crop.yield || 0
  };
  showCropModal.value = true;
};

// 保存作物
const saveCrop = () => {
  if (!cropForm.value.name || !cropForm.value.type) {
    alert('请填写作物名称和类型！');
    return;
  }

  if (editingCrop.value) {
    // 编辑作物
    farmStore.actions.updateCrop(editingCrop.value.id, cropForm.value);
    alert('作物信息更新成功！');
  } else {
    // 添加作物
    const newCrop = {
      ...cropForm.value,
      id: Math.max(...crops.value.map(c => c.id), 0) + 1
    };
    farmStore.actions.addCrop(cropForm.value);
    alert('作物添加成功！');
  }
  
  showCropModal.value = false;
};

// 删除作物
const deleteCrop = (id) => {
  if (!confirm('确定要删除这个作物吗？')) {
    return;
  }
  
  farmStore.actions.deleteCrop(id);
  alert('作物删除成功！');
};

// 查看作物详情
const viewCropDetail = (crop) => {
  selectedCrop.value = crop;
  showDetailModal.value = true;
};

// 初始化
onMounted(() => {
  // 数据已通过farmStore自动加载
});
</script>

<style scoped>
.crops-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  color: #2d5016;
  margin-bottom: 1.5rem;
  text-align: center;
}

.crops-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-box {
  display: flex;
  align-items: center;
  width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.search-box input {
  flex: 1;
  padding: 0.75rem;
  border: none;
  font-size: 1rem;
  outline: none;
}

.search-btn {
  background-color: #2d5016;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background-color: #1e3a0f;
}

.add-crop-btn {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.add-crop-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

/* 统计概览 */
.crops-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.summary-card {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.summary-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(45, 80, 22, 0.15);
}

.summary-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f7e6, #dcedc1);
  border-radius: 10px;
}

.summary-content {
  display: flex;
  flex-direction: column;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d5016;
}

.summary-label {
  font-size: 0.85rem;
  color: #666;
}

.crops-table {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 2rem;
}

.crops-table table {
  width: 100%;
  border-collapse: collapse;
}

.crops-table th, .crops-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.crops-table th {
  background: linear-gradient(135deg, #f8f9fa, #f0f7e6);
  font-weight: bold;
  color: #2d5016;
}

.crops-table tr:hover {
  background-color: #f8f9fa;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
}

.status-good {
  background: #d4edda;
  color: #155724;
}

.status-info {
  background: #d1ecf1;
  color: #0c5460;
}

.status-success {
  background: #fff3cd;
  color: #856404;
}

.status-warning {
  background: #fff3cd;
  color: #856404;
}

.status-danger {
  background: #f8d7da;
  color: #721c24;
}

.status-default {
  background: #e2e3e5;
  color: #495057;
}

.action-btn {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 0.3rem;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.edit-btn {
  background: #007bff;
  color: white;
}

.edit-btn:hover {
  background: #0069d9;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}

.detail-btn {
  background: #6c757d;
  color: white;
}

.detail-btn:hover {
  background: #5a6268;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  width: 450px;
  max-width: 90%;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2d5016;
  text-align: center;
}

.modal-content .form-group {
  margin-bottom: 1rem;
}

.modal-content .form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.modal-content .form-group input,
.modal-content .form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

.modal-content .form-group input:focus,
.modal-content .form-group select:focus {
  border-color: #2d5016;
  box-shadow: 0 0 0 3px rgba(45, 80, 22, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel,
.btn-confirm {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background-color: #5a6268;
}

.btn-confirm {
  background: linear-gradient(135deg, #2d5016, #388e3c);
  color: white;
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(45, 80, 22, 0.3);
}

/* 详情模态框 */
.detail-modal {
  width: 500px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.detail-item {
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 6px;
}

.detail-label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.detail-value {
  font-weight: bold;
  color: #2d5016;
}

@media (max-width: 768px) {
  .crops-container {
    padding: 1rem;
  }
  
  .crops-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .search-box {
    width: 100%;
  }
  
  .crops-table {
    overflow-x: auto;
  }
  
  .crops-summary {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>