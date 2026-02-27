import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('should render theme toggle button', () => {
    const mockToggle = vi.fn();
    render(<ThemeToggle theme="dark" onToggle={mockToggle} />);

    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });

  it('should show sun icon for dark theme', () => {
    const mockToggle = vi.fn();
    const { container } = render(<ThemeToggle theme="dark" onToggle={mockToggle} />);

    const sunIcon = container.querySelector('svg circle');
    expect(sunIcon).toBeInTheDocument();
    expect(sunIcon).toHaveClass('text-yellow-400');
  });

  it('should show moon icon for light theme', () => {
    const mockToggle = vi.fn();
    const { container } = render(<ThemeToggle theme="light" onToggle={mockToggle} />);

    const moonPath = container.querySelector('svg path');
    expect(moonPath).toBeInTheDocument();
  });

  it('should call onToggle when clicked', () => {
    const mockToggle = vi.fn();
    render(<ThemeToggle theme="dark" onToggle={mockToggle} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('should show correct title for dark theme', () => {
    const mockToggle = vi.fn();
    render(<ThemeToggle theme="dark" onToggle={mockToggle} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Switch to light mode');
  });

  it('should show correct title for light theme', () => {
    const mockToggle = vi.fn();
    render(<ThemeToggle theme="light" onToggle={mockToggle} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Switch to dark mode');
  });

  it('should have proper accessibility attributes', () => {
    const mockToggle = vi.fn();
    render(<ThemeToggle theme="dark" onToggle={mockToggle} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Toggle theme');
  });
});
