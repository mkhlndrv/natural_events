import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import FilterPanel from '../components/FilterPanel.vue';
import { useFilterStore } from '../stores/filterStore';

describe('FilterPanel', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders all filter controls', () => {
    const wrapper = mount(FilterPanel);

    const buttons = wrapper.findAll('button');
    const buttonTexts = buttons.map((b) => b.text());
    expect(buttonTexts).toContain('All');
    expect(buttonTexts).toContain('Earthquakes');
    expect(buttonTexts).toContain('Natural Events');
    expect(buttonTexts).toContain('Reset');

    expect(wrapper.text()).toContain('Min Magnitude');
    expect(wrapper.text()).toContain('Max Magnitude');
    expect(wrapper.text()).toContain('Start Date');
    expect(wrapper.text()).toContain('End Date');
    expect(wrapper.text()).toContain('EONET Status');
  });

  it('updates store when clicking event type buttons', async () => {
    const wrapper = mount(FilterPanel);
    const store = useFilterStore();

    const buttons = wrapper.findAll('button');
    const eqButton = buttons.find((b) => b.text() === 'Earthquakes')!;
    const naturalButton = buttons.find((b) => b.text() === 'Natural Events')!;
    const allButton = buttons.find((b) => b.text() === 'All')!;

    await eqButton.trigger('click');
    expect(store.eventType).toBe('earthquakes');

    await naturalButton.trigger('click');
    expect(store.eventType).toBe('natural');

    await allButton.trigger('click');
    expect(store.eventType).toBe('all');
  });

  it('updates store when changing magnitude inputs', async () => {
    const wrapper = mount(FilterPanel);
    const store = useFilterStore();

    const numberInputs = wrapper.findAll('input[type="number"]');
    const minInput = numberInputs[0];
    const maxInput = numberInputs[1];

    await minInput.setValue('4');
    expect(store.minMagnitude).toBe(4);

    await maxInput.setValue('8');
    expect(store.maxMagnitude).toBe(8);
  });

  it('updates store when changing date inputs', async () => {
    const wrapper = mount(FilterPanel);
    const store = useFilterStore();

    const dateInputs = wrapper.findAll('input[type="date"]');
    const startInput = dateInputs[0];
    const endInput = dateInputs[1];

    await startInput.setValue('2025-01-01');
    expect(store.startDate).toBe('2025-01-01');

    await endInput.setValue('2025-06-01');
    expect(store.endDate).toBe('2025-06-01');
  });

  it('updates store when changing EONET status', async () => {
    const wrapper = mount(FilterPanel);
    const store = useFilterStore();

    const select = wrapper.find('select');
    await select.setValue('closed');
    expect(store.eonetStatus).toBe('closed');
  });

  it('resets all filters to defaults', async () => {
    const wrapper = mount(FilterPanel);
    const store = useFilterStore();

    const eqButton = wrapper
      .findAll('button')
      .find((b) => b.text() === 'Earthquakes')!;
    await eqButton.trigger('click');

    const numberInputs = wrapper.findAll('input[type="number"]');
    await numberInputs[0].setValue('5');
    await numberInputs[1].setValue('7');

    const select = wrapper.find('select');
    await select.setValue('closed');

    const resetButton = wrapper
      .findAll('button')
      .find((b) => b.text() === 'Reset')!;
    await resetButton.trigger('click');

    expect(store.eventType).toBe('all');
    expect(store.minMagnitude).toBe(2);
    expect(store.maxMagnitude).toBe(10);
    expect(store.eonetStatus).toBe('open');
  });
});
