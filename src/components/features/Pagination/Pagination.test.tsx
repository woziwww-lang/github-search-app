import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './index';

describe('Pagination', () => {
  it('should not render when totalPages is 1 or less', () => {
    const onPageChange = vi.fn();
    const { container: container1 } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={onPageChange} />
    );
    const { container: container2 } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={onPageChange} />
    );

    expect(container1).toBeEmptyDOMElement();
    expect(container2).toBeEmptyDOMElement();
  });

  it('should render Previous and Next buttons', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);

    expect(screen.getByRole('button', { name: /prev/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('should disable Previous button on first page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

    const prevButton = screen.getByRole('button', { name: /prev/i });
    expect(prevButton).toBeDisabled();
  });

  it('should disable Next button on last page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('should call onPageChange when clicking Previous', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);

    const prevButton = screen.getByRole('button', { name: /prev/i });
    await user.click(prevButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when clicking Next', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('should show current page number', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);

    const currentPageButton = screen.getByRole('button', { name: '3' });
    expect(currentPageButton).toBeInTheDocument();
  });

  it('should render jump to page input and button', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    expect(screen.getByPlaceholderText('Page')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^go$/i })).toBeInTheDocument();
  });

  it('should jump to specific page when submitting form', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    const input = screen.getByPlaceholderText('Page');
    const goButton = screen.getByRole('button', { name: /^go$/i });

    await user.type(input, '5');
    await user.click(goButton);

    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it('should clear input after successful jump', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    const input = screen.getByPlaceholderText('Page') as HTMLInputElement;
    const goButton = screen.getByRole('button', { name: /^go$/i });

    await user.type(input, '5');
    await user.click(goButton);

    expect(input.value).toBe('');
  });

  it('should disable Go button when input is empty', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    const goButton = screen.getByRole('button', { name: /^go$/i });
    expect(goButton).toBeDisabled();
  });

  it('should disable Go button for invalid page numbers', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

    const input = screen.getByPlaceholderText('Page');
    const goButton = screen.getByRole('button', { name: /^go$/i });

    // Test page > totalPages
    await user.type(input, '10');
    expect(goButton).toBeDisabled();

    await user.clear(input);

    // Test page < 1
    await user.type(input, '0');
    expect(goButton).toBeDisabled();
  });

  it('should show ellipsis for large page ranges', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={50} totalPages={100} onPageChange={onPageChange} />);

    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it('should show first and last page buttons when far from edges', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={50} totalPages={100} onPageChange={onPageChange} />);

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '100' })).toBeInTheDocument();
  });
});
