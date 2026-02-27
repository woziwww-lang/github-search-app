import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './index';

describe('SearchBar', () => {
  it('should render search input and button', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    expect(screen.getByPlaceholderText(/search repositories/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('should update input value when typing', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/search repositories/i);
    await user.type(input, 'react');

    expect(input).toHaveValue('react');
  });

  it('should call onSearch when form is submitted', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/search repositories/i);
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'react');
    await user.click(button);

    expect(onSearch).toHaveBeenCalledWith('react');
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('should call onSearch when pressing Enter', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/search repositories/i);

    await user.type(input, 'typescript{Enter}');

    expect(onSearch).toHaveBeenCalledWith('typescript');
  });

  it('should not call onSearch with empty query', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={onSearch} />);

    const button = screen.getByRole('button', { name: /search/i });
    await user.click(button);

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('should not call onSearch with whitespace-only query', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/search repositories/i);
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, '   ');
    await user.click(button);

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('should disable input and button when loading', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} loading={true} />);

    const input = screen.getByPlaceholderText(/search repositories/i);
    const button = screen.getByRole('button', { name: /searching/i });

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('should show "Searching..." text when loading', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} loading={true} />);

    expect(screen.getByText(/searching\.\.\./i)).toBeInTheDocument();
  });
});
