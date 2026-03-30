import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';
import AppNavbar from '../components/AppNavbar.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/analytics', component: { template: '<div>Analytics</div>' } },
    { path: '/about', component: { template: '<div>About</div>' } },
  ],
});

describe('AppNavbar', () => {
  it('renders all 3 navigation links', async () => {
    router.push('/');
    await router.isReady();

    const wrapper = mount(AppNavbar, {
      global: {
        plugins: [router],
      },
    });

    const links = wrapper.findAll('a');
    expect(links).toHaveLength(3);

    const hrefs = links.map((link) => link.attributes('href'));
    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/analytics');
    expect(hrefs).toContain('/about');
  });

  it('renders the NaturalEvents brand name', async () => {
    router.push('/');
    await router.isReady();

    const wrapper = mount(AppNavbar, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.text()).toContain('NaturalEvents');
  });
});
