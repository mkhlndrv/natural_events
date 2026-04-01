import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import AppLayout from './components/AppLayout.vue';
import './style.css';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        { path: '', component: () => import('./pages/DashboardPage.vue') },
        {
          path: 'event/:id',
          component: () => import('./pages/EventDetailPage.vue'),
        },
        {
          path: 'analytics',
          component: () => import('./pages/AnalyticsPage.vue'),
        },
        { path: 'about', component: () => import('./pages/AboutPage.vue') },
      ],
    },
  ],
});

createApp(App).use(router).use(createPinia()).mount('#app');
