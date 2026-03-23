import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import AppLayout from './components/AppLayout.vue';
import DashboardPage from './pages/DashboardPage.vue';
import EventDetailPage from './pages/EventDetailPage.vue';
import AnalyticsPage from './pages/AnalyticsPage.vue';
import AboutPage from './pages/AboutPage.vue';
import './style.css';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        { path: '', component: DashboardPage },
        { path: 'event/:id', component: EventDetailPage },
        { path: 'analytics', component: AnalyticsPage },
        { path: 'about', component: AboutPage },
      ],
    },
  ],
});

createApp(App).use(router).use(createPinia()).mount('#app');
