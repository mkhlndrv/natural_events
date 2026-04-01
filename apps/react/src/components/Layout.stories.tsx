import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout';

const meta: Meta<typeof Layout> = {
  component: Layout,
  decorators: [
    () => (
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route
              path="/"
              element={
                <p className="text-gray-500">Dashboard content goes here</p>
              }
            />
          </Route>
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Layout>;

export const Default: Story = {};
