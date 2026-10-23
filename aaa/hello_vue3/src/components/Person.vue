<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="logo-container">
        <img src="https://picsum.photos/id/1/40/40" alt="Logo" class="logo">
        <div class="site-name">
          <span>中国非物质文化遗产网</span>
          <span>中国非物质文化遗产数字博物馆</span>
        </div>
      </div>
      
      <div class="header-controls">
        <button class="icon-btn">🔍</button>
        <button class="icon-btn">📹</button>
        <button class="icon-btn">📤</button>
        <div class="date-info">2025-11-22 星期六 农历十月初三</div>
        <button class="user-btn">👤</button>
      </div>
    </header>
    
    <!-- 导航菜单 -->
    <nav class="main-nav">
    <ul>
      <!-- 点击li触发setActiveNav方法，传入菜单名称 -->
      <li @click="setActiveNav('首页')" :class="{active: activeNav === '首页'}">首页</li>
      <li @click="setActiveNav('机构')" :class="{active: activeNav === '机构'}">机构</li>
      <li @click="setActiveNav('政策')" :class="{active: activeNav === '政策'}">政策</li>
      <li @click="setActiveNav('资讯')" :class="{active: activeNav === '资讯'}">资讯</li>
      <li @click="setActiveNav('清单')" :class="{active: activeNav === '清单'}">清单</li>
      <li @click="setActiveNav('资源')" :class="{active: activeNav === '资源'}">资源</li>
      <li @click="setActiveNav('学术')" :class="{active: activeNav === '学术'}">学术</li>
      <li @click="setActiveNav('百科')" :class="{active: activeNav === '百科'}">百科</li>
    </ul>
    </nav>
    
    <!-- 主横幅 -->
    <section class="hero-banner">
      <div class="banner-content">
        <div class="left-decoration">
          <div class="couplet">初一拜大年</div>
          <div class="couplet">初二回娘家</div>
          <div class="couplet">初三贴赤口</div>
        </div>
        
        <div class="center-content">
          <h1 class="chinese-new-year">春节</h1>
          <p class="sub-title">中国人庆祝传统新年的社会实践</p>
          <p class="highlight-text">列入人类非物质文化遗产代表作名录</p>
        </div>
        
        <div class="right-image">
          <img src="https://picsum.photos/id/237/600/400" alt="春节庆祝活动">
        </div>
      </div>
      
      <div class="lanterns-decoration">
        <div class="lantern"></div>
        <div class="lantern"></div>
        <div class="lantern"></div>
        <div class="lantern"></div>
        <div class="lantern"></div>
      </div>
      
      <div class="pattern-decoration">
        <div class="pattern"></div>
        <div class="pattern"></div>
        <div class="pattern"></div>
        <div class="pattern"></div>
        <div class="pattern"></div>
        <div class="pattern"></div>
      </div>
    </section>
    
    <!-- 页面内容区域 -->
    <main class="main-content">
      <!-- 内容板块1：春节简介 -->
      <section class="intro-section">
        <h2 class="section-title">春节简介</h2>
        <div class="section-content">
          <p>春节，即中国农历新年，俗称新春、新岁、岁旦等，口头上又称过年、过大年。春节历史悠久，由上古时代岁首祈岁祭祀演变而来。万物本乎天、人本乎祖，祈岁祭祀、敬天法祖，报本反始也。</p>
          <p>春节的起源蕴含着深邃的文化内涵，在传承发展中承载了丰厚的历史文化底蕴。在春节期间，全国各地均有举行各种庆贺新春的活动，带有浓郁的各地域特色。这些活动以除旧布新、驱邪攘灾、拜神祭祖、纳福祈年为主要内容，形式丰富多彩，凝聚着中华传统文化精华。</p>
        </div>
      </section>
      
      <!-- 内容板块2：传统习俗 -->
      <section class="customs-section">
        <h2 class="section-title">传统习俗</h2>
        <div class="customs-grid">
          <div class="customs-item">
            <img src="https://picsum.photos/id/292/300/200" alt="贴春联">
            <h3>贴春联</h3>
            <p>春联，又叫“春贴”、“门对”、“对联”，是过年时所贴的红色喜庆元素“年红”中一个种类。</p>
          </div>
          <div class="customs-item">
            <img src="https://picsum.photos/id/431/300/200" alt="守岁">
            <h3>守岁</h3>
            <p>守岁，又称守岁火、照岁等，其由来已久，是中国民间的年俗活动之一。</p>
          </div>
          <div class="customs-item">
            <img src="https://picsum.photos/id/488/300/200" alt="拜年">
            <h3>拜年</h3>
            <p>拜年是中国民间的传统习俗，是人们辞旧迎新、相互表达美好祝愿的一种方式。</p>
          </div>
          <div class="customs-item">
            <img src="https://picsum.photos/id/674/300/200" alt="年夜饭">
            <h3>年夜饭</h3>
            <p>年夜饭，又称年晚饭、团年饭、团圆饭等，特指年尾除夕的阖家聚餐。</p>
          </div>
        </div>
      </section>
    </main>
    
    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">
          <img src="https://picsum.photos/id/1/60/60" alt="Logo">
          <div class="footer-site-name">中国非物质文化遗产网</div>
        </div>
        <div class="footer-links">
          <a href="#">关于我们</a>
          <a href="#">联系方式</a>
          <a href="#">隐私政策</a>
          <a href="#">网站地图</a>
        </div>
        <div class="copyright">
          © 2025 中国非物质文化遗产网 版权所有 | 京ICP备12345678号
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 导入路由钩子
const router = useRouter(); // 获取路由实例
const activeNav = ref('首页');
const setActiveNav = (item) => {
  activeNav.value = item; // 保持菜单高亮
  // 根据菜单名称匹配路由路径
  switch (item) {
    case '首页':
      router.push('/'); // 跳转到首页路径
      break;
    case '机构':
      router.push('/organization'); // 跳转到机构页路径
      break;
    case '政策':
      router.push('/policy');
      break;
    case '资讯':
      router.push('/news');
      break;
    case '清单':
      router.push('/list');
      break;
    case '资源':
      router.push('/resource');
      break;
    case '学术':
      router.push('/academic');
      break;
    case '百科':
      router.push('/encyclopedia');
      break;
  }
};
</script>

<style scoped>
/* 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'SimSun', 'STSong', 'Microsoft YaHei', sans-serif;
}

.app-container {
  background-color: #f8f5f0;
  min-height: 100vh;
}

/* 顶部导航 */
.header {
  background-color: #c8102e;
  color: white;
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 1rem;
  border-radius: 50%;
  background-color: white;
  object-fit: cover;
}

.site-name {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  line-height: 1.2;
}

.site-name span:first-child {
  font-weight: bold;
  font-size: 1rem;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.icon-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.icon-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.date-info {
  font-size: 0.8rem;
  padding: 0 1rem;
  white-space: nowrap;
}

.user-btn {
  background: none;
  border: 1px solid white;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.user-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 主导航 */
.main-nav {
  background-color: #a80c24;
  padding: 0.5rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.main-nav ul {
  display: flex;
  list-style: none;
  gap: 2.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.main-nav li {
  color: white;
  cursor: pointer;
  padding: 0.3rem 0;
  position: relative;
  font-size: 0.95rem;
  transition: color 0.3s;
}

.main-nav li:hover {
  color: #ffd700;
}

.main-nav li:hover::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #ffd700;
}

/* 主横幅 */
.hero-banner {
  position: relative;
  min-height: 500px;
  overflow: hidden;
  background-color: #c8102e;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
}

.banner-content {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
  flex-wrap: wrap;
}

.left-decoration {
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  flex: 1 1 200px;
}

.couplet {
  font-size: 1.8rem;
  color: white;
  font-weight: bold;
  writing-mode: vertical-rl;
  text-orientation: upright;
  letter-spacing: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.center-content {
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  color: white;
  flex: 1 1 300px;
}

.chinese-new-year {
  font-size: 6rem;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 1rem;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
  line-height: 1;
}

.sub-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.highlight-text {
  font-size: 1.2rem;
  font-weight: bold;
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  display: inline-block;
  border-radius: 4px;
  border-left: 3px solid #ffd700;
}

.right-image {
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  flex: 1 1 300px;
}

.right-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  max-height: 400px;
  object-fit: cover;
}

/* 灯笼装饰 */
.lanterns-decoration {
  position: absolute;
  top: 20px;
  left: 15%;
  display: flex;
  gap: 1.5rem;
  z-index: 1;
  flex-wrap: wrap;
  justify-content: center;
}

.lantern {
  width: 30px;
  height: 40px;
  background: linear-gradient(90deg, #ff6b6b, #ffd166, #ff6b6b);
  border-radius: 50% / 60% 60% 40% 40%;
  position: relative;
  box-shadow: 0 0 15px rgba(255, 210, 100, 0.8);
  animation: swing 3s ease-in-out infinite;
}

.lantern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50% 50% 0 0;
}

.lantern::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 15px;
  background-color: #8b4513;
}

.lantern:nth-child(2) { animation-delay: 0.5s; height: 35px; }
.lantern:nth-child(3) { animation-delay: 1s; height: 45px; }
.lantern:nth-child(4) { animation-delay: 1.5s; height: 38px; }
.lantern:nth-child(5) { animation-delay: 2s; height: 32px; }

/* 底部花纹装饰 */
.pattern-decoration {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 1;
  flex-wrap: wrap;
  justify-content: center;
}

.pattern {
  width: 20px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}

/* 主内容区 */
.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* 内容板块 */
.intro-section, .customs-section {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  color: #c8102e;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.section-content {
  line-height: 1.8;
  color: #333;
  font-size: 1rem;
}

.section-content p {
  margin-bottom: 1rem;
}

/* 习俗网格 */
.customs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.customs-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.customs-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.customs-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.customs-item h3 {
  padding: 1rem;
  color: #333;
  font-size: 1.2rem;
  border-bottom: 1px solid #f0f0f0;
}

.customs-item p {
  padding: 1rem;
  color: #666;
  line-height: 1.6;
  font-size: 0.95rem;
}

/* 页脚 */
.footer {
  background-color: #333;
  color: white;
  padding: 2rem;
  margin-top: 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.footer-logo img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.footer-site-name {
  font-size: 1.2rem;
  font-weight: bold;
}

.footer-links {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-links a {
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #ffd700;
}

.copyright {
  font-size: 0.85rem;
  color: #999;
  text-align: center;
}

/* 动画 */
@keyframes swing {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .chinese-new-year {
    font-size: 4.5rem;
  }
  
  .hero-banner {
    min-height: 400px;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 0.5rem 1rem;
  }
  
  .main-nav ul {
    gap: 1rem;
    padding: 0.5rem 0;
  }
  
  .chinese-new-year {
    font-size: 3.5rem;
    text-align: center;
  }
  
  .sub-title, .highlight-text {
    text-align: center;
  }
  
  .highlight-text {
    margin: 0 auto;
    display: block;
    width: fit-content;
  }
  
  .couplet {
    writing-mode: horizontal-tb;
    font-size: 1.2rem;
    letter-spacing: 0.2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .intro-section, .customs-section {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .chinese-new-year {
    font-size: 2.8rem;
  }
  
  .sub-title {
    font-size: 1.2rem;
  }
  
  .header-controls {
    gap: 0.5rem;
  }
  
  .date-info {
    display: none;
  }
  
  .customs-grid {
    grid-template-columns: 1fr;
  }
}
</style>