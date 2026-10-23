<template>
  <Navigation v-if="!isAdminPage" />
  <div class="router-view-container" :class="{ 'admin-page': isAdminPage }">
    <router-view v-slot="{ Component }">
      <transition name="page-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navigation from './components/Navigation.vue';

export default {
  name: 'App',
  components: { Navigation },
  setup() {
    const route = useRoute();
    
    // 判断是否为管理员页面
    const isAdminPage = computed(() => {
      return route.path === '/admin';
    });
    
    return {
      isAdminPage
    };
  }
}
</script>

<style>
/* 全局样式 */
html, body {
  background-color: #f8f5f0;
  margin: 0;
  padding: 0;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}

/* 内容区域 */
.router-view-container {
  margin: 0;
  padding: 140px 0 2rem 0;
  background-color: #f8f5f0;
}

/* 管理员页面样式 */
.router-view-container.admin-page {
  margin: 0;
  padding: 0;
  background-color: #f7fafc;
}

/* 页面切换渐变过渡效果 */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.page-fade-enter-to,
.page-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>