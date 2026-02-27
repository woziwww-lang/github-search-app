import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PullToRefresh } from './PullToRefresh';

describe('PullToRefresh', () => {
  it('should not render when not pulling or refreshing', () => {
    const { container } = render(
      <PullToRefresh
        isPulling={false}
        isRefreshing={false}
        pullDistance={0}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render when pulling', () => {
    const { container } = render(
      <PullToRefresh
        isPulling={true}
        isRefreshing={false}
        pullDistance={50}
      />
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render when refreshing', () => {
    const { container } = render(
      <PullToRefresh
        isPulling={false}
        isRefreshing={true}
        pullDistance={80}
      />
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should adjust height based on pull distance', () => {
    const { container } = render(
      <PullToRefresh
        isPulling={true}
        isRefreshing={false}
        pullDistance={100}
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.height).toBe('100px');
  });

  it('should adjust opacity based on pull distance', () => {
    const { container } = render(
      <PullToRefresh
        isPulling={true}
        isRefreshing={false}
        pullDistance={40}
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.opacity).toBe('0.5'); // 40/80 = 0.5
  });

  it('should show spinning animation when refreshing', () => {
    const { container } = render(
      <PullToRefresh
        isPulling={false}
        isRefreshing={true}
        pullDistance={80}
      />
    );

    const icon = container.querySelector('.animate-spin');
    expect(icon).toBeInTheDocument();
  });

  it('should not use spin animation when pulling but not refreshing', () => {
    const { container } = render(
      <PullToRefresh
        isPulling={true}
        isRefreshing={false}
        pullDistance={75}
      />
    );

    // When pulling (not refreshing), the icon should not have animate-spin class
    const icon = container.querySelector('.animate-spin');
    expect(icon).not.toBeInTheDocument();
  });

  it('should have fixed position at top', () => {
    const { container } = render(
      <PullToRefresh
        isPulling={true}
        isRefreshing={false}
        pullDistance={50}
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('fixed');
    expect(wrapper.className).toContain('top-0');
  });
});
