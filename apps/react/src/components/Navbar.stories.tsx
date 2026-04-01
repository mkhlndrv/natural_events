import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

const meta: Meta<typeof Navbar> = {
  component: Navbar,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {};
