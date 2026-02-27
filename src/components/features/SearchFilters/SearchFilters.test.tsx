import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchFiltersComponent } from './index';

describe('SearchFiltersComponent', () => {
  const mockOnFiltersChange = vi.fn();
  const mockOnSortChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render filter toggle button', () => {
    render(
      <SearchFiltersComponent
        onFiltersChange={mockOnFiltersChange}
        onSortChange={mockOnSortChange}
        currentSort="stars"
      />
    );

    expect(screen.getByText('Advanced Filters')).toBeInTheDocument();
  });

  it('should render sort dropdown', () => {
    render(
      <SearchFiltersComponent
        onFiltersChange={mockOnFiltersChange}
        onSortChange={mockOnSortChange}
        currentSort="stars"
      />
    );

    expect(screen.getByText('Sort by:')).toBeInTheDocument();
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('should show current sort option', () => {
    render(
      <SearchFiltersComponent
        onFiltersChange={mockOnFiltersChange}
        onSortChange={mockOnSortChange}
        currentSort="forks"
      />
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('forks');
  });

  it('should call onSortChange when sort is changed', () => {
    render(
      <SearchFiltersComponent
        onFiltersChange={mockOnFiltersChange}
        onSortChange={mockOnSortChange}
        currentSort="stars"
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'updated' } });

    expect(mockOnSortChange).toHaveBeenCalledWith('updated');
  });

  it('should expand filters panel when clicked', () => {
    render(
      <SearchFiltersComponent
        onFiltersChange={mockOnFiltersChange}
        onSortChange={mockOnSortChange}
        currentSort="stars"
      />
    );

    const toggleButton = screen.getByText('Advanced Filters');
    fireEvent.click(toggleButton);

    expect(screen.getByText('Programming Language')).toBeInTheDocument();
    expect(screen.getByText('Minimum Stars')).toBeInTheDocument();
    expect(screen.getByText('Created After')).toBeInTheDocument();
  });

  it('should show active indicator when filters are applied', () => {
    render(
      <SearchFiltersComponent
        onFiltersChange={mockOnFiltersChange}
        onSortChange={mockOnSortChange}
        currentSort="stars"
      />
    );

    const toggleButton = screen.getByText('Advanced Filters');
    fireEvent.click(toggleButton);

    // Set a language filter
    const languageSelect = screen.getAllByRole('combobox')[1]; // Second combobox is language
    fireEvent.change(languageSelect, { target: { value: 'JavaScript' } });

    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should call onFiltersChange when Apply Filters is clicked', () => {
    render(
      <SearchFiltersComponent
        onFiltersChange={mockOnFiltersChange}
        onSortChange={mockOnSortChange}
        currentSort="stars"
      />
    );

    fireEvent.click(screen.getByText('Advanced Filters'));

    const languageSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(languageSelect, { target: { value: 'TypeScript' } });

    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      language: 'TypeScript',
    });
  });

  it('should clear filters when Clear button is clicked', () => {
    render(
      <SearchFiltersComponent
        onFiltersChange={mockOnFiltersChange}
        onSortChange={mockOnSortChange}
        currentSort="stars"
      />
    );

    fireEvent.click(screen.getByText('Advanced Filters'));

    const languageSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(languageSelect, { target: { value: 'JavaScript' } });

    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({});
  });

  it('should disable controls when disabled prop is true', () => {
    render(
      <SearchFiltersComponent
        onFiltersChange={mockOnFiltersChange}
        onSortChange={mockOnSortChange}
        currentSort="stars"
        disabled={true}
      />
    );

    const buttons = screen.getAllByRole('button');
    const toggleButton = buttons.find(b => b.textContent?.includes('Advanced Filters'));
    const sortSelect = screen.getByRole('combobox');

    expect(toggleButton).toBeDisabled();
    expect(sortSelect).toBeDisabled();
  });

  it('should handle minimum stars filter', () => {
    render(
      <SearchFiltersComponent
        onFiltersChange={mockOnFiltersChange}
        onSortChange={mockOnSortChange}
        currentSort="stars"
      />
    );

    fireEvent.click(screen.getByText('Advanced Filters'));

    const starsInput = screen.getByPlaceholderText('e.g., 100');
    fireEvent.change(starsInput, { target: { value: '500' } });

    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      minStars: 500,
    });
  });

  it('should handle date filter', () => {
    const { container } = render(
      <SearchFiltersComponent
        onFiltersChange={mockOnFiltersChange}
        onSortChange={mockOnSortChange}
        currentSort="stars"
      />
    );

    const buttons = screen.getAllByRole('button');
    const toggleButton = buttons.find(b => b.textContent?.includes('Advanced Filters'));
    fireEvent.click(toggleButton!);

    const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '2024-01-01' } });

    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      dateFrom: '2024-01-01',
    });
  });

  it('should handle multiple filters together', () => {
    const { container } = render(
      <SearchFiltersComponent
        onFiltersChange={mockOnFiltersChange}
        onSortChange={mockOnSortChange}
        currentSort="stars"
      />
    );

    const buttons = screen.getAllByRole('button');
    const toggleButton = buttons.find(b => b.textContent?.includes('Advanced Filters'));
    fireEvent.click(toggleButton!);

    const languageSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(languageSelect, { target: { value: 'Python' } });

    const starsInput = screen.getByPlaceholderText('e.g., 100');
    fireEvent.change(starsInput, { target: { value: '1000' } });

    const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '2023-01-01' } });

    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      language: 'Python',
      minStars: 1000,
      dateFrom: '2023-01-01',
    });
  });
});
