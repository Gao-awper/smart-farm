<template>
  <div class="user-center-container">
    <!-- 个人中心头部 -->
    <div class="user-center-header">
      <div class="header-left">
        <div class="avatar-container">
          <img :src="userInfo.avatar || defaultAvatar" alt="头像" class="user-avatar" @click="triggerAvatarUpload">
          <input type="file" accept="image/*" class="avatar-upload" ref="avatarInput" @change="handleAvatarUpload">
        </div>
        <div class="user-basic-info">
          <h2 class="user-name">{{ userInfo.nickname || '未设置昵称' }}</h2>
          <p class="user-id">ID: {{ userInfo.id || '10000' }}</p>
          <p class="user-level">
            <span class="level-icon">🏆</span>
            {{ userInfo.level || '农场管理员' }}
          </p>
        </div>
      </div>
      <div class="header-right">
        <button class="edit-info-btn" @click="showEditInfoModal = true">
          <i class="edit-icon">✏️</i> 编辑资料
        </button>
      </div>
    </div>

    <!-- 功能导航栏 -->
    <div class="function-nav">
      <button
          class="nav-item"
          :class="{active: activeTab === 'order'}"
          @click="switchTab('order')"
      >
        <i class="nav-icon">📦</i>
        <span class="nav-text">我的订单</span>
      </button>
      <button
          class="nav-item"
          :class="{active: activeTab === 'answer'}"
          @click="switchTab('answer')"
      >
        <i class="nav-icon">📝</i>
        <span class="nav-text">我的答题记录</span>
      </button>
      <button
          class="nav-item"
          :class="{active: activeTab === 'activity'}"
          @click="switchTab('activity')"
      >
        <i class="nav-icon">🎉</i>
        <span class="nav-text">我的活动</span>
      </button>
      <button
          class="nav-item"
          :class="{active: activeTab === 'info'}"
          @click="switchTab('info')"
      >
        <i class="nav-icon">👤</i>
        <span class="nav-text">个人信息</span>
      </button>

    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 1. 我的订单 -->
      <div class="order-tab" v-if="activeTab === 'order'">
        <!-- 订单筛选 -->
        <div class="order-filter">
          <button
              class="filter-btn"
              :class="{active: activeOrderStatus === 'all'}"
              @click="switchOrderStatus('all')"
          >
            全部订单
          </button>
          <button
              class="filter-btn"
              :class="{active: activeOrderStatus === 'pending'}"
              @click="switchOrderStatus('pending')"
          >
            待付款
          </button>
          <button
              class="filter-btn"
              :class="{active: activeOrderStatus === 'paid'}"
              @click="switchOrderStatus('paid')"
          >
            待发货
          </button>
          <button
              class="filter-btn"
              :class="{active: activeOrderStatus === 'shipped'}"
              @click="switchOrderStatus('shipped')"
          >
            待收货
          </button>
          <button
              class="filter-btn"
              :class="{active: activeOrderStatus === 'completed'}"
              @click="switchOrderStatus('completed')"
          >
            已完成
          </button>
          <button
              class="filter-btn"
              :class="{active: activeOrderStatus === 'cancelled'}"
              @click="switchOrderStatus('cancelled')"
          >
            已取消
          </button>
        </div>

        <!-- 订单列表 -->
        <div class="order-list" v-if="filteredOrders.length > 0">
          <div class="order-card" v-for="order in filteredOrders" :key="order.id">
            <div class="order-header">
              <div class="order-left">
                <span class="order-no">订单编号：{{ order.orderNo }}</span>
                <span class="order-time">下单时间：{{ formatTime(order.createTime) }}</span>
              </div>
              <div class="order-right">
                <span class="order-status" :class="getStatusClass(order.status)">{{ getStatusText(order.status) }}</span>
              </div>
            </div>

            <div class="order-goods">
              <div class="goods-item" v-for="goods in order.goodsList" :key="goods.id">
                <img :src="goods.image || defaultGoodsImg" alt="商品图片" class="goods-img">
                <div class="goods-info">
                  <div class="goods-name">{{ goods.name }}</div>
                  <div class="goods-spec" v-if="goods.spec">规格：{{ goods.spec }}</div>
                </div>
                <div class="goods-price">¥{{ goods.price.toFixed(2) }}</div>
                <div class="goods-count">x{{ goods.count }}</div>
              </div>
            </div>

            <div class="order-footer">
              <div class="order-amount">
                实付款：<span class="amount">¥{{ order.totalPrice.toFixed(2) }}</span>
              </div>
              <div class="order-actions">
                <button class="action-btn cancel-btn" @click="cancelOrder(order.id)" v-if="order.status === 'pending'">取消订单</button>
                <button class="action-btn pay-btn" @click="payOrder(order.id)" v-if="order.status === 'pending'">立即付款</button>
                <button class="action-btn confirm-btn" @click="confirmReceipt(order.id)" v-if="order.status === 'shipped'">确认收货</button>
                <button class="action-btn delete-btn" @click="deleteOrder(order.id)" v-if="order.status === 'cancelled' || order.status === 'completed'">删除订单</button>
                <button class="action-btn detail-btn" @click="viewOrderDetail(order.id)">订单详情</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空订单状态 -->
        <div class="empty-order" v-else>
          <div class="empty-icon">📦</div>
          <p class="empty-text">{{ getEmptyOrderText() }}</p>
          <button class="go-shop-btn" @click="goToShop">去逛逛</button>
        </div>
      </div>

      <!-- 2. 我的答题记录 -->
      <div class="answer-tab" v-if="activeTab === 'answer'">
        <!-- 答题记录筛选 -->
        <div class="answer-filter">
          <select v-model="activeAnswerType" class="type-select">
            <option value="all">全部答题类型</option>
            <option value="springFestival">春节专题</option>
            <option value="opera">戏曲专题</option>
            <option value="paperCut">剪纸专题</option>
            <option value="shadowPlay">皮影戏专题</option>
            <option value="general">综合题库</option>
            <option value="daily">每日答题</option>
          </select>
          <input type="date" v-model="answerDate" class="date-select">
          <button class="search-btn" @click="filterAnswerRecords">查询</button>
        </div>

        <!-- 答题记录列表 -->
        <div class="answer-list" v-if="filteredAnswerRecords.length > 0">
          <div class="answer-card" v-for="record in filteredAnswerRecords" :key="record.id">
            <div class="answer-header">
              <div class="answer-left">
                <span class="answer-type">{{ getAnswerTypeText(record.type) }}</span>
                <span class="answer-time">答题时间：{{ formatTime(record.answerTime) }}</span>
              </div>
              <div class="answer-score">
                得分：<span class="score">{{ record.score }}</span>/{{ record.totalScore }}
              </div>
            </div>

            <div class="answer-stats">
              <div class="stats-item">
                <span class="stats-label">答题时长：</span>
                <span class="stats-value">{{ formatDuration(record.duration) }}</span>
              </div>
              <div class="stats-item">
                <span class="stats-label">正确题数：</span>
                <span class="stats-value">{{ record.correctCount }}题</span>
              </div>
              <div class="stats-item">
                <span class="stats-label">错误题数：</span>
                <span class="stats-value">{{ record.errorCount }}题</span>
              </div>
            </div>

            <div class="answer-actions">
              <button class="review-btn" @click="reviewAnswer(record.id)">查看答题详情</button>
              <button class="redo-btn" @click="redoAnswer(record.type)">重新答题</button>
            </div>
          </div>
        </div>

        <!-- 空答题记录状态 -->
        <div class="empty-answer" v-else>
          <div class="empty-icon">📝</div>
          <p class="empty-text">暂无答题记录</p>
          <button class="go-answer-btn" @click="goToAnswer">立即答题</button>
        </div>
      </div>

      <!-- 3. 我的活动 -->
      <div class="activity-tab" v-if="activeTab === 'activity'">
        <!-- 活动列表 -->
        <div class="activity-list" v-if="userActivities.length > 0">
          <div class="activity-card" v-for="activity in userActivities" :key="activity.id">
            <div class="activity-header">
              <h3 class="activity-title">{{ activity.title }}</h3>
              <span class="activity-status" :class="getActivityStatusClass(activity.status)">{{ getActivityStatusText(activity.status) }}</span>
            </div>
            <div class="activity-content">
              <div class="activity-info">
                <div class="info-item">
                  <span class="info-label">活动时间：</span>
                  <span class="info-value">{{ formatTime(activity.startTime) }} 至 {{ formatTime(activity.endTime) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">活动地点：</span>
                  <span class="info-value">{{ activity.location }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">报名时间：</span>
                  <span class="info-value">{{ formatTime(activity.registrationTime) }}</span>
                </div>
              </div>
              <div class="activity-description">
                {{ activity.description }}
              </div>
            </div>
            <div class="activity-footer">
              <button class="activity-btn detail-btn" @click="viewActivityDetail(activity.id)">查看详情</button>
              <button class="activity-btn cancel-btn" @click="cancelActivityRegistration(activity.id)" v-if="activity.status === 'pending'">取消报名</button>
            </div>
          </div>
        </div>

        <!-- 空活动状态 -->
        <div class="empty-activity" v-else>
          <div class="empty-icon">🎉</div>
          <p class="empty-text">暂无报名的活动</p>
          <button class="go-activity-btn" @click="goToActivities">查看农场活动</button>
        </div>
      </div>

      <!-- 4. 个人信息 -->
      <div class="info-tab" v-if="activeTab === 'info'">
        <div class="info-card">
          <div class="info-item">
            <label class="info-label">头像：</label>
            <div class="info-value">
              <img :src="userInfo.avatar || defaultAvatar" alt="头像" class="info-avatar">
            </div>
          </div>
          <div class="info-item">
            <label class="info-label">昵称：</label>
            <div class="info-value">{{ userInfo.nickname || '未设置' }}</div>
          </div>
          <div class="info-item">
            <label class="info-label">真实姓名：</label>
            <div class="info-value">{{ userInfo.realname || '未设置' }}</div>
          </div>
          <div class="info-item">
            <label class="info-label">性别：</label>
            <div class="info-value">{{ userInfo.sex ==='male'? '男' : userInfo.sex === 'female'? '女' : '未设置' }}</div>
          </div>
          <div class="info-item">
            <label class="info-label">手机号：</label>
            <div class="info-value">{{ userInfo.phone || '未绑定' }}</div>
          </div>
          <div class="info-item">
            <label class="info-label">邮箱：</label>
            <div class="info-value">{{ userInfo.email || '未绑定' }}</div>
          </div>
          <div class="info-item">
            <label class="info-label">生日：</label>
            <div class="info-value">{{ userInfo.birthday? formatDate(userInfo.birthday) : '未设置' }}</div>
          </div>
          <div class="info-item">
            <label class="info-label">地址：</label>
            <div class="info-value">{{ userInfo.address || '未设置' }}</div>
          </div>
          <div class="info-item">
            <label class="info-label">注册时间：</label>
            <div class="info-value">{{ formatTime(userInfo.registerTime) }}</div>
          </div>
        </div>
        <button class="edit-info-btn-bottom" @click="showEditInfoModal = true">
          <i class="edit-icon">✏️</i> 编辑个人信息
        </button>
      </div>
    </div>

    <!-- 编辑个人信息弹窗 -->
    <div class="modal" v-if="showEditInfoModal">
      <div class="modal-overlay" @click="showEditInfoModal = false"></div>
      <div class="modal-content edit-modal">
        <div class="modal-header">
          <h3 class="modal-title">编辑个人信息</h3>
          <button class="close-btn" @click="showEditInfoModal = false">×</button>
        </div>
        <div class="modal-body">
          <!-- 头像上传 -->
          <div class="form-group">
            <label class="form-label">头像</label>
            <div class="avatar-upload-container">
              <img :src="tempUserInfo.avatar || defaultAvatar" alt="头像预览" class="avatar-preview">
              <button class="upload-btn" @click="triggerAvatarUploadModal">更换头像</button>
              <input type="file" accept="image/*" class="avatar-upload-modal" ref="avatarInputModal" @change="handleAvatarUploadModal">
            </div>
          </div>

          <!-- 昵称 -->
          <div class="form-group">
            <label class="form-label">昵称</label>
            <input type="text" v-model="tempUserInfo.nickname" class="form-input" placeholder="请输入昵称">
          </div>

          <!-- 真实姓名 -->
          <div class="form-group">
            <label class="form-label">真实姓名</label>
            <input type="text" v-model="tempUserInfo.realname" class="form-input" placeholder="请输入真实姓名">
          </div>

          <!-- 性别 -->
          <div class="form-group">
            <label class="form-label">性别</label>
            <div class="gender-select">
              <label class="gender-option">
                <input type="radio" v-model="tempUserInfo.sex" value="male"> 男
              </label>
              <label class="gender-option">
                <input type="radio" v-model="tempUserInfo.sex" value="female"> 女
              </label>
              <label class="gender-option">
                <input type="radio" v-model="tempUserInfo.sex" value=""> 保密
              </label>
            </div>
          </div>

          <!-- 手机号 -->
          <div class="form-group">
            <label class="form-label">手机号</label>
            <input type="tel" v-model="tempUserInfo.phone" class="form-input" placeholder="请输入手机号">
          </div>

          <!-- 邮箱 -->
          <div class="form-group">
            <label class="form-label">邮箱</label>
            <input type="email" v-model="tempUserInfo.email" class="form-input" placeholder="请输入邮箱">
          </div>

          <!-- 生日 -->
          <div class="form-group">
            <label class="form-label">生日</label>
            <input type="date" v-model="tempUserInfo.birthday" class="form-input">
          </div>

          <!-- 地址 -->
          <div class="form-group form-group-full">
            <label class="form-label">地址</label>
            <textarea v-model="tempUserInfo.address" class="form-textarea" placeholder="请输入详细地址"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showEditInfoModal = false">取消</button>
          <button class="save-btn" @click="saveUserInfo">保存修改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { getCurrentUser, logout } from '@/utils/auth';
import { getUserActivities, cancelRegistration } from '@/api/activityApi';

const router = useRouter();

// 基础常量
const defaultAvatar = 'https://picsum.photos/id/64/100/100'; // 默认头像
const defaultGoodsImg = 'https://picsum.photos/id/237/100/100'; // 默认商品图片

// 核心状态
const activeTab = ref('order'); // 当前激活标签：order/answer/info/activity
const showEditInfoModal = ref(false); // 编辑信息弹窗
const tempUserInfo = ref({}); // 临时用户信息（编辑用）
const loading = ref(false); // 加载状态

// 订单相关状态
const activeOrderStatus = ref('all'); // 订单状态筛选：all/pending/paid/shipped/completed/cancelled
const orderList = ref([]); // 订单列表，从后端加载

// 答题记录相关状态
const activeAnswerType = ref('all'); // 答题类型筛选：all/heritage/culture/craft
const answerDate = ref(''); // 答题日期筛选
const answerRecords = ref([]); // 答题记录列表，从后端加载

// 活动相关状态
const userActivities = ref([]); // 用户报名的活动列表

// 用户信息
const userInfo = ref({});

// 从后端加载用户信息
const loadUserInfo = async () => {
  loading.value = true;
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const response = await axios.get(`/api/user/${currentUser.id}`);
    if (response.data.status ==='success') {
      const data = response.data.data;
      // 处理头像路径
      let avatarUrl = defaultAvatar;
      if (data.avatar) {
        avatarUrl = data.avatar;
      }
      // 将后端数据映射到前端需要的格式
      userInfo.value = {
        id: data.id,
        avatar: avatarUrl,
        nickname: data.nickname || data.username || '未设置昵称',
        realname: data.realname || '',
        sex: data.sex || '',
        phone: data.phone? `${data.phone.substring(0, 3)}****${data.phone.substring(7)}` : '',
        email: data.email || '',
        birthday: data.birthday || '',
        registerTime: data.createTime || '',
        level: data.level || '农场管理员'
      };
    } else {
      // 当个人信息查询失败时（如用户不存在），清除缓存并重新登录
      console.error('用户信息查询失败:', response.data.message);
      alert('用户信息已失效，请重新登录');
      logout(); // 清除用户缓存
      router.push('/login'); // 跳转到登录页面
    }
  } catch (error) {
    console.error('加载用户信息失败:', error);
    // 网络错误或其他异常时，也可以考虑清除缓存
    if (error.response && error.response.data && error.response.data.status === 'error') {
      alert('用户信息已失效，请重新登录');
      logout(); // 清除用户缓存
      router.push('/login'); // 跳转到登录页面
    } else {
      alert('加载用户信息失败，请稍后重试');
    }
  } finally {
    loading.value = false;
  }
};

// 从后端加载订单数据
const loadOrders = async () => {
  loading.value = true;
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const response = await axios.get(`/api/orders/user/${currentUser.id}`);
    if (response.data.status ==='success') {
      // 后端返回的订单数据可能需要进行格式转换以匹配前端需求
      orderList.value = response.data.data || [];
    } else {
      console.error('订单数据加载失败:', response.data.message);
    }
  } catch (error) {
    console.error('加载订单数据失败:', error);
  } finally {
    loading.value = false;
  }
};

// 从后端加载答题记录数据
const loadAnswerRecords = async () => {
  loading.value = true;
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const response = await axios.get(`/api/answer-records/user/${currentUser.id}`);
    if (response.data.status ==='success') {
      // 后端返回的答题记录数据可能需要进行格式转换以匹配前端需求
      answerRecords.value = response.data.data || [];
    } else {
      console.error('答题记录加载失败:', response.data.message);
    }
  } catch (error) {
    console.error('加载答题记录失败:', error);
  } finally {
    loading.value = false;
  }
};



// 计算属性 - 筛选后的订单列表
const filteredOrders = computed(() => {
  if (activeOrderStatus.value === 'all') {
    return [...orderList.value];
  }
  return orderList.value.filter(order => order.status === activeOrderStatus.value);
});

// 计算属性 - 筛选后的答题记录
const filteredAnswerRecords = computed(() => {
  let result = [...answerRecords.value];

  // 类型筛选
  if (activeAnswerType.value!== 'all') {
    result = result.filter(record => record.type === activeAnswerType.value);
  }

  // 日期筛选
  if (answerDate.value) {
    result = result.filter(record => {
      const recordDate = record.answerTime.split(' ')[0];
      return recordDate === answerDate.value;
    });
  }

  return result;
});

// 从后端加载用户报名的活动数据
const loadUserActivities = async () => {
  loading.value = true;
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const result = await getUserActivities();
    // 检查返回结果是完整response对象还是直接活动列表
    let activities = result;
    if (result && result.data) {
      activities = result.data;
    }
    
    if (Array.isArray(activities)) {
      // 后端返回的活动数据可能需要进行格式转换以匹配前端需求
      userActivities.value = activities || [];
    } else {
      console.error('用户活动加载失败: 返回数据格式不正确');
      console.log('返回结果:', result);
    }
  } catch (error) {
    console.error('加载用户活动失败:', error);
  } finally {
    loading.value = false;
  }
};

// 方法 - 切换标签
const switchTab = (tab) => {
  activeTab.value = tab;
};

// 订单相关方法
const switchOrderStatus = (status) => {
  activeOrderStatus.value = status;
};

const getStatusText = (status) => {
  const statusMap = {
    pending: '待付款',
    paid: '待发货',
    shipped: '待收货',
    completed: '已完成',
    cancelled: '已取消'
  };
  return statusMap[status] || '未知状态';
};

const getStatusClass = (status) => {
  const classMap = {
    pending: 'status-pending',
    paid: 'status-paid',
    shipped: 'status-shipped',
    completed: 'status-completed',
    cancelled: 'status-cancelled'
  };
  return classMap[status] || '';
};

const getEmptyOrderText = () => {
  const textMap = {
    all: '暂无订单记录',
    pending: '暂无待付款订单',
    paid: '暂无待发货订单',
    shipped: '暂无待收货订单',
    completed: '暂无已完成订单',
    cancelled: '暂无已取消订单'
  };
  return textMap[activeOrderStatus.value] || '暂无订单记录';
};

const cancelOrder = async (id) => {
  if (confirm('确定要取消该订单吗？')) {
    try {
      const response = await axios.put(`/api/orders/${id}/cancel`);
      if (response.data.status ==='success') {
        // 操作成功后重新加载订单数据
        await loadOrders();
        alert('订单已取消！');
      } else {
        alert('订单取消失败：' + response.data.message);
      }
    } catch (error) {
      console.error('取消订单失败:', error);
      alert('订单取消失败，请稍后重试');
    }
  }
};

const payOrder = async (id) => {
  try {
    const response = await axios.put(`/api/orders/${id}/pay`);
    if (response.data.status ==='success') {
      // 操作成功后重新加载订单数据
      await loadOrders();
      alert('订单支付成功！');
    } else {
      alert('订单支付失败：' + response.data.message);
    }
  } catch (error) {
    console.error('支付订单失败:', error);
    alert('订单支付失败，请稍后重试');
  }
};

const confirmReceipt = async (id) => {
  if (confirm('确定已收到商品吗？')) {
    try {
      const response = await axios.put(`/api/orders/${id}/confirm`);
      if (response.data.status ==='success') {
        // 操作成功后重新加载订单数据
        await loadOrders();
        alert('已确认收货！');
      } else {
        alert('确认收货失败：' + response.data.message);
      }
    } catch (error) {
      console.error('确认收货失败:', error);
      alert('确认收货失败，请稍后重试');
    }
  }
};

const viewOrderDetail = (orderId) => {
  // 跳转到订单详情页面
  router.push(`/order/${orderId}`);
};

const deleteOrder = async (id) => {
  if (confirm('确定要删除该订单吗？删除后不可恢复！')) {
    try {
      const response = await axios.delete(`/api/orders/${id}/delete`);
      if (response.data.status ==='success') {
        // 操作成功后重新加载订单数据
        await loadOrders();
        alert('订单已删除！');
      } else {
        alert('订单删除失败：' + response.data.message);
      }
    } catch (error) {
      console.error('删除订单失败:', error);
      alert('订单删除失败，请稍后重试');
    }
  }
};

const goToShop = () => {
  router.push('/buy'); // 跳转到商城页面
};

// 答题记录相关方法
const filterAnswerRecords = () => {
  // 筛选逻辑已通过计算属性实现，此处仅触发更新
  console.log('筛选答题记录：', activeAnswerType.value, answerDate.value);
};

const getAnswerTypeText = (type) => {
  const typeMap = {
    springFestival: '春节专题',
    opera: '戏曲专题',
    paperCut: '剪纸专题',
    shadowPlay: '皮影戏专题',
    general: '综合题库',
    daily: '每日答题'
  };
  return typeMap[type] || '未知类型';
};

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}分${secs}秒`;
};

const reviewAnswer = (id) => {
  // 跳转到答题详情页面
  router.push(`/answer/detail/${id}`);
};

const redoAnswer = (type) => {
  // 跳转到答题页面，携带答题类型参数
  router.push({
    path: '/answer/doing',
    query: { type: type }
  });
};

const goToAnswer = () => {
  alert('跳转到答题页面！');
  // 实际项目中可跳转到答题页面
};



// 活动相关方法
const getActivityStatusText = (status) => {
  // 映射常见的英文状态到中文
  const statusMap = {
    pending: '待开始',
    ongoing: '进行中',
    completed: '已结束',
    cancelled: '已取消',
    '已结束': '已结束',
    '进行中': '进行中',
    '待开始': '待开始',
    '已取消': '已取消'
  };
  // 如果状态不在映射表中，直接返回原始值
  return statusMap[status] || status || '未知状态';
};

const getActivityStatusClass = (status) => {
  const classMap = {
    pending: 'status-pending',
    ongoing: 'status-ongoing',
    completed: 'status-completed',
    cancelled: 'status-cancelled'
  };
  return classMap[status] || '';
};

const viewActivityDetail = (activityId) => {
  // 跳转到List页面并传递活动ID参数
  router.push({ path: '/list', query: { activityId: activityId, view: 'detail' } });
};

const cancelActivityRegistration = async (activityId) => {
  if (confirm('确定要取消该活动的报名吗？')) {
    try {
      // 调用取消报名接口
      const response = await axios.post(`/api/activities/${activityId}/cancel`);
      if (response.data.status ==='success') {
        // 重新加载用户活动列表
        await loadUserActivities();
        alert('活动报名已取消！');
      } else {
        alert('取消报名失败：' + response.data.message);
      }
    } catch (error) {
      console.error('取消活动报名失败:', error);
      alert('取消报名失败，请稍后重试');
    }
  }
};

const goToActivities = () => {
  // 跳转到农场活动列表页面
  router.push('/list');
};

// 个人信息相关方法
// 初始化临时用户信息
const initTempUserInfo = () => {
  tempUserInfo.value = { ...userInfo.value };
};

// 触发头像上传
const triggerAvatarUpload = () => {
  const input = document.querySelector('.avatar-upload');
  if (input) input.click();
};

const triggerAvatarUploadModal = () => {
  const input = document.querySelector('.avatar-upload-modal');
  if (input) input.click();
};

// 处理头像上传
const handleAvatarUpload = async (e) => {
  const file = e.target.files[0];
  if (file) {
    // 校验文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件！');
      return;
    }

    // 校验文件大小（限制2MB）
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('头像大小不能超过2MB！');
      return;
    }

    // 先预览本地头像
    const reader = new FileReader();
    reader.onload = (event) => {
      userInfo.value.avatar = event.target.result;
    };
    reader.readAsDataURL(file);

    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }

      // 使用FormData上传文件
      const formData = new FormData();
      formData.append('file', file);

      // 发送头像上传请求到后端
      const uploadResponse = await axios.post(`/api/uploads/avatars`, formData, {
        headers: {
          'Content-Type':'multipart/form-data'
        }
      });

      if (uploadResponse.data.status ==='success') {
        // 获取图片路径
        const imagePath = uploadResponse.data.data.path;

        // 更新用户信息中的头像路径
        const updateResponse = await axios.put(`/api/user/${currentUser.id}`, {
          avatar: imagePath
        });

        if (updateResponse.data.status ==='success') {
          // 更新本地用户信息
          await loadUserInfo();
        } else {
          alert(`头像更新失败：${updateResponse.data.message}`);
          // 恢复原来的头像
          await loadUserInfo();
        }
      } else {
        alert(`头像上传失败：${uploadResponse.data.message}`);
        // 恢复原来的头像
        await loadUserInfo();
      }
    } catch (error) {
      console.error('更新头像失败:', error);
      alert('更新头像失败，请稍后重试');
      // 恢复原来的头像
      await loadUserInfo();
    }
  }
};

const handleAvatarUploadModal = (e) => {
  const file = e.target.files[0];
  if (file) {
    // 校验文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件！');
      return;
    }

    // 校验文件大小（限制2MB）
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('头像大小不能超过2MB！');
      return;
    }

    // 预览头像
    const reader = new FileReader();
    reader.onload = (event) => {
      tempUserInfo.value.avatar = event.target.result;
    };
    reader.readAsDataURL(file);

    // 保存文件到临时变量，等待保存用户信息时上传
    tempAvatarFile.value = file;
  }
};

// 临时存储头像文件
const tempAvatarFile = ref(null);


// 保存用户信息
const saveUserInfo = async () => {
  // 表单验证
  if (tempUserInfo.value.nickname && tempUserInfo.value.nickname.length > 20) {
    alert('昵称长度不能超过20个字符！');
    return;
  }

  if (tempUserInfo.value.phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(tempUserInfo.value.phone)) {
      alert('请输入正确的手机号格式！');
      return;
    }
  }

  if (tempUserInfo.value.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(tempUserInfo.value.email)) {
      alert('请输入正确的邮箱格式！');
      return;
    }
  }

  if (tempUserInfo.value.realname && tempUserInfo.value.realname.length > 20) {
    alert('真实姓名长度不能超过20个字符！');
    return;
  }

  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    loading.value = true;
    let imagePath = tempUserInfo.value.avatar;

    // 如果有新的头像文件，先上传图片
    if (tempAvatarFile.value) {
      // 使用FormData上传文件
      const formData = new FormData();
      formData.append('file', tempAvatarFile.value);

      // 发送头像上传请求到后端
      const uploadResponse = await axios.post(`/api/uploads/avatars`, formData, {
        headers: {
          'Content-Type':'multipart/form-data'
        }
      });

      if (uploadResponse.data.status ==='success') {
        // 获取图片路径
        imagePath = uploadResponse.data.data.path;
      } else {
        alert(`头像上传失败：${uploadResponse.data.message}`);
        return;
      }
    }

    // 准备更新数据
    const updateData = {
      nickname: tempUserInfo.value.nickname,
      realname: tempUserInfo.value.realname,
      sex: tempUserInfo.value.sex,
      phone: tempUserInfo.value.phone,
      email: tempUserInfo.value.email,
      avatar: imagePath
    };
    // 确保包含birthday字段，后端需要YYYY-MM-DD格式
    if (tempUserInfo.value.birthday) {
      const birthdayDate = new Date(tempUserInfo.value.birthday);
      if (!isNaN(birthdayDate)) {
        updateData.birthday = birthdayDate.toISOString().split('T')[0]; // 转换为YYYY-MM-DD格式
      }
    }

    // 发送更新请求到后端
    const response = await axios.put(`/api/user/${currentUser.id}`, updateData);

    if (response.data.status ==='success') {
      // 更新本地用户信息
      await loadUserInfo(); // 重新从后端加载最新用户信息
      showEditInfoModal.value = false;
      alert('个人信息修改成功！');
      // 清空临时头像文件
      tempAvatarFile.value = null;
    } else {
      alert(`修改失败：${response.data.message || '未知错误'}`);
    }
  } catch (error) {
    console.error('更新用户信息失败:', error);
    if (error.response && error.response.data && error.response.data.message) {
      alert(`更新失败：${error.response.data.message}`);
    } else if (error.message) {
      alert(`更新失败：${error.message}`);
    } else {
      alert('更新用户信息失败，请稍后重试');
    }
  } finally {
    loading.value = false;
  }
};

// 工具方法 - 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return '未知时间';
  // 简单格式化，实际项目可使用dayjs等库
  return timeStr;
};

// 工具方法 - 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '未知日期';
  // 转换日期格式为YYYY-MM-DD或更友好的格式
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// 监听编辑弹窗显示，初始化临时数据
watch(showEditInfoModal, (val) => {
  if (val) {
    initTempUserInfo();
  }
});

// 组件挂载时加载用户信息、订单、答题记录和用户活动
onMounted(() => {
  loadUserInfo();
  loadOrders();
  loadAnswerRecords();
  loadUserActivities();
});

// 初始化
initTempUserInfo();
</script>

<style scoped>
/* 基础样式 */
.user-center-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Open Sans', sans-serif;
  background-color: #f8f5f0;
  min-height: 100vh;
  box-sizing: border-box;
}

/* 头部样式 */
.user-center-header {
  background-color: #fff;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.avatar-container {
  position: relative;
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #c8102e;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
}

.user-avatar:hover {
  transform: scale(1.08);
}

.avatar-upload {
  display: none;
}

.user-basic-info {
  color: #333;
}

.user-name {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  color: #c8102e;
}

.user-id {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.user-level {
  font-size: 1.2rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.level-icon {
  font-size: 1.5rem;
}

.header-right {
  display: flex;
  align-items: center;
}

.edit-info-btn {
  background-color: #c8102e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: background-color 0.3s ease-in-out;
}

.edit-info-btn:hover {
  background-color: #a80c24;
}

.edit-icon {
  font-size: 1.4rem;
}

/* 功能导航栏 */
.function-nav {
  display: flex;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-item {
  flex: 1;
  padding: 1.5rem;
  background-color: #f5f5f5;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s ease-in-out;
}

.nav-item.active {
  background-color: #c8102e;
  color: #fff;
}

.nav-item:hover:not(.active) {
  background-color: #fdf2f8;
  color: #c8102e;
}

.nav-icon {
  font-size: 1.8rem;
}

.nav-text {
  font-size: 1.2rem;
}

/* 内容区域通用样式 */
.content-area {
  background-color: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 订单标签页样式 */
.order-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.filter-btn {
  padding: 0.8rem 1.5rem;
  background-color: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  color: #333;
}

.filter-btn.active {
  background-color: #c8102e;
  color: #fff;
  border-color: #c8102e;
}

.filter-btn:hover:not(.active) {
  background-color: #fff;
  border-color: #c8102e;
  color: #c8102e;
  box-shadow: 0 2px 8px rgba(200, 16, 46, 0.15);
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.order-card {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 2rem;
  transition: box-shadow 0.3s ease-in-out;
}

.order-card:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f5f5f5;
}

.order-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.order-no {
  font-size: 1.3rem;
  color: #333;
  font-weight: 600;
}

.order-time {
  font-size: 1.1rem;
  color: #666;
}

.order-right {
  display: flex;
  align-items: center;
}

.order-status {
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
}

.status-pending {
  background-color: #fff7e6;
  color: #ff9a3c;
}

.status-paid {
  background-color: #e6f4ff;
  color: #4096ff;
}

.status-shipped {
  background-color: #e8f4e8;
  color: #52c41a;
}

.status-completed {
  background-color: #f0f8fb;
  color: #1890ff;
}

.status-cancelled {
  background-color: #f9f9f9;
  color: #8c8c8c;
}

.order-goods {
  margin-bottom: 1.5rem;
}

.goods-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f5f5f5;
}

.goods-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
}

.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.goods-name {
  font-size: 1.3rem;
  color: #333;
}

.goods-spec {
  font-size: 1.1rem;
  color: #666;
}

.goods-price {
  font-size: 1.3rem;
  color: #c8102e;
  font-weight: bold;
  min-width: 100px;
  text-align: right;
}

.goods-count {
  font-size: 1.1rem;
  color: #666;
  min-width: 60px;
  text-align: right;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
}

.order-amount {
  font-size: 1.4rem;
  color: #333;
}

.amount {
  color: #c8102e;
  font-weight: bold;
  font-size: 1.5rem;
}

.order-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  padding: 0.7rem 1.2rem;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease-in-out;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #666;
}

.cancel-btn:hover {
  background-color: #eee;
}

.delete-btn {
  background-color: #f5f5f5;
  color: #c8102e;
}

.delete-btn:hover {
  background-color: #ffe6e6;
}

.pay-btn {
  background-color: #c8102e;
  color: #fff;
}

.pay-btn:hover {
  background-color: #a80c24;
}

.confirm-btn {
  background-color: #52c41a;
  color: #fff;
}

.confirm-btn:hover {
  background-color: #43a047;
}

.detail-btn {
  background-color: #4096ff;
  color: #fff;
}

.detail-btn:hover {
  background-color: #1890ff;
}

.empty-order {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 0;
  color: #666;
}

.empty-icon {
  font-size: 6rem;
  margin-bottom: 2rem;
  color: #ccc;
}

.empty-text {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.go-shop-btn {
  padding: 1rem 2rem;
  background-color: #c8102e;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.3rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.go-shop-btn:hover {
  background-color: #a80c24;
}

/* 答题记录标签页样式 */
.answer-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.type-select,
.date-select {
  padding: 0.8rem 1rem;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  font-size: 1.1rem;
  min-width: 200px;
  background-color: #f8f9fa;
  color: #333;
  transition: all 0.3s ease-in-out;
}

.type-select:focus,
.date-select:focus {
  outline: none;
  border-color: #c8102e;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(200, 16, 46, 0.1);
}

.type-select option,
.date-select option {
  background-color: #fff;
  color: #333;
}

.search-btn {
  padding: 0.8rem 1.5rem;
  background-color: #c8102e;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 2px 8px rgba(200, 16, 46, 0.2);
}

.search-btn:hover {
  background-color: #a80c24;
  box-shadow: 0 4px 12px rgba(200, 16, 46, 0.3);
  transform: translateY(-1px);
}

.search-btn:active {
  transform: translateY(0);
}

.answer-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.answer-card {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 2rem;
  transition: box-shadow 0.3s ease-in-out;
}

.answer-card:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.answer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f5f5f5;
}

.answer-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.answer-type {
  font-size: 1.3rem;
  color: #c8102e;
  font-weight: 600;
}

.answer-time {
  font-size: 1.1rem;
  color: #666;
}

.answer-score {
  font-size: 1.4rem;
  color: #333;
}

.score {
  color: #c8102e;
  font-weight: bold;
  font-size: 1.5rem;
}

.answer-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.stats-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stats-label {
  font-size: 1.1rem;
  color: #666;
}

.stats-value {
  font-size: 1.2rem;
  color: #333;
  font-weight: 600;
}

.answer-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.review-btn {
  padding: 0.8rem 1.5rem;
  background-color: #4096ff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.review-btn:hover {
  background-color: #1890ff;
}

.redo-btn {
  padding: 0.8rem 1.5rem;
  background-color: #c8102e;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.redo-btn:hover {
  background-color: #a80c24;
}

.empty-answer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 0;
  color: #666;
}

.go-answer-btn {
  padding: 1rem 2rem;
  background-color: #c8102e;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.3rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.go-answer-btn:hover {
  background-color: #a80c24;
}

/* 活动标签页样式 */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.activity-card {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 2rem;
  transition: box-shadow 0.3s ease-in-out;
}

.activity-card:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f5f5f5;
}

.activity-left {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  flex: 1;
}

.activity-title {
  font-size: 1.5rem;
  color: #c8102e;
  font-weight: 700;
  margin: 0;
}

.activity-time {
  font-size: 1.1rem;
  color: #666;
}

.activity-right {
  display: flex;
  align-items: center;
}

.activity-status {
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
}

.activity-status.status-pending {
  background-color: #fff7e6;
  color: #ff9a3c;
}

.activity-status.status-ongoing {
  background-color: #e8f4e8;
  color: #52c41a;
}

.activity-status.status-completed {
  background-color: #f0f8fb;
  color: #1890ff;
}

.activity-status.status-cancelled {
  background-color: #f9f9f9;
  color: #8c8c8c;
}

.activity-info {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-location {
  font-size: 1.1rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.location-icon {
  font-size: 1.2rem;
}

.activity-description {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
}

.activity-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
}

.activity-organizer {
  font-size: 1.1rem;
  color: #666;
}

.activity-actions {
  display: flex;
  gap: 1rem;
}

.empty-activity {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 0;
  color: #666;
}

.go-activity-btn {
  padding: 1rem 2rem;
  background-color: #c8102e;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.3rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.go-activity-btn:hover {
  background-color: #a80c24;
}

/* 活动标签页样式 */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.activity-card {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 2rem;
  transition: box-shadow 0.3s ease-in-out;
}

.activity-card:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f5f5f5;
}

.activity-left {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  flex: 1;
}

.activity-title {
  font-size: 1.5rem;
  color: #c8102e;
  font-weight: 700;
  margin: 0;
}

.activity-time {
  font-size: 1.1rem;
  color: #666;
}

.activity-right {
  display: flex;
  align-items: center;
}

.activity-status {
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
}

.activity-status.status-pending {
  background-color: #fff7e6;
  color: #ff9a3c;
}

.activity-status.status-ongoing {
  background-color: #e8f4e8;
  color: #52c41a;
}

.activity-status.status-completed {
  background-color: #f0f8fb;
  color: #1890ff;
}

.activity-status.status-cancelled {
  background-color: #f9f9f9;
  color: #8c8c8c;
}

.activity-info {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-location {
  font-size: 1.1rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.location-icon {
  font-size: 1.2rem;
}

.activity-description {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
}

.activity-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
}

.activity-organizer {
  font-size: 1.1rem;
  color: #666;
}

.activity-actions {
  display: flex;
  gap: 1rem;
}

.empty-activity {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 0;
  color: #666;
}

.go-activity-btn {
  padding: 1rem 2rem;
  background-color: #c8102e;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.3rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.go-activity-btn:hover {
  background-color: #a80c24;
}

/* 个人信息标签页样式 */
.info-card {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  padding: 1.5rem 0;
  border-bottom: 1px solid #eee;
}

.info-label {
  width: 150px;
  font-size: 1.3rem;
  color: #333;
  font-weight: 600;
}

.info-value {
  flex: 1;
  font-size: 1.3rem;
  color: #666;
  display: flex;
  align-items: center;
}

.info-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.edit-info-btn-bottom {
  display: block;
  margin: 0 auto;
  padding: 1rem 2rem;
  background-color: #c8102e;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: background-color 0.3s ease-in-out;
}

.edit-info-btn-bottom:hover {
  background-color: #a80c24;
}

/* 编辑信息弹窗样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}

.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 650px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -60%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

.edit-modal {
  padding: 0;
}

.modal-header {
  padding: 2rem;
  background: linear-gradient(135deg, #c8102e 0%, #a80c24 100%);
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(200, 16, 46, 0.3);
}

.modal-title {
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 2rem;
  color: #fff;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.modal-body {
  padding: 2rem;
  background-color: #f5f6f7;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  align-items: start;
}

.form-group {
  margin-bottom: 0;
  background-color: #fff;
  padding: 1.2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease-in-out;
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.form-group:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-label {
  display: block;
  margin-bottom: 0.6rem;
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
  position: relative;
  padding-left: 12px;
}

.form-label::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  background-color: #c8102e;
  border-radius: 2px;
}

.form-input {
  width: 100%;
  max-width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  font-size: 1.1rem;
  transition: all 0.3s ease-in-out;
  background-color: #f8f9fa;
  color: #333;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #c8102e;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(200, 16, 46, 0.1);
}

.form-input::placeholder {
  color: #999;
}

.form-textarea {
  width: 100%;
  max-width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  font-size: 1.1rem;
  min-height: 80px;
  resize: vertical;
  transition: all 0.3s ease-in-out;
  background-color: #f8f9fa;
  color: #333;
  box-sizing: border-box;
}

.form-textarea:focus {
  outline: none;
  border-color: #c8102e;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(200, 16, 46, 0.1);
}

.form-textarea::placeholder {
  color: #999;
}

.avatar-upload-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease-in-out;
}

.avatar-preview:hover {
  transform: scale(1.05);
}

.upload-btn {
  padding: 0.6rem 1.2rem;
  background-color: #fff;
  border: 2px solid #c8102e;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  color: #c8102e;
  font-weight: 600;
}

.upload-btn:hover {
  background-color: #c8102e;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(200, 16, 46, 0.3);
}

.avatar-upload-modal {
  display: none;
}

.gender-select {
  display: flex;
  gap: 0.8rem;
  padding: 0.3rem 0;
  flex-wrap: wrap;
}

.gender-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  border: 1px solid #e8e8e8;
  background-color: #f8f9fa;
  transition: all 0.3s ease-in-out;
  font-size: 1rem;
  color: #333;
}

.gender-option:hover {
  border-color: #c8102e;
  background-color: rgba(200, 16, 46, 0.05);
}

.gender-option:has(input[type="radio"]:checked) {
  border-color: #c8102e;
  background-color: rgba(200, 16, 46, 0.08);
}

.gender-option input[type="radio"] {
  width: 20px;
  height: 20px;
  accent-color: #c8102e;
  cursor: pointer;
}

.gender-option input[type="radio"]:checked + span {
  color: #c8102e;
  font-weight: 600;
}

.gender-option input[type="radio"]:checked {
  background-color: #c8102e;
}

.form-group-full {
  grid-column: 1 / -1;
}

.modal-footer {
  padding: 1.5rem 2rem;
  background-color: #fafafa;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1.2rem;
}

.cancel-btn {
  padding: 1rem 2rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background-color: #fff;
  color: #666;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.3s ease-in-out;
}

.cancel-btn:hover {
  border-color: #c8102e;
  color: #c8102e;
  background-color: rgba(200, 16, 46, 0.05);
  transform: translateY(-2px);
}

.save-btn {
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #c8102e 0%, #a80c24 100%);
  color: #fff;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 700;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 12px rgba(200, 16, 46, 0.3);
}

.save-btn:hover {
  background: linear-gradient(135deg, #a80c24 0%, #900a20 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(200, 16, 46, 0.4);
}

.save-btn:active {
  transform: translateY(0);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .modal-body {
    grid-template-columns: 1fr;
  }

  .user-center-container {
    padding: 1rem;
  }

  .user-center-header {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .header-left {
    gap: 1rem;
    width: 100%;
    justify-content: center;
  }

  .user-avatar {
    width: 80px;
    height: 80px;
  }

  .user-name {
    font-size: 1.5rem;
  }

  .function-nav {
    flex-direction: column;
  }

  .nav-item {
    flex-direction: row;
    justify-content: center;
    padding: 1rem;
  }

  .content-area {
    padding: 1.5rem;
  }

  .order-header,.answer-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }

  .order-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .order-actions {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .answer-stats {
    gap: 1rem;
  }

  .info-item {
    flex-direction: column;
    gap: 0.5rem;
  }

  .info-label {
    width: 100%;
  }

  .avatar-upload-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .gender-select {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .user-center-header {
    padding: 1rem;
  }

  .user-avatar {
    width: 60px;
    height: 60px;
  }

  .user-name {
    font-size: 1.2rem;
  }

  .content-area {
    padding: 1rem;
  }

  .filter-btn {
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
  }

  .goods-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }

  .goods-img {
    width: 60px;
    height: 60px;
  }

  .goods-price,.goods-count {
    text-align: left;
    min-width: auto;
  }

  .modal-content {
    width: 95%;
  }

  .modal-title {
    font-size: 1.1rem;
  }

  .form-input,.form-textarea {
    padding: 0.6rem;
    font-size: 0.9rem;
  }

  .cancel-btn,.save-btn {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
}
</style>