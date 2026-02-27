import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Loading } from './Loading';

describe('Loading', () => {
  it('should render loading spinner', () => {
    const { container } = render(<Loading />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should display loading text', () => {
    render(<Loading />);
    expect(screen.getByText(/searching repositories/i)).toBeInTheDocument();
  });
});
