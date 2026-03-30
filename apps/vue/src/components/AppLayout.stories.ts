import type { Meta, StoryObj } from '@storybook/vue3';
import AppLayout from './AppLayout.vue';

const meta: Meta<typeof AppLayout> = {
  component: AppLayout,
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

export const Default: Story = {};
