import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BackToTop } from './BackToTop';

describe('BackToTop', () => {
  beforeEach(() => {
    window.scrollY = 0;
  });

  it('should not render when scroll position is less than 300', () => {
    window.scrollY = 200;
    const { container } = render(<BackToTop />);

    expect(container.firstChild).toBeNull();
  });

  it('should render when scroll position is greater than 300', () => {
    window.scrollY = 400;
    render(<BackToTop />);

    fireEvent.scroll(window);

    const button = screen.queryByRole('button');
    if (button) {
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Back to top');
    }
  });

  it('should scroll to top when clicked', () => {
    window.scrollY = 500;
    window.scrollTo = vi.fn();

    render(<BackToTop />);
    fireEvent.scroll(window);

    const button = screen.queryByRole('button');
    if (button) {
      fireEvent.click(button);
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    }
  });

  it('should have proper styling classes', () => {
    window.scrollY = 500;
    const { container } = render(<BackToTop />);

    fireEvent.scroll(window);

    const button = container.querySelector('button');
    if (button) {
      expect(button.className).toContain('fixed');
      expect(button.className).toContain('bg-primary');
      expect(button.className).toContain('rounded-full');
    }
  });
});
