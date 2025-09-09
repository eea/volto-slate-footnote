import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchWidget from './SearchWidget';
import '@testing-library/jest-dom/extend-expect';

jest.mock('semantic-ui-react', () => {
  const Card = ({ children }) => <div>{children}</div>;
  Card.Content = ({ children }) => <div>{children}</div>;
  Card.Header = ({ children }) => <div>{children}</div>;
  Card.Description = ({ children }) => <div>{children}</div>;

  return {
    Search: ({ onSearchChange, value }) => (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onSearchChange(e, { value: e.target.value })}
      />
    ),
    Card,
    Segment: ({ children }) => <div>{children}</div>,
  };
});

describe('SearchWidget', () => {
  const choices = [
    { footnote: 'Citation 1' },
    { footnote: 'Citation 2' },
    { footnote: 'Citation 3' },
  ];

  it('renders the search widget', () => {
    const onChange = jest.fn();
    render(<SearchWidget choices={choices} onChange={onChange} value="" />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('Citation')).toBeInTheDocument();
  });

  it('calls onChange when input changes', () => {
    const onChange = jest.fn();
    render(<SearchWidget choices={choices} onChange={onChange} value="" />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(onChange).toHaveBeenCalledWith({ footnote: 'test' });
  });

  it('displays initial value', () => {
    const onChange = jest.fn();
    render(
      <SearchWidget choices={choices} onChange={onChange} value="Initial" />,
    );

    expect(screen.getByRole('textbox')).toHaveValue('Initial');
  });
});
