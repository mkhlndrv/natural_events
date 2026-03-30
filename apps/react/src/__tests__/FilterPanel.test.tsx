import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import FilterPanel from '../components/FilterPanel';
import { useFilterStore } from '../store/filterStore';

describe('FilterPanel', () => {
  beforeEach(() => {
    useFilterStore.getState().resetFilters();
  });

  it('renders all filter controls', () => {
    render(<FilterPanel />);

    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Earthquakes' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Natural Events' })
    ).toBeInTheDocument();

    expect(screen.getByText('Min Magnitude')).toBeInTheDocument();
    expect(screen.getByText('Max Magnitude')).toBeInTheDocument();
    expect(screen.getByText('Start Date')).toBeInTheDocument();
    expect(screen.getByText('End Date')).toBeInTheDocument();
    expect(screen.getByText('EONET Status')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });

  it('updates store when clicking event type buttons', () => {
    render(<FilterPanel />);

    fireEvent.click(screen.getByRole('button', { name: 'Earthquakes' }));
    expect(useFilterStore.getState().eventType).toBe('earthquakes');

    fireEvent.click(screen.getByRole('button', { name: 'Natural Events' }));
    expect(useFilterStore.getState().eventType).toBe('natural');

    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(useFilterStore.getState().eventType).toBe('all');
  });

  it('updates store when changing magnitude inputs', () => {
    render(<FilterPanel />);

    const minInput = screen.getByDisplayValue('2');
    const maxInput = screen.getByDisplayValue('10');

    fireEvent.change(minInput, { target: { value: '4' } });
    expect(useFilterStore.getState().minMagnitude).toBe(4);

    fireEvent.change(maxInput, { target: { value: '8' } });
    expect(useFilterStore.getState().maxMagnitude).toBe(8);
  });

  it('updates store when changing date inputs', () => {
    render(<FilterPanel />);

    const { startDate, endDate } = useFilterStore.getState();
    const startInput = screen.getByDisplayValue(startDate);
    const endInput = screen.getByDisplayValue(endDate);

    fireEvent.change(startInput, { target: { value: '2025-01-01' } });
    expect(useFilterStore.getState().startDate).toBe('2025-01-01');

    fireEvent.change(endInput, { target: { value: '2025-06-01' } });
    expect(useFilterStore.getState().endDate).toBe('2025-06-01');
  });

  it('updates store when changing EONET status', () => {
    render(<FilterPanel />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'closed' } });
    expect(useFilterStore.getState().eonetStatus).toBe('closed');
  });

  it('resets all filters to defaults', () => {
    render(<FilterPanel />);

    fireEvent.click(screen.getByRole('button', { name: 'Earthquakes' }));
    fireEvent.change(screen.getByDisplayValue('2'), {
      target: { value: '5' },
    });
    fireEvent.change(screen.getByDisplayValue('10'), {
      target: { value: '7' },
    });
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'closed' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));

    const state = useFilterStore.getState();
    expect(state.eventType).toBe('all');
    expect(state.minMagnitude).toBe(2);
    expect(state.maxMagnitude).toBe(10);
    expect(state.eonetStatus).toBe('open');
  });
});
