import type { Meta, StoryObj } from '@storybook/vue3';
import FilterPanel from './FilterPanel.vue';

const meta: Meta<typeof FilterPanel> = {
  component: FilterPanel,
};

export default meta;
type Story = StoryObj<typeof FilterPanel>;

export const Default: Story = {};
