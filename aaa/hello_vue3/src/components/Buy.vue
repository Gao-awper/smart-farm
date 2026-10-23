<template>
  <div class="buy-container">
    <!-- 选项卡切换 -->
    <div class="tab-nav">
      <div class="tab-container">
        <button 
          class="tab-item" 
          :class="{active: activeTab === 'goods'}"
          @click="switchTab('goods')"
        >
          商品浏览
        </button>
        <button 
          class="tab-item" 
          :class="{active: activeTab === 'cart'}"
          @click="switchTab('cart')"
        >
          购物车管理
        </button>
        <button 
          class="tab-item" 
          :class="{active: activeTab === 'checkout'}"
          @click="switchTab('checkout')"
          :disabled="cartList.length === 0"
        >
          下单与支付
        </button>
      </div>
      <div class="header-actions">
        <button class="cart-btn" @click="switchTab('cart')">
          🛒 购物车
          <span class="cart-count" v-if="cartList.length > 0">{{ cartList.length }}</span>
        </button>
        <button class="back-btn" @click="goBack">← 返回首页</button>
      </div>
    </div>

    <!-- 1. 商品浏览板块 -->
    <div class="tab-content" v-show="activeTab === 'goods'">
      <div class="goods-container">
        <!-- 商品筛选 -->
        <div class="goods-filter">
          <div class="filter-group">
            <label class="filter-label">分类：</label>
            <select v-model="activeCategory" class="filter-select">
              <option value="all">全部商品</option>
              <option value="vegetables">新鲜蔬菜</option>
              <option value="fruits">时令水果</option>
              <option value="grains">五谷杂粮</option>
              <option value="processed">加工产品</option>
              <option value="tools">农场工具</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">价格：</label>
            <select v-model="priceRange" class="filter-select">
              <option value="all">全部价格</option>
              <option value="0-100">0-100元</option>
              <option value="100-300">100-300元</option>
              <option value="300-500">300-500元</option>
              <option value="500+">500元以上</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">排序：</label>
            <select v-model="sortType" class="filter-select">
              <option value="default">默认排序</option>
              <option value="price-asc">价格从低到高</option>
              <option value="price-desc">价格从高到低</option>
              <option value="sales">销量优先</option>
            </select>
          </div>
          <div class="search-group">
            <input 
              type="text" 
              v-model="searchKeyword" 
              placeholder="搜索农场产品..." 
              class="search-input"
            >
            <button class="search-btn" @click="searchGoods">搜索</button>
          </div>
        </div>

        <!-- 商品列表 -->
        <div class="goods-list">
          <!-- 无商品提示 -->
          <div class="empty-goods" v-if="filteredGoods.length === 0">
            <div class="empty-icon">📦</div>
            <p>暂无符合条件的商品</p>
          </div>

          <!-- 商品卡片 -->
          <div class="goods-card" v-for="(goods, index) in filteredGoods" :key="index">
            <div class="goods-img-container">
              <img :src="goods.image" alt="goods.name" class="goods-img">
            </div>
            <div class="goods-info">
              <h3 class="goods-name">{{ goods.name }}</h3>
              <div class="goods-tag">{{ goods.tag }}</div>
              <div class="goods-price">¥{{ goods.price.toFixed(2) }}</div>
              <div class="goods-sales">销量：{{ goods.sales }}件</div>
              <div class="goods-stock">库存：{{ goods.stock }}件</div>
              <div class="goods-actions">
                <button class="add-cart-btn" @click="addToCart(goods)">加入购物车</button>
                <button class="buy-now-btn" @click="buyNow(goods)">立即购买</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 购物车管理板块 -->
    <div class="tab-content" v-show="activeTab === 'cart'">
      <div class="cart-container">
        <!-- 无商品提示 -->
        <div class="empty-cart" v-if="cartList.length === 0">
          <div class="empty-icon">🛒</div>
          <p>购物车空空如也，快去挑选心仪的农场产品吧！</p>
          <button class="go-shopping-btn" @click="switchTab('goods')">立即选购</button>
        </div>

        <!-- 购物车列表 -->
        <div class="cart-list" v-else>
          <div class="cart-header">
            <div class="col-select">全选 <input type="checkbox" v-model="selectAll" @change="handleSelectAll"></div>
            <div class="col-goods">商品信息</div>
            <div class="col-price">单价</div>
            <div class="col-count">数量</div>
            <div class="col-total">小计</div>
            <div class="col-op">操作</div>
          </div>

          <div class="cart-item" v-for="(item, index) in cartList" :key="index">
            <div class="col-select">
              <input type="checkbox" v-model="item.checked" @change="calcTotalPrice">
            </div>
            <div class="col-goods">
              <img :src="item.image" alt="item.name" class="cart-goods-img">
              <div class="goods-desc">
                <div class="goods-name">{{ item.name }}</div>
                <div class="goods-tag">{{ item.tag }}</div>
              </div>
            </div>
            <div class="col-price">¥{{ item.price.toFixed(2) }}</div>
            <div class="col-count">
              <button class="count-btn minus" @click="changeCount(item, -1)" :disabled="item.count <= 1">-</button>
              <input type="number" v-model="item.count" min="1" @change="calcTotalPrice" class="count-input">
              <button class="count-btn plus" @click="changeCount(item, 1)">+</button>
            </div>
            <div class="col-total">¥{{ (item.price * item.count).toFixed(2) }}</div>
            <div class="col-op">
              <button class="delete-btn" @click="removeFromCart(index)">删除</button>
            </div>
          </div>

          <!-- 购物车底部 -->
          <div class="cart-footer">
            <div class="select-info">
              已选 {{ selectedCount }} 件商品
            </div>
            <div class="total-price">
              合计：<span class="price-value">¥{{ totalPrice.toFixed(2) }}</span>
            </div>
            <button class="checkout-btn" @click="goToCheckout" :disabled="selectedCount === 0">
              去结算
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 下单与支付板块 -->
    <div class="tab-content" v-show="activeTab === 'checkout'">
      <div class="checkout-container">
        <!-- 收货地址 -->
        <div class="address-section">
          <h3 class="section-title">📦 收货地址</h3>
          <div class="address-list">
            <div 
              class="address-item" 
              v-for="(addr, index) in addressList" 
              :key="index"
              :class="{active: activeAddressId === addr.id}"
              @click="selectAddress(addr.id)"
            >
              <div class="address-name">{{ addr.name }} {{ addr.phone }}</div>
              <div class="address-detail">{{ addr.province }} {{ addr.city }} {{ addr.area }} {{ addr.detail }}</div>
              <div class="default-tag" v-if="addr.isDefault">默认地址</div>
            </div>
            <button class="add-address-btn" @click="showAddAddress = true">+ 添加新地址</button>
          </div>
        </div>

        <!-- 商品清单 -->
        <div class="goods-section">
          <h3 class="section-title">🛍️ 商品清单</h3>
          <div class="checkout-goods-list">
            <div class="checkout-goods-item" v-for="(item, index) in selectedGoods" :key="index">
              <div class="goods-info">
                <img :src="item.image" alt="item.name" class="goods-img">
                <div class="goods-desc">
                  <div class="goods-name">{{ item.name }}</div>
                  <div class="goods-tag">{{ item.tag }}</div>
                </div>
              </div>
              <div class="goods-count">×{{ item.count }}</div>
              <div class="goods-price">¥{{ (item.price * item.count).toFixed(2) }}</div>
            </div>
          </div>
        </div>

        <!-- 支付方式 -->
        <div class="payment-section">
          <h3 class="section-title">💳 支付方式</h3>
          <div class="payment-list">
            <div 
              class="payment-item" 
              v-for="(pay, index) in paymentList" 
              :key="index"
              :class="{active: activePayment === pay.type}"
              @click="selectPayment(pay.type)"
            >
              <div class="payment-icon">{{ pay.icon }}</div>
              <div class="payment-name">{{ pay.name }}</div>
              <div class="payment-check" v-if="activePayment === pay.type">✓</div>
            </div>
          </div>
        </div>

        <!-- 订单结算 -->
        <div class="checkout-footer">
          <div class="order-summary">
            <div class="summary-item">
              <span class="label">商品总价：</span>
              <span class="value">¥{{ totalPrice.toFixed(2) }}</span>
            </div>
            <div class="summary-item">
              <span class="label">运费：</span>
              <span class="value">{{ totalPrice >= 199 ? '包邮' : '¥10.00' }}</span>
            </div>
            <div class="summary-item total">
              <span class="label">实付款：</span>
              <span class="value">¥{{ finalPrice.toFixed(2) }}</span>
            </div>
          </div>
          <button class="pay-btn" @click="submitOrder" :disabled="!activeAddressId || !activePayment">
            提交订单并支付
          </button>
        </div>
      </div>
    </div>

    <!-- 添加地址弹窗 -->
    <div class="modal" v-if="showAddAddress">
      <div class="modal-overlay" @click="showAddAddress = false"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>添加收货地址</h3>
          <button class="close-btn" @click="showAddAddress = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>收货人</label>
            <input type="text" v-model="newAddress.name" placeholder="请输入收货人姓名">
          </div>
          <div class="form-group">
            <label>手机号码</label>
            <input type="tel" v-model="newAddress.phone" placeholder="请输入手机号码">
          </div>
          <div class="form-group">
            <label>所在地区</label>
            <div class="address-select">
              <select v-model="newAddress.province">
                <option value="">请选择省份</option>
                <option value="北京市">北京市</option>
                <option value="上海市">上海市</option>
                <option value="广东省">广东省</option>
                <option value="江苏省">江苏省</option>
                <option value="浙江省">浙江省</option>
              </select>
              <select v-model="newAddress.city">
                <option value="">请选择城市</option>
                <option value="北京市" v-if="newAddress.province === '北京市'">北京市</option>
                <option value="上海市" v-if="newAddress.province === '上海市'">上海市</option>
                <option value="广州市" v-if="newAddress.province === '广东省'">广州市</option>
                <option value="深圳市" v-if="newAddress.province === '广东省'">深圳市</option>
                <option value="南京市" v-if="newAddress.province === '江苏省'">南京市</option>
                <option value="杭州市" v-if="newAddress.province === '浙江省'">杭州市</option>
              </select>
              <select v-model="newAddress.area">
                <option value="">请选择区县</option>
                <option value="朝阳区" v-if="newAddress.city === '北京市'">朝阳区</option>
                <option value="浦东新区" v-if="newAddress.city === '上海市'">浦东新区</option>
                <option value="天河区" v-if="newAddress.city === '广州市'">天河区</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>详细地址</label>
            <input type="text" v-model="newAddress.detail" placeholder="请输入详细地址（街道/小区/门牌号）">
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="newAddress.isDefault">
              设置为默认地址
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showAddAddress = false">取消</button>
          <button class="confirm-btn" @click="saveAddress">保存地址</button>
        </div>
      </div>
    </div>

    <!-- 支付成功弹窗 -->
    <div class="modal" v-if="showPaySuccess">
      <div class="modal-overlay"></div>
      <div class="modal-content success-modal">
        <div class="success-icon">✅</div>
        <h3>支付成功！</h3>
        <p>您的农场产品订单已提交，我们将尽快为您发货</p>
        <div class="success-actions">
          <button class="view-order-btn" @click="viewOrder">查看订单</button>
          <button class="back-home-btn" @click="backHome">返回首页</button>
        </div>
      </div>
    </div>

    <!-- 自定义提示框 -->
    <transition name="toast-fade">
      <div class="toast-container" v-if="toast.show">
        <div class="toast-content" :class="toast.type">
          <div class="toast-header">
            <div class="toast-icon">{{ getToastIcon(toast.type) }}</div>
            <div class="toast-title">{{ getToastTitle(toast.type) }}</div>
            <button class="toast-close" @click="hideToast">×</button>
          </div>
          <div class="toast-body">
            <div class="toast-message">{{ toast.message }}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentUser, isAuthenticated } from '@/utils/auth';
import img1 from '@/components/img/1.png';
const router = useRouter();

// 核心状态
const activeTab = ref('goods'); // 商品/购物车/结算
const showAddAddress = ref(false); // 添加地址弹窗
const showPaySuccess = ref(false); // 支付成功弹窗
const currentOrderId = ref(null); // 当前创建的订单ID


// Toast提示框状态
const toast = ref({
  show: false,
  message: '',
  type: 'success', // success, error, warning, info
  duration: 3000
});
let toastTimer = null;

// 显示Toast提示
const showToast = (message, type = 'success', duration = 3000) => {
  toast.value = {
    show: true,
    message,
    type,
    duration
  };
  
  if (toastTimer) {
    clearTimeout(toastTimer);
  }
  
  toastTimer = setTimeout(() => {
    toast.value.show = false;
  }, duration);
};

// 隐藏Toast提示
const hideToast = () => {
  if (toastTimer) {
    clearTimeout(toastTimer);
  }
  toast.value.show = false;
};

// 获取Toast图标
const getToastIcon = (type) => {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  return icons[type] || icons.info;
};




// 获取Toast标题
const getToastTitle = (type) => {
  const titles = {
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '提示'
  };
  return titles[type] || titles.info;
};

// 1. 商品浏览相关数据
const activeCategory = ref('all'); // 商品分类
const priceRange = ref('all'); // 价格区间
const sortType = ref('default'); // 排序方式
const searchKeyword = ref(''); // 搜索关键词
const goodsList = ref([]); // 商品列表（从API获取）
const loading = ref(false); // 加载状态

// 加载商品列表
const loadGoodsList = async () => {
  loading.value = true;
  try {
    let url = 'http://localhost:5173/api/goods';
    if (activeCategory.value !== 'all') {
      url = `http://localhost:5173/api/goods/category/${activeCategory.value}`;
    }
    const response = await fetch(url);
    const result = await response.json();
    if (result.status === 'success') {
      goodsList.value = result.data.map(item => ({
        ...item,
        price: parseFloat(item.price) // 转换价格为数字类型
      }));
    } else {
      showToast(result.message || '加载商品失败', 'error');
    }
  } catch (error) {
    console.error('加载商品失败:', error);
    showToast('加载商品失败，请检查网络连接', 'error');
  } finally {
    loading.value = false;
  }
};

// 搜索商品
const searchGoods = async () => {
  if (!searchKeyword.value.trim()) {
    loadGoodsList();
    return;
  }
  
  loading.value = true;
  try {
    const url = `http://localhost:5173/api/goods/search?keyword=${encodeURIComponent(searchKeyword.value.trim())}`;
    const response = await fetch(url);
    const result = await response.json();
    if (result.status === 'success') {
      goodsList.value = result.data.map(item => ({
        ...item,
        price: parseFloat(item.price) // 转换价格为数字类型
      }));
    } else {
      showToast(result.message || '搜索商品失败', 'error');
    }
  } catch (error) {
    console.error('搜索商品失败:', error);
    showToast('搜索商品失败，请检查网络连接', 'error');
  } finally {
    loading.value = false;
  }
};

// 分类筛选变化时重新加载商品
watch(activeCategory, () => {
  loadGoodsList();
});

// 组件挂载时加载商品
onMounted(() => {
  loadGoodsList();
});

// 筛选后的商品列表
const filteredGoods = computed(() => {
  let result = [...goodsList.value];
  
  // 分类筛选
  if (activeCategory.value !== 'all') {
    result = result.filter(item => item.category === activeCategory.value);
  }
  
  // 价格筛选
  if (priceRange.value !== 'all') {
    const [min, max] = priceRange.value.split('-');
    result = result.filter(item => {
      if (max) {
        return item.price >= Number(min) && item.price <= Number(max);
      } else {
        return item.price >= Number(min.slice(0, -1));
      }
    });
  }
  
  // 搜索筛选
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(item => 
      item.name.toLowerCase().includes(keyword) || 
      item.tag.toLowerCase().includes(keyword)
    );
  }
  
  // 排序
  switch (sortType.value) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'sales':
      result.sort((a, b) => b.sales - a.sales);
      break;
    default:
      break;
  }
  
  return result;
});

// 2. 购物车相关数据
const cartList = ref([]); // 购物车列表
const selectAll = ref(false); // 全选状态

// 加入购物车
const addToCart = (goods) => {
  const existItem = cartList.value.find(item => item.id === goods.id);
  if (existItem) {
    existItem.count += 1;
  } else {
    cartList.value.push({
      ...goods,
      count: 1,
      checked: true
    });
  }
  calcTotalPrice();
  showToast(`${goods.name} 已加入购物车！`, 'success');
};

// 立即购买
const buyNow = (goods) => {
  cartList.value = [{
    ...goods,
    count: 1,
    checked: true
  }];
  calcTotalPrice();
  switchTab('checkout');
};

// 修改商品数量
const changeCount = (item, num) => {
  item.count += num;
  if (item.count < 1) item.count = 1;
  calcTotalPrice();
};

// 移除购物车商品
const removeFromCart = (index) => {
  cartList.value.splice(index, 1);
  calcTotalPrice();
  checkSelectAll();
};

// 全选/取消全选
const handleSelectAll = () => {
  cartList.value.forEach(item => {
    item.checked = selectAll.value;
  });
  calcTotalPrice();
};

// 检查全选状态
const checkSelectAll = () => {
  if (cartList.value.length === 0) {
    selectAll.value = false;
    return;
  }
  selectAll.value = cartList.value.every(item => item.checked);
};

// 计算选中商品数量
const selectedCount = computed(() => {
  return cartList.value.filter(item => item.checked).reduce((sum, item) => sum + item.count, 0);
});

// 计算总价
const totalPrice = ref(0);
const calcTotalPrice = () => {
  totalPrice.value = cartList.value
    .filter(item => item.checked)
    .reduce((sum, item) => sum + item.price * item.count, 0);
  checkSelectAll();
};

// 3. 下单支付相关数据
const addressList = ref([
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    area: '朝阳区',
    detail: '建国路88号',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '13900139000',
    province: '上海市',
    city: '上海市',
    area: '浦东新区',
    detail: '张江高科技园区',
    isDefault: false
  }
]); // 地址列表

const newAddress = ref({
  name: '',
  phone: '',
  province: '',
  city: '',
  area: '',
  detail: '',
  isDefault: false
}); // 新地址

const paymentList = ref([
  { type: 'wechat', name: '微信支付', icon: '💚' },
  { type: 'alipay', name: '支付宝', icon: '💙' },
  { type: 'bank', name: '银行卡支付', icon: '💳' } // 修改为bank与后端匹配
]); // 支付方式

const activeAddressId = ref(addressList.value.find(addr => addr.isDefault)?.id || null); // 选中地址，确保是数字类型
const activePayment = ref(''); // 选中支付方式

// 选中地址
const selectAddress = (id) => {
  activeAddressId.value = id;
};

// 保存地址
const saveAddress = () => {
  if (!newAddress.value.name || !newAddress.value.phone || !newAddress.value.province || !newAddress.value.city || !newAddress.value.area || !newAddress.value.detail) {
    showToast('请填写完整的地址信息！', 'warning');
    return;
  }
  
  const newId = Date.now();
  // 取消原有默认地址
  if (newAddress.value.isDefault) {
    addressList.value.forEach(addr => {
      addr.isDefault = false;
    });
  }
  
  addressList.value.push({
    id: newId,
    ...newAddress.value
  });
  
  // 选中新地址
  activeAddressId.value = newId;
  
  // 重置表单
  newAddress.value = {
    name: '',
    phone: '',
    province: '',
    city: '',
    area: '',
    detail: '',
    isDefault: false
  };
  
  showAddAddress.value = false;
  showToast('地址添加成功！', 'success');
};

// 选中支付方式
const selectPayment = (type) => {
  activePayment.value = type;
};

// 选中的商品（结算用）
const selectedGoods = computed(() => {
  return cartList.value.filter(item => item.checked);
});

// 最终价格（含运费）
const finalPrice = computed(() => {
  const freight = totalPrice.value >= 199 ? 0 : 10;
  return totalPrice.value + freight;
});

// 去结算
const goToCheckout = () => {
  if (selectedCount.value === 0) {
    showToast('请选择要结算的商品！', 'warning');
    return;
  }
  switchTab('checkout');
};

// 提交订单并支付
const submitOrder = async () => {
  // 检查用户是否已登录
  if (!isAuthenticated()) {
    showToast('请先登录！', 'warning');
    router.push('/login');
    return;
  }
  
  // 获取当前用户信息
  const currentUser = getCurrentUser();
  
  if (!activeAddressId.value) {
    showToast('请选择收货地址！', 'warning');
    return;
  }
  if (!activePayment.value) {
    showToast('请选择支付方式！', 'warning');
    return;
  }
  
  // 构造订单数据
  const address = addressList.value.find(addr => addr.id === activeAddressId.value);
  const orderData = {
    userId: currentUser.id, // 从登录状态获取用户ID
    totalPrice: finalPrice.value,
    shippingFee: finalPrice.value >= 199 ? 0 : 10, // 运费逻辑
    paymentMethod: activePayment.value, // 支付方式
    addressId: activeAddressId.value, // 传递地址ID而不是完整地址对象
    goodsList: selectedGoods.value.map(item => ({
      goodsId: item.id, // 商品ID
      name: item.name, // 商品名称，与后端OrderGoods实体类name字段匹配
      price: item.price, // 商品价格，与后端OrderGoods实体类price字段匹配
      count: item.count, // 商品数量，与后端OrderGoods实体类count字段匹配
      image: item.image, // 商品图片，与后端OrderGoods实体类image字段匹配
      spec: item.spec || '' // 商品规格，与后端OrderGoods实体类spec字段匹配
    }))
  };
  
  try {
    // 调用后端API创建订单
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    if (result.status === 'success') {
      // 保存订单ID
      currentOrderId.value = result.data.id;
      
      // 订单创建成功后模拟支付流程
      setTimeout(() => {
        showPaySuccess.value = true;
        // 清空购物车已结算商品
        cartList.value = cartList.value.filter(item => !item.checked);
        calcTotalPrice();
      }, 1500);
    } else {
      showToast('订单创建失败：' + result.message, 'error');
    }
  } catch (error) {
    console.error('创建订单失败:', error);
    showToast('创建订单失败，请检查网络连接', 'error');
  }
};

// 辅助方法
// 切换选项卡
const switchTab = (tab) => {
  activeTab.value = tab;
  // 切换到结算页时自动计算总价
  if (tab === 'checkout') {
    calcTotalPrice();
    // 默认选中第一个支付方式
    if (!activePayment.value && paymentList.value.length > 0) {
      activePayment.value = paymentList.value[0].type;
    }
  }
};

// 返回首页
const goBack = () => {
  router.push('/');
};

// 查看订单
const viewOrder = () => {
  showPaySuccess.value = false;
  if (currentOrderId.value) {
    router.push(`/order/${currentOrderId.value}`);
  } else {
    // 如果没有当前订单ID，跳转到个人中心的订单列表
    router.push('/profile');
  }
};

// 支付成功后返回首页
const backHome = () => {
  showPaySuccess.value = false;
  router.push('/');
};

// 监听购物车变化，检查全选状态
watch(cartList, () => {
  checkSelectAll();
}, { deep: true });

// 初始化
calcTotalPrice();
</script>

<style scoped>
/* 基础样式 */
.buy-container {
  min-height: 100vh;
  background-color: #f8f5f0;
  font-family: 'SimSun', 'STSong', 'Microsoft YaHei', sans-serif;
}

/* 选项卡导航 */
.tab-nav {
  background-color: white;
  border-bottom: 1px solid #eee;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tab-container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  flex: 1;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.cart-btn {
  background: rgba(200, 16, 46, 0.1);
  border: 1px solid #c8102e;
  color: #c8102e;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.cart-btn:hover {
  background-color: #c8102e;
  color: white;
}

.cart-count {
  background-color: #c8102e;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}

.back-btn {
  background: none;
  border: 1px solid #ddd;
  color: #666;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background-color: #f5f5f5;
  color: #c8102e;
  border-color: #c8102e;
}

.tab-item {
  padding: 1rem 2rem;
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: color 0.3s;
}

.tab-item.active {
  color: #c8102e;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #c8102e;
}

.tab-item:hover:not(:disabled) {
  color: #c8102e;
}

.tab-item:disabled {
  color: #ccc;
  cursor: not-allowed;
}

/* 选项卡内容容器 */
.tab-content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* 1. 商品浏览样式 */
.goods-filter {
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
  color: #666;
  font-size: 0.95rem;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
}

.search-group {
  display: flex;
  margin-left: auto;
  flex: 1;
  max-width: 300px;
}

.search-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 0.95rem;
}

.search-btn {
  background-color: #c8102e;
  color: white;
  border: none;
  padding: 0 1rem;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.goods-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.empty-goods, .empty-cart {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  color: #999;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.goods-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.goods-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(200, 16, 46, 0.12);
}

.goods-img-container {
  height: 200px;
  overflow: hidden;
}

.goods-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.goods-card:hover .goods-img {
  transform: scale(1.05);
}

.goods-info {
  padding: 1rem;
}

.goods-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods-tag {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background-color: #fdf2f8;
  color: #c8102e;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.goods-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #c8102e;
  margin-bottom: 0.5rem;
}

.goods-sales {
  font-size: 0.85rem;
  color: #999;
  margin-bottom: 0.5rem;
}

.goods-stock {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 1rem;
}

.goods-actions {
  display: flex;
  gap: 0.5rem;
}

.add-cart-btn {
  flex: 1;
  background-color: #f5f5f5;
  color: #c8102e;
  border: 1px solid #c8102e;
  border-radius: 4px;
  padding: 0.6rem;
  cursor: pointer;
  transition: all 0.3s;
}

.add-cart-btn:hover {
  background-color: #c8102e;
  color: white;
}

.buy-now-btn {
  flex: 1;
  background-color: #c8102e;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.6rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.buy-now-btn:hover {
  background-color: #a80c24;
}

/* 2. 购物车管理样式 */
.cart-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.go-shopping-btn {
  background-color: #c8102e;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.8rem 1.5rem;
  margin-top: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.go-shopping-btn:hover {
  background-color: #a80c24;
}

.cart-header {
  display: flex;
  padding: 1rem;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
  font-weight: bold;
  color: #666;
}

.cart-item {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.cart-item:last-child {
  border-bottom: none;
}

.col-select {
  width: 60px;
  text-align: center;
}

.col-goods {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cart-goods-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.goods-desc {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.col-price {
  width: 100px;
  text-align: center;
  color: #333;
}

.col-count {
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.count-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.count-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.count-input {
  width: 40px;
  height: 30px;
  text-align: center;
  border: none;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  outline: none;
}

.col-total {
  width: 100px;
  text-align: center;
  color: #c8102e;
  font-weight: bold;
}

.col-op {
  width: 80px;
  text-align: center;
}

.delete-btn {
  color: #ff4d4f;
  border: none;
  background: none;
  cursor: pointer;
}

.delete-btn:hover {
  text-decoration: underline;
}

.cart-footer {
  display: flex;
  padding: 1rem;
  background-color: #f9f9f9;
  align-items: center;
  justify-content: space-between;
}

.select-info {
  color: #666;
}

.total-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #c8102e;
}

.checkout-btn {
  background-color: #c8102e;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.checkout-btn:hover:not(:disabled) {
  background-color: #a80c24;
}

.checkout-btn:disabled {
  background-color: #d94457;
  cursor: not-allowed;
}

/* 3. 下单与支付样式 */
.checkout-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-title {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.address-section, .goods-section, .payment-section {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.address-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.address-item {
  flex: 1;
  min-width: 280px;
  padding: 1rem;
  border: 2px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.3s;
  position: relative;
}

.address-item.active {
  border-color: #c8102e;
  background-color: #fef7fb;
}

.address-name {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.address-detail {
  color: #666;
  margin-bottom: 0.5rem;
}

.default-tag {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #c8102e;
  color: white;
  font-size: 0.8rem;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
}

.add-address-btn {
  flex: 1;
  min-width: 280px;
  padding: 1rem;
  border: 2px dashed #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  cursor: pointer;
  color: #666;
  transition: all 0.3s;
}

.add-address-btn:hover {
  border-color: #c8102e;
  color: #c8102e;
}

.checkout-goods-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.checkout-goods-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.checkout-goods-item:last-child {
  border-bottom: none;
}

.checkout-goods-item .goods-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.checkout-goods-item .goods-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.checkout-goods-item .goods-count {
  width: 80px;
  text-align: center;
  color: #666;
}

.checkout-goods-item .goods-price {
  width: 100px;
  text-align: center;
  color: #c8102e;
  font-weight: bold;
}

.payment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.payment-item {
  flex: 1;
  min-width: 200px;
  padding: 1.5rem;
  border: 2px solid #eee;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-item.active {
  border-color: #c8102e;
  background-color: #fef7fb;
}

.payment-icon {
  font-size: 1.5rem;
}

.payment-name {
  font-size: 1.1rem;
  font-weight: 500;
}

.payment-check {
  color: #c8102e;
  font-size: 1.2rem;
  font-weight: bold;
}

.checkout-footer {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-summary {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: flex-end;
}

.summary-item {
  display: flex;
  gap: 1rem;
  font-size: 1.1rem;
}

.summary-item.total {
  font-size: 1.3rem;
  font-weight: bold;
  color: #c8102e;
  margin-top: 0.5rem;
}

.pay-btn {
  width: 100%;
  background-color: #c8102e;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pay-btn:hover:not(:disabled) {
  background-color: #a80c24;
}

.pay-btn:disabled {
  background-color: #d94457;
  cursor: not-allowed;
}

/* 弹窗样式 */
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
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
}

.close-btn:hover {
  color: #c8102e;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.address-select {
  display: flex;
  gap: 0.5rem;
}

.address-select select {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn {
  padding: 0.8rem 1.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f5f5f5;
  cursor: pointer;
}

.confirm-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: #c8102e;
  color: white;
  cursor: pointer;
}

.confirm-btn:hover {
  background-color: #a80c24;
}

/* 支付成功弹窗 */
.success-modal {
  max-width: 400px;
  text-align: center;
  padding: 2rem;
}

.success-icon {
  font-size: 5rem;
  color: #52c41a;
  margin-bottom: 1rem;
}

.success-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.view-order-btn, .back-home-btn {
  flex: 1;
  padding: 0.8rem;
  border-radius: 4px;
  cursor: pointer;
}

.view-order-btn {
  border: 1px solid #c8102e;
  color: #c8102e;
  background: none;
}

.back-home-btn {
  border: none;
  background-color: #c8102e;
  color: white;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .tab-nav {
    padding: 0 1rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .tab-container {
    width: 100%;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .tab-item {
    padding: 1rem 1.2rem;
    font-size: 1rem;
  }

  .tab-content {
    padding: 1rem;
  }

  .goods-filter {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-group {
    margin-left: 0;
    width: 100%;
    max-width: none;
  }

  .cart-header, .cart-item {
    flex-wrap: wrap;
  }

  .col-select {
    width: 100%;
    text-align: left;
    margin-bottom: 1rem;
  }

/* Toast提示框样式 */
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  max-width: 420px;
}

.toast-content {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 320px;
  max-width: 420px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: toastSlideIn 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  overflow: hidden;
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toast-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.toast-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.toast-title {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.toast-close {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #909399;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  padding: 0;
  flex-shrink: 0;
}

.toast-close:hover {
  background: #f5f7fa;
  color: #606266;
}

.toast-body {
  padding: 12px 20px 16px 20px;
}

.toast-message {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  word-break: break-word;
}

/* Toast类型样式 */
.toast-content.success {
  border-left: 4px solid #67c23a;
}

.toast-content.success .toast-icon {
  color: #67c23a;
}

.toast-content.success .toast-title {
  color: #67c23a;
}

.toast-content.error {
  border-left: 4px solid #f56c6c;
}

.toast-content.error .toast-icon {
  color: #f56c6c;
}

.toast-content.error .toast-title {
  color: #f56c6c;
}

.toast-content.warning {
  border-left: 4px solid #e6a23c;
}

.toast-content.warning .toast-icon {
  color: #e6a23c;
}

.toast-content.warning .toast-title {
  color: #e6a23c;
}

.toast-content.info {
  border-left: 4px solid #909399;
}

.toast-content.info .toast-icon {
  color: #909399;
}

.toast-content.info .toast-title {
  color: #909399;
}

/* Toast过渡动画 */
.toast-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* 移动端Toast样式 */
@media (max-width: 768px) {
  .toast-container {
    top: auto;
    bottom: 24px;
    right: 50%;
    transform: translateX(50%);
    left: 24px;
    max-width: none;
  }

  .toast-content {
    min-width: 280px;
    max-width: calc(100vw - 48px);
    animation: toastSlideUp 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }

  @keyframes toastSlideUp {
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .toast-fade-enter-from {
    transform: translateY(100%);
  }

  .toast-fade-leave-to {
    transform: translateY(100%);
  }
}

  .col-goods {
    width: 100%;
    margin-bottom: 1rem;
  }

  .col-price, .col-count, .col-total, .col-op {
    width: 25%;
  }

  .address-item, .add-address-btn {
    min-width: 100%;
  }

  .payment-item {
    min-width: 100%;
  }
}

@media (max-width: 480px) {
  .header-actions {
    flex-wrap: wrap;
  }

  .cart-btn, .back-btn {
    flex: 1;
    padding: 0.5rem;
    font-size: 0.9rem;
    text-align: center;
  }

  .goods-list {
    grid-template-columns: 1fr;
  }

  .checkout-goods-item {
    flex-wrap: wrap;
  }

  .checkout-goods-item .goods-count, .checkout-goods-item .goods-price {
    width: 50%;
    text-align: left;
    margin-top: 0.5rem;
  }

  .success-actions {
    flex-direction: column;
  }
}

   /* 基础样式 */
 .buy-container {
   min-height: 100vh;
   background-color: #f8f5f0;
   font-family: 'SimSun', 'STSong', 'Microsoft YaHei', sans-serif;
 }

/* 选项卡导航 */
.tab-nav {
  background-color: white;
  border-bottom: 1px solid #eee;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tab-container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  flex: 1;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.cart-btn {
  background: rgba(200, 16, 46, 0.1);
  border: 1px solid #c8102e;
  color: #c8102e;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.cart-btn:hover {
  background-color: #c8102e;
  color: white;
}

.cart-count {
  background-color: #c8102e;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}

.back-btn {
  background: none;
  border: 1px solid #ddd;
  color: #666;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background-color: #f5f5f5;
  color: #c8102e;
  border-color: #c8102e;
}

.tab-item {
  padding: 1rem 2rem;
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: color 0.3s;
}

.tab-item.active {
  color: #c8102e;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #c8102e;
}

.tab-item:hover:not(:disabled) {
  color: #c8102e;
}

.tab-item:disabled {
  color: #ccc;
  cursor: not-allowed;
}

/* 选项卡内容容器 */
.tab-content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* 1. 商品浏览样式 */
.goods-filter {
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
  color: #666;
  font-size: 0.95rem;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
}

.search-group {
  display: flex;
  margin-left: auto;
  flex: 1;
  max-width: 300px;
}

.search-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 0.95rem;
}

.search-btn {
  background-color: #c8102e;
  color: white;
  border: none;
  padding: 0 1rem;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.goods-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.empty-goods, .empty-cart {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  color: #999;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.goods-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.goods-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(200, 16, 46, 0.12);
}

.goods-img-container {
  height: 200px;
  overflow: hidden;
}

.goods-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.goods-card:hover .goods-img {
  transform: scale(1.05);
}

.goods-info {
  padding: 1rem;
}

.goods-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods-tag {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background-color: #fdf2f8;
  color: #c8102e;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.goods-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #c8102e;
  margin-bottom: 0.5rem;
}

.goods-sales {
  font-size: 0.85rem;
  color: #999;
  margin-bottom: 0.5rem;
}

.goods-stock {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 1rem;
}

.goods-actions {
  display: flex;
  gap: 0.5rem;
}

.add-cart-btn {
  flex: 1;
  background-color: #f5f5f5;
  color: #c8102e;
  border: 1px solid #c8102e;
  border-radius: 4px;
  padding: 0.6rem;
  cursor: pointer;
  transition: all 0.3s;
}

.add-cart-btn:hover {
  background-color: #c8102e;
  color: white;
}

.buy-now-btn {
  flex: 1;
  background-color: #c8102e;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.6rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.buy-now-btn:hover {
  background-color: #a80c24;
}

/* 2. 购物车管理样式 */
.cart-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.go-shopping-btn {
  background-color: #c8102e;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.8rem 1.5rem;
  margin-top: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.go-shopping-btn:hover {
  background-color: #a80c24;
}

.cart-header {
  display: flex;
  padding: 1rem;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
  font-weight: bold;
  color: #666;
}

.cart-item {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.cart-item:last-child {
  border-bottom: none;
}

.col-select {
  width: 60px;
  text-align: center;
}

.col-goods {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cart-goods-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.goods-desc {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.col-price {
  width: 100px;
  text-align: center;
  color: #333;
}

.col-count {
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.count-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.count-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.count-input {
  width: 40px;
  height: 30px;
  text-align: center;
  border: none;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  outline: none;
}

.col-total {
  width: 100px;
  text-align: center;
  color: #c8102e;
  font-weight: bold;
}

.col-op {
  width: 80px;
  text-align: center;
}

.delete-btn {
  color: #ff4d4f;
  border: none;
  background: none;
  cursor: pointer;
}

.delete-btn:hover {
  text-decoration: underline;
}

.cart-footer {
  display: flex;
  padding: 1rem;
  background-color: #f9f9f9;
  align-items: center;
  justify-content: space-between;
}

.select-info {
  color: #666;
}

.total-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #c8102e;
}

.checkout-btn {
  background-color: #c8102e;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.checkout-btn:hover:not(:disabled) {
  background-color: #a80c24;
}

.checkout-btn:disabled {
  background-color: #d94457;
  cursor: not-allowed;
}

/* 3. 下单与支付样式 */
.checkout-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-title {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.address-section, .goods-section, .payment-section {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.address-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.address-item {
  flex: 1;
  min-width: 280px;
  padding: 1rem;
  border: 2px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.3s;
  position: relative;
}

.address-item.active {
  border-color: #c8102e;
  background-color: #fef7fb;
}

.address-name {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.address-detail {
  color: #666;
  margin-bottom: 0.5rem;
}

.default-tag {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #c8102e;
  color: white;
  font-size: 0.8rem;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
}

.add-address-btn {
  flex: 1;
  min-width: 280px;
  padding: 1rem;
  border: 2px dashed #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  cursor: pointer;
  color: #666;
  transition: all 0.3s;
}

.add-address-btn:hover {
  border-color: #c8102e;
  color: #c8102e;
}

.checkout-goods-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.checkout-goods-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.checkout-goods-item:last-child {
  border-bottom: none;
}

.checkout-goods-item .goods-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.checkout-goods-item .goods-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.checkout-goods-item .goods-count {
  width: 80px;
  text-align: center;
  color: #666;
}

.checkout-goods-item .goods-price {
  width: 100px;
  text-align: center;
  color: #c8102e;
  font-weight: bold;
}

.payment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.payment-item {
  flex: 1;
  min-width: 200px;
  padding: 1.5rem;
  border: 2px solid #eee;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-item.active {
  border-color: #c8102e;
  background-color: #fef7fb;
}

.payment-icon {
  font-size: 1.5rem;
}

.payment-name {
  font-size: 1.1rem;
  font-weight: 500;
}

.payment-check {
  color: #c8102e;
  font-size: 1.2rem;
  font-weight: bold;
}

.checkout-footer {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-summary {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: flex-end;
}

.summary-item {
  display: flex;
  gap: 1rem;
  font-size: 1.1rem;
}

.summary-item.total {
  font-size: 1.3rem;
  font-weight: bold;
  color: #c8102e;
  margin-top: 0.5rem;
}

.pay-btn {
  width: 100%;
  background-color: #c8102e;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pay-btn:hover:not(:disabled) {
  background-color: #a80c24;
}

.pay-btn:disabled {
  background-color: #d94457;
  cursor: not-allowed;
}

/* 弹窗样式 */
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
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
}

.close-btn:hover {
  color: #c8102e;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.address-select {
  display: flex;
  gap: 0.5rem;
}

.address-select select {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn {
  padding: 0.8rem 1.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f5f5f5;
  cursor: pointer;
}

.confirm-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: #c8102e;
  color: white;
  cursor: pointer;
}

.confirm-btn:hover {
  background-color: #a80c24;
}

/* 支付成功弹窗 */
.success-modal {
  max-width: 400px;
  text-align: center;
  padding: 2rem;
}

.success-icon {
  font-size: 5rem;
  color: #52c41a;
  margin-bottom: 1rem;
}

.success-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.view-order-btn, .back-home-btn {
  flex: 1;
  padding: 0.8rem;
  border-radius: 4px;
  cursor: pointer;
}

.view-order-btn {
  border: 1px solid #c8102e;
  color: #c8102e;
  background: none;
}

.back-home-btn {
  border: none;
  background-color: #c8102e;
  color: white;
}

/* ========== 美化后的Toast提示框样式 ========== */
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  max-width: 420px;
  /* 增加堆叠间距，多个Toast时不重叠 */
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toast-content {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 320px;
  max-width: 420px;
  border-radius: 12px; /* 增大圆角，更柔和 */
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08); /* 增强阴影，更有层次感 */
  animation: toastSlideIn 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  overflow: hidden;
  /* 增加轻微内边距，避免内容贴边 */
  padding: 2px;
}

/* 新增：Toast背景渐变（根据类型区分），提升质感 */
.toast-content.success {
  background: linear-gradient(135deg, #f6ffed 0%, #ffffff 100%);
}
.toast-content.error {
  background: linear-gradient(135deg, #fff2f0 0%, #ffffff 100%);
}
.toast-content.warning {
  background: linear-gradient(135deg, #fffbe6 0%, #ffffff 100%);
}
.toast-content.info {
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(100%) translateY(-20px); /* 增加y轴偏移，动画更自然 */
  }
  to {
    opacity: 1;
    transform: translateX(0) translateY(0);
  }
}

.toast-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.toast-icon {
  font-size: 24px; /* 增大图标，更醒目 */
  flex-shrink: 0;
  /* 增加图标背景，突出显示 */
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-title {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.toast-close {
  width: 28px; /* 增大关闭按钮点击区域 */
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #909399;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  border-radius: 6px; /* 增大圆角 */
  transition: all 0.2s ease;
  padding: 0;
  flex-shrink: 0;
}

.toast-close:hover {
  background: #f0f0f0;
  color: #606266;
  transform: scale(1.1); /*  hover时轻微放大，增加交互反馈 */
}

.toast-body {
  padding: 12px 20px 16px;
}

.toast-message {
  font-size: 14px;
  color: #606266;
  line-height: 1.7; /* 增大行高，更易阅读 */
  word-break: break-word;
}

/* Toast类型样式（优化配色和细节） */
.toast-content.success {
  border-left: 6px solid #67c23a; /* 增粗左侧色条 */
}
.toast-content.success .toast-icon {
  color: #67c23a;
  background: rgba(103, 194, 58, 0.1); /* 新增图标背景 */
}
.toast-content.success .toast-title {
  color: #52c41a; /* 加深标题颜色 */
}

.toast-content.error {
  border-left: 6px solid #f56c6c;
}
.toast-content.error .toast-icon {
  color: #f56c6c;
  background: rgba(245, 108, 108, 0.1);
}
.toast-content.error .toast-title {
  color: #ff4d4f;
}

.toast-content.warning {
  border-left: 6px solid #e6a23c;
}
.toast-content.warning .toast-icon {
  color: #e6a23c;
  background: rgba(230, 162, 60, 0.1);
}
.toast-content.warning .toast-title {
  color: #faad14;
}

.toast-content.info {
  border-left: 6px solid #909399;
}
.toast-content.info .toast-icon {
  color: #909399;
  background: rgba(144, 147, 153, 0.1);
}
.toast-content.info .toast-title {
  color: #606266;
}

/* Toast过渡动画（优化曲线，更流畅） */
.toast-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-fade-enter-from {
  opacity: 0;
  transform: translateX(100%) translateY(-20px);
}
.toast-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.75, 0, 0.85, 0);
}
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(100%) translateY(-20px);
}

/* 移动端Toast样式（优化适配） */
@media (max-width: 768px) {
  .toast-container {
    top: auto;
    bottom: 24px;
    right: 50%;
    transform: translateX(50%);
    left: 24px;
    max-width: none;
    align-items: center;
  }

  .toast-content {
    min-width: 280px;
    max-width: calc(100vw - 48px);
    animation: toastSlideUp 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }

  @keyframes toastSlideUp {
    from {
      opacity: 0;
      transform: translateY(100%) translateX(50%);
    }
    to {
      opacity: 1;
      transform: translateY(0) translateX(50%);
    }
  }

  .toast-fade-enter-from {
    transform: translateY(100%) translateX(50%);
  }

  .toast-fade-leave-to {
    transform: translateY(100%) translateX(50%);
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .tab-nav {
    padding: 0 1rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .tab-container {
    width: 100%;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .tab-item {
    padding: 1rem 1.2rem;
    font-size: 1rem;
  }

  .tab-content {
    padding: 1rem;
  }

  .goods-filter {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-group {
    margin-left: 0;
    width: 100%;
    max-width: none;
  }

  .cart-header, .cart-item {
    flex-wrap: wrap;
  }

  .col-select {
    width: 100%;
    text-align: left;
    margin-bottom: 1rem;
  }

  .col-goods {
    width: 100%;
    margin-bottom: 1rem;
  }

  .col-price, .col-count, .col-total, .col-op {
    width: 25%;
  }

  .address-item, .add-address-btn {
    min-width: 100%;
  }

  .payment-item {
    min-width: 100%;
  }
}

@media (max-width: 480px) {
  .header-actions {
    flex-wrap: wrap;
  }

  .cart-btn, .back-btn {
    flex: 1;
    padding: 0.5rem;
    font-size: 0.9rem;
    text-align: center;
  }

  .goods-list {
    grid-template-columns: 1fr;
  }

  .checkout-goods-item {
    flex-wrap: wrap;
  }

  .checkout-goods-item .goods-count, .checkout-goods-item .goods-price {
    width: 50%;
    text-align: left;
    margin-top: 0.5rem;
  }

  .success-actions {
    flex-direction: column;
  }
}
</style>