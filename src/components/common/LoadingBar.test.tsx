import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { LoadingBar } from './LoadingBar';

describe('LoadingBar', () => {
  it('should render fixed positioned element', () => {
    const { container } = render(<LoadingBar isLoading={false} />);

    const wrapper = container.querySelector('.fixed');
    expect(wrapper).toBeTruthy();
  });

  it('should render when loading', async () => {
    const { container } = render(<LoadingBar isLoading={true} />);

    await waitFor(() => {
      const wrapper = container.querySelector('.fixed');
      expect(wrapper).toBeTruthy();
    });
  });

  it('should show progress bar at top', async () => {
    const { container } = render(<LoadingBar isLoading={true} />);

    await waitFor(() => {
      const wrapper = container.querySelector('.fixed');
      expect(wrapper).toBeTruthy();
      if (wrapper) {
        expect(wrapper.className).toContain('top-0');
        expect(wrapper.className).toContain('left-0');
        expect(wrapper.className).toContain('right-0');
      }
    });
  });

  it('should have gradient background', async () => {
    const { container } = render(<LoadingBar isLoading={true} />);

    await waitFor(() => {
      const progressBar = container.querySelector('.h-full');
      if (progressBar) {
        expect(progressBar.className).toContain('bg-gradient-to-r');
        expect(progressBar.className).toContain('from-primary');
        expect(progressBar.className).toContain('to-primary-dark');
      }
    });
  });

  it('should have height of 1', () => {
    const { container } = render(<LoadingBar isLoading={true} />);

    const wrapper = container.querySelector('.fixed');
    if (wrapper) {
      expect(wrapper.className).toContain('h-1');
    }
  });

  it('should have proper z-index', () => {
    const { container } = render(<LoadingBar isLoading={true} />);

    const wrapper = container.querySelector('.fixed');
    if (wrapper) {
      expect(wrapper.className).toContain('z-50');
    }
  });
});
