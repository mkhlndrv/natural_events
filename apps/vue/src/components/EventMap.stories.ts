import type { Meta, StoryObj } from '@storybook/vue3';
import type { EarthquakeFeature, EonetEvent } from '@terrawatch/shared';
import EventMap from './EventMap.vue';
import { mockEarthquakes, mockEonetEvents } from './__mocks__/eventData';

type EventMapArgs = {
  earthquakes: EarthquakeFeature[];
  eonetEvents: EonetEvent[];
};

const meta: Meta<EventMapArgs> = {
  component: EventMap,
};

export default meta;
type Story = StoryObj<EventMapArgs>;

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
