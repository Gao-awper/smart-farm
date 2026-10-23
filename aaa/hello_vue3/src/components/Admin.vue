<template>
  <div class="admin-container">
    <div class="admin-sidebar">
      <h2 class="sidebar-title">绿野智农管理</h2>
      <ul class="sidebar-menu">
        <li
          v-for="menu in menuList"
          :key="menu.path"
          @click="activeMenu = menu.path"
          :class="{ active: activeMenu === menu.path }"
        >
          <i :class="menu.icon"></i>
          <span>{{ menu.name }}</span>
        </li>
      </ul>
    </div>
    <div class="admin-main">
      <div class="main-header">
        <div class="header-title">
          <h1>{{ currentMenuName }}</h1>
        </div>
        <div class="header-user">
          <span>管理员</span>
          <button @click="logout">退出登录</button>
        </div>
      </div>
      <div class="main-content">
        <!-- 用户管理 -->
        <div v-if="activeMenu === '/admin/users'">
          <div class="content-header">
            <h2>用户管理</h2>
            <button class="btn-add" @click="addUser">添加用户</button>
          </div>
          <div class="search-bar">
            <input type="text" v-model="userSearchKeyword" placeholder="搜索用户..." @input="searchUsers">
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>昵称</th>
                <th>邮箱</th>
                <th>手机</th>
                <th>性别</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.nickname }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.phone }}</td>
                <td>{{ user.sex }}</td>
                <td>
                  <button class="btn-edit" @click="editUser(user)">编辑</button>
                  <button class="btn-delete" @click="deleteUser(user.id)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 设备管理 -->
        <div v-if="activeMenu === '/admin/devices'">
          <div class="content-header">
            <h2>设备管理</h2>
            <button class="btn-add" @click="addDevice">添加设备</button>
          </div>
          <div class="search-bar">
            <input type="text" v-model="deviceSearchKeyword" placeholder="搜索设备..." @input="searchDevices">
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>名称</th>
                <th>类型</th>
                <th>状态</th>
                <th>位置</th>
                <th>最后在线</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="device in devices" :key="device.id">
                <td>{{ device.id }}</td>
                <td>{{ device.name }}</td>
                <td>{{ device.type }}</td>
                <td>
                  <span class="device-status" :class="device.status">
                    {{ device.status }}
                  </span>
                </td>
                <td>{{ device.location }}</td>
                <td>{{ device.lastOnline }}</td>
                <td>
                  <button class="btn-edit" @click="editDevice(device)">编辑</button>
                  <button class="btn-delete" @click="deleteDevice(device.id)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 作物管理 -->
        <div v-if="activeMenu === '/admin/crops'">
          <div class="content-header">
            <h2>作物管理</h2>
            <button class="btn-add" @click="addCrop">添加作物</button>
          </div>
          <div class="search-bar">
            <input type="text" v-model="cropSearchKeyword" placeholder="搜索作物..." @input="searchCrops">
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>名称</th>
                <th>类型</th>
                <th>种植面积</th>
                <th>生长状态</th>
                <th>预计收获</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="crop in crops" :key="crop.id">
                <td>{{ crop.id }}</td>
                <td>{{ crop.name }}</td>
                <td>{{ crop.type }}</td>
                <td>{{ crop.area }}亩</td>
                <td>{{ crop.status }}</td>
                <td>{{ crop.expectedHarvest }}</td>
                <td>
                  <button class="btn-edit" @click="editCrop(crop)">编辑</button>
                  <button class="btn-delete" @click="deleteCrop(crop.id)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 灌溉管理 -->
        <div v-if="activeMenu === '/admin/irrigation'">
          <div class="content-header">
            <h2>灌溉管理</h2>
            <button class="btn-add" @click="addIrrigationZone">添加灌溉区域</button>
          </div>
          <div class="search-bar">
            <input type="text" v-model="irrigationSearchKeyword" placeholder="搜索灌溉区域..." @input="searchIrrigationZones">
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>区域名称</th>
                <th>面积</th>
                <th>状态</th>
                <th>上次灌溉</th>
                <th>下次灌溉</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="zone in irrigationZones" :key="zone.id">
                <td>{{ zone.id }}</td>
                <td>{{ zone.name }}</td>
                <td>{{ zone.area }}亩</td>
                <td>
                  <span class="irrigation-status" :class="zone.status">
                    {{ zone.status }}
                  </span>
                </td>
                <td>{{ zone.lastIrrigation }}</td>
                <td>{{ zone.nextIrrigation }}</td>
                <td>
                  <button class="btn-edit" @click="editIrrigationZone(zone)">编辑</button>
                  <button class="btn-delete" @click="deleteIrrigationZone(zone.id)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 数据管理 -->
        <div v-if="activeMenu === '/admin/data'">
          <div class="content-header">
            <h2>数据管理</h2>
            <button class="btn-add" @click="exportData">导出数据</button>
          </div>
          <div class="search-bar">
            <input type="text" v-model="dataSearchKeyword" placeholder="搜索数据..." @input="searchData">
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>数据类型</th>
                <th>数值</th>
                <th>单位</th>
                <th>采集时间</th>
                <th>采集位置</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data in dataRecords" :key="data.id">
                <td>{{ data.id }}</td>
                <td>{{ data.type }}</td>
                <td>{{ data.value }}</td>
                <td>{{ data.unit }}</td>
                <td>{{ data.timestamp }}</td>
                <td>{{ data.location }}</td>
                <td>
                  <button class="btn-delete" @click="deleteData(data.id)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 系统设置 -->
        <div v-if="activeMenu === '/admin/settings'">
          <div class="content-header">
            <h2>系统设置</h2>
          </div>
          <div class="settings-form">
            <div class="form-group">
              <label>系统名称</label>
              <input type="text" v-model="systemSettings.name" placeholder="输入系统名称">
            </div>
            <div class="form-group">
              <label>系统版本</label>
              <input type="text" v-model="systemSettings.version" placeholder="输入系统版本">
            </div>
            <div class="form-group">
              <label>联系邮箱</label>
              <input type="email" v-model="systemSettings.email" placeholder="输入联系邮箱">
            </div>
            <div class="form-group">
              <label>联系电话</label>
              <input type="tel" v-model="systemSettings.phone" placeholder="输入联系电话">
            </div>
            <button class="btn-save" @click="saveSystemSettings">保存设置</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户添加/编辑模态框 -->
    <div v-if="showUserModal" class="modal-overlay" @click.self="showUserModal = false">
      <div class="modal-content">
        <h3>{{ editingUser? '编辑用户' : '添加用户' }}</h3>
        <form @submit.prevent="saveUser">
          <div class="form-group">
            <label>昵称</label>
            <input type="text" v-model="userForm.nickname" required>
          </div>
          <div class="form-group">
            <label>邮箱</label>
            <input type="email" v-model="userForm.email" required>
          </div>
          <div class="form-group">
            <label>手机号</label>
            <input type="tel" v-model="userForm.phone" pattern="[0-9]{11}" title="请输入11位手机号">
          </div>
          <div class="form-group" v-if="!editingUser">
            <label>密码</label>
            <input type="password" v-model="userForm.password" required>
          </div>
          <div class="form-group">
            <label>性别</label>
            <select v-model="userForm.sex">
              <option value="男">男</option>
              <option value="女">女</option>
              <option value="">未设置</option>
            </select>
          </div>
          <div class="form-group">
            <label>身份</label>
            <select v-model="userForm.identity">
              <option value="regular">普通用户</option>
              <option value="admin">管理员</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="showUserModal = false">取消</button>
            <button type="submit" class="btn-confirm">确定</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 设备添加/编辑模态框 -->
    <div v-if="showDeviceModal" class="modal-overlay" @click.self="showDeviceModal = false">
      <div class="modal-content">
        <h3>{{ editingDevice? '编辑设备' : '添加设备' }}</h3>
        <form @submit.prevent="saveDevice">
          <div class="form-group">
            <label>设备名称</label>
            <input type="text" v-model="deviceForm.name" required>
          </div>
          <div class="form-group">
            <label>设备类型</label>
            <input type="text" v-model="deviceForm.type" required>
          </div>
          <div class="form-group">
            <label>设备状态</label>
            <select v-model="deviceForm.status">
              <option value="在线">在线</option>
              <option value="离线">离线</option>
            </select>
          </div>
          <div class="form-group">
            <label>设备位置</label>
            <input type="text" v-model="deviceForm.location" required>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="showDeviceModal = false">取消</button>
            <button type="submit" class="btn-confirm">确定</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 作物添加/编辑模态框 -->
    <div v-if="showCropModal" class="modal-overlay" @click.self="showCropModal = false">
      <div class="modal-content">
        <h3>{{ editingCrop? '编辑作物' : '添加作物' }}</h3>
        <form @submit.prevent="saveCrop">
          <div class="form-group">
            <label>作物名称</label>
            <input type="text" v-model="cropForm.name" required>
          </div>
          <div class="form-group">
            <label>作物类型</label>
            <input type="text" v-model="cropForm.type" required>
          </div>
          <div class="form-group">
            <label>种植面积</label>
            <input type="number" v-model="cropForm.area" step="0.1" min="0" required>
          </div>
          <div class="form-group">
            <label>生长状态</label>
            <select v-model="cropForm.status">
              <option value="生长中">生长中</option>
              <option value="成熟期">成熟期</option>
              <option value="收获期">收获期</option>
            </select>
          </div>
          <div class="form-group">
            <label>预计收获日期</label>
            <input type="date" v-model="cropForm.expectedHarvest" required>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="showCropModal = false">取消</button>
            <button type="submit" class="btn-confirm">确定</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 灌溉区域添加/编辑模态框 -->
    <div v-if="showIrrigationModal" class="modal-overlay" @click.self="showIrrigationModal = false">
      <div class="modal-content">
        <h3>{{ editingIrrigationZone? '编辑灌溉区域' : '添加灌溉区域' }}</h3>
        <form @submit.prevent="saveIrrigationZone">
          <div class="form-group">
            <label>区域名称</label>
            <input type="text" v-model="irrigationForm.name" required>
          </div>
          <div class="form-group">
            <label>区域面积</label>
            <input type="number" v-model="irrigationForm.area" step="0.1" min="0" required>
          </div>
          <div class="form-group">
            <label>状态</label>
            <select v-model="irrigationForm.status">
              <option value="正常">正常</option>
              <option value="维护中">维护中</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="showIrrigationModal = false">取消</button>
            <button type="submit" class="btn-confirm">确定</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getUsers, saveUsers, getDevices, saveDevices, getCrops, saveCrops, getIrrigationZones, saveIrrigationZones } from '../utils/dataStorage';
import type { User, Device, Crop, IrrigationZone } from '../utils/dataStorage';
import { farmStore } from '../stores/farmStore';

// 菜单数据
const menuList = [
  { path: '/admin/users', name: '用户管理', icon: 'fa-users' },
  { path: '/admin/devices', name: '设备管理', icon: 'fa-microchip' },
  { path: '/admin/crops', name: '作物管理', icon: 'fa-seedling' },
  { path: '/admin/irrigation', name: '灌溉管理', icon: 'fa-tint' },
  { path: '/admin/data', name: '数据管理', icon: 'fa-database' },
  { path: '/admin/settings', name: '系统设置', icon: 'fa-cog' }
];

const router = useRouter();
const activeMenu = ref('/admin/users');
const currentMenuName = computed(() => {
  const menu = menuList.find(m => m.path === activeMenu.value);
  return menu? menu.name : '';
});

// 用户管理 - 从 farmStore 获取数据
const users = ref<User[]>(farmStore.state.users);
const userSearchKeyword = ref('');
const showUserModal = ref(false);
const editingUser = ref<User | null>(null);
const userForm = ref({
  nickname: '',
  email: '',
  phone: '',
  password: '',
  sex: '',
  identity: 'regular'
});

// 设备管理 - 从 farmStore 获取数据
const devices = ref<Device[]>(farmStore.state.devices);
const deviceSearchKeyword = ref('');
const showDeviceModal = ref(false);
const editingDevice = ref<Device | null>(null);
const deviceForm = ref({
  name: '',
  type: '',
  status: '在线',
  location: '',
  lastOnline: ''
});

// 作物管理 - 使用localStorage同步数据
const crops = ref<Crop[]>(getCrops());
const cropSearchKeyword = ref('');
const showCropModal = ref(false);
const editingCrop = ref<Crop | null>(null);
const cropForm = ref({
  name: '',
  type: '',
  area: 0,
  status: '生长中',
  expectedHarvest: ''
});

// 搜索作物
const searchCrops = () => {
  if (!cropSearchKeyword.value.trim()) {
    crops.value = getCrops();
    return;
  }
  const keyword = cropSearchKeyword.value.toLowerCase();
  crops.value = crops.value.filter(crop => 
    crop.name.toLowerCase().includes(keyword) ||
    crop.type.toLowerCase().includes(keyword) ||
    crop.status.toLowerCase().includes(keyword)
  );
};

// 灌溉管理 - 使用localStorage同步数据
const irrigationZones = ref<IrrigationZone[]>(getIrrigationZones());
const irrigationSearchKeyword = ref('');
const showIrrigationModal = ref(false);
const editingIrrigationZone = ref<IrrigationZone | null>(null);
const irrigationForm = ref({
  name: '',
  area: 0,
  status: '正常',
  lastIrrigation: '',
  nextIrrigation: ''
});

// 搜索灌溉区域
const searchIrrigationZones = () => {
  if (!irrigationSearchKeyword.value.trim()) {
    irrigationZones.value = getIrrigationZones();
    return;
  }
  const keyword = irrigationSearchKeyword.value.toLowerCase();
  irrigationZones.value = irrigationZones.value.filter(zone => 
    zone.name.toLowerCase().includes(keyword) ||
    zone.status.toLowerCase().includes(keyword)
  );
};

// 数据管理
const dataRecords = ref([
  { id: 1, type: '土壤湿度', value: 65, unit: '%', timestamp: '2026-03-10 10:00', location: '东区' },
  { id: 2, type: '土壤温度', value: 22, unit: '°C', timestamp: '2026-03-10 10:00', location: '东区' },
  { id: 3, type: '空气温度', value: 25, unit: '°C', timestamp: '2026-03-10 10:05', location: '西区' },
  { id: 4, type: '空气湿度', value: 60, unit: '%', timestamp: '2026-03-10 10:05', location: '西区' },
  { id: 5, type: '光照强度', value: 80000, unit: 'lux', timestamp: '2026-03-10 10:10', location: '北区' }
]);
const dataSearchKeyword = ref('');

// 系统设置
const systemSettings = ref({
  name: '绿野智农管理系统',
  version: '1.0.0',
  email: 'admin@smartfarm.com',
  phone: '13800138000'
});

// 加载用户数据（从 farmStore 获取）
const loadUsers = () => {
  users.value = farmStore.state.users;
};

// 搜索用户
const searchUsers = () => {
  if (!userSearchKeyword.value.trim()) {
    // 重置为全部用户
    users.value = farmStore.state.users;
    return;
  }
  const keyword = userSearchKeyword.value.toLowerCase();
  users.value = farmStore.state.users.filter(user =>
    user.nickname.toLowerCase().includes(keyword) ||
    user.email.toLowerCase().includes(keyword) ||
    user.phone.includes(keyword)
  );
};

// 搜索设备
const searchDevices = () => {
  if (!deviceSearchKeyword.value.trim()) {
    devices.value = farmStore.state.devices;
    return;
  }
  const keyword = deviceSearchKeyword.value.toLowerCase();
  devices.value = farmStore.state.devices.filter(device =>
    device.name.toLowerCase().includes(keyword) ||
    device.type.toLowerCase().includes(keyword) ||
    device.location.toLowerCase().includes(keyword)
  );
};

// 搜索数据
const searchData = () => {
  // 这里可以实现数据搜索逻辑
  console.log('搜索数据:', dataSearchKeyword.value);
};

// 添加用户
const addUser = () => {
  editingUser.value = null;
  userForm.value = {
    nickname: '',
    email: '',
    phone: '',
    password: '',
    sex: '',
    identity: 'regular'
  };
  showUserModal.value = true;
};

// 编辑用户
const editUser = (user: User) => {
  editingUser.value = user;
  userForm.value = {
    nickname: user.nickname,
    email: user.email,
    phone: user.phone,
    password: '',
    sex: user.sex,
    identity: user.identity
  };
  showUserModal.value = true;
};

// 保存用户（使用localStorage同步数据）
const saveUser = () => {
  if (!userForm.value.nickname || !userForm.value.email) {
    alert('请填写必要字段（昵称和邮箱）！');
    return;
  }
  
  if (!editingUser.value && !userForm.value.password) {
    alert('新增用户必须设置密码！');
    return;
  }
  
  if (editingUser.value) {
    // 编辑用户
    const user = editingUser.value;
    const index = users.value.findIndex(u => u.id === user.id);
    if (index !== -1) {
      const currentUser = users.value[index]!;
      const updatedUser: User = {
        id: currentUser.id,
        nickname: userForm.value.nickname,
        email: userForm.value.email,
        phone: userForm.value.phone,
        sex: userForm.value.sex,
        identity: userForm.value.identity
      };
      users.value[index] = updatedUser;
    }
  } else {
    // 添加用户
    const newUser: User = {
      id: users.value.length + 1,
      nickname: userForm.value.nickname,
      email: userForm.value.email,
      phone: userForm.value.phone,
      sex: userForm.value.sex,
      identity: userForm.value.identity
    };
    users.value.push(newUser);
  }
  saveUsers(users.value); // 同步保存到localStorage
  showUserModal.value = false;
  alert(editingUser.value ? '用户信息更新成功！' : '用户添加成功！');
};

// 删除用户（使用localStorage同步数据）
const deleteUser = (id: number) => {
  if (id === 1) {
    alert('不能删除管理员账户！');
    return;
  }
  if (confirm('确定要删除该用户吗？')) {
    users.value = users.value.filter(u => u.id !== id);
    saveUsers(users.value); // 同步保存到localStorage
    alert('用户删除成功！');
  }
};

// 添加设备
const addDevice = () => {
  editingDevice.value = null;
  deviceForm.value = {
    name: '',
    type: '',
    status: '在线',
    location: '',
    lastOnline: new Date().toISOString().slice(0, 19).replace('T', ' ')
  };
  showDeviceModal.value = true;
};

// 编辑设备
const editDevice = (device: Device) => {
  editingDevice.value = device;
  deviceForm.value = {
    name: device.name,
    type: device.type,
    status: device.status,
    location: device.location,
    lastOnline: device.lastOnline
  };
  showDeviceModal.value = true;
};

// 保存设备（使用localStorage同步数据）
const saveDevice = () => {
  if (editingDevice.value) {
    // 编辑设备
    const device = editingDevice.value;
    const index = devices.value.findIndex(d => d.id === device.id);
    if (index !== -1) {
      devices.value[index] = {
        ...device,
        ...deviceForm.value
      };
    }
  } else {
    // 添加设备
    const newDevice: Device = {
      id: devices.value.length + 1,
      name: deviceForm.value.name,
      type: deviceForm.value.type,
      status: deviceForm.value.status,
      location: deviceForm.value.location,
      lastOnline: deviceForm.value.lastOnline
    };
    devices.value.push(newDevice);
  }
  saveDevices(devices.value); // 同步保存到localStorage
  showDeviceModal.value = false;
};

// 删除设备（使用localStorage同步数据）
const deleteDevice = (id: number) => {
  devices.value = devices.value.filter(d => d.id !== id);
  saveDevices(devices.value); // 同步保存到localStorage
};

// 添加作物
const addCrop = () => {
  editingCrop.value = null;
  cropForm.value = {
    name: '',
    type: '',
    area: 0,
    status: '生长中',
    expectedHarvest: ''
  };
  showCropModal.value = true;
};

// 编辑作物
const editCrop = (crop: Crop) => {
  editingCrop.value = crop;
  cropForm.value = {
    name: crop.name,
    type: crop.type,
    area: crop.area,
    status: crop.status,
    expectedHarvest: crop.expectedHarvest
  };
  showCropModal.value = true;
};

// 保存作物（使用localStorage同步数据）
const saveCrop = () => {
  if (!cropForm.value.name || !cropForm.value.type || cropForm.value.area <= 0) {
    alert('请填写必要字段（名称、类型、面积）！');
    return;
  }
  
  if (editingCrop.value) {
    // 编辑作物
    const crop = editingCrop.value;
    const index = crops.value.findIndex(c => c.id === crop.id);
    if (index !== -1) {
      const currentCrop = crops.value[index]!;
      const updatedCrop: Crop = {
        id: currentCrop.id,
        name: cropForm.value.name,
        type: cropForm.value.type,
        area: cropForm.value.area,
        status: cropForm.value.status,
        expectedHarvest: cropForm.value.expectedHarvest
      };
      crops.value[index] = updatedCrop;
    }
  } else {
    // 添加作物
    const newCrop: Crop = {
      id: crops.value.length + 1,
      name: cropForm.value.name,
      type: cropForm.value.type,
      area: cropForm.value.area,
      status: cropForm.value.status,
      expectedHarvest: cropForm.value.expectedHarvest
    };
    crops.value.push(newCrop);
  }
  saveCrops(crops.value); // 同步保存到localStorage
  showCropModal.value = false;
  alert(editingCrop.value ? '作物信息更新成功！' : '作物添加成功！');
};

// 删除作物（使用localStorage同步数据）
const deleteCrop = (id: number) => {
  if (confirm('确定要删除该作物吗？')) {
    crops.value = crops.value.filter(c => c.id !== id);
    saveCrops(crops.value); // 同步保存到localStorage
    alert('作物删除成功！');
  }
};

// 添加灌溉区域
const addIrrigationZone = () => {
  editingIrrigationZone.value = null;
  const now = new Date();
  const lastIrrigation = new Date(now);
  lastIrrigation.setDate(lastIrrigation.getDate() - 1);
  const nextIrrigation = new Date(now);
  nextIrrigation.setDate(nextIrrigation.getDate() + 1);
  
  irrigationForm.value = {
    name: '',
    area: 0,
    status: '正常',
    lastIrrigation: lastIrrigation.toISOString().slice(0, 19).replace('T', ' '),
    nextIrrigation: nextIrrigation.toISOString().slice(0, 19).replace('T', ' ')
  };
  showIrrigationModal.value = true;
};

// 编辑灌溉区域
const editIrrigationZone = (zone: IrrigationZone) => {
  editingIrrigationZone.value = zone;
  irrigationForm.value = {
    name: zone.name,
    area: zone.area,
    status: zone.status,
    lastIrrigation: zone.lastIrrigation,
    nextIrrigation: zone.nextIrrigation
  };
  showIrrigationModal.value = true;
};

// 保存灌溉区域（使用localStorage同步数据）
const saveIrrigationZone = () => {
  if (!irrigationForm.value.name || irrigationForm.value.area <= 0) {
    alert('请填写必要字段（区域名称、面积）！');
    return;
  }
  
  if (editingIrrigationZone.value) {
    // 编辑灌溉区域
    const zone = editingIrrigationZone.value;
    const index = irrigationZones.value.findIndex(z => z.id === zone.id);
    if (index !== -1) {
      const currentZone = irrigationZones.value[index]!;
      const updatedZone: IrrigationZone = {
        id: currentZone.id,
        name: irrigationForm.value.name,
        area: irrigationForm.value.area,
        status: irrigationForm.value.status,
        lastIrrigation: irrigationForm.value.lastIrrigation,
        nextIrrigation: irrigationForm.value.nextIrrigation
      };
      irrigationZones.value[index] = updatedZone;
    }
  } else {
    // 添加灌溉区域
    const newZone: IrrigationZone = {
      id: irrigationZones.value.length + 1,
      name: irrigationForm.value.name,
      area: irrigationForm.value.area,
      status: irrigationForm.value.status,
      lastIrrigation: irrigationForm.value.lastIrrigation,
      nextIrrigation: irrigationForm.value.nextIrrigation
    };
    irrigationZones.value.push(newZone);
  }
  saveIrrigationZones(irrigationZones.value); // 同步保存到localStorage
  showIrrigationModal.value = false;
  alert(editingIrrigationZone.value ? '灌溉区域信息更新成功！' : '灌溉区域添加成功！');
};

// 删除灌溉区域（使用localStorage同步数据）
const deleteIrrigationZone = (id: number) => {
  if (confirm('确定要删除该灌溉区域吗？')) {
    irrigationZones.value = irrigationZones.value.filter(z => z.id !== id);
    saveIrrigationZones(irrigationZones.value); // 同步保存到localStorage
    alert('灌溉区域删除成功！');
  }
};

// 导出数据
const exportData = () => {
  // 实现CSV数据导出
  const data = dataRecords.value;
  if (data.length === 0) {
    alert('没有数据可导出');
    return;
  }
  
  // 生成CSV内容
  const headers = ['ID', '数据类型', '数值', '单位', '采集时间', '采集位置'];
  const csvContent = [
    headers.join(','),
    ...data.map(item => [
      item.id,
      `"${item.type}"`,
      item.value,
      `"${item.unit}"`,
      `"${item.timestamp}"`,
      `"${item.location}"`
    ].join(','))
  ].join('\n');
  
  // 创建Blob对象
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // 创建下载链接
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `农场数据_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 删除数据
const deleteData = (id: number) => {
  dataRecords.value = dataRecords.value.filter(d => d.id !== id);
};

// 保存系统设置
const saveSystemSettings = () => {
  alert('系统设置保存成功！');
};

// 退出登录
const logout = () => {
  // 这里可以实现退出登录逻辑
  router.push('/login');
};

// 初始化
onMounted(() => {
  // 用户数据已在初始化时定义，无需额外加载
  // 设备数据已在初始化时定义
});
</script>

<style scoped>
.admin-container {
  display: flex;
  height: 100vh;
  background-color: #f8fafc;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}

.admin-sidebar {
  width: 240px;
  background: linear-gradient(180deg, #2d5016 0%, #3a6e18 100%);
  color: white;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.sidebar-title {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.sidebar-menu li {
  padding: 14px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  border-left: 3px solid transparent;
}

.sidebar-menu li:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-left-color: rgba(255, 255, 255, 0.3);
}

.sidebar-menu li.active {
  background-color: rgba(255, 255, 255, 0.15);
  border-left-color: #ffd700;
}

.sidebar-menu li i {
  margin-right: 12px;
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-header {
  background-color: white;
  padding: 16px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title h1 {
  font-size: 22px;
  margin: 0;
  color: #2d5016;
  font-weight: 600;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-user span {
  font-weight: 500;
  color: #333;
}

.header-user button {
  padding: 8px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.header-user button:hover {
  background-color: #c0392b;
  transform: translateY(-1px);
}

.main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.content-header h2 {
  font-size: 18px;
  margin: 0;
  color: #333;
  font-weight: 600;
}

.btn-add {
  padding: 10px 24px;
  background: linear-gradient(135deg, #2d5016 0%, #4caf50 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(45, 80, 22, 0.3);
}

.btn-add:hover {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(45, 80, 22, 0.4);
}

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: white;
}

.search-bar input:focus {
  outline: none;
  border-color: #2d5016;
  box-shadow: 0 0 0 3px rgba(45, 80, 22, 0.1);
}

.search-bar input::placeholder {
  color: #94a3b8;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.data-table th,
.data-table td {
  padding: 14px 16px;
  text-align: left;
}

.data-table th {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  font-weight: 600;
  color: #475569;
  font-size: 14px;
  border-bottom: 2px solid #e2e8f0;
}

.data-table td {
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #64748b;
}

.data-table tr:hover {
  background-color: #f8fafc;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.btn-edit,
.btn-delete {
  padding: 6px 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
  transition: all 0.3s ease;
  font-size: 13px;
  font-weight: 500;
}

.btn-edit {
  background-color: #3b82f6;
  color: white;
}

.btn-edit:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.btn-delete {
  background-color: #ef4444;
  color: white;
}

.btn-delete:hover {
  background-color: #dc2626;
  transform: translateY(-1px);
}

.device-status,
.irrigation-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.device-status.在线,
.irrigation-status.正常 {
  background-color: #dcfce7;
  color: #166534;
}

.device-status.离线,
.irrigation-status.维护中 {
  background-color: #fee2e2;
  color: #991b1b;
}

.settings-form {
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #2d5016;
  box-shadow: 0 0 0 3px rgba(45, 80, 22, 0.1);
}

.btn-save {
  padding: 12px 32px;
  background: linear-gradient(135deg, #2d5016 0%, #4caf50 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(45, 80, 22, 0.3);
}

.btn-save:hover {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(45, 80, 22, 0.4);
}

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
  padding: 28px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  width: 420px;
  max-width: 90%;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #2d5016;
  font-size: 18px;
  font-weight: 600;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

.btn-cancel,
.btn-confirm {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 14px;
}

.btn-cancel {
  background-color: #f1f5f9;
  color: #64748b;
}

.btn-cancel:hover {
  background-color: #e2e8f0;
}

.btn-confirm {
  background: linear-gradient(135deg, #2d5016 0%, #4caf50 100%);
  color: white;
}

.btn-confirm:hover {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  transform: translateY(-1px);
}
</style>