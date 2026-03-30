import type { Preview } from '@storybook/vue3';
import { setup } from '@storybook/vue3';
import { createPinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import '../src/style.css';

const pinia = createPinia();
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/analytics', component: { template: '<div />' } },
    { path: '/about', component: { template: '<div />' } },
    { path: '/event/:id', component: { template: '<div />' } },
  ],
});

setup((app) => {
  app.use(pinia);
  app.use(router);
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
