import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('should render with title', () => {
    render(<EmptyState title="No results found" />);

    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('should render with custom icon', () => {
    render(<EmptyState icon="🔍" title="No results" />);

    expect(screen.getByText('🔍')).toBeInTheDocument();
  });

  it('should render with default search icon', () => {
    render(<EmptyState title="No results" />);

    expect(screen.getByText('🔍')).toBeInTheDocument();
  });

  it('should render with description', () => {
    render(
      <EmptyState
        title="No results"
        description="Try adjusting your search"
      />
    );

    expect(screen.getByText('Try adjusting your search')).toBeInTheDocument();
  });

  it('should render action button when provided', () => {
    const mockAction = vi.fn();
    render(
      <EmptyState
        title="No results"
        action={{
          label: 'Clear Filters',
          onClick: mockAction,
        }}
      />
    );

    const button = screen.getByRole('button', { name: 'Clear Filters' });
    expect(button).toBeInTheDocument();
  });

  it('should call action onClick when button is clicked', () => {
    const mockAction = vi.fn();
    render(
      <EmptyState
        title="No results"
        action={{
          label: 'Clear Filters',
          onClick: mockAction,
        }}
      />
    );

    const button = screen.getByRole('button', { name: 'Clear Filters' });
    fireEvent.click(button);

    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('should not render action button when not provided', () => {
    render(<EmptyState title="No results" />);

    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  it('should have proper styling classes', () => {
    const { container } = render(<EmptyState title="No results" />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('flex');
    expect(wrapper.className).toContain('flex-col');
    expect(wrapper.className).toContain('items-center');
    expect(wrapper.className).toContain('animate-fade-in');
  });
});
