import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import EventMap from './EventMap';
import { mockEarthquakes, mockEonetEvents } from './__mocks__/eventData';

const meta: Meta<typeof EventMap> = {
  component: EventMap,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EventMap>;

export const Default: Story = {
  args: {
    earthquakes: mockEarthquakes,
    eonetEvents: mockEonetEvents,
  },
};

export const Empty: Story = {
  args: {
    earthquakes: [],
    eonetEvents: [],
  },
};
