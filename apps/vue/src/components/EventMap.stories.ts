import type { Meta, StoryObj } from '@storybook/vue3';
import EventMap from './EventMap.vue';
import { mockEarthquakes, mockEonetEvents } from './__mocks__/eventData';

const meta: Meta<typeof EventMap> = {
  component: EventMap,
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
