import type { Meta, StoryObj } from '@storybook/vue3';
import StatsBar from './StatsBar.vue';
import {
  mockEarthquakes,
  mockEonetEvents,
  mockHighMagEarthquake,
} from './__mocks__/eventData';

const meta: Meta<typeof StatsBar> = {
  component: StatsBar,
};

export default meta;
type Story = StoryObj<typeof StatsBar>;

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

export const HighMagnitude: Story = {
  args: {
    earthquakes: [mockHighMagEarthquake],
    eonetEvents: [],
  },
};
