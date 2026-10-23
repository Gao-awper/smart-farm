<template>
  <div class="settings-container">
    <h1>系统设置</h1>
    <div class="settings-tabs">
      <button class="tab-btn" :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">基本设置</button>
      <button class="tab-btn" :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">用户管理</button>
      <button class="tab-btn" :class="{ active: activeTab === 'devices' }" @click="activeTab = 'devices'">设备管理</button>
      <button class="tab-btn" :class="{ active: activeTab === 'notifications' }" @click="activeTab = 'notifications'">通知设置</button>
    </div>
    <div class="settings-content">
      <!-- 基本设置 -->
      <div v-if="activeTab === 'basic'" class="setting-section">
        <h3>农场基本信息</h3>
        <div class="form-group">
          <label>农场名称:</label>
          <input type="text" v-model="farmInfo.name" placeholder="输入农场名称">
        </div>
        <div class="form-group">
          <label>农场地址:</label>
          <input type="text" v-model="farmInfo.address" placeholder="输入农场地址">
        </div>
        <div class="form-group">
          <label>联系电话:</label>
          <input type="tel" v-model="farmInfo.phone" placeholder="输入联系电话">
        </div>
        <div class="form-group">
          <label>农场面积:</label>
          <input type="number" v-model="farmInfo.area" placeholder="输入农场面积（亩）">
        </div>
        <div class="form-group">
          <label>农场地图:</label>
          <div class="farm-map">
            <div class="custom-map">
              <div class="map-zone east-zone">
                <div class="zone-label">东区</div>
                <div class="zone-info">小麦 25亩</div>
              </div>
              <div class="map-zone west-zone">
                <div class="zone-label">西区</div>
                <div class="zone-info">玉米 30亩</div>
              </div>
              <div class="map-zone south-zone">
                <div class="zone-label">南区</div>
                <div class="zone-info">蔬菜 20亩</div>
              </div>
              <div class="map-zone north-zone">
                <div class="zone-label">北区</div>
                <div class="zone-info">水果 25亩</div>
              </div>
              <div class="map-center">
                <div class="center-building">农场中心</div>
              </div>
            </div>
          </div>
        </div>
        <button class="save-btn" @click="saveSettings">保存设置</button>
      </div>
      
      <!-- 用户管理 -->
      <div v-if="activeTab === 'users'" class="setting-section">
        <h3>用户管理</h3>
        <div class="users-table">
          <table>
            <thead>
              <tr>
                <th>用户名</th>
                <th>角色</th>
                <th>邮箱</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.username }}</td>
                <td>{{ user.role }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.status }}</td>
                <td>
                  <button class="edit-btn" @click="editUser(user)">编辑</button>
                  <button class="delete-btn" @click="deleteUser(user.id)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button class="add-user-btn" @click="addUser">添加用户</button>
      </div>
      
      <!-- 设备管理 -->
      <div v-if="activeTab === 'devices'" class="setting-section">
        <h3>设备管理</h3>
        <div class="devices-grid">
          <div class="device-card" v-for="device in devices" :key="device.id">
            <h4>{{ device.name }}</h4>
            <p>类型: {{ device.type }}</p>
            <p>状态: <span :class="{ 'device-active': device.status === '在线', 'device-offline': device.status === '离线' }">{{ device.status }}</span></p>
            <p>位置: {{ device.location }}</p>
            <p>最后在线: {{ device.lastOnline }}</p>
            <button class="device-control-btn" @click="controlDevice(device.id)">
              {{ device.status === '在线' ? '禁用' : '启用' }}
            </button>
          </div>
        </div>
        <button class="add-device-btn">添加设备</button>
      </div>
      
      <!-- 通知设置 -->
      <div v-if="activeTab === 'notifications'" class="setting-section">
        <h3>通知设置</h3>
        <div class="notification-settings">
          <div class="notification-item">
            <input type="checkbox" id="soil-notification" v-model="notificationSettings.soil">
            <label for="soil-notification">土壤湿度异常通知</label>
          </div>
          <div class="notification-item">
            <input type="checkbox" id="weather-notification" v-model="notificationSettings.weather">
            <label for="weather-notification">气象异常通知</label>
          </div>
          <div class="notification-item">
            <input type="checkbox" id="irrigation-notification" v-model="notificationSettings.irrigation">
            <label for="irrigation-notification">灌溉系统通知</label>
          </div>
          <div class="notification-item">
            <input type="checkbox" id="crop-notification" v-model="notificationSettings.crop">
            <label for="crop-notification">作物生长异常通知</label>
          </div>
          <div class="notification-item">
            <input type="checkbox" id="system-notification" v-model="notificationSettings.system">
            <label for="system-notification">系统通知</label>
          </div>
        </div>
        <div class="notification-method">
          <h4>通知方式</h4>
          <div class="notification-item">
            <input type="checkbox" id="email-notification" v-model="notificationSettings.email">
            <label for="email-notification">邮箱通知</label>
          </div>
          <div class="notification-item">
            <input type="checkbox" id="sms-notification" v-model="notificationSettings.sms">
            <label for="sms-notification">短信通知</label>
          </div>
          <div class="notification-item">
            <input type="checkbox" id="app-notification" v-model="notificationSettings.app">
            <label for="app-notification">APP通知</label>
          </div>
        </div>
        <button class="save-btn" @click="saveNotificationSettings">保存设置</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { farmStore } from '../stores/farmStore';

// 激活的标签
const activeTab = ref('basic');

// 农场基本信息
const farmInfo = ref({
  name: '绿野智农',
  address: '北京市海淀区农业科技园区',
  phone: '13800138000',
  area: 100
});

// 从 farmStore 获取用户和设备数据
const users = computed(() => farmStore.state.users.map(user => ({
  id: user.id,
  username: user.nickname,
  role: user.identity === 'admin' ? '管理员' : (user.identity === 'farmer' ? '农户' : '普通用户'),
  email: user.email,
  status: '活跃'
})));

const devices = computed(() => farmStore.state.devices.map(device => ({
  id: device.id,
  name: device.name,
  type: getDeviceTypeName(device.type),
  status: device.status === 'online' ? '在线' : (device.status === 'offline' ? '离线' : (device.status === 'running' ? '运行中' : (device.status === 'open' ? '开启' : '关闭'))),
  location: device.location,
  lastOnline: device.lastOnline ? new Date(device.lastOnline).toLocaleString('zh-CN') : '-'
})));

// 通知设置
const notificationSettings = ref({
  soil: true,
  weather: true,
  irrigation: true,
  crop: true,
  system: true,
  email: true,
  sms: false,
  app: true
});

// 设备类型名称映射
function getDeviceTypeName(type) {
  const typeMap = {
    'soil': '土壤传感器',
    'weather': '气象站',
    'valve': '灌溉阀门',
    'pump': '水泵'
  };
  return typeMap[type] || type;
}

// 控制设备
const controlDevice = (deviceId) => {
  const device = farmStore.state.devices.find(d => d.id === deviceId);
  if (!device) return;

  const isOnline = device.status === 'online' || device.status === 'running' || device.status === 'open';
  const newStatus = isOnline ? 'offline' : 'online';

  farmStore.actions.updateDeviceStatus(deviceId, newStatus);
  alert(`设备${device.name}已${isOnline ? '禁用' : '启用'}`);
};

// 用户管理方法
const editUser = (user) => {
  alert('用户编辑功能开发中，当前可查看用户信息');
};

const deleteUser = (userId) => {
  if (confirm('确定要删除这个用户吗？')) {
    farmStore.actions.deleteUser(userId);
    alert('用户删除成功！');
  }
};

// 添加用户
const addUser = () => {
  const nickname = prompt('请输入用户昵称：');
  if (!nickname) return;
  const email = prompt('请输入邮箱：');
  if (!email) return;
  const phone = prompt('请输入手机号：') || '';
  const sex = prompt('请输入性别（男/女）：') || '男';
  const identity = prompt('请输入身份（admin/regular/farmer）：') || 'regular';

  farmStore.actions.addUser({ nickname, email, phone, sex, identity });
  alert('用户添加成功！');
};

// 保存设置
const saveSettings = () => {
  alert('设置保存成功！');
};

// 保存通知设置
const saveNotificationSettings = () => {
  alert('通知设置保存成功！');
};
</script>

<style scoped>
.settings-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #2d5016;
  margin-bottom: 2rem;
  text-align: center;
}

.settings-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  border-bottom: 3px solid transparent;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn:hover {
  color: #2d5016;
}

.tab-btn.active {
  color: #2d5016;
  border-bottom-color: #2d5016;
}

.settings-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.setting-section h3 {
  color: #2d5016;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #f0f7e6;
  padding-bottom: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
}

.farm-map {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.farm-map img {
  width: 100%;
  height: auto;
  display: block;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.map-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  pointer-events: auto;
  cursor: pointer;
}

.map-marker::before {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: #2d5016;
  border: 2px solid white;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.marker-label {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(45, 80, 22, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
}

.marker-label::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px 5px 0;
  border-style: solid;
  border-color: rgba(45, 80, 22, 0.9) transparent transparent;
}

/* 自定义农场地图样式 */
.custom-map {
  position: relative;
  width: 100%;
  height: 400px;
  background-color: #f0f7e6;
  border: 2px solid #2d5016;
  border-radius: 8px;
  overflow: hidden;
}

.map-zone {
  position: absolute;
  border: 1px solid #2d5016;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.map-zone:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(45, 80, 22, 0.2);
}

.zone-label {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2d5016;
  margin-bottom: 0.5rem;
}

.zone-info {
  font-size: 0.9rem;
  color: #666;
}

.east-zone {
  top: 10%;
  right: 10%;
  width: 35%;
  height: 80%;
  background-color: rgba(144, 238, 144, 0.7);
}

.west-zone {
  top: 10%;
  left: 10%;
  width: 35%;
  height: 80%;
  background-color: rgba(173, 216, 230, 0.7);
}

.south-zone {
  bottom: 10%;
  left: 10%;
  width: 80%;
  height: 35%;
  background-color: rgba(255, 223, 186, 0.7);
}

.north-zone {
  top: 10%;
  left: 10%;
  width: 80%;
  height: 35%;
  background-color: rgba(221, 160, 221, 0.7);
}

.map-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20%;
  height: 20%;
  background-color: #2d5016;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.center-building {
  color: white;
  font-weight: bold;
  text-align: center;
  font-size: 0.9rem;
}

.save-btn {
  background-color: #2d5016;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-btn:hover {
  background-color: #1e3a0f;
}

.users-table {
  margin-bottom: 1.5rem;
  overflow-x: auto;
}

.users-table table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th, .users-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.users-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #2d5016;
}

.users-table tr:hover {
  background-color: #f8f9fa;
}

.add-user-btn, .add-device-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-user-btn:hover, .add-device-btn:hover {
  background-color: #218838;
}

.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.device-card {
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 1.5rem;
  transition: all 0.3s;
}

.device-card:hover {
  box-shadow: 0 4px 12px rgba(45, 80, 22, 0.15);
}

.device-card h4 {
  color: #2d5016;
  margin-bottom: 1rem;
}

.device-card p {
  margin: 0.5rem 0;
  color: #666;
}

.device-active {
  color: #28a745;
  font-weight: bold;
}

.device-offline {
  color: #dc3545;
  font-weight: bold;
}

.device-control-btn {
  margin-top: 1rem;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #2d5016;
  border-radius: 4px;
  background-color: white;
  color: #2d5016;
  cursor: pointer;
  transition: all 0.3s;
}

.device-control-btn:hover {
  background-color: #2d5016;
  color: white;
}

.notification-settings, .notification-method {
  margin-bottom: 1.5rem;
}

.notification-settings h4, .notification-method h4 {
  color: #2d5016;
  margin-bottom: 1rem;
}

.notification-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.notification-item label {
  color: #666;
  cursor: pointer;
}

@media (max-width: 768px) {
  .settings-container {
    padding: 1rem;
  }
  
  .settings-tabs {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .settings-content {
    padding: 1rem;
  }
  
  .devices-grid {
    grid-template-columns: 1fr;
  }
}
</style>