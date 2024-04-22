import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchWidget from './SearchWidget';
import '@testing-library/jest-dom/extend-expect';

describe('SearchWidget', () => {
  const choices = [
    { footnote: 'Citation 1' },
    { footnote: 'Citation 2' },
    { footnote: 'Citation 3' },
  ];

  it('renders the search input and displays the choices', () => {
    const onChange = jest.fn();
    render(<SearchWidget choices={choices} onChange={onChange} value="" />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('Citation')).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('filters the choices based on the search input', async () => {
    const onChange = jest.fn();
    const { container } = render(
      <SearchWidget choices={choices} onChange={onChange} value="" />,
    );

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Citation 2' } });

    await waitFor(() => {
      expect(container.querySelectorAll('.result')).toHaveLength(1);
      expect(
        container.querySelector('div[footnote="Citation 2"]'),
      ).toBeInTheDocument();
    });
  });

  it('calls the onChange callback when a choice is selected', () => {
    const onChange = jest.fn();
    render(<SearchWidget choices={choices} onChange={onChange} value="" />);

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Citation 2' } });

    waitFor(() => {
      const option = screen.getByText('Citation 2');
      fireEvent.click(option);
      expect(onChange).toHaveBeenCalledWith({ footnote: 'Citation 2' });
    });
  });

  it('updates the value prop when the search input changes', () => {
    const onChange = jest.fn();
    render(
      <SearchWidget
        choices={choices}
        onChange={onChange}
        value="Initial value"
      />,
    );

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toHaveValue('Initial value');

    fireEvent.change(searchInput, { target: { value: 'New value' } });
    expect(onChange).toHaveBeenCalledWith({ footnote: 'New value' });
  });
});
