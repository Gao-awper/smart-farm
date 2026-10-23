<template>
  <div class="order-detail-container">
    <div class="order-detail-wrapper">
      <!-- 顶部导航 -->
      <div class="order-detail-header">
        <button class="back-btn" @click="goBack">
          <i class="back-icon">←</i> 返回订单列表
        </button>
        <h2>订单详情</h2>
      </div>

      <!-- 订单信息 -->
      <div class="order-info-section">
        <div class="section-title">订单信息</div>
        <div class="order-basic-info">
          <div class="info-item">
            <span class="info-label">订单编号：</span>
            <span class="info-value">{{ orderDetail.orderNo }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">下单时间：</span>
            <span class="info-value">{{ formatTime(orderDetail.createTime) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">订单状态：</span>
            <span class="info-value status" :class="getStatusClass(orderDetail.status)">
              {{ getStatusText(orderDetail.status) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 收货地址 -->
      <div class="address-section" v-if="orderDetail.address">
        <div class="section-title">收货地址</div>
        <div class="address-info">
          <div class="address-header">
            <span class="receiver-name">{{ orderDetail.address.name }}</span>
            <span class="receiver-phone">{{ orderDetail.address.phone }}</span>
          </div>
          <div class="address-content">
            {{ orderDetail.address.province }}{{ orderDetail.address.city }}{{ orderDetail.address.district }}{{ orderDetail.address.detailAddress }}
          </div>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="goods-section">
        <div class="section-title">商品列表</div>
        <div class="goods-list">
          <div class="goods-item" v-for="goods in orderDetail.goodsList" :key="goods.id">
            <img :src="goods.image || defaultGoodsImg" alt="商品图片" class="goods-img">
            <div class="goods-info">
              <div class="goods-name">{{ goods.name }}</div>
              <div class="goods-spec" v-if="goods.spec">规格：{{ goods.spec }}</div>
            </div>
            <div class="goods-price">¥{{ (goods.price || 0).toFixed(2) }}</div>
            <div class="goods-count">x{{ goods.count || 0 }}</div>
          </div>
        </div>
      </div>

      <!-- 支付信息 -->
      <div class="payment-section">
        <div class="section-title">支付信息</div>
        <div class="payment-info">
          <div class="payment-item">
            <span class="payment-label">支付方式：</span>
            <span class="payment-value">{{ getPaymentText(orderDetail.paymentMethod) }}</span>
          </div>
          <div class="payment-item">
            <span class="payment-label">商品总价：</span>
            <span class="payment-value">¥{{ (orderDetail.totalPrice || 0).toFixed(2) }}</span>
          </div>
          <div class="payment-item">
            <span class="payment-label">运费：</span>
            <span class="payment-value">¥{{ (orderDetail.shippingFee || 0).toFixed(2) }}</span>
          </div>
          <div class="payment-item total">
            <span class="payment-label">实付款：</span>
            <span class="payment-value amount">¥{{ (orderDetail.totalPrice || 0).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- 订单操作按钮 -->
      <div class="order-actions" v-if="orderDetail.status">
        <button class="action-btn cancel-btn" @click="cancelOrder" v-if="orderDetail.status === 'pending'">取消订单</button>
        <button class="action-btn pay-btn" @click="payOrder" v-if="orderDetail.status === 'pending'">立即付款</button>
        <button class="action-btn confirm-btn" @click="confirmReceipt" v-if="orderDetail.status === 'shipped'">确认收货</button>
      </div>

      <!-- 加载状态 -->
      <div class="loading" v-if="loading">
        加载中...
      </div>

      <!-- 错误状态 -->
      <div class="error" v-if="error">
        {{ error }}
        <button class="retry-btn" @click="loadOrderDetail">重试</button>
      </div>
    </div>
  </div> <!-- 补全 order-detail-container 的闭合标签 -->
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { getCurrentUser, isAuthenticated } from '@/utils/auth';

// 调试axios
console.log('axios对象:', axios);
console.log('axios默认配置:', axios.defaults);

const router = useRouter();
const route = useRoute();
console.log('路由对象:', route);
console.log('路由参数:', route.params);
console.log('路由参数类型:', typeof route.params.id);
const orderId = route.params.id;
console.log('获取到的orderId:', orderId);
console.log('orderId类型:', typeof orderId);

// 状态管理
const orderDetail = ref({});
const loading = ref(true); // 初始设置为true，显示加载状态
const error = ref('');

// 默认商品图片
const defaultGoodsImg = 'https://picsum.photos/id/237/100/100';

// 格式化时间
const formatTime = (time) => {
  if (!time) return '';
  const date = new Date(time);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// 获取状态文本
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

// 获取状态样式
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

// 获取支付方式文本
const getPaymentText = (paymentMethod) => {
  const paymentMap = {
    alipay: '支付宝',
    wechat: '微信支付',
    bank: '银行卡支付'
  };
  return paymentMap[paymentMethod] || '其他支付方式';
};

// 返回订单列表
const goBack = () => {
  router.push('/profile');
};

// 加载订单详情
const loadOrderDetail = async () => {
  console.log('开始加载订单详情');
  console.log('当前orderId:', orderId);
  console.log('用户登录状态:', isAuthenticated());

  loading.value = true;
  error.value = '';

  try {
    // 暂时跳过登录检查，直接发送API请求
    // if (!isAuthenticated()) {
    //   console.log('用户未登录，重定向到登录页面');
    //   router.push('/login');
    //   return;
    // }

    console.log('准备发送API请求:', `/api/orders/${orderId}`);

    // 发送真实的API请求获取订单详情
    const response = await axios.get(`/api/orders/${orderId}`);

    console.log('API请求成功，响应数据:', response.data);

    // 检查响应状态
    if (response.data.status === 'success') {
      // 从后端返回的数据中提取订单详情
      const orderData = response.data.data;

      // 确保商品列表存在且为数组
      if (!orderData.goodsList) {
        orderData.goodsList = [];
      }

      // 为商品列表中的商品提供默认值（如果某些字段为null）
      orderData.goodsList = orderData.goodsList.map(goods => ({
        ...goods,
        name: goods.name || '未知商品',
        image: goods.image || defaultGoodsImg,
        price: goods.price || 0.0,
        count: goods.count || 0,
        spec: goods.spec || '默认规格'
      }));

      // 设置订单详情数据
      orderDetail.value = orderData;
    } else {
      // 处理API返回的错误信息
      error.value = response.data.message || '获取订单详情失败';
      console.log('API返回错误:', error.value);
    }
  } catch (err) {
    console.error('加载订单详情失败:', err);
    console.error('错误详情:', err.response ? err.response.data : err.message);
    error.value = '网络错误，请稍后重试';
  } finally {
    loading.value = false;
    console.log('加载订单详情完成');
  }
};

// 取消订单
const cancelOrder = async () => {
  if (confirm('确定要取消该订单吗？')) {
    try {
      const response = await axios.put(`/api/orders/${orderId}/cancel`);
      if (response.data.status === 'success') {
        alert('订单已取消');
        loadOrderDetail(); // 重新加载订单详情
      } else {
        alert('订单取消失败：' + response.data.message);
      }
    } catch (err) {
      console.error('取消订单失败:', err);
      alert('取消订单失败，请稍后重试');
    }
  }
};

// 支付订单
const payOrder = async () => {
  try {
    const response = await axios.put(`/api/orders/${orderId}/pay`);
    if (response.data.status === 'success') {
      alert('订单支付成功');
      loadOrderDetail(); // 重新加载订单详情
    } else {
      alert('订单支付失败：' + response.data.message);
    }
  } catch (err) {
    console.error('支付订单失败:', err);
    alert('支付订单失败，请稍后重试');
  }
};

// 确认收货
const confirmReceipt = async () => {
  if (confirm('确定已收到商品吗？')) {
    try {
      const response = await axios.put(`/api/orders/${orderId}/confirm`);
      if (response.data.status === 'success') {
        alert('已确认收货');
        loadOrderDetail(); // 重新加载订单详情
      } else {
        alert('确认收货失败：' + response.data.message);
      }
    } catch (err) {
      console.error('确认收货失败:', err);
      alert('确认收货失败，请稍后重试');
    }
  }
};

// 初始化加载订单详情
onMounted(() => {
  console.log('组件已挂载，开始调用loadOrderDetail函数');
  loadOrderDetail();
});

// 调试路由参数变化
watch(() => route.params.id, (newId) => {
  console.log('路由参数id变化:', newId);
  if (newId) {
    loadOrderDetail();
  }
});
</script>

<style scoped>
.order-detail-container {
  min-height: 100vh;
  background-color: #f8f5f0;
  font-family: 'SimSun', 'STSong', 'Microsoft YaHei', sans-serif;
  padding-bottom: 2rem;
}

/* 页面主容器，限制最大宽度 */
.order-detail-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 顶部导航 */
.order-detail-header {
  background-color: #c8102e;
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.back-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.back-icon {
  font-size: 1.2rem;
}

.order-detail-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

/* 通用章节样式 */
.section-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.8rem;
  color: #333;
}

.order-info-section,
.address-section,
.goods-section,
.payment-section {
  background-color: white;
  margin: 1rem;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 订单基本信息 */
.order-basic-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
}

.info-label {
  color: #666;
}

.info-value {
  color: #333;
}

.status {
  font-weight: bold;
}

.status-pending {
  color: #ff9800;
}

.status-paid {
  color: #2196f3;
}

.status-shipped {
  color: #4caf50;
}

.status-completed {
  color: #8bc34a;
}

.status-cancelled {
  color: #999;
}

/* 收货地址 */
.address-info {
  padding: 0.8rem;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.address-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.receiver-name {
  font-weight: bold;
}

/* 商品列表 */
.goods-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.goods-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.goods-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.goods-info {
  flex: 1;
}

.goods-name {
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.goods-spec {
  color: #666;
  font-size: 0.9rem;
}

.goods-price {
  font-weight: bold;
  color: #c8102e;
}

.goods-count {
  color: #666;
}

/* 支付信息 */
.payment-info {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.payment-item {
  display: flex;
  justify-content: space-between;
}

.payment-item.total {
  border-top: 1px solid #eee;
  padding-top: 0.8rem;
  font-weight: bold;
}

.amount {
  color: #c8102e;
  font-size: 1.2rem;
}

/* 订单操作按钮 */
.order-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 1rem;
}

.action-btn {
  padding: 0.8rem 2rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.pay-btn {
  background-color: #c8102e;
  color: white;
}

.pay-btn:hover {
  background-color: #a70d25;
}

.confirm-btn {
  background-color: #4caf50;
  color: white;
}

.confirm-btn:hover {
  background-color: #45a049;
}

/* 加载和错误状态 */
.loading,
.error {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.retry-btn {
  background-color: #c8102e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}
</style>