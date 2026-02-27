import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkeletonCard, SkeletonGrid } from './SkeletonCard';

describe('SkeletonCard', () => {
  it('should render skeleton card', () => {
    const { container } = render(<SkeletonCard />);

    const skeletonCard = container.querySelector('.animate-pulse');
    expect(skeletonCard).toBeInTheDocument();
  });

  it('should have proper skeleton elements', () => {
    const { container } = render(<SkeletonCard />);

    // Avatar placeholder
    const avatar = container.querySelector('.w-12.h-12.rounded-full');
    expect(avatar).toBeInTheDocument();

    // Text placeholders
    const textPlaceholders = container.querySelectorAll('.bg-gray-700\\/50');
    expect(textPlaceholders.length).toBeGreaterThan(0);
  });

  it('should have proper styling', () => {
    const { container } = render(<SkeletonCard />);

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('border');
    expect(card.className).toContain('rounded-xl');
    expect(card.className).toContain('animate-pulse');
  });
});

describe('SkeletonGrid', () => {
  it('should render default 6 skeleton cards', () => {
    const { container } = render(<SkeletonGrid />);

    const cards = container.querySelectorAll('.animate-pulse');
    expect(cards).toHaveLength(6);
  });

  it('should render custom number of skeleton cards', () => {
    const { container } = render(<SkeletonGrid count={3} />);

    const cards = container.querySelectorAll('.animate-pulse');
    expect(cards).toHaveLength(3);
  });

  it('should render in grid layout', () => {
    const { container } = render(<SkeletonGrid />);

    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain('grid');
    expect(grid.className).toContain('grid-cols-1');
    expect(grid.className).toContain('md:grid-cols-2');
  });

  it('should handle zero count', () => {
    const { container } = render(<SkeletonGrid count={0} />);

    const cards = container.querySelectorAll('.animate-pulse');
    expect(cards).toHaveLength(0);
  });

  it('should handle large count', () => {
    const { container } = render(<SkeletonGrid count={20} />);

    const cards = container.querySelectorAll('.animate-pulse');
    expect(cards).toHaveLength(20);
  });
});
